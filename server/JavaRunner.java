import javax.tools.*;
import java.io.*;
import java.lang.reflect.Method;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class JavaRunner {
  static final JavaCompiler COMPILER = ToolProvider.getSystemJavaCompiler();
  static final DiagnosticCollector<JavaFileObject> DIAG = new DiagnosticCollector<>();

  public static void main(String[] args) throws Exception {
    BufferedReader in = new BufferedReader(new InputStreamReader(System.in, StandardCharsets.UTF_8));
    String line;
    while ((line = in.readLine()) != null) {
      if (line.isEmpty()) continue;
      try {
        String code = extractField(line, "code");
        String expected = extractField(line, "expectedOutput");
        boolean verify = line.contains("\"verify\"");

        long start = System.nanoTime();
        RunResult r = compileAndRun(code);
        long elapsed = (System.nanoTime() - start) / 1_000_000;

        String json;
        if (r.error != null) {
          json = jsonOf("success", "false", "compileError", r.error, "output", "", "executionTime", String.valueOf(elapsed));
        } else if (verify) {
          String normOut = r.output.trim().replace("\r\n", "\n");
          String normExp = (expected != null ? expected : "").trim().replace("\r\n", "\n");
          boolean pass = normOut.equals(normExp);
          json = jsonOf("pass", String.valueOf(pass), "output", r.output, "expected", expected != null ? expected : "", "error", "null");
        } else {
          json = jsonOf("success", "true", "output", r.output, "error", "", "executionTime", String.valueOf(elapsed));
        }
        System.out.println(json);
        System.out.flush();
      } catch (Exception e) {
        System.out.println(jsonOf("error", e.getMessage()));
        System.out.flush();
      }
    }
  }

  static RunResult compileAndRun(String code) {
    InMemoryFileManager fm = new InMemoryFileManager(COMPILER.getStandardFileManager(DIAG, null, null));
    JavaFileObject src = new InMemorySource("Main", code);
    DIAG.getDiagnostics().clear();

    boolean compiled = COMPILER.getTask(null, fm, DIAG, null, null, List.of(src)).call();

    if (!compiled) {
      StringBuilder sb = new StringBuilder();
      for (Diagnostic d : DIAG.getDiagnostics()) {
        String msg = d.getMessage(null);
        long line = d.getLineNumber();
        if (line > 0) sb.append("Línea ").append(line).append(": ");
        sb.append(msg).append("\n");
        if (sb.length() > 500) break;
      }
      return new RunResult(null, sb.toString());
    }

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PrintStream ps = new PrintStream(baos, true, StandardCharsets.UTF_8);
    PrintStream oldOut = System.out;
    System.setOut(ps);

    try {
      Class<?> mainClass = fm.loadClass("Main");
      Method m = mainClass.getMethod("main", String[].class);
      m.invoke(null, (Object) new String[0]);
    } catch (NoSuchMethodException e) {
      return new RunResult("", "La clase Main debe tener: public static void main(String[] args)");
    } catch (Exception e) {
      Throwable cause = e.getCause() != null ? e.getCause() : e;
      return new RunResult("", cause.toString());
    } finally {
      System.out.flush();
      System.setOut(oldOut);
    }

    return new RunResult(baos.toString(StandardCharsets.UTF_8), null);
  }

  // ── In-memory file manager ──
  static class InMemorySource extends SimpleJavaFileObject {
    final String code;
    InMemorySource(String name, String code) {
      super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
      this.code = code;
    }
    public CharSequence getCharContent(boolean ignore) { return code; }
  }

  static class InMemoryClass extends SimpleJavaFileObject {
    final ByteArrayOutputStream baos = new ByteArrayOutputStream();
    InMemoryClass(String name) {
      super(URI.create("bytes:///" + name.replace('.', '/') + Kind.CLASS.extension), Kind.CLASS);
    }
    public OutputStream openOutputStream() { return baos; }
    byte[] getBytes() { return baos.toByteArray(); }
  }

  static class InMemoryFileManager extends ForwardingJavaFileManager<StandardJavaFileManager> {
    final Map<String, InMemoryClass> classes = new HashMap<>();
    InMemoryFileManager(StandardJavaFileManager fm) { super(fm); }
    public JavaFileObject getJavaFileForOutput(Location loc, String name, JavaFileObject.Kind k, FileObject src) {
      InMemoryClass mc = new InMemoryClass(name);
      classes.put(name, mc);
      return mc;
    }
    Class<?> loadClass(String name) throws ClassNotFoundException {
      InMemoryClass mc = classes.get(name);
      if (mc == null) throw new ClassNotFoundException(name);
      byte[] bytes = mc.getBytes();
      CustomCL cl = new CustomCL(getClass().getClassLoader());
      return cl.define(name, bytes);
    }
  }

  static class CustomCL extends ClassLoader {
    CustomCL(ClassLoader parent) { super(parent); }
    Class<?> define(String name, byte[] b) { return defineClass(name, b, 0, b.length); }
  }

  static class RunResult {
    String output, error;
    RunResult(String output, String error) { this.output = output; this.error = error; }
  }

  // ── JSON helpers ──
  static String extractField(String json, String field) {
    String q = "\"" + field + "\":\"";
    int i = json.indexOf(q);
    if (i < 0) {
      q = "\"" + field + "\":\"\\\"";
      i = json.indexOf(q);
      if (i < 0) return null;
    }
    i += q.length();
    StringBuilder sb = new StringBuilder();
    for (; i < json.length(); i++) {
      char c = json.charAt(i);
      if (c == '\\') { sb.append(json.charAt(++i)); }
      else if (c == '"') break;
      else sb.append(c);
    }
    return sb.toString();
  }

  static String escape(String s) {
    return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
  }

  static String jsonOf(String... kv) {
    StringBuilder sb = new StringBuilder("{");
    for (int i = 0; i < kv.length; i += 2) {
      if (i > 0) sb.append(",");
      sb.append('"').append(escape(kv[i])).append("\":");
      String v = kv[i + 1];
      if (v.equals("null") || v.equals("true") || v.equals("false")) {
        sb.append(v);
      } else {
        sb.append('"').append(escape(v)).append('"');
      }
    }
    return sb.append("}").toString();
  }
}
