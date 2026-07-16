(() => {
MODULES.push({
  id: 15, icon: '🗄️', title: 'Databases Deep Dive',
  desc: 'MVCC, B+ Trees, LSM Trees, Query Planning, Isolation Levels, ARIES, Indexing, Sharding, Replication, NoSQL',
  lessons: [
    {id:'15-01',title:'MVCC — Multi-Version Concurrency Control',
    content:`<h1>📄 MVCC — el corazón de PostgreSQL</h1>
<h3>¿Cómo evita MVCC los locks de lectura?</h3>
<p>Cada transacción ve una <strong>instantánea (snapshot)</strong> consistente de la base de datos al momento en que empezó. Las escrituras crean nuevas versiones de filas, no sobrescriben las existentes. Lectores nunca bloquean escritores, escritores nunca bloquean lectores.</p>
<h3>Implementación — xmin y xmax</h3>
<p>Cada fila tiene metadatos de transacción:</p>
<table class="comp-table"><tr><th>Campo</th><th>Qué almacena</th></tr>
<tr><td>xmin</td><td>Transaction ID que CREÓ esta versión</td></tr>
<tr><td>xmax</td><td>Transaction ID que BORRÓ/actualizó esta versión (0 si activa)</td></tr>
<tr><td>t_ctid</td><td>Pointer a la siguiente versión (cadena de versiones)</td></tr>
</table>
<div class="code-block"><pre><span class="cm">// Regla de visibilidad (simplificada):</span>
<span class="cm">// 1. xmin debe ser < txid_snapshot_más_alto (committed)</span>
<span class="cm">// 2. xmin NO debe estar en la lista de transacciones activas del snapshot</span>
<span class="cm">// 3. xmax == 0 (válida) O xmax está abortada (válida)</span>
<span class="cm">// 4. xmax == txid propia: el UPDATE aún no se commitó (versión anterior visible)</span></pre></div>
<h3>Problema: bloat (tuplas muertas)</h3>
<p>Las versiones viejas de filas no se borran inmediatamente. <strong>VACUUM</strong> las limpia: escanea tablas, marca espacio como reusable. <strong>Autovacuum</strong> se activa cuando hay suficientes tuplas muertas (threshold). Sin VACUUM: bloat infinito, rendimiento degrada.</p>
<h3>Snapshot Isolation vs Serializable</h3>
<p><strong>Snapshot Isolation:</strong> evita dirty reads, non-repeatable reads, phantom reads. Pero permite <strong>write skew</strong> (actualizaciones concurrentes que no confligen en mismas filas pero violan restricciones). Serializable en PostgreSQL detecta write skew con SI + predicate locks (SSI).</p>`,
    exercise:{prompt:'¿Qué es write skew en MVCC y cómo lo previene PostgreSQL Serializable?',
    code:'',answer:'Write skew: dos transacciones leen un conjunto de filas (ej: doctores de guardia), cada una actualiza una fila diferente, pero el invariante se rompe (ambos se van de guardia). SSI detecta dependencias entre lecturas y escrituras, aborta si hay conflicto.'}},

    {id:'15-02',title:'B+ Trees — estructura y optimizaciones',
    content:`<h1>🌳 B+ Tree — el índice más usado del mundo</h1>
<h3>Estructura</h3>
<p>Árbol balanceado donde:</p>
<ul>
<li>Nodos internos: solo contienen <strong>claves de separación</strong> + punteros a hijos</li>
<li>Nodos hoja: contienen <strong>pares (clave, valor)</strong> o punteros a tuplas</li>
<li>Hojas están enlazadas en una linked list (range scans eficientes)</li>
</ul>
<h3>Parámetros clave</h3>
<table class="comp-table"><tr><th>Parámetro</th><th>Descripción</th><th>Valor típico</th></tr>
<tr><td>Order (fanout)</td><td>Máximo número de hijos por nodo</td><td>~200-500 (según tamaño de clave + puntero)</td></tr>
<tr><td>Page size</td><td>Tamaño de cada nodo</td><td>8KB (InnoDB), 16KB (SQL Server)</td></tr>
<tr><td>Fill factor</td><td>% de llenado en inserción</td><td>67-90%</td></tr>
<tr><td>Altura típica</td><td>Número de niveles raíz→hoja</td><td>3-4 para millones de filas, 5-6 para billones</td></tr>
</table>
<h3>Búsqueda por rango — Range Scan</h3>
<div class="code-block"><pre><span class="cm">// SELECT * FROM users WHERE age BETWEEN 25 AND 30</span>
<span class="cm">// 1. Buscar clave = 25 en hojas (O(log n))</span>
<span class="cm">// 2. Recorrer linked list de hojas hasta clave > 30</span>
<span class="cm">// Complejidad: O(log n + k) donde k = resultados</span>
<span class="cm">// Índice clusterizado: mucho más rápido (datos en hoja)</span>
<span class="cm">// Índice secundario: necesita lookups a la tabla (random I/O)</span></pre></div>
<h3>Page Splits</h3>
<p>Cuando un nodo se llena: 50% queda, 50% va a nuevo nodo, clave de separación sube al padre. Costoso: write-ahead log, actualizar punteros. <strong>Fill factor</strong> bajo en índices con inserción aleatoria (ej: UUID) para reducir splits.</p>
<h3>B+ Tree vs B-Tree</h3>
<p><strong>B-Tree:</strong> datos en todos los nodos. <strong>B+ Tree:</strong> datos solo en hojas. Ventaja de B+: rango scans más rápidos (linked list de hojas), mayor fanout (nodos internos sin datos). Desventaja: búsqueda puntual siempre va a hoja (O(log n) igual).</p>`,
    exercise:{prompt:'¿Por qué InnoDB usa B+ Tree y no B-Tree para índices?',
    code:'',answer:'B+ Tree permite range scans eficientes (hojas enlazadas), mayor fanout (más claves por página), y mejor localidad de cache. Las hojas contienen datos o PK pointers. B-Tree tiene datos en nodos internos, range scan requiere recursion.'}},

    {id:'15-03',title:'LSM Trees — SSTables, Compaction, Bloom Filters',
    content:`<h1>📚 LSM Tree — write-optimized storage</h1>
<h3>Arquitectura</h3>
<p>Log-Structured Merge Tree: optimizado para <strong>writes</strong> (10-100x más rápido que B+ Tree en inserts aleatorios). Usado por: LevelDB, RocksDB (MySQL MyRocks), Cassandra, HBase, Bigtable.</p>
<h3>Componentes</h3>
<table class="comp-table"><tr><th>Componente</th><th>Descripción</th><th>Rendimiento</th></tr>
<tr><td>MemTable</td><td>Tabla en memoria (ordenada, skiplist o árbol)</td><td>Writes O(log n), volátil</td></tr>
<tr><td>WAL (Write-Ahead Log)</td><td>Log en disco para recovery</td><td>Append secuencial, rápido</td></tr>
<tr><td>Immutable MemTable</td><td>MemTable listo para flush</td><td>Read-only, se flushea a disco</td></tr>
<tr><td>SSTable</td><td>Sorted String Table en disco</td><td>Inmutable, ordenada por clave</td></tr>
</table>
<h3>Compaction — el secreto del rendimiento a largo plazo</h3>
<p>Niveles (L0, L1, L2...). L0 contiene flushes directos de MemTable (solapados). Niveles superiores: <strong>sorted runs</strong> sin solapamiento. Compaction: merge de SSTables, elimina claves borradas/sobrescritas.</p>
<table class="comp-table"><tr><th>Tipo</th><th>Cuándo</th><th>Costo</th><th>Write Amplification</th></tr>
<tr><td>Minor compaction</td><td>Flush MemTable → L0</td><td>Bajo (1 archivo)</td><td>1x</td></tr>
<tr><td>Major compaction</td><td>Merge niveles</td><td>Alto (rewrite)</td><td>10-50x</td></tr>
<tr><td>Full compaction</td><td>Todos los niveles</td><td>Muy alto</td><td>100x+</td></tr>
</table>
<h3>Bloom Filter — optimización de lecturas</h3>
<p>Estructura probabilística: dice si una clave <strong>no existe</strong> en un SSTable. Si el bloom filter dice "no" → skip el SSTable. Si dice "sí" → puede ser falso positivo (configurable, típico 1%). Evita revisar todos los SSTables en cada get.</p>
<h3>LSM vs B+ Tree — cuándo usar cada uno</h3>
<table class="comp-table"><tr><th></th><th>B+ Tree</th><th>LSM Tree</th></tr>
<tr><td>Write throughput</td><td>~10K ops/s</td><td>~100K ops/s (random inserts)</td></tr>
<tr><td>Read (puntual)</td><td>~O(log n)</td><td>~O(n SSTables) sin bloom filter</td></tr>
<tr><td>Range scan</td><td>Excelente (linked list)</td><td>Bueno (merge sort)</td></tr>
<tr><td>Space amplification</td><td>Baja (fill factor ~67%)</td><td>Alta (SSTables duplicados)</td></tr>
<tr><td>Write amplification</td><td>Baja (~2x con WAL)</td><td>Alta (10-50x con compaction)</td></tr>
</table>`,
    exercise:{prompt:'¿Por qué los LSM Trees tienen write amplification alta y cómo se mitiga?',
    code:'',answer:'Cada write se reescribe múltiples veces en compaction (merge de SSTables). Mitigación: tamaño de nivel exponencial (L1=10MB, L2=100MB, L3=1GB...), compactación en background, rate limiting de compaction.'}},

    {id:'15-04',title:'Query Planning — optimización de consultas',
    content:`<h1>🔍 Query Planning — cómo la DB ejecuta tu SQL</h1>
<h3>Plan de ejecución — EXPLAIN ANALYZE</h3>
<p>Secuencia de operadores (plan nodes) que la DB ejecuta para resolver una query. Cada nodo tiene: tipo (scan, join, sort, aggregate), estimación de filas/costo, algoritmo usado.</p>
<h3>Métodos de scan</h3>
<table class="comp-table"><tr><th>Scan</th><th>Cuándo lo elige</th><th>Costo</th></tr>
<tr><td>Sequential scan</td><td>Tabla pequeña, sin índice, o filas > 5-10% de la tabla</td><td>O(n) páginas (lectura secuencial)</td></tr>
<tr><td>Index scan</td><td>Pocas filas (<5%), índice disponible</td><td>O(log n) búsqueda + random I/O por fila</td></tr>
<tr><td>Index-only scan</td><td>Índice cubre todas las columnas</td><td>O(log n), sin I/O a heap (más rápido)</td></tr>
<tr><td>Bitmap scan</td><td>Varias filas pero no todas (5-20%)</td><td>Bitmap en mem, ordena por página (reduce random I/O)</td></tr>
</table>
<h3>Join algorithms — el cuello de botella</h3>
<table class="comp-table"><tr><th></th><th>Nested Loop Join</th><th>Hash Join</th><th>Merge Join</th></tr>
<tr><td>Complejidad</td><td>O(n * m)</td><td>O(n + m) hash + O(n) probe</td><td>O(n + m) sorted</td></tr>
<tr><td>Memo</td><td>O(1)</td><td>O(n) (hash table)</td><td>O(1)</td></tr>
<tr><td>Orden requerido</td><td>No</td><td>No</td><td>Sí (ambos inputs ordenados)</td></tr>
<tr><td>Mejor para</td><td>Tabla externa pequeña</td><td>Tablas grandes, sin orden</td><td>Datos ya ordenados por índice</td></tr>
<tr><td>Index NLJ</td><td>O(n * log m) si hay índice</td><td>N/A</td><td>N/A</td></tr>
</table>
<h3>Estimación de cardinalidad</h3>
<p>El planner estima filas usando <strong>estadísticas</strong>: histogramas, MCV (Most Common Values), correlación entre columnas. <strong>Problema:</strong> estimaciones malas → plan malo. Causas: stats desactualizadas (falta ANALYZE), correlated columns, funciones en WHERE.</p>
<h3>Subquery vs JOIN</h3>
<p>No siempre es obvio. <strong>Subquery correlacionada</strong> ejecuta la subquery por cada fila → lento. JOIN puede ser más eficiente. <strong>LATERAL JOIN</strong> (PostgreSQL): similar a subquery correlacionada pero el planner lo optimiza mejor.</p>`,
    exercise:{prompt:'¿Cuándo el planificador elige sequential scan sobre index scan?',
    code:'',answer:'Cuando estima que el índice no reduce lo suficiente (más de ~5-10% de filas). Sequential scan lee páginas secuencialmente (rápido, prefecthing). Index scan requiere random I/O, que es más lento para muchas filas.'}},

    {id:'15-05',title:'Isolation Levels — anomalías y configuración',
    content:`<h1>🔒 Isolation Levels — transacciones concurrentes</h1>
<h3>Anomalías de concurrencia</h3>
<table class="comp-table"><tr><th>Anomalía</th><th>Descripción</th><th>Nivel que lo evita</th></tr>
<tr><td>Dirty Read</td><td>Leer datos escritos por transacción no confirmada (aborta → datos inválidos)</td><td>READ COMMITTED</td></tr>
<tr><td>Non-Repeatable Read</td><td>Misma fila leída dos veces da diferente valor (otra TX hizo UPDATE intermedio)</td><td>REPEATABLE READ</td></tr>
<tr><td>Phantom Read</td><td>Misma query retorna filas nuevas (otra TX INSERT entre lecturas)</td><td>SERIALIZABLE</td></tr>
<tr><td>Lost Update</td><td>Dos transacciones leen y escriben mismo valor, una pisa a la otra</td><td>Depende (last update wins vs pessimistic locking)</td></tr>
<tr><td>Write Skew</td><td>Dos TX leen set de filas, cada una escribe diferente fila, invariante roto</td><td>SERIALIZABLE (SSI)</td></tr>
</table>
<h3>Niveles de aislamiento en SQL estándar</h3>
<table class="comp-table"><tr><th></th><th>Dirty Read</th><th>Non-Repeatable Read</th><th>Phantom Read</th></tr>
<tr><td>READ UNCOMMITTED</td><td>Posible</td><td>Posible</td><td>Posible</td></tr>
<tr><td>READ COMMITTED</td><td>No</td><td>Posible</td><td>Posible</td></tr>
<tr><td>REPEATABLE READ</td><td>No</td><td>No</td><td>Posible (no en PostgreSQL)</td></tr>
<tr><td>SERIALIZABLE</td><td>No</td><td>No</td><td>No</td></tr>
</table>
<h3>Implementación en motores populares</h3>
<table class="comp-table"><tr><th></th><th>PostgreSQL</th><th>MySQL InnoDB</th><th>SQL Server</th></tr>
<tr><td>Default</td><td>READ COMMITTED</td><td>REPEATABLE READ</td><td>READ COMMITTED</td></tr>
<tr><td>READ UNCOMMITTED</td><td>No (igual a RC)</td><td>Sí</td><td>Sí</td></tr>
<tr><td>REPEATABLE READ</td><td>No phantoms (MVCC)</td><td>Phantoms posibles</td><td>Phantoms posibles</td></tr>
<tr><td>SERIALIZABLE</td><td>SSI (optimista)</td><td>2PL (pesimista, lock)</td><td>2PL + range locks</td></tr>
</table>
<h3>Snapshot Isolation vs Serializable</h3>
<p>PostgreSQL REPEATABLE READ = Snapshot Isolation. Permite write skew. Serializable usa Serializable Snapshot Isolation (SSI): detecta conflictos serializables con graph de dependencias. Si hay ciclo → aborta una transacción.</p>`,
    exercise:{prompt:'¿Por qué PostgreSQL REPEATABLE READ no tiene phantom reads pero MySQL InnoDB sí?',
    code:'',answer:'PostgreSQL usa MVCC con snapshots: la misma lectura siempre devuelve los mismos datos (versión al momento del snapshot). Los inserts de otras TX son invisibles. InnoDB usa next-key locking en REPEATABLE READ, que no cubre todos los casos de phantom.'}},

    {id:'15-06',title:'Transacciones y ARIES — WAL, recovery',
    content:`<h1>📝 ARIES — Algorithms for Recovery and Isolation Exploiting Semantics</h1>
<h3>WAL (Write-Ahead Log) — el principio fundamental</h3>
<p>Antes de modificar cualquier página en disco, se escribe un <strong>log record</strong> en el WAL. <strong>Regla WAL:</strong> el log debe llegar a disco ANTES que la página modificada. Esto permite recovery después de crash: <strong>Redo</strong> (operaciones committed no flusheadas) y <strong>Undo</strong> (operaciones no committed que llegaron a disco).</p>
<h3>ARIES — 3 fases de recovery</h3>
<ol>
<li><strong>Analysis:</strong> escanea WAL desde el último checkpoint. Identifica dirty pages y TX en progreso.</li>
<li><strong>Redo:</strong> reaplica operaciones desde el LSN más antiguo de dirty pages. Vuelve a estado de crash.</li>
<li><strong>Undo:</strong> deshace operaciones de TX que no commitearon. Genera <strong>CLR</strong> (Compensation Log Records) para idempotencia.</li>
</ol>
<h3>LSN (Log Sequence Number)</h3>
<p>Cada página almacena <code>pageLSN</code> = último LSN de log que la modificó. Durante Redo: si <code>pageLSN >= log.LSN</code>, la modificación ya está en la página → skip. Esto evita redo innecesario.</p>
<h3>Steal / No-Steal, Force / No-Force</h3>
<table class="comp-table"><tr><th></th><th>Force (flush en commit)</th><th>No-Force (flush diferido)</th></tr>
<tr><td>Steal (flush dirty antes de commit)</td><td>No usado (demasiado I/O en commit)</td><td>ARIES (steal/no-force) — PostgreSQL, InnoDB</td></tr>
<tr><td>No-Steal</td><td>Difícil (mucha RAM)</td><td>No usado</td></tr>
</table>
<p><strong>ARIES = steal + no-force</strong>: WAL permite undo de páginas flusheadas antes de commit (steal) y redo de páginas no flusheadas en commit (no-force). Mejor balance rendimiento/seguridad.</p>`,
    exercise:{prompt:'¿Qué ventaja tiene No-Force + Steal sobre Force + No-Steal?',
    code:'',answer:'No-Force: commit no requiere flush de todas las páginas (solo WAL) → commits rápidos. Steal: páginas dirty pueden flush antes de commit → menos RAM necesaria. ARIES con WAL hace esto seguro.'}},

    {id:'15-07',title:'Indexing Strategies — clustered, covering, partial',
    content:`<h1>📑 Estrategias de Indexación — maximizando performance</h1>
<h3>Tipos de índices</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Descripción</th><th>Ejemplo</th></tr>
<tr><td>Clustered (Primary)</td><td>Orden físico de datos en disco = orden del índice. Solo 1 por tabla</td><td>InnoDB PK index</td></tr>
<tr><td>Secondary (Non-clustered)</td><td>Índice separado, apunta a fila via PK o RID</td><td>CREATE INDEX ON users(email)</td></tr>
<tr><td>Covering (Include)</td><td>Índice incluye TODAS las columnas de la query (index-only scan)</td><td>CREATE INDEX ON ... INCLUDE (col1, col2)</td></tr>
<tr><td>Composite (Multi-column)</td><td>Índice con varias columnas (order matters!)</td><td>CREATE INDEX ON users(country, city)</td></tr>
<tr><td>Partial (Filtered)</td><td>Índice solo para filas que cumplen condición</td><td>CREATE INDEX ON orders(status) WHERE status = 'pending'</td></tr>
<tr><td>Functional (Expression)</td><td>Índice sobre resultado de expresión/función</td><td>CREATE INDEX ON users(LOWER(email))</td></tr>
</table>
<h3>Composite Index — orden de columnas</h3>
<p>El orden de columnas determina qué queries puede acelerar. Ej: <code>INDEX(a, b, c)</code> acelera queries con WHERE en: a solo, a+b, a+b+c. No acelera b solo ni c solo. <strong>Regla de la barba:</strong> primero columnas de igualdad (=), luego rango (>, BETWEEN), luego ORDER BY/GROUP BY.</p>
<h3>Selectividad (Cardinalidad)</h3>
<p>Columnas con alta selectividad (muchos valores distintos) primero. <code>INDEX(gender, email)</code> — gender tiene 2 valores, email millones. Mejor <code>INDEX(email, gender)</code> — email filtra mucho más rápido.</p>
<h3>Índices y writes</h3>
<p>Cada índice extra en una tabla incrementa tiempo de INSERT/UPDATE/DELETE. <strong>Tradeoff:</strong> reads rápidos vs writes lentos. Tablas con alta relación reads/writes → más índices. Tablas de log/eventos → menos índices.</p>`,
    exercise:{prompt:'¿Qué es un index-only scan y por qué es más rápido?',
    code:'',answer:'Cuando el índice contiene todas las columnas que necesita la query, no necesita acceder a la tabla (heap). Ahorra random I/O. Se logra con INCLUDE columns o creando índices que cubren la query.'}},

    {id:'15-08',title:'Sharding — particionando datos horizontalmente',
    content:`<h1>🔪 Sharding — escalando horizontalmente la base de datos</h1>
<h3>Sharding vs Partitioning</h3>
<table class="comp-table"><tr><th></th><th>Partitioning</th><th>Sharding</th></tr>
<tr><td>Alcance</td><td>Misma base de datos/misma instancia</td><td>Instancias/máquinas separadas</td></tr>
<tr><td>Transparencia</td><td>SQL transparente (el motor maneja)</td><td>App debe saber qué shard consultar</td></tr>
<tr><td>Cross-partition queries</td><td>Posibles (misma instancia)</td><td>Complejas (requieren coordinación)</td></tr>
<tr><td>Escalabilidad</td><td>Horizontal limitada (misma máquina)</td><td>Horizontal ilimitada</td></tr>
</table>
<h3>Estrategias de sharding</h3>
<table class="comp-table"><tr><th>Estrategia</th><th>Cómo asigna</th><th>Problemas</th></tr>
<tr><td>Hash-based</td><td>hash(shard_key) % N</td><td>Agregar shards requiere rehash (o consistent hashing)</td></tr>
<tr><td>Range-based</td><td>Clave en rango (0-1000 → shard 1, 1001-2000 → shard 2)</td><td>Hot spots (último shard siempre activo), skew</td></tr>
<tr><td>Directory-based</td><td>Tabla de lookup (shard_key → shard)</td><td>Punto único de fallo (la tabla de lookup)</td></tr>
<tr><td>Geographic</td><td>Región del usuario</td><td>Desbalance si regiones crecen diferente</td></tr>
</table>
<h3>Problemas de sharding</h3>
<ul>
<li><strong>Cross-shard joins:</strong> casi imposibles. Desnormalizar o hacer en app.</li>
<li><strong>Distributed transactions:</strong> 2PC es lento. SAGA es más práctico.</li>
<li><strong>Rebalancing:</strong> mover datos entre shards. Consistent hashing minimiza.</li>
<li><strong>Auto-increment IDs:</strong> no funcionan. Usar Snowflake, UUID, o sequence por shard.</li>
<li><strong>Backup/restore:</strong> más complejo, requiere coordinar todos los shards.</li>
</ul>
<h3>Alternativas: NoSQL nativo</h3>
<p>Cassandra, MongoDB, DynamoDB tienen sharding built-in. Manejan rebalanceo, replicación, y tolerancia a fallos. Pero sacrifican joins y transacciones ACID.</p>`,
    exercise:{prompt:'¿Por qué el rebalanceo de shards es difícil y cómo ayuda consistent hashing?',
    code:'',answer:'Mover terabytes entre nodos es lento y consume I/O. Consistent hashing: solo mueve 1/N de los datos al agregar/quitar un nodo (vs N-1/N con hash mod N). Virtual nodes mejoran distribución.'}},

    {id:'15-09',title:'Replicación — sync, async, multi-leader',
    content:`<h1>🔄 Replicación — datos en múltiples nodos</h1>
<h3>Single-Leader (Master-Slave)</h3>
<p>Todos los writes van al leader. El leader replica a followers (síncrono o asíncrono). Reads pueden ir a cualquier nodo. Usado por: MySQL, PostgreSQL, SQL Server.</p>
<table class="comp-table"><tr><th></th><th>Síncrona</th><th>Asíncrona</th><th>Semi-síncrona</th></tr>
<tr><td>Leader commit</td><td>Espera confirmación de ≥1 follower</td><td>No espera</td><td>Espera al menos 1 follower</td></tr>
<tr><td>Data loss en failover</td><td>0 (follower está al día)</td><td>Posible (últimas escrituras no replicadas)</td><td>Mínimo</td></tr>
<tr><td>Latencia de write</td><td>Mayor (esperar red)</td><td>Baja</td><td>Media</td></tr>
<tr><td>Disponibilidad</td><td>Menor (follower caído bloquea writes)</td><td>Alta</td><td>Alta</td></tr>
</table>
<h3>Multi-Leader</h3>
<p>Varios nodos aceptan writes. Conflictos inevitables. Estrategias de resolución:</p>
<ul>
<li><strong>Last Write Wins (LWW):</strong> timestamp más alto gana. Puede perder datos.</li>
<li><strong>Version Vectors:</strong> detecta conflictos, resolución manual o aplicación.</li>
<li><strong>CRDT:</strong> tipos de datos que convergen automáticamente (contadores, sets).</li>
</ul>
<p>Usado por: DynamoDB, Cassandra (multi-leader configurable). Problema: conflictos frecuentes si no se particiona bien.</p>
<h3>Leaderless (Quorum)</h3>
<p>Writes van a N nodos, reads consultan M nodos. Si W + R > N, hay consistencia fuerte. Ej: Cassandra (N=3, W=2, R=2). Tradeoff: más latencia (varios nodos), mayor disponibilidad (no depende de 1 nodo).</p>`,
    exercise:{prompt:'¿Cuándo elegir replicación asíncrona vs síncrona?',
    code:'',answer:'Asíncrona: baja latencia, alta disponibilidad, acepta posible pérdida de datos en failover. Síncrona: cero pérdida de datos, pero menor throughput y riesgo de indisponibilidad si follower cae.'}},

    {id:'15-10',title:'NoSQL Tradeoffs — document, wide-column, graph, time-series',
    content:`<h1>🗃️ NoSQL — tipos, uso y tradeoffs</h1>
<h3>Los 4 grandes tipos de NoSQL</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Modelo de datos</th><th>Ejemplos</th><th>Mejor para</th></tr>
<tr><td>Document</td><td>JSON/BSON, esquema flexible</td><td>MongoDB, Firestore, Couchbase</td><td>Catálogos, perfiles, contenido anidado</td></tr>
<tr><td>Key-Value</td><td>Par clave-valor, simple</td><td>Redis, DynamoDB, Riak</td><td>Caches, sesiones, contadores</td></tr>
<tr><td>Wide-Column</td><td>Tablas con columnas variables por fila</td><td>Cassandra, HBase, Scylla</td><td>Time-series, eventos, IoT</td></tr>
<tr><td>Graph</td><td>Nodos + aristas + propiedades</td><td>Neo4j, Dgraph, Amazon Neptune</td><td>Redes sociales, recomendaciones, fraude</td></tr>
<tr><td>Time-Series</td><td>Datos indexados por timestamp</td><td>InfluxDB, TimescaleDB, Prometheus</td><td>Métricas, monitoreo, sensores</td></tr>
</table>
<h3>SQL vs NoSQL — cuándo usar cada uno</h3>
<table class="comp-table"><tr><th>Criterio</th><th>SQL (PostgreSQL, MySQL)</th><th>NoSQL (MongoDB, Cassandra)</th></tr>
<tr><td>Schema</td><td>Fijo, migraciones</td><td>Flexible, evolución fácil</td></tr>
<tr><td>Joins</td><td>Nativos, eficientes</td><td>No existen (desnormalizar)</td></tr>
<tr><td>Transacciones</td><td>ACID completas</td><td>Limitadas (single document/row key)</td></tr>
<tr><td>Escalabilidad</td><td>Vertical (fuerte) / Horizontal (limitada)</td><td>Horizontal nativa</td></tr>
<tr><td>Consistencia</td><td>Strong (default)</td><td>Eventual (tunable)</td></tr>
<tr><td>Queries complejas</td><td>JOIN, subqueries, window functions</td><td>Limitadas (aggregation pipeline)</td></tr>
<tr><td>Casos de uso</td><td>Fintech, ERP, SaaS</td><td>IoT, Big Data, tiempo real</td></tr>
</table>
<h3>NewSQL — lo mejor de ambos mundos</h3>
<p>Bases de datos SQL con escalabilidad horizontal: <strong>CockroachDB</strong> (PostgreSQL compatible, Raft-based), <strong>YugabyteDB</strong> (PostgreSQL compatible, distributed), <strong>Spanner</strong> (Google, TrueTime). ACID distribuido + escalabilidad horizontal.</p>`,
    exercise:{prompt:'¿Cuándo elegir Cassandra sobre PostgreSQL?',
    code:'',answer:'Cassandra para: writes masivos (time-series, eventos, IoT), escalabilidad horizontal nativa, multi-región activa. PostgreSQL para: relaciones complejas, ACID, joins, queries ad-hoc, consistencia fuerte.'}}
  ]
});
})();
