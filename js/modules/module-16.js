(() => {
MODULES.push({
  id: 16, icon: '🌍', title: 'Distributed Systems',
  desc: 'CAP Theorem, Raft, 2PC/3PC, Distributed ID, Vector Clocks, Gossip, Consistent Hashing, Caching, SAGA, Monitoring',
  lessons: [
    {id:'16-01',title:'CAP Theorem — consistency, availability, partition tolerance',
    content:`<h1>🧩 CAP Theorem — solo 2 de 3</h1>
<h3>El teorema (Brewer, 2000)</h3>
<p>En un sistema distribuido particionado, debes elegir entre <strong>Consistency</strong> (todos ven mismos datos) y <strong>Availability</strong> (toda request recibe respuesta). <strong>Partition Tolerance</strong> (el sistema sigue funcionando aunque la red se divida) no es opcional en sistemas distribuidos — la red siempre puede fallar.</p>
<h3>CP vs AP — la decisión real</h3>
<table class="comp-table"><tr><th></th><th>CP (Consistency + Partition)</th><th>AP (Availability + Partition)</th></tr>
<tr><td>Durante partición</td><td>Rechaza writes (o algunos nodos dejan de servir)</td><td>Acepta writes en ambos lados (eventual consistency)</td></tr>
<tr><td>Cuando la red sana</td><td>Datos consistentes</td><td>Resuelve conflictos</td></tr>
<tr><td>Ejemplos</td><td>ZooKeeper, etcd, HBase, MongoDB (default)</td><td>Cassandra, DynamoDB, Redis (cluster asíncrono)</td></tr>
<tr><td>Usa</td><td>Quorum reads/writes</td><td>Read-repair, hinted handoff</td></tr>
<tr><td>Tradeoff</td><td>Disponibilidad reducida en partición</td><td>Consistencia eventual (datos divergentes)</td></tr>
</table>
<h3>PACELC — extendiendo CAP</h3>
<p>Si hay partición (P): tradeoff C vs A. <strong>Else (E):</strong> tradeoff Latency vs Consistency. Muchos sistemas eligen baja latencia (L) en operación normal, incluso si sacrifican consistencia fuerte. Ej: Cassandra (AP/EL): durante partición elige disponibilidad, en operación normal elige baja latencia (consistency tunable).</p>
<h3>Consistency models — de estricta a eventual</h3>
<table class="comp-table"><tr><th>Modelo</th><th>Garantía</th><th>Ejemplo</th></tr>
<tr><td>Strict (Linearizability)</td><td>Toda operación parece instantánea, como single node</td><td>etcd, ZooKeeper (sync), Spanner (TrueTime)</td></tr>
<tr><td>Sequential</td><td>Operaciones de cada cliente en orden</td><td>DynamoDB (transactions)</td></tr>
<tr><td>Causal</td><td>Operaciones causalmente relacionadas vistas en orden</td><td>Vector clocks, CRDTs</td></tr>
<tr><td>Read-your-writes</td><td>Cliente ve sus propias escrituras</td><td>DynamoDB (session consistency)</td></tr>
<tr><td>Eventual</td><td>Sin writes, todos convergen al mismo estado</td><td>DNS, Cassandra (default)</td></tr>
</table>`,
    exercise:{prompt:'¿Por qué se dice que en la práctica solo eliges entre CP y AP?',
    code:'',answer:'Porque Partition Tolerance no es opcional — la red siempre puede fallar. Si dices "no quiero particiones", estás asumiendo que la red nunca falla, lo cual es falso en sistemas distribuidos reales.'}},

    {id:'16-02',title:'Raft Consensus — leader election, log replication',
    content:`<h1>⚓ Raft — consenso entendible</h1>
<h3>Roles en Raft</h3>
<table class="comp-table"><tr><th>Rol</th><th>Qué hace</th><th>Tiempo límite</th></tr>
<tr><td><strong>Leader</strong></td><td>Recibe writes, replica log a followers, envía heartbeats periódicos</td><td>Indefinido (hasta que falla o se desconecta)</td></tr>
<tr><td><strong>Follower</strong></td><td>Recibe log del leader, vota en elecciones</td><td>Election timeout aleatorio (150-300ms)</td></tr>
<tr><td><strong>Candidate</strong></td><td>Inicia elección cuando timeout expira</td><td>Hasta ganar o perder elección</td></tr>
</table>
<h3>Leader Election — el proceso</h3>
<ol>
<li>Follower no recibe heartbeat en election timeout → incrementa term, se vuelve Candidate</li>
<li>Candidate vota por sí mismo, envía RequestVote a todos los nodos</li>
<li>Si recibe mayoría (N/2 + 1) de votos → se vuelve Leader</li>
<li>Leader envía heartbeats inmediatamente para mantener su liderazgo</li>
<li>Si hay split vote (empate) → timeout y nueva elección</li>
</ol>
<h3>Log Replication — el camino del write</h3>
<div class="code-block"><pre><span class="cm">// Cliente envía comando al Leader</span>
<span class="cm">// 1. Leader crea log entry (term + index + comando)</span>
<span class="cm">// 2. Leader envía AppendEntries a todos los Followers</span>
<span class="cm">// 3. Cada Follower escribe entry a su log (aún no COMMITTED)</span>
<span class="cm">// 4. Cuando mayoría responde OK → entry está COMMITTED</span>
<span class="cm">// 5. Leader aplica comando a state machine, responde al cliente</span>
<span class="cm">// 6. Leader notifica a Followers en próximo heartbeat</span>
<span class="cm">// </span>
<span class="cm">// Safety: Leader nunca sobrescribe su propio log. Solo entries del term actual se consideran committed.</span></pre></div>
<h3>Log Compaction — snapshotting</h3>
<p>El log crece indefinidamente. Raft toma <strong>snapshots</strong> del state machine periódicamente. El snapshot reemplaza entradas de log anteriores. Los followers pueden descargar snapshots si están muy atrás (InstallSnapshot RPC).</p>
<h3>Raft vs Paxos</h3>
<p><strong>Paxos:</strong> más complejo (multi-paxos, prepare/promise/accept). <strong>Raft:</strong> descompone consenso en subproblemas (election, replication, safety, membership changes). Más fácil de implementar correctamente. Usado por: etcd, Consul, TiKV, CockroachDB.</p>`,
    exercise:{prompt:'¿Qué pasa si el Leader de Raft se cae y un Follower no tiene todas las entradas committed?',
    code:'',answer:'El nuevo Leader puede tener entradas no en todos los followers. Raft restringe: solo un candidato con el log más actualizado puede ganar (su log debe estar al menos tan actualizado como el de la mayoría). Entradas del Leader anterior pueden perderse si no estaban committed.'}},

    {id:'16-03',title:'2PC y 3PC — transacciones distribuidas',
    content:`<h1>🤝 2PC (Two-Phase Commit) y 3PC — ACID distribuido</h1>
<h3>2PC — dos fases, un coordinador</h3>
<table class="comp-table"><tr><th>Fase</th><th>Coordinador</th><th>Participantes</th></tr>
<tr><td><strong>Fase 1: Prepare</strong></td><td>Envía "prepare" a todos</td><td>Escriben a WAL, responden YES/NO. Si NO → aborta</td></tr>
<tr><td><strong>Fase 2: Commit/Abort</strong></td><td>Si todos YES → envía "commit"</td><td>Aplican commit, liberan recursos</td></tr>
</table>
<h3>Problemas de 2PC</h3>
<ul>
<li><strong>Bloqueante:</strong> si coordinador falla después de prepare, participantes quedan bloqueados (esperando decisión)</li>
<li><strong>Punto único de fallo:</strong> si coordinador se cae, no se puede completar</li>
<li><strong>Latencia:</strong> 2 RTTs mínimo (prepare + commit)</li>
<li><strong>No tolera particiones:</strong> si un participante no responde, toda la TX se aborta o bloquea</li>
</ul>
<h3>3PC — non-blocking (con límites)</h3>
<table class="comp-table"><tr><th>Fase</th><th>Novedad</th></tr>
<tr><td>1. CanCommit?</td><td>Pregunta si pueden (aún no preparan)</td></tr>
<tr><td>2. PreCommit</td><td>Preparan pero esperan commit definitivo</td></tr>
<tr><td>3. DoCommit</td><td>Commit final</td></tr>
</table>
<p>3PC evita bloqueo si coordinador falla después de PreCommit (participantes pueden abortar por timeout). Pero aún falla con particiones de red. Poco usado en la práctica.</p>
<h3>SAGA — la alternativa práctica</h3>
<p>Secuencia de transacciones locales con <strong>compensation</strong>. Si T5 falla, se ejecutan compensaciones de T4, T3, T2, T1. <strong>Coreografía:</strong> cada servicio publica evento y reacciona a eventos. <strong>Orquestación:</strong> un orquestador central maneja la secuencia. Usado por: Netflix, Uber, microservicios modernos.</p>`,
    exercise:{prompt:'¿Cuál es la diferencia clave entre 2PC y SAGA?',
    code:'',answer:'2PC es ACID (bloqueante, consistencia fuerte). SAGA es eventual consistency (cada paso es una TX local independiente, con compensación si falla). SAGA es más escalable y tolerante a fallos, pero no tiene aislamiento.'}},

    {id:'16-04',title:'Distributed ID — Snowflake, UUID, sequences',
    content:`<h1>🔢 Distributed ID — IDs únicos a escala global</h1>
<h3>Requerimientos de IDs distribuidas</h3>
<ul>
<li><strong>Único globalmente:</strong> sin colisiones entre máquinas</li>
<li><strong>Ordenable:</strong> idealmente por tiempo (índices B+ Tree eficientes)</li>
<li><strong>Compacto:</strong> 64 bits es ideal (cabe en long de Java)</li>
<li><strong>Alta velocidad:</strong> generar millones/sec sin bottleneck</li>
</ul>
<h3>Comparativa de estrategias</h3>
<table class="comp-table"><tr><th></th><th>Snowflake (Twitter)</th><th>UUID v4</th><th>UUID v7</th><th>Auto-increment DB</th></tr>
<tr><td>Tamaño</td><td>64 bits (8 bytes)</td><td>128 bits (16 bytes)</td><td>128 bits</td><td>Variable</td></tr>
<tr><td>Ordenable</td><td>Sí (timestamp)</td><td>No (aleatorio)</td><td>Sí (timestamp ms + random)</td><td>Sí</td></tr>
<tr><td>Velocidad</td><td>Millones/seg (local)</td><td>Rápido (aleatorio)</td><td>Rápido</td><td>Lento (DB bottleneck)</td></tr>
<tr><td>Sin coordinación</td><td>Worker ID asignado</td><td>Sí (puramente local)</td><td>Sí</td><td>No (DB central)</td></tr>
<tr><td>Colisiones</td><td>Imposibles (config)</td><td>Extremadamente raras</td><td>Extremadamente raras</td><td>Imposibles</td></tr>
</table>
<h3>Snowflake — 64 bits para 10K IDs/s</h3>
<div class="code-block"><pre><span class="cm">// Bit layout (64 bits total)</span>
<span class="cm">// Bit 63: unused (0 para futuro)</span>
<span class="cm">// Bits 62-22 (41 bits): timestamp en ms (custom epoch) → ~69 años</span>
<span class="cm">// Bits 21-12 (10 bits): worker ID (máx 1024 workers)</span>
<span class="cm">// Bits 11-0 (12 bits): sequence number (~4096 IDs/ms/worker)</span>
<span class="cm">// </span>
<span class="cm">// Si se exceden 4096 IDs en 1ms → esperar al próximo ms</span>
<span class="cm">// Al reiniciar, sequence reinicia (timestamp no retrocede)</span></pre></div>
<h3>UUID v7 — el estándar moderno</h3>
<p>UUID v7 (RFC 9562): timestamp Unix ms (48 bits) + random (74 bits) + version/variant (6 bits). Es <strong>monotónico</strong> dentro del mismo ms. Compatible con UUID estándar, ordenado por tiempo, sin coordinación central.</p>`,
    exercise:{prompt:'¿Por qué UUID v4 es malo para índices de base de datos?',
    code:'',answer:'UUID v4 es aleatorio → inserts en índices B+ Tree causan page splits constantes (escritura dispersa), fragmentación, y bajo fill factor. UUID v7 es monotónico → inserts secuenciales (más eficientes para B+ Tree).'}},

    {id:'16-05',title:'Vector Clocks — causalidad y conflictos',
    content:`<h1>🕰️ Vector Clocks — quién sabe qué</h1>
<h3>El problema de la causalidad</h3>
<p>En sistemas distribuidos sin reloj sincronizado, necesitamos saber si el evento A causó el evento B. <strong>Lamport timestamps</strong> dan orden parcial: si A → B (A causalmente antes de B), entonces L(A) < L(B). Pero L(A) < L(B) no implica A → B (pueden ser concurrentes).</p>
<h3>Vector Clock — solución</h3>
<p>Cada proceso i mantiene un vector V[i] de N enteros (N = número de procesos).</p>
<ul>
<li>Al hacer un evento local: V[i]++</li>
<li>Al enviar mensaje: V[i]++, incluye V en mensaje</li>
<li>Al recibir mensaje M: V[j] = max(V[j], M.V[j]) para todo j, luego V[i]++</li>
</ul>
<div class="code-block"><pre><span class="cm">// Comparación de vectores:</span>
<span class="cm">// V(A) <= V(B) si V(A)[i] <= V(B)[i] para todo i → A causalmente antes de B</span>
<span class="cm">// V(A) < V(B) si V(A) <= V(B) y algún i con < → A antes de B</span>
<span class="cm">// V(A) || V(B) si ni V(A) <= V(B) ni V(B) <= V(A) → concurrentes (conflicto)</span>
<span class="cm">// </span>
<span class="cm">// Ejemplo: V(A) = [2,0,3], V(B) = [1,2,3] → concurrentes (2>1 pero 0<2)</span>
<span class="cm">// A y B son concurrentes → puede haber conflicto</span></pre></div>
<h3>Version Vectors (Vector Clocks en almacenamiento)</h3>
<p>Usados en DynamoDB, Riak para detección de conflictos. Cada clave tiene un vector de versiones. Si un write llega con vector concurrente al actual → hay conflicto. Resolución: LWW (last write wins) o read-repair manual.</p>
<h3>Problema: escalabilidad</h3>
<p>Vector clocks crecen O(N) con cada nodo que coordina el dato. Para sistemas grandes (1000 nodos), vectores de 1000 enteros. Solución: <strong>version vectors</strong> con dot notation (solo pares (nodo, contador) activos), o <strong>CRDTs</strong> que no necesitan vectores.</p>`,
    exercise:{prompt:'¿Cuándo dos eventos son concurrentes en un sistema distribuido?',
    code:'',answer:'Dos eventos A y B son concurrentes si no hay relación causal entre ellos: ni A → B ni B → A. Vector clocks: V(A) || V(B) cuando hay al menos una dimensión donde A > B y otra donde B > A.'}},

    {id:'16-06',title:'Gossip Protocol — epidemic broadcast',
    content:`<h1>🗣️ Gossip Protocol — comunicación epidémica</h1>
<h3>Cómo funciona</h3>
<p>Cada nodo periódicamente selecciona un subconjunto aleatorio de nodos (típico 3-5) y comparte información. Similar a cómo se propagan los rumores. <strong>Propiedades:</strong> descentralizado, tolerante a fallos, eventualmente todos reciben el mensaje.</p>
<h3>Variantes de gossip</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Mecanismo</th><th>Convergencia</th><th>Carga de red</th></tr>
<tr><td>Push</td><td>Nodo envía mensaje a B nodos aleatorios</td><td>Rápida (O(log n))</td><td>Alta (todos envían)</td></tr>
<tr><td>Pull</td><td>Nodo pregunta a B nodos si tienen novedades</td><td>Más lenta</td><td>Menor (solo pregunta)</td></tr>
<tr><td>Push-Pull</td><td>Ambos envían y reciben</td><td>Más rápida</td><td>Balanceada</td></tr>
</table>
<h3>SWIM — Gossip Escalable</h3>
<p>SWIM (Scalable Weakly-consistent Infection-style Process Group Membership Protocol) es el protocolo usado por Consul, Cassandra y Serf:</p>
<ul>
<li><strong>Dissemination:</strong> gossip de estados de nodos (push-pull periódico)</li>
<li><strong>Failure detection:</strong> indirect probing (si A no responde a B → B pide a C que pruebe A). Evita split-brain en redes asimétricas</li>
<li><strong>Round:</strong> cada ~100ms, seleccionar nodo aleatorio y hacer ping-pong</li>
</ul>
<h3>Convergencia — ¿en cuánto tiempo todos saben?</h3>
<p>Con push gossip y B peers/gossip: O(log_B(n)) rondas para informar a todos. Ej: n=10000, B=3 → ~8 rondas. <strong>Phantom deaths:</strong> nodo vivo pero no responde es marcado como sospechoso, luego confirmado muerto si no mejora.</p>`,
    exercise:{prompt:'¿Cómo detecta SWIM que un nodo ha fallado sin depender de un líder central?',
    code:'',answer:'Cada nodo periódicamente hace ping a un nodo aleatorio. Si no responde, pide a otros nodos que lo prueben (indirect probing). Si varios confirman la falta de respuesta, se marca como sospechoso. Si no mejora en N rondas, se declara fallado y se gossip el cambio.'}},

    {id:'16-07',title:'Consistent Hashing — distribuyendo claves',
    content:`<h1>💍 Consistent Hashing — el hash ring</h1>
<h3>El problema del hash mod N</h3>
<p><code>server = hash(key) % N</code>. Si N cambia (nuevo servidor, fallo), casi todas las claves se reasignan → movimiento masivo de datos. En un cache, esto causa <strong>cache stampede</strong> (todas las claves fallan simultáneamente → origen overload).</p>
<h3>Hash Ring</h3>
<p>Servidores y claves se posicionan en un anillo (hash circular, típicamente SHA-1 de 0 a 2^160 - 1). Cada clave se asigna al primer servidor en sentido horario. Cuando un servidor se agrega/quita, solo las claves en su vecindad se reasignan.</p>
<h3>Virtual Nodes — distribución uniforme</h3>
<p>Si hay pocos servidores, la distribución puede ser desigual. <strong>Solución:</strong> cada servidor aparece en múltiples posiciones del anillo (100-200 virtual nodes por servidor físico). Mejor distribución, especialmente cuando hay servidores de diferentes capacidades (más vnodes = más capacidad).</p>
<div class="code-block"><pre><span class="cm">// Consistent Hashing con vnodes — concepto</span>
<span class="cm">// for each server physical:</span>
<span class="cm">//   for i in 0..VNODES_PER_SERVER:</span>
<span class="cm">//     pos = hash(server.id + ":" + i)</span>
<span class="cm">//     ring[pos] = server</span>
<span class="cm">// </span>
<span class="cm">// Al buscar clave:</span>
<span class="cm">//   pos = hash(key)</span>
<span class="cm">//   server = ring.ceilingEntry(pos)  // primer servidor en sentido horario</span>
<span class="cm">//   if server == null: server = ring.firstEntry()  // wrap around</span>
<span class="cm">// </span>
<span class="cm">// Cuando un servidor sale: solo sus vnodes se reasignan = 1/N de las claves</span>
<span class="cm">// Cuando uno entra: asume ~Vnodes/N keys de otros servidores</span></pre></div>
<h3>Usos en producción</h3>
<p><strong>Amazon DynamoDB:</strong> consistent hashing + vnodes para distribución y balance de carga. <strong>Cassandra:</strong> particionamiento por hash ring, cada nodo tiene un rango de tokens. <strong>Discord:</strong> consistent hashing para sharding de servidores de chat. <strong>Akamai CDN:</strong> mapeo de URLs a edge servers.</p>`,
    exercise:{prompt:'¿Qué ventaja tiene consistent hashing sobre hash mod N para un cache distribuido?',
    code:'',answer:'Hash mod N: si se agrega/elimina 1 servidor, ~99% de claves se reasignan → cache miss masivo. Consistent hashing: solo ~1/N de claves se reasignan (con vnodes). Minimiza redistribución y cache stampede.'}},

    {id:'16-08',title:'Distributed Caching — Memcached vs Redis',
    content:`<h1>⚡ Distributed Caching — estrategias y tecnologías</h1>
<h3>Caching strategies</h3>
<table class="comp-table"><tr><th>Patrón</th><th>Read</th><th>Write</th><th>Problema</th></tr>
<tr><td>Cache-Aside</td><td>Leer de cache, miss → leer DB, set en cache</td><td>Escribir DB, invalidar cache</td><td>Race condition (escritura concurrente)</td></tr>
<tr><td>Read-Through</td><td>Cache llama a DB automáticamente en miss</td><td>Escribir DB, invalidar</td><td>Cache debe conocer DB</td></tr>
<tr><td>Write-Through</td><td>Normal</td><td>Escribir cache → cache escribe DB</td><td>Write latency (2 writes)</td></tr>
<tr><td>Write-Behind (Write-Back)</td><td>Normal</td><td>Escribir cache → async write a DB</td><td>Pérdida si cache falla antes de persistir</td></tr>
<tr><td>Refresh-Ahead</td><td>Cache refresca antes de expirar</td><td>Normal</td><td>Predicción de acceso</td></tr>
</table>
<h3>Memcached vs Redis</h3>
<table class="comp-table"><tr><th></th><th>Memcached</th><th>Redis</th></tr>
<tr><td>Estructuras</td><td>Solo strings</td><td>Strings, lists, sets, hashes, sorted sets, streams, hyperloglogs</td></tr>
<tr><td>Persistencia</td><td>No (volátil)</td><td>Sí (RDB, AOF, ambos)</td></tr>
<tr><td>Multiplexación</td><td>Multi-thread (event-driven)</td><td>Single-thread (event loop)</td></tr>
<tr><td>Replicación</td><td>No</td><td>Sí (leader-follower, sentinel, cluster)</td></tr>
<tr><td>Lua scripting</td><td>No</td><td>Sí (EVAL)</td></tr>
<tr><td>TTL</td><td>Sí (LRU cuando lleno)</td><td>Sí (TTL por clave, varias eviction policies)</td></tr>
<tr><td>Cluster</td><td>Proxy-based (Twemproxy)</td><td>Nativo (Redis Cluster, hash slots)</td></tr>
<tr><td>Usado por</td><td>Facebook (billones de objetos)</td><td>Twitter, GitHub, Stack Overflow, Discord</td></tr>
</table>
<h3>Cache Invalidation — el problema más difícil</h3>
<p><strong>Dos problemas famosos:</strong> 1) <strong>Cache stampede:</strong> cuando clave expira y N requests simultáneos golpean DB. Solución: lock around cache miss o probabilistic early expiration. 2) <strong>Thundering herd:</strong> mismo concepto pero para recomputación costosa. Solución: single flight (solo 1 solicitud computa, las demás esperan).</p>`,
    exercise:{prompt:'¿Cuándo usar Redis vs Memcached?',
    code:'',answer:'Redis: necesitas estructuras de datos (sorted sets para leaderboards, lists para colas), persistencia, replicación, pub/sub, Lua scripts. Memcached: simple, multi-thread, solo strings, gran volumen de objetos simples, no necesita persistencia.'}},

    {id:'16-09',title:'Distributed Transactions — SAGA, TCC, Outbox',
    content:`<h1>🔄 Distributed Transactions — ACID sin 2PC</h1>
<h3>El problema</h3>
<p>En microservicios, una operación de negocio abarca múltiples servicios con sus propias bases de datos. 2PC no escala (bloqueante, lento). Alternativas: patrones de consistencia eventual.</p>
<h3>SAGA — Coreografía vs Orquestación</h3>
<table class="comp-table"><tr><th></th><th>Coreografía</th><th>Orquestación</th></tr>
<tr><td>Coordinación</td><td>Cada servicio escucha eventos y actúa</td><td>Un orquestador central maneja el flujo</td></tr>
<tr><td>Acoplamiento</td><td>Bajo (solo conocen eventos)</td><td>Medio (conocen orquestador)</td></tr>
<tr><td>Trazabilidad</td><td>Difícil (eventos dispersos)</td><td>Fácil (orquestador tiene el estado)</td></tr>
<tr><td>Complejidad</td><td>Alta (muchos handlers)</td><td>Media (orquestador centralizado)</td></tr>
<tr><td>Ejemplo</td><td>Kafka + handlers locales</td><td>Temporal.io, AWS Step Functions</td></tr>
</table>
<h3>Transaction Outbox — el patrón infalible</h3>
<p>En lugar de publicar evento directamente (no atómico con DB write), escribe evento en tabla <strong>outbox</strong> en la MISMA transacción DB. Un proceso separado (CDC, scheduler) lee outbox y publica a message broker.</p>
<div class="code-block"><pre><span class="cm">// Paso 1: en la misma TX de negocio</span>
BEGIN TX;
  INSERT INTO orders (...) VALUES (...);       <span class="cm">// dato de negocio</span>
  INSERT INTO outbox (event_type, payload)       <span class="cm">// evento a publicar</span>
    VALUES ('order.created', '{"id": 123}');
COMMIT;

<span class="cm">// Paso 2: proceso aparte lee outbox y publica</span>
<span class="cm">// Opciones: Debezium (CDC con Kafka), scheduler polling, PostgreSQL LISTEN/NOTIFY</span>
<span class="cm">// Paso 3: listener recibe evento y procesa (ej: enviar email, actualizar inventario)</span></pre></div>
<h3>TCC (Try-Confirm/Cancel)</h3>
<p>Cada operación tiene 3 fases: Try (reservar recursos), Confirm (aplicar), Cancel (liberar). Ej: reservar asiento de avión (Try), confirmar pago (Confirm), o liberar si falla (Cancel). Más rápido que 2PC pero requiere lógica de compensación explícita.</p>`,
    exercise:{prompt:'¿Cómo resuelve el patrón Outbox el problema de atomicidad entre DB write y publicación de evento?',
    code:'',answer:'La escritura en DB y en la tabla outbox ocurren en la misma transacción (atómicas). Un proceso aparte (CDC como Debezium) lee el outbox y publica en Kafka. Si el proceso falla, reintenta. Si la DB falla, la TX se revierte completamente.'}},

    {id:'16-10',title:'Distributed Monitoring — métricas, tracing, logging',
    content:`<h1>📊 Distributed Monitoring — observando sistemas complejos</h1>
<h3>Los 3 pilares de la observabilidad</h3>
<table class="comp-table"><tr><th></th><th>Logging</th><th>Metrics</th><th>Tracing</th></tr>
<tr><td>Qué registra</td><td>Eventos discretos con texto</td><td>Valores agregados numéricos</td><td>Seguimiento de requests entre servicios</td></tr>
<tr><td>Ejemplo</td><td>"User 123 login failed"</td><td>requests/sec, p99 latency</td><td>Span A → Span B → Span C</td></tr>
<tr><td>Herramientas</td><td>ELK, Loki, Splunk</td><td>Prometheus, Grafana, Datadog</td><td>Jaeger, Zipkin, OpenTelemetry</td></tr>
<tr><td>Costo</td><td>Alto (almacenar texto)</td><td>Bajo (números compactos)</td><td>Medio (muestreo ~1%)</td></tr>
<tr><td>Cardinalidad</td><td>Ilimitada</td><td>Alta (labels)</td><td>Media (trace_id + span_id)</td></tr>
</table>
<h3>SLI / SLO / SLA — ingeniería de confiabilidad</h3>
<ul>
<li><strong>SLI (Service Level Indicator):</strong> métrica medida. Ej: latencia P99 < 500ms</li>
<li><strong>SLO (Service Level Objective):</strong> objetivo interno. Ej: 99.9% de requests cumplen SLI</li>
<li><strong>SLA (Service Level Agreement):</strong> promesa al cliente (con penalización). Ej: 99.9% uptime</li>
</ul>
<h3>Error Budget</h3>
<p>Si el SLO es 99.9% = 8.76 horas de downtime/año. El error budget son esos 8.76h. Mientras haya budget, se pueden hacer deploys. Si se agota → congelar cambios hasta recuperar. Balance entre innovación y confiabilidad.</p>
<h3>Distributed Tracing — OpenTelemetry</h3>
<p>Cada request genera un <strong>trace_id</strong> (propagado en headers HTTP/gRPC). Cada servicio crea <strong>spans</strong> con start/end time, tags, logs. El traza completa se ensambla recolectando spans del trace_id. <strong>Muestreo:</strong> head-based (decide al inicio) o tail-based (decide después, mejor para errores raros).</p>`,
    exercise:{prompt:'¿Cuál es la diferencia entre SLI, SLO y SLA?',
    code:'',answer:'SLI = métrica real (ej: latencia P99 = 450ms). SLO = objetivo (ej: P99 < 500ms 99.9% del tiempo). SLA = acuerdo legal con cliente. SLO es interno y guía decisiones; SLA tiene consecuencias si se incumple.'}}
  ]
});
})();
