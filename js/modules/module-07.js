(() => {
MODULES.push({
  id: 7, icon: '🧠', title: 'JVM Internals & Tuning',
  desc: 'Arquitectura JVM, bytecode, ClassLoader, GC profiling, JMH, herramientas de diagnóstico',
  lessons: [
    {id:'7-01',title:'Arquitectura JVM y Runtime Data Areas',
content:`<h1>🧠 Arquitectura de la JVM</h1>
<div class="visual-flow"><div class="flow-node">ClassLoader Subsystem</div><div class="flow-arrow">→</div><div class="flow-node">Runtime Data Areas</div><div class="flow-arrow">→</div><div class="flow-node">Execution Engine</div><div class="flow-arrow">→</div><div class="flow-node">Native Interface</div></div>
<h3>Runtime Data Areas</h3>
<table class="comp-table"><tr><th>Área</th><th>Qué contiene</th><th>Compartido?</th><th>Tamaño típico</th></tr>
<tr><td>Heap</td><td>Objetos, arrays, String pool (Java 7+)</td><td>Sí</td><td>-Xms/-Xmx (ej: 4GB)</td></tr>
<tr><td>Metaspace (Java 8+)</td><td>Metadatos de clases, métodos, constant pool</td><td>Sí</td><td>Ilimitado por defecto (controlando con -XX:MaxMetaspaceSize)</td></tr>
<tr><td>Stack (por hilo)</td><td>Frames: local variables, operand stack, refs al constant pool</td><td>No</td><td>1MB default (-Xss)</td></tr>
<tr><td>PC Register</td><td>Dirección instrucción actual del hilo</td><td>No</td><td>~</td></tr>
<tr><td>Native Method Stack</td><td>Llamadas JNI</td><td>No</td><td>~</td></tr>
</table>
<h3>📐 Parent Delegation Model</h3>
<p>Bootstrap ClassLoader (<code>rt.jar</code>, <code>java.*</code>) → Extension ClassLoader → Application ClassLoader → Custom ClassLoader. Cada uno delega al padre antes de cargar. Esto evita duplicados y protege clases del sistema.</p>
<h3>🎯 Herramientas de diagnóstico</h3>
<div class="code-block"><pre>jps                    <span class="cm">// lista procesos JVM</span>
jstat -gc PID 1s       <span class="cm">// GC stats cada 1s</span>
jmap -heap PID         <span class="cm">// heap summary</span>
jstack PID             <span class="cm">// stack traces de todos los hilos</span>
jcmd PID VM.flags      <span class="cm">// flags de la JVM</span>
jhsdb hsdb            <span class="cm">// debugger visual</span></pre></div>`,
exercise:{prompt:'¿Qué área NO comparten los hilos en la JVM?',
code:'',answer:'Stack (cada hilo tiene su propio stack)'}},

    {id:'7-02',title:'Bytecode y JIT Compilation',
content:`<h1>🔧 Bytecode y el compilador JIT</h1>
<h3>javap — desensamblar bytecode</h3>
<div class="code-block"><pre><span class="cm">// Código: int x = 5 + 3;</span>
$ javap -c Main.class
   0: bipush        <span class="num">8</span>      <span class="cm">// el compilador ya evaluó 5+3 en compile time</span>
   2: istore_1              <span class="cm">// store en variable local 1</span>
   3: aload_0              <span class="cm">// cargar args</span>
   4: iconst_0             <span class="cm">// cargar 0</span>
   5: aaload               <span class="cm">// array load (String[])</span>
   6: astore_2             <span class="cm">// store en variable local 2</span>
   7: <span class="kw">return</span></pre></div>
<h3>📐 Compilación por capas (Tiered Compilation)</h3>
<ol><li><strong>Nivel 0</strong>: intérprete — sin optimización, arranque rápido</li>
<li><strong>Nivel 1</strong>: C1 simple — compilación rápida, pocas optimizaciones</li>
<li><strong>Nivel 2</strong>: C1 limitado — con contadores de métodos</li>
<li><strong>Nivel 3</strong>: C1 completo — perfilado, información de tipos</li>
<li><strong>Nivel 4</strong>: C2 (server) — optimizaciones agresivas, más lento en compilar</li></ol>
<p>La JVM sube de nivel cuando un método es lo suficientemente <em>hot</em>. Puedes verlo con <code>-XX:+PrintCompilation</code>.</p>
<h3>🎯 Inlining — la optimización más importante</h3>
<p>El JIT inlinea métodos pequeños (por defecto < 35 bytes de bytecode). Ajustable: <code>-XX:MaxInlineSize=50</code>. Inlining elimina el overhead de llamada a método, permite más optimizaciones.</p>`,
exercise:{prompt:'¿Qué hace bipush 8 en bytecode?',
code:'// int x = 5 + 3; // compila a bipush 8',answer:'Empuja la constante 8 al stack (el compilador ya evaluó 5+3)'}},

    {id:'7-03',title:'Profiling con JMH (Java Microbenchmark Harness)',
content:`<h1>⏱️ JMH — benchmarks serios</h1>
<p>JMH es la herramienta oficial de OpenJDK para microbenchmarks. Nunca uses <code>System.currentTimeMillis()</code> para benchmarks — el JIT distorsiona los resultados.</p>
<div class="code-block"><pre><span class="at">@BenchmarkMode</span>(Mode.Throughput)
<span class="at">@OutputTimeUnit</span>(TimeUnit.MILLISECONDS)
<span class="at">@State</span>(Scope.Thread)
<span class="kw">public class</span> <span class="typ">MiBenchmark</span> {
    <span class="typ">String</span> s = <span class="str">"hola mundo"</span>;
    
    <span class="at">@Benchmark</span>
    <span class="kw">public</span> <span class="typ">String</span> toUpperCase() {
        <span class="kw">return</span> s.toUpperCase();
    }
    
    <span class="kw">public static void</span> main(<span class="typ">String</span>[] args) <span class="kw">throws</span> <span class="typ">Exception</span> {
        <span class="typ">org</span>.openjdk.jmh.Main.main(args);
    }
}</pre></div>
<h3>📐 Errores comunes en benchmarks</h3>
<ul><li><strong>Dead code elimination</strong>: si no usas el resultado, el JIT lo elimina</li>
<li><strong>Constant folding</strong>: el compilador evalúa constantes en compile time</li>
<li><strong>Loop unrolling</strong>: el JIT desenrolla bucles pequeños</li>
<li><strong>Warmup</strong>: necesitas iteraciones de calentamiento (JMH las maneja)</li></ul>
<p>JMH resuelve todo esto automáticamente con <code>@Benchmark</code> y <code>Blackhole</code>.</p>`,
exercise:{prompt:'¿Por qué no usar System.currentTimeMillis() para benchmarks?',
code:'',answer:'JIT distorsiona: warmup, dead code elimination, constant folding, loop unrolling'}}
  ]
});
})();
