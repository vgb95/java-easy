(() => {
MODULES.push({
  id: 9, icon: '📊', title: 'Performance Testing',
  desc: 'Profiling, heap analysis, GC tuning, async profiler, optimización de código, benchmarks',
  lessons: [
    {id:'9-01',title:'Profiling — cómo encontrar cuellos de botella',
content:`<h1>🔬 Profiling: dónde se va el tiempo</h1>
<h3>Muestreo vs instrumentación</h3>
<table class="comp-table"><tr><th></th><th>Sampling (Async Profiler)</th><th>Instrumentación (Java Flight Recorder)</th></tr>
<tr><td>Coste</td><td>Muy bajo (0.1%)</td><td>Bajo (~1%)</td></tr>
<tr><td>Precisión</td><td>Estadística (muestras cada N ms)</td><td>Exacta (cada llamada)</td></tr>
<tr><td>Impacto en código</td><td>Ninguno</td><td>Puntos de entrada/salida</td></tr>
<tr><td>Mejor para</td><td>Hot spots, CPUs</td><td>Contadores, tiempo real</td></tr>
</table>
<h3>📐 Async Profiler — la herramienta moderna</h3>
<div class="code-block"><pre><span class="cm">// CPU profiling — sample cada N nanosegundos</span>
$ async-profiler profiled -e cpu -d <span class="num">30</span> -f perfil.html

<span class="cm">// Allocation profiling (dónde se crean los objetos)</span>
$ async-profiler profiled -e alloc -d <span class="num">30</span> -f alloc.html

<span class="cm">// Wall-clock profiling (incluye tiempo bloqueado en I/O)</span>
$ async-profiler profiled -e wall -d <span class="num">30</span> -f wall.html</pre></div>
<h3>🎯 Heap Dump Analysis</h3>
<p>Heap dumps capturan el estado completo del heap. Herramientas: Eclipse MAT, JProfiler, IntelliJ Profiler.</p>
<div class="code-block"><pre>jmap -dump:live,format=b,file=heap.hprof PID  <span class="cm">// tomar heap dump</span>
<span class="cm">// Buscar: objetos grandes, leak suspects, GC roots, dominator tree</span></pre></div>
<h3>💡 Reglas de optimización</h3>
<ol><li><strong>Mide antes de optimizar</strong>: el 90% del tiempo se gasta en el 10% del código</li>
<li><strong>Perfil, no adivines</strong>: la intuición sobre qué es lento falla el 80% de las veces</li>
<li><strong>Las optimizaciones prematuras son la raíz de todos los males</strong> (Knuth)</li>
<li><strong>Reduce allocations</strong>: object pooling, primitivos, evitar autoboxing en hot paths</li>
<li><strong>Mide con JMH</strong>, no con System.currentTimeMillis()</li></ol>`,
exercise:{prompt:'¿Qué herramienta usarías para encontrar dónde se crean más objetos en el heap?',
code:'',answer:'Async Profiler con -e alloc o heap dump con Eclipse MAT (dominator tree)'}},

    {id:'9-02',title:'GC Tuning práctico — G1, ZGC, Shenandoah',
content:`<h1>🗑️ GC Tuning: de la teoría a la práctica</h1>
<h3>Objetivos de tuning</h3>
<ol><li><strong>Latencia</strong>: pausas mínimas (P99 < 10ms) → ZGC o Shenandoah</li>
<li><strong>Throughput</strong>: máximo trabajo por unidad de tiempo → Parallel GC o G1</li>
<li><strong>Memoria</strong>: footprint mínimo → Serial o G1 con heap pequeño</li>
</ol>
<h3>📐 Configuración típica por escenario</h3>
<div class="code-block"><pre><span class="cm">// API REST — baja latencia (ZGC)</span>
java -XX:+UseZGC -Xms2g -Xmx2g -Xlog:gc*:file=gc.log
   -XX:SoftMaxHeapSize=1g
   -jar app.jar

<span class="cm">// Batch/Big Data — máximo throughput (Parallel)</span>
java -XX:+UseParallelGC -Xms8g -Xmx8g -XX:+UseParallelOldGC
   -XX:ParallelGCThreads=8
   -jar batch.jar

<span class="cm">// Microservicio estándar — equilibrio (G1)</span>
java -XX:+UseG1GC -Xms512m -Xmx512m
   -XX:MaxGCPauseMillis=20
   -jar app.jar</pre></div>
<h3>🎯 Señales de que necesitas tuning</h3>
<ul><li><code>Full GC</code> frecuentes en logs → heap muy pequeño o leak</li>
<li><code>GC overhead limit exceeded</code> → >98% del tiempo en GC</li>
<li><code>Promotion failed</code> → objetos grandes que saturan Survivor</li>
<li><code>Allocation failure</code> muy frecuentes → ajustar Eden size</li></ul>`,
exercise:{prompt:'¿Qué GC elegirías para una app de trading con P99 < 5ms?',
code:'',answer:'ZGC o Shenandoah — ambos tienen pausas sub-milisegundo'}}
  ]
});
})();
