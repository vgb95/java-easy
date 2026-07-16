(() => {
MODULES.push({
  id: 13, icon: '⚙️', title: 'Operating Systems',
  desc: 'Procesos, Scheduling, Memoria Virtual, Sincronización, Deadlock, IPC, File Systems, I/O, Concurrencia',
  lessons: [
    {id:'13-01',title:'Procesos y Threads — PCB, Context Switch',
    content:`<h1>⚙️ Procesos vs Threads — la base de todo</h1>
<h3>Proceso (PCB — Process Control Block)</h3>
<p>Estructura de datos del kernel que representa un proceso en ejecución. Contiene:</p>
<table class="comp-table"><tr><th>Campo</th><th>Descripción</th></tr>
<tr><td>PID</td><td>Identificador único</td></tr>
<tr><td>Estado</td><td>Running, Ready, Blocked, Zombie</td></tr>
<tr><td>PC (Program Counter)</td><td>Próxima instrucción</td></tr>
<tr><td>Registros</td><td>CPU registers (salvo en context switch)</td></tr>
<tr><td>MMU info</td><td>Page table base register</td></tr>
<tr><td>File descriptors</td><td>Tabla de archivos abiertos</td></tr>
<tr><td>Stack pointers</td><td>Kernel stack, user stack</td></tr>
</table>
<h3>Context Switch — el costo oculto</h3>
<p>Cambiar de proceso: guardar PCB actual → cargar PCB nuevo → flush TLB → cambiar page table. <strong>Costo típico: 1-10 µs</strong> (depende de CPU). Cambio de thread: más barato (comparten espacio de direcciones, no flush TLB).</p>
<h3>Threads — tipos</h3>
<table class="comp-table"><tr><th></th><th>User Thread (green thread)</th><th>Kernel Thread</th></tr>
<tr><td>Scheduling</td><td>Runtime del usuario</td><td>Kernel</td></tr>
<tr><td>Bloqueante</td><td>Bloquea todo el proceso</td><td>Solo el thread</td></tr>
<tr><td>Context switch</td><td>~100 ns</td><td>~1 µs</td></tr>
<tr><td>Paralelismo real</td><td>No (un solo kernel thread)</td><td>Sí (varios cores)</td></tr>
<tr><td>Ejemplos</td><td>Goroutines (Go), Virtual Threads (Java 21+)</td><td>Pthreads (NPTL en Linux)</td></tr>
</table>
<h3>Estados de un proceso</h3>
<p>New → Ready ↔ Running → Blocked (I/O) → Ready → Running → Terminated → Zombie (espera wait()). <strong>Zombie</strong>: proceso terminado pero PCB retenido para que el padre lea exit code. Si el padre no hace wait() → memory leak de PCB.</p>`,
    exercise:{prompt:'¿Qué diferencia a un thread de un proceso en términos de recursos del sistema?',
    code:'',answer:'Los threads comparten espacio de direcciones, file descriptors y señales. Los procesos tienen espacios de direcciones separados (requieren IPC para comunicarse). Cambiar de thread no requiere flush TLB ni cambiar page table.'}},

    {id:'13-02',title:'CPU Scheduling — algoritmos y tradeoffs',
    content:`<h1>📊 CPU Scheduling — el arte de repartir tiempo</h1>
<h3>Métricas de scheduling</h3>
<table class="comp-table"><tr><th>Métrica</th><th>Definición</th><th>Ideal</th></tr>
<tr><td>Throughput</td><td>Procesos completados por unidad de tiempo</td><td>Maximizar</td></tr>
<tr><td>Turnaround time</td><td>Tiempo desde llegada hasta finalización</td><td>Minimizar</td></tr>
<tr><td>Waiting time</td><td>Tiempo total en Ready queue</td><td>Minimizar</td></tr>
<tr><td>Response time</td><td>Tiempo hasta primera ejecución</td><td>Minimizar (interactivo)</td></tr>
<tr><td>Fairness</td><td>Distribución equitativa de CPU</td><td>No starvation</td></tr>
</table>
<h3>Algoritmos comparados</h3>
<table class="comp-table"><tr><th></th><th>FCFS (FIFO)</th><th>SJF (Shortest Job)</th><th>Round Robin</th><th>MLFQ</th></tr>
<tr><td>Turnaround</td><td>Alto (convoy effect)</td><td>Óptimo (minimo)</td><td>Alto si quantum pequeño</td><td>Bueno</td></tr>
<tr><td>Response</td><td>Malo</td><td>Malo (largo espera)</td><td>Excelente</td><td>Excelente</td></tr>
<tr><td>Overhead</td><td>Mínimo</td><td>Alto (predecir duración)</td><td>Medio (context switches)</td><td>Medio</td></tr>
<tr><td>Starvation</td><td>No</td><td>Sí (llegada posterior corta)</td><td>No</td><td>Posible (prioridades)</td></tr>
<tr><td>Usado en</td><td>Sistemas batch</td><td>Teórico</td><td>Interactivo</td><td>Linux, macOS, Windows</td></tr>
</table>
<h3>MLFQ (Multi-Level Feedback Queue) — el que usan los SO modernos</h3>
<p>Múltiples colas con prioridad decreciente. <strong>Reglas:</strong> 1) proceso nuevo entra a prioridad máxima. 2) Si usa todo su quantum, baja un nivel. 3) Si cede CPU antes (I/O), mantiene prioridad. 4) Periódicamente, todos suben a prioridad máxima (evita starvation).</p>
<p>Linux CFS (Completely Fair Scheduler): árbol rojo-negro de tareas ordenado por <em>vruntime</em>. Siempre ejecuta la de menor vruntime. Balancea perfectamente fairness y throughput.</p>`,
    exercise:{prompt:'¿Por qué SJF es óptimo en turnaround time pero no se usa en la práctica?',
    code:'',answer:'Porque requiere conocer la duración del proceso ANTES de ejecutarlo, lo cual es imposible. Es un modelo teórico. En la práctica se estima con promedios ponderados (envejecimiento exponencial).'}},

    {id:'13-03',title:'Memoria Virtual — paginación, TLB, swapping',
    content:`<h1>🧠 Memoria Virtual — la ilusión de RAM infinita</h1>
<h3>Paginación — traducción de direcciones</h3>
<p>Dirección virtual → MMU → Page Table → Dirección física. Cada proceso tiene su propio espacio de direcciones virtuales (ej: 48 bits = 256 TB en x86-64).</p>
<div class="code-block"><pre><span class="cm">// Dirección virtual de 32 bits (page size 4KB = 12 bits offset)</span>
<span class="cm">// Bits 31-12: VPN (Virtual Page Number), Bits 11-0: offset</span>
<span class="cm">// VPN se usa como índice en la page table → Physical Frame Number (PFN)</span>
<span class="cm">// PFN + offset = dirección física</span>

<span class="cm">// x86-64 con 4 niveles de page table:</span>
<span class="cm">// Level 4 → Level 3 → Level 2 → Level 1 (4KB pages) → offset</span>
<span class="cm">// Cada nivel indexa una tabla de 512 entradas (9 bits por nivel, total 48 bits)</span></pre></div>
<h3>TLB (Translation Lookaside Buffer)</h3>
<p>Cache asociativa de traducciones VPN→PFN. <strong>Hit rate: 99%+</strong> (localidad espacial y temporal). Miss → page walk (4 accesos a memoria en x86-64) → hasta 100ns adicionales. <strong>TLB coverage:</strong> páginas grandes (2MB, 1GB) mejoran cobertura.</p>
<h3>Page Fault — qué pasa cuando no está en RAM</h3>
<ol>
<li>CPU genera page fault exception</li>
<li>Kernel verifica si la dirección es válida (segmentación si no)</li>
<li>Selecciona página víctima (replacement policy)</li>
<li>Si la víctima está dirty → write-back a swap</li>
<li>Carga página del disco (swap o mmap)</li>
<li>Actualiza page table, flush TLB</li>
<li>Retorna al proceso → re-ejecuta instrucción</li>
</ol>
<h3>Page Replacement — FIFO vs LRU vs Clock</h3>
<table class="comp-table"><tr><th></th><th>FIFO</th><th>LRU</th><th>Clock (Second Chance)</th><th>LFU</th></tr>
<tr><td>Calidad</td><td>Mala (Belady's anomaly)</td><td>Excelente</td><td>Buena (aprox LRU)</td><td>Mala (obsoleto)</td></tr>
<tr><td>Overhead</td><td>Mínimo</td><td>Alto (actualizar timestamp)</td><td>Bajo (bit de referencia)</td><td>Medio</td></tr>
<tr><td>Hardware support</td><td>Nada</td><td>Mucho (o software)</td><td>Bit R (MMU)</td><td>Contadores</td></tr>
</table>
<h3>Swapping</h3>
<p>Swap space en disco (partición o archivo). Linux usa swap para: hibernación, memory overcommit (sí, puede matar procesos con OOM killer), y páginas inactivas de procesos dormidos.</p>`,
    exercise:{prompt:'Belady\'s anomaly: ¿qué es y qué algoritmo lo sufre?',
    code:'',answer:'Es cuando aumentar el número de páginas empeora la tasa de page faults. Ocurre con FIFO. LRU y algoritmos de stack (optimal, Clock) no lo sufren porque son "stack algorithms".'}},

    {id:'13-04',title:'Asignación de Memoria — Buddy System, Slab, Fragmentation',
    content:`<h1>📦 Asignación de Memoria — del kernel a malloc</h1>
<h3>Fragmentación</h3>
<table class="comp-table"><tr><th></th><th>Fragmentación Interna</th><th>Fragmentación Externa</th></tr>
<tr><td>Qué es</td><td>Espacio desperdiciado DENTRO de un bloque</td><td>Huecos entre bloques</td></tr>
<tr><td>Causa</td><td>Redondeo alineación/tamaño mínimo</td><td>Asignaciones y liberaciones alternadas</td></tr>
<tr><td>Ejemplo</td><td>Bloque de 16 bytes para datos de 7 bytes</td><td>Memoria total 100 bytes libres pero en 10 bloques de 10</td></tr>
</table>
<h3>Buddy System (kernel Linux)</h3>
<p>Divide la memoria en bloques de tamaño potencia de 2 (4KB, 8KB, 16KB, ...). Al liberar, combina con su "buddy" (bloque adyacente del mismo tamaño) para formar un bloque mayor. <strong>Ventaja:</strong> coalescing simple, O(log n). <strong>Desventaja:</strong> fragmentación interna (hasta 50% desperdicio).</p>
<h3>Slab Allocator — para objetos del kernel</h3>
<p>Linux usa slab cache por tipo de objeto (task_struct, inode, dentry). Cada slab contiene objetos del mismo tamaño pre-inicializados. <strong>Coloreado</strong> de slabs para mejorar uso de cache L1/L2.</p>
<div class="code-block"><pre><span class="cm">// Ejemplo: slab para task_struct (~2KB)</span>
<span class="cm">// slab_cache = kmem_cache_create("task_struct", sizeof(task_struct), ...)</span>
<span class="cm">// t = kmem_cache_alloc(task_struct_cache) // O(1), objeto listo</span>
<span class="cm">// kmem_cache_free(task_struct_cache, t)    // O(1), vuelve al cache</span></pre></div>
<h3>malloc en user-space (glibc ptmalloc)</h3>
<p>Usa <strong>arenas</strong> (múltiples heaps para reducir lock contention). Bloques pequeños (<256KB) usan bins ordenados por tamaño (fast, small, large). Bloques grandes → mmap(). free() coalesce bloques adyacentes. Tcache (thread-local cache) para acceso ultra rápido.</p>`,
    exercise:{prompt:'¿Qué ventaja tiene el slab allocator sobre el buddy system para objetos del kernel?',
    code:'',answer:'Elimina overhead de inicialización (objetos pre-inicializados), mejor localidad de cache (misma clase de objeto en misma página), y no hay fragmentación externa para objetos del mismo tamaño.'}},

    {id:'13-05',title:'Sincronización — Mutex, Semaphore, Monitor',
    content:`<h1>🔒 Sincronización — evitando race conditions</h1>
<h3>Mutex vs Semaphore vs Monitor</h3>
<table class="comp-table"><tr><th></th><th>Mutex</th><th>Binary Semaphore</th><th>Counting Semaphore</th><th>Monitor</th></tr>
<tr><td>Estado</td><td>Lockeado/desbloqueado</td><td>0/1</td><td>0..N</td><td>Cola de espera</td></tr>
<tr><td>Owner</td><td>Sí (quien lockea debe unlockear)</td><td>No (cualquiera puede signal)</td><td>No</td><td>Implícito (methods sincronizados)</td></tr>
<tr><td>Uso típico</td><td>Sección crítica</td><td>Exclusión mutua</td><td>Recursos limitados (pool conexiones)</td><td>Java synchronized, pthread_cond</td></tr>
<tr><td>Inversión de prioridad</td><td>Riesgo</td><td>Riesgo</td><td>Bajo</td><td>Bajo</td></tr>
</table>
<h3>Spinlock vs Mutex Sleep</h3>
<table class="comp-table"><tr><th></th><th>Spinlock</th><th>Mutex (sleeping)</th></tr>
<tr><td>Espera</td><td>Busy-wait (consume CPU)</td><td>Duerme (cede CPU)</td></tr>
<tr><td>Costo</td><td>Bajo si espera corta</td><td>Context switch (~µs)</td></tr>
<tr><td>Uso</td><td>Kernel, ISRs, secciones muy cortas</td><td>User-space, I/O, esperas largas</td></tr>
<tr><td>Deadlock risk</td><td>Sí (preemption deshabilitada)</td><td>Sí</td></tr>
</table>
<h3>Condition Variables — wait y signal</h3>
<div class="code-block"><pre><span class="cm">// Productor-consumidor con mutex + condition variable</span>
pthread_mutex_lock(&mutex);
<span class="kw">while</span> (buffer.empty())      <span class="cm">// siempre en while (spurious wakeup)</span>
    pthread_cond_wait(&cond, &mutex);
item = buffer.pop();
pthread_mutex_unlock(&mutex);

<span class="cm">// Producer:</span>
pthread_mutex_lock(&mutex);
buffer.push(item);
pthread_cond_signal(&cond);   <span class="cm">// despierta un waiter</span>
pthread_mutex_unlock(&mutex);</pre></div>
<h3>Read-Write Lock</h3>
<p>Múltiples lectores simultáneos, escritura exclusiva. Útil para estructuras leídas frecuentemente, escritas rara vez (caches, config). Fairness: puede causar writer starvation si hay muchos lectores.</p>`,
    exercise:{prompt:'¿Qué es un spurious wakeup y por qué se usa while en lugar de if en condition variables?',
    code:'',answer:'Spurious wakeup: pthread_cond_wait puede retornar sin señal. En while se re-evalúa la condición; en if se asume que la condición es verdadera (puede ser falso).'}},

    {id:'13-06',title:'Deadlock — 4 condiciones, prevención, Banker\'s Algorithm',
    content:`<h1>💀 Deadlock — cuando todos esperan a todos</h1>
<h3>Las 4 condiciones (Coffman)</h3>
<table class="comp-table"><tr><th>#</th><th>Condición</th><th>Descripción</th></tr>
<tr><td>1</td><td>Mutual Exclusion</td><td>Recurso no compartible (o se usa exclusivo)</td></tr>
<tr><td>2</td><td>Hold and Wait</td><td>Proceso retiene recursos mientras espera otros</td></tr>
<tr><td>3</td><td>No Preemption</td><td>Recurso no puede ser arrebatado</td></tr>
<tr><td>4</td><td>Circular Wait</td><td>Ciclo en grafo de asignación</td></tr>
</table>
<p>Si se rompe CUALQUIER condición, no hay deadlock.</p>
<h3>Prevención — romper una condición</h3>
<ol>
<li><strong>Hold and Wait:</strong> asignar todos los recursos al inicio (baja utilización) o que el proceso no retenga mientras espera</li>
<li><strong>No Preemption:</strong> si un proceso no consigue recurso, libera los que tiene (difícil para algunas cosas como mutex)</li>
<li><strong>Circular Wait:</strong> orden total de recursos (adquirir en orden numérico ascendente) — solución práctica más común</li>
</ol>
<h3>Banker\'s Algorithm (Dijkstra)</h3>
<p>Algoritmo de evitación: el sistema conoce de antemano el máximo de recursos que cada proceso necesita. Antes de asignar, verifica si el estado resultante es <strong>safe</strong> (existe secuencia en que todos terminan). Si no, bloquea la asignación. <strong>Problema:</strong> requiere conocer necesidades futuras, raramente usado en la práctica.</p>
<h3>Detección y Recovery</h3>
<p>Wait-for graph: nodos = procesos, aristas = "proceso A espera recurso retenido por B". Si hay ciclo → deadlock. Recovery: matar procesos (cascada) o forzar preemption (rollback).</p>`,
    exercise:{prompt:'¿Por qué Banker\'s Algorithm no se usa en sistemas operativos modernos?',
    code:'',answer:'Requiere que los procesos declaren su MAX resource need de antemano, no maneja recursos dinámicos, y es cuadrático. En la práctica se usan deadlock detection con timeout o se ignoran (ocurren raramente).'}},

    {id:'13-07',title:'IPC — Pipes, Sockets, Shared Memory, Signals',
    content:`<h1>📡 IPC — comunicación entre procesos</h1>
<h3>Métodos de IPC comparados</h3>
<table class="comp-table"><tr><th></th><th>Pipe (named/unamed)</th><th>Socket</th><th>Shared Memory</th><th>Message Queue</th><th>Signal</th></tr>
<tr><td>Velocidad</td><td>Rápido (kernel buffer)</td><td>Medio (protocol stack)</td><td>Más rápido (sin kernel)</td><td>Medio</td><td>Bajo (límite info)</td></tr>
<tr><td>Bidireccional</td><td>Solo named pipe</td><td>Sí</td><td>Sí</td><td>Sí</td><td>No</td></tr>
<tr><td>Red</td><td>No (localhost)</td><td>Sí (TCP/UDP)</td><td>No</td><td>No (POSIX)/Sí (System V)</td><td>No</td></tr>
<tr><td>Sincronización</td><td>Kernel (bloqueante)</td><td>Kernel</td><td>Manual (semáforo)</td><td>Kernel</td><td>Asíncrona</td></tr>
<tr><td>Máximo datos</td><td>Pipe buffer (64KB Linux)</td><td>Memo limitada</td><td>Toda la RAM</td><td>Límite sistema</td><td>~32 bytes (siginfo)</td></tr>
</table>
<h3>Shared Memory — el más rápido</h3>
<p>Procesos mapean la misma página física en sus espacios virtuales. <strong>mmap()</strong> con MAP_SHARED. Necesita sincronización explícita (mutex en shared memory o semáforo POSIX). <strong>Ejemplo:</strong> base de datos en memoria compartida entre procesos.</p>
<h3>Unix Domain Socket vs TCP Socket (localhost)</h3>
<p>Unix Domain Socket: 2-3x más rápido que TCP en localhost. No pasa por protocol stack (no checksum, no headers TCP/IP). Usa el sistema de archivos (path) o abstract namespace como dirección.</p>
<h3>Signal — el IPC más limitado</h3>
<p>Notificación asíncrona a un proceso. Señales estándar (SIGINT, SIGTERM, SIGKILL) y definidas por usuario (SIGUSR1, SIGUSR2). <strong>Problemas:</strong> no lleva payload, manejador corre en interrupción (no puede usar malloc/lock). signalfd en Linux convierte señales en eventos de fd.</p>`,
    exercise:{prompt:'¿Por qué shared memory es más rápido que pipes y sockets?',
    code:'',answer:'Porque los datos se leen/escriben directamente en memoria compartida sin copiar al kernel ni serializar. Pipe/socket requieren copy_user (user→kernel→user). Shared memory: solo sincronización (semáforo en RAM).'}},

    {id:'13-08',title:'File Systems — inodos, ext4, journaling',
    content:`<h1>📁 File Systems — cómo se organizan los datos</h1>
<h3>Inodes — metadata de archivos</h3>
<p>Cada archivo/directorio tiene un inodo (estructura en disco). Contiene: permisos, tamaño, timestamps, apuntadores a bloques de datos (directos, indirectos, doble indirecto, triple indirecto).</p>
<table class="comp-table"><tr><th>Nivel de indirección</th><th>Bloques direccionables</th><th>Tamaño máximo (bloques 4KB)</th></tr>
<tr><td>12 directos</td><td>12 bloques</td><td>48 KB</td></tr>
<tr><td>1 indirecto</td><td>1024 bloques (32-bit)</td><td>4 MB</td></tr>
<tr><td>2 indirectos</td><td>1024² bloques</td><td>4 GB</td></tr>
<tr><td>3 indirectos</td><td>1024³ bloques</td><td>4 TB</td></tr>
</table>
<h3>ext4 — journaling file system</h3>
<p><strong>Journal</strong>: registro de operaciones pendientes (metadata-only o full data journaling). Si el sistema crashea, replay del journal recupera consistencia (no requiere fsck). modos: journal (más seguro, lento), ordered (metadata journal + data write antes, default), writeback (metadata journal solo, más rápido).</p>
<h3>Comparativa de FS modernos</h3>
<table class="comp-table"><tr><th></th><th>ext4</th><th>XFS</th><th>Btrfs</th><th>ZFS</th></tr>
<tr><td>Journaling</td><td>Sí</td><td>Sí (metadata)</td><td>Copy-on-write</td><td>Copy-on-write</td></tr>
<tr><td>Snapshot</td><td>No</td><td>No</td><td>Sí</td><td>Sí</td></tr>
<tr><td>Compression</td><td>No</td><td>No</td><td>Sí (zstd, lzo)</td><td>Sí (lz4, gzip)</td></tr>
<tr><td>Deduplication</td><td>No</td><td>No</td><td>Sí (online)</td><td>Sí (online)</td></tr>
<tr><td>Max file size</td><td>16 TB</td><td>8 EB</td><td>16 EB</td><td>256 ZB</td></tr>
<tr><td>Repair speed</td><td>Rápido (e2fsck)</td><td>Muy rápido</td><td>Lento (btrfs check)</td><td>Rápido (scrub)</td></tr>
</table>
<h3>VFS — Virtual File System (Linux)</h3>
<p>Capa de abstracción: system calls (read/write/open) → VFS → FS específico. VFS define inode, dentry, superblock, file objects. Permite montar múltiples FS bajo el mismo árbol (/).</p>`,
    exercise:{prompt:'¿Qué ventaja tiene copy-on-write (Btrfs/ZFS) sobre journaling (ext4)?',
    code:'',answer:'Snapshots instantáneos (rehúso bloques), integridad de datos (checksums), no requiere fsck después de crash (siempre consistente), compresión/dedup nativa.'}},

    {id:'13-09',title:'I/O Models — blocking, non-blocking, async, epoll',
    content:`<h1>🔄 I/O Models — de select a io_uring</h1>
<h3>Los 5 modelos I/O</h3>
<table class="comp-table"><tr><th>Modelo</th><th>Fase 1 (wait data)</th><th>Fase 2 (copy data)</th><th>Hilos necesarios</th><th>Latencia</th></tr>
<tr><td>Blocking I/O</td><td>Bloquea</td><td>Kernel→User</td><td>1 por conexión</td><td>Alta (thousands conexiones)</td></tr>
<tr><td>Non-blocking I/O</td><td>Polling (EAGAIN)</td><td>Kernel→User</td><td>1 + loop</td><td>CPU wasting</td></tr>
<tr><td>I/O Multiplexing (select/epoll)</td><td>select() bloquea</td><td>Kernel→User</td><td>1 + event loop</td><td>Buena (nginx, Redis)</td></tr>
<tr><td>Signal-driven I/O</td><td>sigaction (asíncrono)</td><td>Kernel→User</td><td>1 + handler</td><td>Complejo</td></tr>
<tr><td>Async I/O (AIO / io_uring)</td><td>No bloquea</td><td>Kernel→User (automático)</td><td>1 + submission/completion queue</td><td>Excelente (bajo CPU)</td></tr>
</table>
<h3>select vs poll vs epoll</h3>
<table class="comp-table"><tr><th></th><th>select()</th><th>poll()</th><th>epoll (Linux)</th><th>kqueue (BSD/Mac)</th></tr>
<tr><td>Monitoreo</td><td>FD_SET (max 1024)</td><td>Array de pollfd</td><td>Ilimitado (red-black tree)</td><td>Ilimitado</td></tr>
<tr><td>Registro</td><td>Cada llamada</td><td>Cada llamada</td><td>Una vez (epoll_ctl)</td><td>Una vez</td></tr>
<tr><td>Resultado</td><td>Escanea todo el set</td><td>Escanea todo el array</td><td>Solo FDs ready (O(ready))</td><td>Solo events</td></tr>
<tr><td>Overhead O(n)</td><td>O(1024)</td><td>O(n fds)</td><td>O(1) por fd + O(ready)</td><td>O(1) por fd</td></tr>
</table>
<h3>io_uring — el futuro del I/O en Linux</h3>
<p>Colas de submission (SQ) y completion (CQ) en memoria compartida user/kernel. Sin system calls en el hot path. Soporta read, write, openat, accept, fsync, incluso operaciones de red. <strong>Ventaja:</strong> ~70% menos latencia que epoll + read en workloads mixtos.</p>`,
    exercise:{prompt:'¿Por qué epoll escala mejor que select para miles de conexiones?',
    code:'',answer:'select copia FD_SET completo user↔kernel cada llamada (O(n)), y máximo 1024 FDs. epoll registra FDs una vez (epoll_ctl) y retorna solo los ready (O(ready)). No hay scan lineal de todos los FDs.'}},

    {id:'13-10',title:'Concurrencia — Race Conditions, False Sharing, Memory Order',
    content:`<h1>🧵 Concurrencia — pitfalls y memory model</h1>
<h3>Race Condition — el bug más común</h3>
<p>Ocurre cuando el resultado depende del orden de ejecución de hilos. <strong>Ejemplo:</strong> incremento de contador (read→modify→write no atómico). Solución: atomicidad (CAS, mutex, atomic operations).</p>
<h3>False Sharing — el enemigo silencioso del rendimiento</h3>
<p>Dos variables independientes pero en la misma <strong>cache line</strong> (64 bytes en x86). Si el core 0 escribe A y core 1 lee B, la cache line "bouncea" entre L1 de ambos cores. Rendimiento cae dramáticamente.</p>
<div class="code-block"><pre><span class="cm">// Ejemplo de false sharing — MESI protocol invalidation</span>
<span class="kw">struct</span> { <span class="kw">int</span> x; <span class="kw">int</span> y; } datos;   <span class="cm">// x e y en misma cache line</span>
<span class="cm">// Hilo 1: escribe datos.x — invalida cache line del core 2</span>
<span class="cm">// Hilo 2: lee datos.y — miss, recarga (aunque x e y son independientes)</span>

<span class="cm">// Solución: padding a 64 bytes</span>
<span class="kw">struct</span> { <span class="kw">int</span> x; <span class="kw">char</span> pad[<span class="num">60</span>]; } datosX;
<span class="kw">struct</span> { <span class="kw">int</span> y; <span class="kw">char</span> pad[<span class="num">60</span>]; } datosY;</pre></div>
<h3>Memory Ordering — no asumas secuencialidad</h3>
<p>CPU y compilador reordenan instrucciones mientras el resultado sea equivalente (para un solo hilo). <strong>Memory barriers</strong> (fences) fuerzan orden. Operaciones atómicas en C++/Java tienen memory ordering parameters (relaxed, acquire, release, seq_cst).</p>
<h3>Lock-free programming — CAS (Compare-And-Swap)</h3>
<div class="code-block"><pre><span class="cm">// CAS atómico en Java</span>
AtomicInteger contador = <span class="kw">new</span> AtomicInteger(<span class="num">0</span>);
<span class="kw">int</span> esperado, nuevo;
<span class="kw">do</span> {
    esperado = contador.get();
    nuevo = esperado + <span class="num">1</span>;
} <span class="kw">while</span> (!contador.compareAndSet(esperado, nuevo));
<span class="cm">// ABA problem: si otro hilo cambia A→B→A, CAS no detecta. Solución: AtomicStampedReference</span></pre></div>
<h3>Ampdahl\'s Law — el límite del paralelismo</h3>
<p>Speedup ≤ 1 / ((1 - P) + P/N). Donde P = fracción paralelizable, N = cores. <strong>Ejemplo:</strong> 95% paralelizable en 16 cores → speedup max = 1/(0.05+0.95/16) = 10.4x. Los primeros cores dan más ganancia.</p>`,
    exercise:{prompt:'¿Qué es false sharing y cómo se soluciona?',
    code:'',answer:'Dos variables independientes en la misma cache line causan invalidación MESI continua. Solución: padding a 64 bytes (cache line size) o reorganizar structs para que variables de hilos distintos estén en distintas cache lines.'}}
  ]
});
})();
