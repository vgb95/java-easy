(() => {
MODULES.push({
  id: 4, icon: '⚡', title: 'Concurrencia',
  desc: 'Threads, JMM, sincronización, locks, virtual threads, CompletableFuture, reactive, actores',
  lessons: [
    {id:'4-01',title:'Threads y el modelo de memoria Java (JMM)',
content:`<h1>⚡ Java Memory Model (JMM): el contrato de concurrencia</h1>
<h3>¿Qué es el JMM?</h3>
<p>Define <strong>cuándo un hilo puede ver cambios hechos por otro hilo</strong>. Sin JMM, la CPU/compilador reordenan instrucciones para optimizar, rompiendo la visibilidad entre hilos.</p>
<h3>Reglas happens-before</h3>
<table class="comp-table"><tr><th>Acción A</th><th>Acción B</th><th>Garantía</th></tr>
<tr><td>Unlock de monitor</td><td>Lock del mismo monitor en otro hilo</td><td>Todo previo a unlock es visible</td></tr>
<tr><td>volatile write</td><td>volatile read de la misma variable</td><td>Todo previo a la escritura es visible</td></tr>
<tr><td>Thread.start()</td><td>Cualquier acción del hilo iniciado</td><td>Todo lo anterior a start() es visible</td></tr>
<tr><td>Hilo termina</td><td>Thread.join()</td><td>Todo lo del hilo es visible tras join()</td></tr>
</table>
<h3>📐 El problema de visibilidad clásico</h3>
<div class="code-block"><pre><span class="kw">static boolean</span> listo = <span class="kw">false</span>;
<span class="kw">static int</span> dato = <span class="num">0</span>;

<span class="cm">// Hilo 1</span>
dato = <span class="num">42</span>;
listo = <span class="kw">true</span>;

<span class="cm">// Hilo 2</span>
<span class="kw">while</span> (!listo) { }  <span class="cm">// podría BUCEAR ETERNAMENTE</span>
System.out.println(dato);  <span class="cm">// podría imprimir 0</span></pre></div>
<p>La CPU/compilador puede reordenar: <code>listo=true</code> ANTES de <code>dato=42</code>. Solución: <code>volatile</code>, <code>synchronized</code>, o <code>AtomicBoolean</code>.</p>
<h3>🎯 volatile vs synchronized</h3>
<table class="comp-table"><tr><th></th><th>volatile</th><th>synchronized</th></tr>
<tr><td>Atomicidad</td><td>No (solo lectura/escritura individual)</td><td>Sí (bloque completo)</td></tr>
<tr><td>Visibilidad</td><td>happens-before</td><td>lock/unlock → happens-before</td></tr>
<tr><td>Coste</td><td>Bajo (barrera de memoria)</td><td>Más caro (adquisición de monitor)</td></tr>
<tr><td>Uso típico</td><td>Flags, estado, double-checked locking</td><td>Secciones críticas compuestas</td></tr>
</table>`,
exercise:{prompt:'¿El programa termina? Explica visibilidad.',
code:'public class Main {\\n    static boolean fin = false;\\n    public static void main(String[] args) throws Exception {\\n        new Thread(() -> { while(!fin) Thread.yield(); }).start();\\n        Thread.sleep(50);\\n        fin = true;\\n    }\\n}',answer:'No necesariamente — sin volatile, fin puede cachearse en registro de la CPU'}},

    {id:'4-02',title:'synchronized, ReentrantLock, ReadWriteLock',
content:`<h1>🔒 Sincronización: de synchronized a locks modernos</h1>
<h3>synchronized</h3>
<div class="code-block"><pre><span class="kw">synchronized void</span> incrementar() { contador++; }
<span class="kw">void</span> metodo() { <span class="kw">synchronized</span> (lockObj) { ... } }</pre></div>
<h3>📐 ReentrantLock — más flexible</h3>
<div class="code-block"><pre><span class="kw">private final</span> <span class="typ">ReentrantLock</span> lock = <span class="kw">new</span> <span class="typ">ReentrantLock</span>();
<span class="kw">void</span> metodo() {
    lock.lock();
    <span class="kw">try</span> {
        <span class="cm">// sección crítica</span>
    } <span class="kw">finally</span> { lock.unlock(); }  <span class="cm">// ¡siempre en finally!</span>
}
<span class="cm">// Características extra: tryLock(timeout), lockInterruptibly, fair=true/false</span></pre></div>
<h3>🎯 ReadWriteLock — múltiples lectores, un escritor</h3>
<div class="code-block"><pre><span class="typ">ReadWriteLock</span> rw = <span class="kw">new</span> <span class="typ">ReentrantReadWriteLock</span>();
rw.readLock().lock();   <span class="cm">// múltiples lectores simultáneos</span>
rw.writeLock().lock();  <span class="cm">// exclusivo — espera a que terminen todos los lectores</span></pre></div>
<p><strong>Rendimiento</strong>: con muchos lectores y pocos escritores, ReadWriteLock es ~10x más rápido que synchronized. Cuidado: puede causar <em>writer starvation</em> si hay muchos lectores.</p>
<h3>💡 synchronized moderno: biased locking deprecado</h3>
<p>Desde Java 15, el <em>biased locking</em> está deshabilitado por defecto (era caro de mantener en el JIT). Desde Java 19, se deprecó oficialmente. synchronized sigue siendo rápido para contención baja.</p>`,
exercise:{prompt:'¿Ventaja de ReentrantLock sobre synchronized?',
code:'',answer:'tryLock con timeout, lockInterruptibly, fair queue, ReadWriteLock'}},

    {id:'4-03',title:'ExecutorService, CompletableFuture y virtual threads',
content:`<h1>🏭 Concurrencia moderna</h1>
<h3>ExecutorService — manejo profesional de hilos</h3>
<div class="code-block"><pre><span class="typ">ExecutorService</span> pool = <span class="typ">Executors</span>.newFixedThreadPool(<span class="num">4</span>);
<span class="typ">Future</span>&lt;<span class="typ">Integer</span>&gt; f = pool.submit(() -> tareaPesada());
<span class="kw">int</span> r = f.get(<span class="num">5</span>, <span class="typ">TimeUnit</span>.SECONDS);  <span class="cm">// bloquea hasta resultado</span>
pool.shutdown();  <span class="cm">// no acepta más tareas</span></pre></div>
<h3>📐 CompletableFuture — composición asíncrona</h3>
<div class="code-block"><pre><span class="typ">CompletableFuture</span>
    .supplyAsync(() -> apiCall())          <span class="cm">// ForkJoinPool común</span>
    .thenApply(r -> r * <span class="num">2</span>)               <span class="cm">// transformación</span>
    .thenAccept(System.out::println)       <span class="cm">// consumir</span>
    .exceptionally(e -> { log(e); <span class="kw">return null</span>; });

<span class="cm">// Combinar 2 futures independientes</span>
f1.thenCombine(f2, (a, b) -> a + b);

<span class="cm">// Esperar múltiples</span>
<span class="typ">CompletableFuture</span>.allOf(f1, f2, f3).join();</pre></div>
<h3>🚀 Virtual Threads (Java 21+) — el cambio revolucionario</h3>
<p>Los <strong>virtual threads</strong> (<code>Thread.ofVirtual()</code>) son hilos gestionados por la JVM, no por el SO. Puedes crear millones sin swap ni context switch del kernel.</p>
<div class="code-block"><pre><span class="typ">Thread</span> vt = <span class="typ">Thread</span>.ofVirtual().start(() -> {
    <span class="typ">Thread</span>.sleep(<span class="num">100</span>);  <span class="cm">// no bloquea hilo del SO — se monta/desmonta automáticamente</span>
});

<span class="cm">// ExecutorService con virtual threads</span>
<span class="kw">try</span> (<span class="kw">var</span> pool = <span class="typ">Executors</span>.newVirtualThreadPerTaskExecutor()) {
    pool.submit(() -> { ... });
}</pre></div>
<p><strong>Cuándo usar virtual threads:</strong> aplicaciones con alta concurrencia I/O-bound (servidores web, APIs, microservicios). <strong>Cuándo NO:</strong> CPU-bound (no gana nada) o tareas con synchronized (pinning).</p>`,
exercise:{prompt:'¿Qué imprime? Explica CompletableFuture.',
code:'import java.util.concurrent.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        String r = CompletableFuture.supplyAsync(() -> "Hola")\\n            .thenApply(s -> s + " Mundo").join();\\n        System.out.println(r);\\n    }\\n}',answer:'Hola Mundo'}},

    {id:'4-04',title:'Concurrencia en colecciones y atomics',
content:`<h1>⚡ Colecciones concurrentes y variables atómicas</h1>
<h3>Colecciones thread-safe</h3>
<table class="comp-table"><tr><th>Colección</th><th>Mecanismo</th><th>Rendimiento</th></tr>
<tr><td>ConcurrentHashMap</td><td>Segment locks / CAS + synchronized</td><td>Excelente — lecturas sin lock</td></tr>
<tr><td>CopyOnWriteArrayList</td><td>Copia en escritura</td><td>Lecturas rápidas, escrituras caras</td></tr>
<tr><td>ConcurrentLinkedQueue</td><td>CAS (Michael-Scott queue)</td><td>Alta concurrencia, sin bloqueo</td></tr>
<tr><td>ConcurrentSkipListMap</td><td>Skip list</td><td>O(log n), ordenado</td></tr>
<tr><td>Collections.synchronizedList()</td><td>Lock en cada método</td><td>Bajo — cuello de botella</td></tr>
</table>
<h3>📐 Variables atómicas (java.util.concurrent.atomic)</h3>
<div class="code-block"><pre><span class="kw">private final</span> <span class="typ">AtomicInteger</span> contador = <span class="kw">new</span> <span class="typ">AtomicInteger</span>(<span class="num">0</span>);
contador.incrementAndGet();  <span class="cm">// atómico sin synchronized</span>
contador.compareAndSet(<span class="num">5</span>, <span class="num">10</span>);  <span class="cm">// CAS — base de toda concurrencia sin bloqueo</span></pre></div>
<p>CAS (Compare-And-Swap) es una instrucción CPU (CMPXCHG en x86). No bloquea — si falla, reintenta. Más rápido que synchronized en baja contención.</p>
<h3>💡 LongAdder — mejor que AtomicInteger para alta contención</h3>
<p><code>LongAdder</code> mantiene un array de celdas, cada hilo actualiza su celda sin contención. La suma final combina todas las celdas. Hasta 10x más rápido que AtomicInteger en alta contención.</p>`,
exercise:{prompt:'¿Por qué ConcurrentHashMap es más rápido que Collections.synchronizedMap?',
code:'',answer:'Segmentación/lock striping + lecturas sin bloqueo + CAS'}}
  ]
});
})();
