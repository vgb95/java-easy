(() => {
MODULES.push({
  id: 3, icon: '📚', title: 'Colecciones y Streams',
  desc: 'ArrayList, HashMap interno, Stream API, parallel streams, Optional, Collectors',
  lessons: [
    {id:'3-01',title:'Collection Framework — arquitectura completa',
content:`<h1>📚 Java Collections Framework</h1>
<table class="comp-table"><tr><th>Interfaz</th><th>Implementaciones</th><th>Orden</th><th>Duplicados</th><th>Thread-safe?</th></tr>
<tr><td>List</td><td>ArrayList, LinkedList, Vector</td><td>Sí</td><td>Sí</td><td>No (CopyOnWriteArrayList sí)</td></tr>
<tr><td>Set</td><td>HashSet, LinkedHashSet, TreeSet, EnumSet</td><td>No/Hash/Comparable</td><td>No</td><td>No (ConcurrentSkipListSet sí)</td></tr>
<tr><td>Queue/Deque</td><td>ArrayDeque, PriorityQueue, LinkedList, DelayQueue</td><td>FIFO/prioridad</td><td>Sí</td><td>No (ConcurrentLinkedDeque sí)</td></tr>
<tr><td>Map</td><td>HashMap, LinkedHashMap, TreeMap, EnumMap, IdentityHashMap</td><td>No/Hash/Comparable</td><td>Claves únicas</td><td>No (ConcurrentHashMap sí)</td></tr>
</table>
<h3>ArrayList vs LinkedList — benchmarks</h3>
<table class="comp-table"><tr><th>Operación</th><th>ArrayList</th><th>LinkedList</th></tr>
<tr><td>get(i)</td><td>O(1) — array index</td><td>O(n) — recorre desde punta</td></tr>
<tr><td>add(E)</td><td>O(1) amortizado</td><td>O(1)</td></tr>
<tr><td>add(i, E)</td><td>O(n) — desplaza</td><td>O(n) — busca</td></tr>
<tr><td>remove(i)</td><td>O(n)</td><td>O(n)</td></tr>
<tr><td>Memoria/elem</td><td>~4 bytes (ref)</td><td>~24 bytes (prev+next+data)</td></tr>
<tr><td>Cache locality</td><td>Excelente</td><td>Mala (nodos dispersos)</td></tr>
</table>
<p><strong>Regla de oro</strong>: usa ArrayList siempre. Solo considera LinkedList si insertas/eliminas al principio constantemente y nunca necesitas get(i).</p>`,
exercise:{prompt:'¿Qué Collection da O(1) en contains()?',
code:'',answer:'HashSet (y HashMap para claves)'}},

    {id:'3-02',title:'HashMap — cómo funciona por dentro (Java 8+)',
content:`<h1>🗺️ HashMap Internals</h1>
<h3>Estructura</h3>
<p>Array de buckets. Cada bucket es una lista enlazada o un árbol rojo-negro (si > 8 nodos y array >= 64).</p>
<h3>📐 Proceso de put():</h3>
<ol><li>Calcula <code>hash(key) ^ (hash >>> 16)</code> (mezcla bits altos y bajos)</li>
<li>Índice: <code>(n - 1) & hash</code> (n es potencia de 2, máscara rápida)</li>
<li>Si bucket vacío → inserta nodo directamente</li>
<li>Si colisión → recorre lista/árbol buscando por equals()</li>
<li>Si encuentra → reemplaza valor</li>
<li>Si no → añade al final. Si la lista supera 8 → treeifica a árbol rojo-negro</li>
<li>Si tamaño > <code>capacidad * loadFactor (0.75)</code> → <strong>resize</strong>: dobla capacidad, rehash todos los elementos (O(n) caro)</li></ol>
<h3>🎯 Factor de carga: tradeoff memoria vs rendimiento</h3>
<p>0.75 es el default. Bajo (0.5) → más memoria, menos colisiones. Alto (0.9) → menos memoria, más colisiones. Si sabes el tamaño de antemano, usa <code>HashMap(tamañoInicial, factorDeCarga)</code> para evitar resizes.</p>
<h3>⚠️ Treeificación</h3>
<p>Lista enlazada > 8 y array >= 64 → árbol rojo-negro (O(log n) vs O(n)). Si baja de 6 → vuelve a lista. Esto evita ataques DoS por colisiones hash.</p>
<h3>💡 Claves inmutables</h3>
<p>Si modificas una clave mutable después de insertarla en HashMap, el hash original queda desactualizado. Nunca podrás recuperar el valor. Usa String, Integer, o records.</p>`,
exercise:{prompt:'¿Qué imprime y por qué?',
code:'import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Map<List<Integer>, String> m = new HashMap<>();\\n        List<Integer> k = new ArrayList<>(List.of(1));\\n        m.put(k, "v");\\n        k.add(2);\\n        System.out.println(m.get(k));\\n    }\\n}',answer:'null — clave en bucket equivocado por hash cambiado'}},

    {id:'3-03',title:'Stream API — lazy, operaciones y pipeline',
content:`<h1>🌊 Stream API: programación funcional</h1>
<h3>Pipeline: source → intermediate (lazy) → terminal</h3>
<div class="code-block"><pre><span class="typ">List</span>&lt;<span class="typ">String</span>&gt; r = personas.stream()
    .filter(p -> p.edad() >= <span class="num">18</span>)           <span class="cm">// intermediate — lazy</span>
    .map(<span class="typ">Persona</span>::nombre)                    <span class="cm">// intermediate — lazy</span>
    .sorted()                                   <span class="cm">// intermediate</span>
    .limit(<span class="num">10</span>)                                <span class="cm">// short-circuiting</span>
    .collect(<span class="typ">Collectors</span>.toList());            <span class="cm">// terminal — dispara ejecución</span></pre></div>
<h3>📐 Operaciones clave</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Operaciones</th><th>Comportamiento</th></tr>
<tr><td>Intermediate</td><td>filter, map, flatMap, distinct, sorted, peek, limit, skip, takeWhile, dropWhile</td><td><strong>Lazy</strong> — no se ejecutan hasta que hay una terminal</td></tr>
<tr><td>Terminal</td><td>collect, toList, forEach, reduce, count, anyMatch, allMatch, noneMatch, findFirst, findAny, min, max</td><td>Disparan la ejecución</td></tr>
<tr><td>Short-circuit</td><td>anyMatch, findFirst, limit, takeWhile</td><td>Pueden terminar antes de procesar todo</td></tr>
</table>
<h3>💡 Lazy evaluation: loop fusion</h3>
<p>El JIT fusiona filter-map en un solo paso en vez de crear colecciones intermedias. <code>stream.filter(...).map(...).collect()</code> recorre los datos <strong>una sola vez</strong>, aplicando filter y map en cada elemento.</p>
<h3>flatMap — aplanar anidados</h3>
<div class="code-block"><pre><span class="typ">List</span>&lt;<span class="typ">List</span>&lt;<span class="typ">Integer</span>&gt;&gt; anidada = ...;
<span class="typ">List</span>&lt;<span class="typ">Integer</span>&gt; plana = anidada.stream()
    .flatMap(<span class="typ">List</span>::stream)
    .collect(<span class="typ">Collectors</span>.toList());</pre></div>`,
exercise:{prompt:'¿Qué imprime? Explica lazy evaluation.',
code:'import java.util.stream.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Stream.of(1,2,3)\\n            .peek(System.out::print)\\n            .filter(n -> n > 1)\\n            .peek(System.out::print)\\n            .count();\\n    }\\n}',answer:'12323'}},

    {id:'3-04',title:'Collectors — groupingBy, partitioningBy, toMap',
content:`<h1>📊 Collectors: el poder de recolectar</h1>
<h3>groupingBy — el más potente</h3>
<div class="code-block"><pre><span class="cm">// Agrupar personas por edad</span>
<span class="typ">Map</span>&lt;<span class="typ">Integer</span>, <span class="typ">List</span>&lt;<span class="typ">Persona</span>&gt;&gt; = personas.stream()
    .collect(Collectors.groupingBy(<span class="typ">Persona</span>::edad));

<span class="cm">// Agrupar y contar</span>
<span class="typ">Map</span>&lt;<span class="typ">Integer</span>, <span class="typ">Long</span>&gt; = personas.stream()
    .collect(Collectors.groupingBy(<span class="typ">Persona</span>::edad, Collectors.counting()));

<span class="cm">// Agrupar y mapear</span>
<span class="typ">Map</span>&lt;<span class="typ">Integer</span>, <span class="typ">Set</span>&lt;<span class="typ">String</span>&gt;&gt; = personas.stream()
    .collect(Collectors.groupingBy(<span class="typ">Persona</span>::edad,
             Collectors.mapping(<span class="typ">Persona</span>::nombre, Collectors.toSet())));</pre></div>
<h3>partitioningBy — dos grupos</h3>
<div class="code-block"><pre><span class="typ">Map</span>&lt;<span class="typ">Boolean</span>, <span class="typ">List</span>&lt;<span class="typ">Persona</span>&gt;&gt; = personas.stream()
    .collect(Collectors.partitioningBy(p -> p.edad() >= <span class="num">18</span>));</pre></div>
<h3>toMap — con merge function</h3>
<div class="code-block"><pre><span class="cm">// Sin duplicados (lanza IllegalStateException si clave repetida)</span>
<span class="typ">Map</span>&lt;<span class="typ">Integer</span>, <span class="typ">String</span>&gt; = personas.stream()
    .collect(Collectors.toMap(<span class="typ">Persona</span>::id, <span class="typ">Persona</span>::nombre));

<span class="cm">// Con merge function</span>
<span class="typ">Map</span>&lt;<span class="typ">String</span>, <span class="typ">String</span>&gt; = personas.stream()
    .collect(Collectors.toMap(<span class="typ">Persona</span>::nombre, <span class="typ">Persona</span>::email,
             (e1, e2) -> e1));  <span class="cm">// conserva el primero</span></pre></div>`,
exercise:{prompt:'Agrupa palabras por primera letra, cuenta cuántas.',
code:'import java.util.stream.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        var r = Stream.of("ana","alberto","luis","laura")\\n            .collect(Collectors.groupingBy(s -> s.charAt(0), Collectors.counting()));\\n        System.out.println(r);\\n    }\\n}',answer:'{a=2, l=2}'}},

    {id:'3-05',title:'Parallel Streams — cuándo y cómo usarlos',
content:`<h1>⚡ Parallel Streams</h1>
<h3>Cómo funciona</h3>
<p><code>parallelStream()</code> divide la fuente en partes, cada parte se procesa en un hilo del <strong>ForkJoinPool común</strong>, y luego se combinan resultados.</p>
<h3>📐 Cuándo NO</h3>
<ul><li>Datos < 10k: overhead de splitting/merging supera ganancia</li>
<li>Operaciones blocking (I/O): bloquean hilos del pool común</li>
<li>Operaciones con side effects (race conditions)</li>
<li>Streams ordenados + paralelo: overhead de ordenar</li>
<li>LinkedList, TreeSet, iterate() — splitter ineficiente</li></ul>
<h3>🎯 Cuándo SÍ</h3>
<ul><li>CPU-bound (cálculos pesados, transformaciones)</li>
<li>ArrayList, arrays, IntStream.range (splitter eficiente)</li>
<li>Operaciones independientes (no stateful como sorted)</li></ul>
<h3>💡 ForkJoinPool común</h3>
<p><code>availableProcessors() - 1</code> hilos. Configurable: <code>-Djava.util.concurrent.ForkJoinPool.common.parallelism=8</code>. Para tareas blocking, usa tu propio pool: <code>new ForkJoinPool(4).submit(() -> stream.parallel().collect(...))</code>.</p>`,
exercise:{prompt:'¿Por qué parallelStream() con LinkedList es ineficiente?',
code:'',answer:'LinkedList no se puede dividir eficientemente (splitter O(n))'}},

    {id:'3-06',title:'Optional — monada de presencia/ausencia',
content:`<h1>🎯 Optional: el fin de NPE</h1>
<h3>Por qué existe</h3>
<p><code>null</code> causa ~50% de los bugs en Java. Optional fuerza al llamante a considerar la ausencia de valor.</p>
<h3>Métodos clave</h3>
<div class="code-block"><pre><span class="typ">Optional</span>&lt;<span class="typ">String</span>&gt; opt = <span class="typ">Optional</span>.ofNullable(metodo());

<span class="cm">// Consumir si presente</span>
opt.ifPresent(System.out::println);

<span class="cm">// Valor por defecto</span>
<span class="typ">String</span> r = opt.orElse(<span class="str">"default"</span>);        <span class="cm">// eager</span>
<span class="typ">String</span> r2 = opt.orElseGet(() -> apiCall());  <span class="cm">// lazy</span>
<span class="typ">String</span> r3 = opt.orElseThrow(RuntimeException::<span class="kw">new</span>);

<span class="cm">// Transformar</span>
<span class="typ">Optional</span>&lt;<span class="typ">Integer</span>&gt; len = opt.map(<span class="typ">String</span>::length);
<span class="typ">Optional</span>&lt;<span class="typ">String</span>&gt; s = opt.flatMap(v -> metodoQueVuelveOptional(v));

<span class="cm">// Filtrar</span>
<span class="typ">Optional</span>&lt;<span class="typ">String</span>&gt; filtrado = opt.filter(s -> s.length() > <span class="num">5</span>);</pre></div>
<h3>⚠️ Lo que NO debes hacer con Optional</h3>
<ul><li>Campos de clase (no serializable)</li>
<li>Parámetros de métodos</li>
<li>Colecciones (usa colecciones vacías no Optional&lt;List&gt;)</li></ul>`,
exercise:{prompt:'¿Qué imprime?',
code:'import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Optional<String> o = Optional.of("java");\\n        var r = o.map(String::length).filter(n -> n > 10).orElse(-1);\\n        System.out.println(r);\\n    }\\n}',answer:'-1'}
    }]
});
})();
