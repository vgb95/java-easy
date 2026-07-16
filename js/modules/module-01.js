(() => {
MODULES.push({
  id: 1, icon: '🌱', title: 'Fundamentos de Java',
  desc: 'JVM, bytecode, tipos, memoria, control de flujo, arrays, strings, métodos, genéricos, records, excepciones, reflection',
  lessons: [
    {id:'1-01',title:'Hola Mundo — el viaje del código a la CPU',
content:`<h1>🌱 Hola Mundo: el viaje completo</h1>
<p>Cada vez que escribes Java, ocurre una cadena de transformaciones:</p>
<div class="code-block"><div class="code-header"><span>📄 Main.java → javac → bytecode → JVM → código máquina</span></div></div>
<h3>1. Compilación (javac)</h3>
<p><code>javac Main.java</code> produce <code>Main.class</code> con <strong>bytecode</strong> — instrucciones para la JVM, no para la CPU real. El bytecode es portable: Windows, Linux, Mac, todos usan el mismo <code>.class</code>. Esto es el <em>Write Once, Run Anywhere</em> de Java.</p>
<h3>2. Carga (ClassLoader)</h3>
<p>La JVM arranca el <em>bootstrap classloader</em> (carga java.lang.*, <code>rt.jar</code>), luego el <em>extension classloader</em>, luego el <em>application classloader</em> (carga tu classpath). Cada uno pide al padre antes de cargar — <strong>parent delegation model</strong> — esto evita cargar clases duplicadas y protege las clases del sistema.</p>
<h3>3. Verificación bytecode</h3>
<p>El <em>verifier</em> revisa: no operandos ilegales, no saltos a direcciones inválidas, tipos correctos. Si pasas <code>-noverify</code> (no recomendado en producción), saltas este paso.</p>
<h3>4. Ejecución (JIT y el intérprete)</h3>
<p>La JVM empieza interpretando bytecode. Cuando un método se ejecuta muchas veces (<em>hot spot</em>), el <strong>JIT Compiler</strong> (C1 o C2) lo compila a código máquina nativo. C1 optimiza rápido pero menos. C2 optimiza agresivamente (pero tarda más en compilar). Compilación por capas: <code>-XX:+TieredCompilation</code> (default desde Java 8).</p>
<div class="code-block"><div class="code-header"><span>📄 Main.java</span></div><pre><code><span class="kw">public class</span> <span class="typ">Main</span> {
    <span class="kw">public static void</span> main(<span class="typ">String</span>[] args) {
        <span class="typ">System</span>.out.println(<span class="str">"Hola Mundo"</span>);
    }
}</code></pre></div>
<h3>Anatomía del método main</h3>
<table class="comp-table"><tr><th>Parte</th><th>Significado</th></tr>
<tr><td><code>public</code></td><td>Visible desde cualquier clase. La JVM necesita accederlo.</td></tr>
<tr><td><code>static</code></td><td>Pertenece a la clase, no a una instancia.</td></tr>
<tr><td><code>void</code></td><td>No retorna nada al SO. Usa <code>System.exit(n)</code> para códigos de salida.</td></tr>
<tr><td><code>main</code></td><td>Nombre fijo. La JVM busca exactamente este método.</td></tr>
<tr><td><code>String[] args</code></td><td>Args de CLI. <code>args[0]</code> es el primer argumento (no el nombre del programa, como en C).</td></tr>
</table>
<h3>📐 System.out.println — no es tan simple</h3>
<p><code>System.out</code> es un <code>PrintStream</code> estático inicializado por la JVM al arrancar. Está <em>buffered</em>: el buffer se vacía con <code>flush()</code> o cuando se llena. <code>println()</code> añade <code>\\n</code> y hace <code>flush()</code>. Por eso es ligeramente más lento que <code>print()</code>. En producción NUNCA uses <code>System.out</code> para logging — usa SLF4J + Logback con niveles y formato estructurado.</p>
<h3>⚠️ Pitfalls de entrevista Google/FANG</h3>
<ul><li>¿main() puede ser <code>final</code>? Sí, los métodos <code>static</code> pueden ser <code>final</code>. No afecta.</li>
<li>¿main() puede ser <code>synchronized</code>? Sí, pero no tiene sentido práctico.</li>
<li>¿Java es <em>puro</em> OO? No: tiene tipos primitivos. Pero desde Java 5 con autoboxing y wrappers, se acerca.</li>
<li>¿Por qué main es <code>static</code>? Porque la JVM no tiene una instancia de tu clase al arrancar. Necesita un punto de entrada sin crear objetos.</li></ul>`,
exercise:{prompt:'¿Qué imprime y por qué? Explica el flujo compilación → bytecode → JIT.',
code:'public class Main {\\n    public static void main(String[] args) {\\n        System.out.print("Java ");\\n        System.out.println("Easy");\\n    }\\n}',answer:'Java Easy'}},

    {id:'1-02',title:'Tipos primitivos — memoria, precisión y autoboxing',
content:`<h1>📦 Tipos primitivos: la base de todo</h1>
<p>Java tiene 8 tipos primitivos. Se almacenan en el <strong>stack</strong> (no en el heap), lo que los hace extremadamente rápidos. La JVM puede asignarlos en registros de la CPU si el JIT lo decide.</p>
<table class="comp-table"><tr><th>Tipo</th><th>Tamaño</th><th>Default</th><th>Rango</th><th>Wrapper</th></tr>
<tr><td><code>byte</code></td><td>8 bits</td><td>0</td><td>-128 a 127</td><td>Byte</td></tr>
<tr><td><code>short</code></td><td>16 bits</td><td>0</td><td>-32.768 a 32.767</td><td>Short</td></tr>
<tr><td><code>int</code></td><td>32 bits</td><td>0</td><td>-2³¹ a 2³¹-1 (~2.1B)</td><td>Integer</td></tr>
<tr><td><code>long</code></td><td>64 bits</td><td>0L</td><td>-2⁶³ a 2⁶³-1</td><td>Long</td></tr>
<tr><td><code>float</code></td><td>32 bits</td><td>0.0f</td><td>±1.4e-45 a ±3.4e38 (6-7 dígitos)</td><td>Float</td></tr>
<tr><td><code>double</code></td><td>64 bits</td><td>0.0d</td><td>±4.9e-324 a ±1.7e308 (15 dígitos)</td><td>Double</td></tr>
<tr><td><code>char</code></td><td>16 bits</td><td>'\\\\u0000'</td><td>0 a 65.535 (Unicode BMP)</td><td>Character</td></tr>
<tr><td><code>boolean</code></td><td>~1 bit*</td><td>false</td><td>true o false</td><td>Boolean</td></tr>
</table>
<p>* <code>boolean</code> no tiene tamaño exacto definido por la JVM. En arrays suele ser 1 byte. La JVM lo mapea a <code>int</code> en operandos (4 bytes) por alineación. <code>true</code> se representa como 1, pero la JVM no especifica el valor exacto.</p>
<h3>🔢 Precisión en punto flotante</h3>
<div class="code-block"><pre><code><span class="kw">double</span> a = <span class="num">0.1</span> + <span class="num">0.2</span>;
<span class="typ">System</span>.out.println(a);                      <span class="cm">// 0.30000000000000004</span>
<span class="typ">System</span>.out.println(a == <span class="num">0.3</span>);              <span class="cm">// false — ¡error clásico!</span>

<span class="cm">// Solución: BigDecimal con String, no double</span>
<span class="typ">BigDecimal</span> b1 = <span class="kw">new</span> <span class="typ">BigDecimal</span>(<span class="str">"0.1"</span>);
<span class="typ">BigDecimal</span> b2 = <span class="kw">new</span> <span class="typ">BigDecimal</span>(<span class="str">"0.2"</span>);
<span class="typ">System</span>.out.println(b1.add(b2));            <span class="cm">// 0.3 exacto</span></code></pre></div>
<h3>📐 Autoboxing — el coste oculto</h3>
<p>Java 5 introdujo autoboxing: <code>Integer x = 42</code> compila a <code>Integer.valueOf(42)</code>. Usa <strong>caché interna</strong> para valores -128 a 127 (configurable con <code>-Djava.lang.Integer.IntegerCache.high=1000</code>).</p>
<ul><li><code>Integer.valueOf(127) == Integer.valueOf(127)</code> → <code>true</code> (caché)</li>
<li><code>Integer.valueOf(200) == Integer.valueOf(200)</code> → <code>false</code> (objetos distintos)</li>
<li>Cada autoboxing crea un objeto en heap. En bucles grandes: <code>Long sum = 0L; for(int i=0; i<1_000_000; i++) sum += i;</code> — son 1M de objetos Long. GC pressure.</li></ul>
<h3>⚠️ Overflow silencioso — el bug que mata sistemas</h3>
<div class="code-block"><pre><code><span class="kw">int</span> x = <span class="num">2_000_000_000</span>;
<span class="kw">int</span> y = <span class="num">2_000_000_000</span>;
<span class="typ">System</span>.out.println(x + y);  <span class="cm">// -294967296 — ¡overflow! Java no avisa</span>

<span class="cm">// Java 8+: Math.addExact(), subtractExact(), multiplyExact(), toIntExact()</span>
<span class="typ">System</span>.out.println(<span class="typ">Math</span>.addExact(x, y));  <span class="cm">// lanza ArithmeticException</span></code></pre></div>
<h3>💡 Contexto de entrevista: ¿Cómo evitas overflow en sumas de millones de transacciones financieras?</h3>
<p>Usa <code>long</code> o <code>BigInteger</code>. Para valores monetarios exactos, <code>BigDecimal</code> con <code>RoundingMode.HALF_EVEN</code> (banker's rounding). En sistemas de trading de alta frecuencia, usa <code>long</code> con micros y chequea overflow con <code>Math.addExact()</code>.</p>`,
exercise:{prompt:'¿Qué imprime? Explica overflow y autoboxing.',
code:'public class Main {\\n    public static void main(String[] args) {\\n        Integer a = 100;\\n        Integer b = 100;\\n        Integer c = 200;\\n        Integer d = 200;\\n        System.out.println(a == b);\\n        System.out.println(c == d);\\n        System.out.println(Integer.MAX_VALUE + 1);\\n    }\\n}',answer:'true\\nfalse\\n-2147483648'}},

    {id:'1-03',title:'Operadores — precedencia, cortocircuito y trampas',
content:`<h1>🔢 Operadores: todo lo que necesitas saber</h1>
<p>Java tiene ~40 operadores. La precedencia correcta evita bugs sutiles.</p>
<table class="comp-table"><tr><th>Prec.</th><th>Operadores</th><th>Asociatividad</th></tr>
<tr><td>1</td><td><code>() [] .</code></td><td>izq→der</td></tr>
<tr><td>2</td><td><code>++ -- + - ~ ! (tipo)</code></td><td>der→izq (unarios)</td></tr>
<tr><td>3</td><td><code>* / %</code></td><td>izq→der</td></tr>
<tr><td>4</td><td><code>+ -</code></td><td>izq→der</td></tr>
<tr><td>5</td><td><code><< >> >>></code></td><td>izq→der</td></tr>
<tr><td>6</td><td><code>< <= > >= instanceof</code></td><td>izq→der</td></tr>
<tr><td>7</td><td><code>== !=</code></td><td>izq→der</td></tr>
<tr><td>11</td><td><code>&&</code></td><td>izq→der</td></tr>
<tr><td>12</td><td><code>||</code></td><td>izq→der</td></tr>
<tr><td>13</td><td><code>?:</code> (ternario)</td><td>der→izq</td></tr>
<tr><td>14</td><td><code>= += -= *= /= %= &= ...</code></td><td>der→izq</td></tr>
</table>
<h3>⚡ Cortocircuito (short-circuit)</h3>
<p><code>&&</code> y <code>||</code> evalúan en cortocircuito: si el primer operando determina el resultado, el segundo NO se evalúa. <code>&</code> y <code>|</code> NO cortocircuitan.</p>
<div class="code-block"><pre><code><span class="typ">String</span> s = <span class="kw">null</span>;
<span class="kw">if</span> (s != <span class="kw">null</span> && s.length() > <span class="num">0</span>) { }  <span class="cm">// seguro</span>
<span class="kw">if</span> (s != <span class="kw">null</span> & s.length() > <span class="num">0</span>) { }  <span class="cm">// NPE</span></code></pre></div>
<h3>🎯 Ternario: expresión, no statement</h3>
<p>El ternario es una <strong>expresión</strong>, no una instrucción. Puede anidarse pero no debe:</p>
<div class="code-block"><pre><code><span class="cm">// ❌ No hagas esto ilegible</span>
<span class="kw">int</span> max = a > b ? (a > c ? a : c) : (b > c ? b : c);
<span class="cm">// ✅ Mejor</span>
<span class="kw">int</span> max = <span class="typ">Math</span>.max(<span class="typ">Math</span>.max(a, b), c);</code></pre></div>
<h3>⚠️ Division by zero</h3>
<ul><li>Enteros: lanza <code>ArithmeticException</code></li>
<li>Flotantes: NO lanza excepción. Da <code>Infinity</code>, <code>-Infinity</code>, o <code>NaN</code></li></ul>
<h3>🏆 Entrevista: incrementos</h3>
<div class="code-block"><pre><code><span class="kw">int</span> i = <span class="num">0</span>;
System.out.println(i++ + ++i);   <span class="cm">// 0 + 2 = 2</span>
System.out.println(i);            <span class="cm">// 2</span>
<span class="cm">// i++ evalúa i (0), luego incrementa a 1</span>
<span class="cm">// ++i incrementa a 2, evalúa 2 → suma = 0+2 = 2</span></code></pre></div>`,
exercise:{prompt:'¿Qué imprime? Explica cortocircuito y precedencia.',
code:'public class Main {\\n    public static void main(String[] args) {\\n        int a = 5, b = 0;\\n        boolean r = a > 0 || b++ > 0;\\n        System.out.println(r + " " + b);\\n    }\\n}',answer:'true 0'}},

    {id:'1-04',title:'Control de flujo — if, switch moderno, pattern matching',
content:`<h1>🚦 Control de flujo: de if a switch con pattern matching</h1>
<h3>if-else clásico</h3>
<div class="code-block"><pre><code><span class="kw">if</span> (condicion) { }
<span class="kw">else if</span> (otra) { }
<span class="kw">else</span> { }</code></pre></div>
<p>La condición debe ser <code>boolean</code>. No puedes hacer <code>if(1)</code> como en C/C++.</p>
<h3>🔀 Switch — evolución completa</h3>
<div class="code-block"><pre><code><span class="cm">// Legacy (Java 6-): fall-through, break obligatorio</span>
<span class="kw">switch</span>(dia) {
    <span class="kw">case</span> <span class="num">1</span>: <span class="typ">System</span>.out.println(<span class="str">"Lunes"</span>); <span class="kw">break</span>;
    <span class="kw">case</span> <span class="num">2</span>: <span class="typ">System</span>.out.println(<span class="str">"Martes"</span>); <span class="kw">break</span>;
}

<span class="cm">// Arrow switch (Java 14+): sin fall-through</span>
<span class="kw">switch</span> (dia) {
    <span class="kw">case</span> <span class="num">1</span>, <span class="num">7</span> -> <span class="typ">System</span>.out.println(<span class="str">"Finde"</span>);
    <span class="kw">case</span> <span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>, <span class="num">6</span> -> <span class="typ">System</span>.out.println(<span class="str">"Laborable"</span>);
}

<span class="cm">// Switch como expresión (Java 14+) — puede asignarse</span>
<span class="typ">String</span> tipo = <span class="kw">switch</span> (dia) {
    <span class="kw">case</span> <span class="num">1</span>, <span class="num">7</span> -> <span class="str">"finde"</span>;
    <span class="kw">default</span> -> <span class="str">"laborable"</span>;
};

<span class="cm">// Con yield para bloques de código</span>
<span class="kw">int</span> diasMes = <span class="kw">switch</span> (mes) {
    <span class="kw">case</span> <span class="str">"FEBRERO"</span> -> <span class="num">28</span>;
    <span class="kw">default</span> -> {
        <span class="kw">int</span> r = calcularDias(mes);
        <span class="kw">yield</span> r;  <span class="cm">// yield en vez de return</span>
    }
};</code></pre></div>
<h3>🔍 Pattern Matching para switch (Java 21+)</h3>
<div class="code-block"><pre><code><span class="typ">String</span> formatear(<span class="typ">Object</span> obj) {
    <span class="kw">return switch</span> (obj) {
        <span class="kw">case</span> <span class="typ">Integer</span> i -> <span class="str">"int "</span> + i;
        <span class="kw">case</span> <span class="typ">String</span> s <span class="kw">when</span> s.length() > <span class="num">10</span> -> <span class="str">"String largo"</span>;
        <span class="kw">case</span> <span class="typ">String</span> s -> <span class="str">"String: "</span> + s;
        <span class="kw">case</span> <span class="kw">null</span> -> <span class="str">"nulo"</span>;
        <span class="kw">default</span> -> <span class="str">"?"</span>;
    };
}</code></pre></div>
<h3>💡 Scope de variables en if sin llaves</h3>
<p><code>if (false) { int x = 1; } int x = 2;</code> — compila bien. El <code>x</code> del if está en su propio scope (las llaves crean ámbito). Sin llaves, <code>if(false) int x = 1; int x = 2;</code> NO compila (x ya está declarado en el mismo ámbito).</p>`,
exercise:{prompt:'¿Qué imprime? Explica el switch expresión.',
code:'public class Main {\\n    public static void main(String[] args) {\\n        String r = switch(3) {\\n            case 1 -> "uno";\\n            case 2 -> "dos";\\n            case 3 -> { yield "tres"; }\\n            default -> "?";\\n        };\\n        System.out.println(r);\\n    }\\n}',answer:'tres'}},

    {id:'1-05',title:'Bucles — for, while, streams y ConcurrentModification',
content:`<h1>🔄 Bucles: itera con conocimiento</h1>
<h3>For clásico vs for-each vs Stream</h3>
<table class="comp-table"><tr><th>Método</th><th>Rendimiento (10M ints)</th><th>Cuándo usarlo</th></tr>
<tr><td>for clásico</td><td>~120M ops/s</td><td>Máximo rendimiento, acceso por índice</td></tr>
<tr><td>for-each</td><td>~115M ops/s</td><td>Colecciones, legibilidad</td></tr>
<tr><td>stream().collect()</td><td>~80M ops/s</td><td>Operaciones encadenadas</td></tr>
<tr><td>parallelStream()</td><td>~200M ops/s (4 cores)</td><td>CPU-bound, datos >10k</td></tr>
</table>
<h3>⚠️ ConcurrentModificationException</h3>
<div class="code-block"><pre><code><span class="typ">List</span>&lt;<span class="typ">String</span>&gt; lista = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;(<span class="typ">List</span>.of(<span class="str">"a"</span>, <span class="str">"b"</span>, <span class="str">"c"</span>));
<span class="kw">for</span> (<span class="typ">String</span> s : lista) {
    <span class="kw">if</span> (s.equals(<span class="str">"b"</span>)) lista.remove(s);  <span class="cm">// ❌ ConcurrentModificationException</span>
}
<span class="cm">// ✅ Soluciones:</span>
lista.removeIf(s -> s.equals(<span class="str">"b"</span>));               <span class="cm">// Java 8+</span>
<span class="typ">Iterator</span>&lt;<span class="typ">String</span>&gt; it = lista.iterator();
<span class="kw">while</span> (it.hasNext()) {
    <span class="kw">if</span> (it.next().equals(<span class="str">"b"</span>)) it.remove();      <span class="cm">// ✅ seguro</span>
}</code></pre></div>
<h3>🎯 For-each con arrays: no hay iterator</h3>
<p>El for-each sobre arrays se compila a un for con índice — no crea Iterator. Sobre colecciones, compila a Iterator con <code>hasNext()</code>/<code>next()</code>.</p>
<h3>⚠️ Pitfall: continue sin llaves</h3>
<div class="code-block"><pre><code><span class="kw">int</span> s = <span class="num">0</span>;
<span class="kw">for</span> (<span class="kw">int</span> n : nums) <span class="kw">if</span> (n % <span class="num">2</span> == <span class="num">0</span>) <span class="kw">continue</span>; s += n;
<span class="cm">// s += n está FUERA del for — solo afecta al último n</span></code></pre></div>`,
exercise:{prompt:'¿Qué imprime? ¿Qué bug tiene el código?',
code:'public class Main {\\n    public static void main(String[] args) {\\n        int[] nums = {1,2,3,4,5};\\n        int s = 0;\\n        for (int n : nums) if (n % 2 == 0) break; s += n;\\n        System.out.println(s);\\n    }\\n}',answer:'5 (solo suma 5 porque break está dentro y s+=n fuera del for)'}},

    {id:'1-06',title:'Strings — pool, inmutabilidad, concatenación y rendimiento',
content:`<h1>📝 Strings: el tipo más maltratado (y optimizado)</h1>
<h3>Inmutabilidad — por qué es clave</h3>
<p>Los String son inmutables: una vez creados, no pueden cambiar. Beneficios: <strong>thread-safe</strong> (sin sincronización), <strong>caché</strong> (String pool compartido), <strong>hash consistente</strong> (se cachea tras primer cálculo), <strong>seguridad</strong> (parámetros de sistema no mutables por terceros).</p>
<h3>🔤 String Pool — internamiento</h3>
<div class="code-block"><pre><code><span class="typ">String</span> a = <span class="str">"hola"</span>;
<span class="typ">String</span> b = <span class="str">"hola"</span>;
<span class="typ">System</span>.out.println(a == b);  <span class="cm">// true — mismo objeto del pool</span>

<span class="typ">String</span> c = <span class="kw">new</span> <span class="typ">String</span>(<span class="str">"hola"</span>);
<span class="typ">System</span>.out.println(a == c);  <span class="cm">// false — new crea objeto en heap FUERA del pool</span>

c = c.intern();
<span class="typ">System</span>.out.println(a == c);  <span class="cm">// true — intern() devuelve el del pool o lo mete</span></code></pre></div>
<p>Desde Java 7, el String pool está en el heap (no en PermGen). Puedes controlar su tamaño con <code>-XX:StringTableSize=1000003</code> (número primo).</p>
<h3>⚡ Concatenación: + vs StringBuilder</h3>
<p>El compilador optimiza <code>"a" + "b" + i</code> a <code>new StringBuilder().append("a").append("b").append(i).toString()</code>. Pero en bucles, crea un StringBuilder por iteración:</p>
<div class="code-block"><pre><code><span class="cm">// ❌ Lento: 1000 objetos StringBuilder creados</span>
<span class="typ">String</span> s = <span class="str">""</span>;
<span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">1000</span>; i++) s += i;

<span class="cm">// ✅ Rápido: un solo StringBuilder con tamaño estimado</span>
<span class="typ">StringBuilder</span> sb = <span class="kw">new</span> <span class="typ">StringBuilder</span>(<span class="num">4000</span>);
<span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">1000</span>; i++) sb.append(i);</code></pre></div>
<h3>💡 Java 9+: Compact Strings</h3>
<p>Desde Java 9, <code>String</code> usa <code>byte[]</code> en vez de <code>char[]</code>. Si todos los caracteres son Latin-1, usa 1 byte/car; si no, 2 bytes (UTF-16). Detectado por el <em>coder</em> (1 byte flag). Ahorra ~50% de memoria en strings occidentales.</p>
<h3>🏆 Entrevista: String vs char[] para contraseñas</h3>
<p>Nunca uses String para passwords: es inmutable, no puedes borrarlo de memoria (se queda hasta GC). Usa <code>char[]</code> y sobrescríbelo con <code>Arrays.fill()</code> inmediatamente después de usar.</p>`,
exercise:{prompt:'¿Qué imprime? Explica el pool de Strings.',
code:'public class Main {\\n    public static void main(String[] args) {\\n        String a = "java";\\n        String b = "ja" + "va";\\n        String c = new String("java");\\n        System.out.println(a == b);\\n        System.out.println(a == c);\\n    }\\n}',answer:'true\\nfalse'}},

    {id:'1-07',title:'Métodos — paso por valor, sobrecarga, varargs',
content:`<h1>🧩 Métodos: todo es paso por valor</h1>
<h3>Java es paso por valor. Siempre.</h3>
<p>Para objetos, el valor de la <strong>referencia</strong> se pasa por copia. No confundir con <em>paso por referencia</em> (C++ tiene &).</p>
<div class="code-block"><pre><code><span class="kw">static void</span> modificar(<span class="typ">String</span> s, <span class="typ">StringBuilder</span> sb) {
    s = s + <span class="str">" mundo"</span>;               <span class="cm">// no afecta fuera — nueva String</span>
    sb.append(<span class="str">" mundo"</span>);            <span class="cm">// sí afecta —modifica el objeto referenciado</span>
}
<span class="typ">String</span> a = <span class="str">"hola"</span>;
<span class="typ">StringBuilder</span> b = <span class="kw">new</span> <span class="typ">StringBuilder</span>(<span class="str">"hola"</span>);
modificar(a, b);
<span class="cm">// a = "hola", b = "hola mundo"</span></code></pre></div>
<h3>🔁 Sobrecarga (overloading) vs Sobreescritura (overriding)</h3>
<table class="comp-table"><tr><th></th><th>Overloading</th><th>Overriding</th></tr>
<tr><td>Resolución</td><td>Compilación (static dispatch)</td><td>Ejecución (dynamic dispatch)</td></tr>
<tr><td>Parámetros</td><td>Distintos (tipo, orden, número)</td><td>Idénticos (misma firma exacta)</td></tr>
<tr><td>Return type</td><td>Puede variar</td><td>Covariante (mismo o subtipo)</td></tr>
<tr><td>Propósito</td><td>Misma operación, distintas entradas</td><td>Especializar comportamiento en subclase</td></tr>
</table>
<h3>🎯 Varargs ... (Java 5+)</h3>
<p>Azúcar sintáctico para arrays. Debe ser el <strong>último</strong> parámetro. Solo uno por método.</p>
<div class="code-block"><pre><code><span class="kw">static int</span> sumar(<span class="kw">int</span>... nums) {
    <span class="kw">int</span> s = <span class="num">0</span>;
    <span class="kw">for</span> (<span class="kw">int</span> n : nums) s += n;
    <span class="kw">return</span> s;
}
sumar();               <span class="cm">// array vacío (no null)</span>
sumar(<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>);       <span class="cm">// compila a sumar(new int[]{1,2,3})</span></code></pre></div>`,
exercise:{prompt:'¿Qué imprime? Demuestra paso por valor.',
code:'public class Main {\\n    static void swap(Integer a, Integer b) {\\n        Integer t = a; a = b; b = t;\\n    }\\n    public static void main(String[] args) {\\n        Integer x = 1, y = 2;\\n        swap(x, y);\\n        System.out.println(x + ", " + y);\\n    }\\n}',answer:'1, 2 (Java no tiene paso por referencia)'}},

    {id:'1-08',title:'Excepciones — checked, unchecked, try-with-resources',
content:`<h1>🚨 Excepciones: jerarquía, buenas prácticas y performance</h1>
<h3>Jerarquía de Throwable</h3>
<div class="code-block"><pre>Throwable
├── Error           <span class="cm">// Fuera de control: OutOfMemoryError, StackOverflowError</span>
└── Exception
    ├── RuntimeException  <span class="cm">// Unchecked: NPE, IllegalArgumentException, ...</span>
    └── (checked)         <span class="cm">// IOException, SQLException, ...</span></pre></div>
<h3>📐 Checked vs Unchecked</h3>
<table class="comp-table"><tr><th></th><th>Checked</th><th>Unchecked</th></tr>
<tr><td>Compilador exige catch?</td><td>Sí</td><td>No</td></tr>
<tr><td>Cuándo usar</td><td>Errores recuperables esperados (archivo no existe)</td><td>Errores de programación (null, índice)</td></tr>
<tr><td>Tendencia moderna</td><td>Spring/JPA prefiere unchecked</td><td>Lombok @SneakyThrows, evitar throws en interfaces</td></tr>
</table>
<h3>🎯 Try-with-resources (Java 7+)</h3>
<p>Cierra automáticamente recursos <code>AutoCloseable</code>. Orden de cierre: inverso al de declaración.</p>
<div class="code-block"><pre><span class="cm">// Antes (Java 6) — verboso y propenso a errores</span>
<span class="typ">BufferedReader</span> br = <span class="kw">null</span>;
<span class="kw">try</span> { br = <span class="kw">new</span> <span class="typ">BufferedReader</span>(...); } <span class="kw">finally</span> {
    <span class="kw">if</span> (br != <span class="kw">null</span>) br.close();
}

<span class="cm">// Moderno (Java 7+) — automático</span>
<span class="kw">try</span> (<span class="typ">BufferedReader</span> br = <span class="kw">new</span> <span class="typ">BufferedReader</span>(...)) {
    <span class="typ">System</span>.out.println(br.readLine());
}  <span class="cm">// br.close() llamado automáticamente, incluso con excepción</span></code></pre></div>
<h3>💡 Performance: las excepciones son caras</h3>
<p>Crear una excepción llena el stack trace (recorre toda la pila). En hot paths, evita usar excepciones para control de flujo:</p>
<div class="code-block"><pre><span class="cm">// ❌ Mal: 1000x más lento</span>
<span class="kw">try</span> { <span class="typ">Integer</span> n = Integer.parseInt(s); } <span class="kw">catch</span> (<span class="typ">NumberFormatException</span> e) { n = <span class="num">0</span>; }
<span class="cm">// ✅ Bien</span>
<span class="kw">int</span> n = s.matches(<span class="str">"\\\\d+"</span>) ? Integer.parseInt(s) : <span class="num">0</span>;</code></pre></div>
<h3>🏆 Entrevista: finally y return</h3>
<div class="code-block"><pre><span class="kw">static int</span> foo() {
    <span class="kw">try</span> { <span class="kw">return</span> <span class="num">1</span>; }
    <span class="kw">finally</span> { <span class="kw">return</span> <span class="num">2</span>; }  <span class="cm">// ❌ finally SOBRESCRIBE el return anterior</span>
}
System.out.println(foo());  <span class="cm">// 2</span></code></pre></div>`,
exercise:{prompt:'¿Qué imprime? Explica finally vs return.',
code:'public class Main {\\n    public static void main(String[] args) {\\n        try {\\n            System.out.print("A");\\n            return;\\n        } finally {\\n            System.out.print("B");\\n        }\\n    }\\n}',answer:'AB'}},

    {id:'1-09',title:'Genéricos — type erasure, wildcards, PECS',
content:`<h1>📦 Genéricos: type safety sin coste de runtime</h1>
<h3>Type Erasure — cómo funciona realmente</h3>
<p>Los genéricos son un <strong>chequeo en compilación</strong>. En runtime, los parámetros de tipo se borran (<em>erase</em>) a su límite superior o a Object.</p>
<div class="code-block"><pre><code><span class="cm">// Fuente</span>
<span class="typ">List</span>&lt;<span class="typ">String</span>&gt; lista = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();
<span class="typ">String</span> s = lista.get(<span class="num">0</span>);

<span class="cm">// Después de erasure</span>
<span class="typ">List</span> lista = <span class="kw">new</span> <span class="typ">ArrayList</span>();
<span class="typ">String</span> s = (<span class="typ">String</span>) lista.get(<span class="num">0</span>);  <span class="cm">// cast insertado por el compilador</span></code></pre></div>
<p>No puedes hacer <code>new T()</code>, <code>new T[]</code>, o <code>T.class</code> — en runtime T no existe.</p>
<h3>🎯 Wildcards — Producer Extends, Consumer Super (PECS)</h3>
<div class="code-block"><pre><span class="cm">// Producer Extends: solo lees → List<? extends X></span>
<span class="typ">List</span>&lt;? <span class="kw">extends</span> <span class="typ">Number</span>&gt; prod = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;<span class="typ">Integer</span>&gt;();
<span class="typ">Number</span> n = prod.get(<span class="num">0</span>);  <span class="cm">// ✅ puedo leer como Number</span>
prod.add(<span class="num">42</span>);              <span class="cm">// ❌ no puedo añadir</span>

<span class="cm">// Consumer Super: solo escribes → List<? super X></span>
<span class="typ">List</span>&lt;? <span class="kw">super</span> <span class="typ">Integer</span>&gt; cons = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;<span class="typ">Number</span>&gt;();
cons.add(<span class="num">42</span>);              <span class="cm">// ✅ puedo añadir Integer</span>
<span class="typ">Integer</span> i = cons.get(<span class="num">0</span>);   <span class="cm">// ❌ no sé si es Integer, Number u Object</span></code></pre></div>
<h3>💡 Bridge methods</h3>
<p>El compilador añade métodos puente para preservar polimorfismo tras erasure:</p>
<div class="code-block"><pre><span class="kw">class</span> <span class="typ">Box</span>&lt;<span class="typ">T</span>&gt; { <span class="kw">void</span> set(<span class="typ">T</span> v) { } }
<span class="kw">class</span> <span class="typ">StringBox</span> <span class="kw">extends</span> <span class="typ">Box</span>&lt;<span class="typ">String</span>&gt; { <span class="kw">void</span> set(<span class="typ">String</span> v) { } }
<span class="cm">// Bridge: void set(Object v) { set((String) v); } — invisible en código</span></code></pre></div>`,
exercise:{prompt:'¿Compila? Explica PECS.',
code:'import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        List<? extends Number> nums = new ArrayList<Integer>();\\n        nums.add(42);\\n        Number n = nums.get(0);\\n    }\\n}',answer:'Error: ? extends impide add (no sabe qué tipo concreto hay)'}},

    {id:'1-10',title:'Records, Sealed Classes, Text Blocks — Java moderno (14-22)',
content:`<h1>🚀 Java moderno: features que cambian el juego</h1>
<h3>📝 Records (Java 14+, estable en 16)</h3>
<p>Clases <em>data</em> inmutables con constructor, getters, equals, hashCode, toString generados automáticamente.</p>
<div class="code-block"><pre><span class="kw">public record</span> <span class="typ">Usuario</span>(<span class="typ">String</span> nombre, <span class="kw">int</span> edad) { }

<span class="cm">// Uso</span>
<span class="typ">Usuario</span> u = <span class="kw">new</span> <span class="typ">Usuario</span>(<span class="str">"Ana"</span>, <span class="num">25</span>);
u.nombre();  <span class="cm">// getter — sin prefijo "get"</span>
u.edad();
u.toString();  <span class="cm">// Usuario[nombre=Ana, edad=25]</span>

<span class="cm">// Puedes añadir métodos y validación en el constructor compacto</span>
<span class="kw">public record</span> <span class="typ">Persona</span>(<span class="typ">String</span> nombre) {
    <span class="kw">public</span> <span class="typ">Persona</span> {  <span class="cm">// constructor compacto</span>
        Objects.requireNonNull(nombre);
    }
}</code></pre></div>
<h3>🔒 Sealed Classes (Java 17+)</h3>
<p>Controlas exactamente qué clases pueden extender/implementar la tuya:</p>
<div class="code-block"><pre><span class="kw">sealed abstract class</span> <span class="typ">Forma</span>
    <span class="kw">permits</span> <span class="typ">Circulo</span>, <span class="typ">Rectangulo</span> { }
<span class="kw">final class</span> <span class="typ">Circulo</span> <span class="kw">extends</span> <span class="typ">Forma</span> { }
<span class="kw">final class</span> <span class="typ">Rectangulo</span> <span class="kw">extends</span> <span class="typ">Forma</span> { }
<span class="cm">// class Triangulo extends Forma { } — ❌ NO compila</span></code></pre></div>
<h3>📐 Text Blocks (Java 15+)</h3>
<div class="code-block"><pre><span class="typ">String</span> json = <span class="str">"""</span>
<span class="str">    {</span>
<span class="str">        "nombre": "Ana",</span>
<span class="str">        "edad": 25</span>
<span class="str">    }</span>
<span class="str">    """</span>;  <span class="cm">// maneja indentación automáticamente</span>
<span class="cm">// La indentación se determina por la línea menos indentada</span>
<span class="cm">// \\s escapa espacios, \\n salto de línea explícito</span></code></pre></div>
<h3>🔍 Pattern Matching instanceof (Java 16+)</h3>
<div class="code-block"><pre><span class="cm">// Antes (Java 15-)</span>
<span class="kw">if</span> (obj <span class="kw">instanceof</span> <span class="typ">String</span>) {
    <span class="typ">String</span> s = (<span class="typ">String</span>) obj;
}

<span class="cm">// Ahora (Java 16+)</span>
<span class="kw">if</span> (obj <span class="kw">instanceof</span> <span class="typ">String</span> s && s.length() > <span class="num">5</span>) {
    System.out.println(s.length());  <span class="cm">// sin cast</span>
}</code></pre></div>`,
exercise:{prompt:'¿Qué imprime? Explica records.',
code:'record Punto(int x, int y) {\\n    int suma() { return x + y; }\\n}\\npublic class Main {\\n    public static void main(String[] args) {\\n        Punto p = new Punto(3, 4);\\n        System.out.println(p.suma());\\n    }\\n}',answer:'7'}},

    {id:'1-11',title:'Garbage Collection — generacional, G1, ZGC, tuning',
content:`<h1>🗑️ Garbage Collection: cómo la JVM gestiona memoria</h1>
<h3>Generational Hypothesis</h3>
<p>El 90%+ de los objetos mueren jóvenes. Por eso el heap se divide:</p>
<table class="comp-table"><tr><th>Generación</th><th>Qué contiene</th><th>% del heap</th></tr>
<tr><td>Young (Eden + S0 + S1)</td><td>Objetos recién creados</td><td>~1/3</td></tr>
<tr><td>Old (Tenured)</td><td>Objetos que sobreviven varios ciclos</td><td>~2/3</td></tr>
</table>
<h3>⚡ Algoritmos de GC comparados (Java 22)</h3>
<table class="comp-table"><tr><th>GC</th><th>Latencia</th><th>Throughput</th><th>Cuándo usar</th></tr>
<tr><td>G1 (default)</td><td>~10ms</td><td>Alto</td><td>Balance general, apps web</td></tr>
<tr><td>ZGC (Java 15+)</td><td>&lt;1ms</td><td>Alto</td><td>Baja latencia, trading, streaming</td></tr>
<tr><td>Shenandoah (Java 12+)</td><td>&lt;1ms</td><td>Alto</td><td>Baja latencia, mismo objetivo que ZGC</td></tr>
<tr><td>Parallel</td><td>~100ms</td><td>Máximo</td><td>Batch/jobs, máximo throughput</td></tr>
</table>
<h3>🎯 Tuning flags esenciales</h3>
<div class="code-block"><pre><span class="cm">// Heap</span>
-Xms4g -Xmx4g
<span class="cm">// Young gen</span>
-Xmn1g  o  -XX:NewRatio=3
<span class="cm">// GC específico</span>
-XX:+UseZGC  -XX:+UseShenandoahGC
<span class="cm">// Logging (Java 9+)</span>
-Xlog:gc*:file=gc.log:time,pid
<span class="cm">// Pausa máxima (solo G1)</span>
-XX:MaxGCPauseMillis=10</pre></div>
<h3>💡 Memory Leaks en Java — sí existen</h3>
<ul><li>Listeners registrados que nunca se quitan</li>
<li>Cachés que crecen sin límite (usa <code>Caffeine</code> o <code>WeakHashMap</code>)</li>
<li>ClassLoaders personalizados que nunca se liberan</li>
<li><code>ThreadLocal</code> sin cleanup (especialmente en thread pools)</li></ul>`,
exercise:{prompt:'¿Qué objeto es elegible para GC tras foo()?',
code:'public class Main {\\n    static void foo() {\\n        StringBuilder a = new StringBuilder("a");\\n        StringBuilder b = new StringBuilder("b");\\n        a = b;\\n    }\\n    public static void main(String[] args) {\\n        foo();\\n        System.gc();\\n    }\\n}',answer:'1 — el primer StringBuilder("a")'}},

    {id:'1-12',title:'Reflection y anotaciones — metaprogramación',
content:`<h1>🪞 Reflection: el poder (y peligro) de inspeccionar runtime</h1>
<h3>Uso básico</h3>
<div class="code-block"><pre><span class="typ">Class</span>&lt;?&gt; clazz = <span class="typ">Class</span>.forName(<span class="str">"java.lang.String"</span>);
<span class="typ">Method</span> m = clazz.getMethod(<span class="str">"toUpperCase"</span>);
<span class="typ">String</span> r = (<span class="typ">String</span>) m.invoke(<span class="str">"hola"</span>);  <span class="cm">// "HOLA"</span></pre></div>
<h3>⚠️ Reflection rompe el encapsulamiento</h3>
<div class="code-block"><pre><span class="cm">// Modificar un String private final — peligroso</span>
<span class="typ">Field</span> f = <span class="typ">String</span>.class.getDeclaredField(<span class="str">"value"</span>);
f.setAccessible(<span class="kw">true</span>);
<span class="kw">byte</span>[] nuevo = <span class="str">"adios"</span>.getBytes();
f.set(<span class="str">"hola"</span>, nuevo);  <span class="cm">// String "hola" ahora es "adios"</span></pre></div>
<h3>💡 Coste de reflection</h3>
<p><code>Method.invoke()</code> es ~10-100x más lento que la llamada directa (boxing, array allocation, type checking). <code>MethodHandles</code> (Java 7+) es más rápido. Spring lo mitiga con caching.</p>
<h3>Anotaciones — metadatos</h3>
<div class="code-block"><pre><span class="at">@Retention</span>(<span class="typ">RetentionPolicy</span>.RUNTIME)
<span class="at">@Target</span>(<span class="typ">ElementType</span>.METHOD)
<span class="kw">public @interface</span> <span class="typ">Medible</span> { }

<span class="cm">// Procesar en runtime</span>
<span class="kw">for</span> (<span class="typ">Method</span> m : clazz.getMethods()) {
    <span class="kw">if</span> (m.isAnnotationPresent(<span class="typ">Medible</span>.class)) { ... }
}</pre></div>`,
exercise:{prompt:'¿Qué imprime?',
code:'import java.lang.reflect.*;\\npublic class Main {\\n    public static void main(String[] args) throws Exception {\\n        String s = "hello";\\n        Field f = String.class.getDeclaredField("value");\\n        f.setAccessible(true);\\n        byte[] val = (byte[]) f.get(s);\\n        System.out.println(val.length);\\n    }\\n}',answer:'5'}
    }]
});
})();
