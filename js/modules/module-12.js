(() => {
MODULES.push({
  id: 12, icon: '🏛️', title: 'System Design — FAANG',
  desc: 'URL Shortener, WhatsApp, Uber, YouTube, Twitter, Web Crawler, Dropbox, Parking Lot, Rate Limiter, Key-Value Store',
  lessons: [
    {id:'12-01',title:'URL Shortener (TinyURL)',
    content:`<h1>🔗 URL Shortener — diseño completo</h1>
<h3>Requerimientos</h3>
<table class="comp-table"><tr><th>Funcionales</th><th>No funcionales</th></tr>
<tr><td>Crear URL corta a partir de larga</td><td>Alta disponibilidad (99.99%)</td></tr>
<tr><td>Redirigir (301) a URL original</td><td>Baja latencia (<10ms redirect)</td></tr>
<tr><td>TTL opcional (expiración)</td><td>Escalable a miles de millones</td></tr>
</table>
<h3>Generación del hash</h3>
<table class="comp-table"><tr><th>Opción</th><th>Longitud</th><th>Colisiones</th><th>Ventaja</th></tr>
<tr><td>MD5 + base62</td><td>7 chars</td><td>Raras (64<sup>7</sup> ≈ 3.5T)</td><td>Determinista</td></tr>
<tr><td>Snowflake ID + base62</td><td>7 chars</td><td>Imposibles</td><td>Ordenable</td></tr>
<tr><td>Contador + base62</td><td>Variable</td><td>Imposibles</td><td>Simple</td></tr>
</table>
<div class="code-block"><pre><span class="cm">// base62 encoding — el clásico</span>
String base62(<span class="kw">long</span> id) {
    String chars = <span class="str">"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"</span>;
    StringBuilder sb = <span class="kw">new</span> StringBuilder();
    <span class="kw">while</span> (id > <span class="num">0</span>) { sb.append(chars.charAt((<span class="kw">int</span>)(id % <span class="num">62</span>))); id /= <span class="num">62</span>; }
    <span class="kw">return</span> sb.reverse().toString();
}
<span class="cm">// 7 chars de base62 => 62^7 ≈ 3.5 billones de combinaciones</span></pre></div>
<h3>Arquitectura</h3>
<p>API Gateway → <strong>Hash Generator</strong> → <strong>Database</strong> (Cassandra/DynamoDB para writes escalables). Cache Redis para reads (LRU, TTL 1 hora). Redirect 301 permanente (cacheable browsers).</p>
<h3>Redirección</h3>
<p>Cliente GET <code>/abc1234</code> → servidor busca en cache/DB → responde 301 con <code>Location</code> header. <strong>301 vs 302</strong>: 301 es cacheable por navegadores (menos carga), 302 permite analytics (cuenta cada click).</p>
<h3>Sharding</h3>
<p><strong>Consistent hashing</strong> sobre el short key para distribuir carga. Replicación multi-AZ para failover.</p>`,
    exercise:{prompt:'¿Por qué usar 301 (permanente) vs 302 (temporal) para la redirección?',
    code:'',answer:'301 es cacheable por navegadores — reduce carga en servidor. 302 permite trackear cada click (analytics). Para TinyURL, usar 301 + analytics sampling.'}},

    {id:'12-02',title:'WhatsApp / Chat System',
    content:`<h1>💬 Chat System — WhatsApp, Messenger</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> mensajes 1:1 y grupales, delivery/read receipts, online status, multimedia, mensajes sin conexión.<br>
<strong>No funcionales:</strong> baja latencia (<100ms), orden estricto de mensajes, alta disponibilidad, cifrado extremo a extremo.</p>
<h3>Protocolo — WebSocket vs Long Polling</h3>
<table class="comp-table"><tr><th></th><th>WebSocket</th><th>Long Polling</th><th>SSE</th></tr>
<tr><td>Latencia</td><td>~10ms</td><td>~200ms</td><td>~50ms</td></tr>
<tr><td>Bidireccional</td><td>Sí</td><td>Sí (simulado)</td><td>No (solo server → client)</td></tr>
<tr><td>Header overhead</td><td>~2 bytes</td><td>~800 bytes</td><td>~200 bytes</td></tr>
<tr><td>Usado por</td><td>WhatsApp, Slack</td><td>Facebook (legacy)</td><td>Notificaciones</td></tr>
</table>
<h3>Arquitectura Pub/Sub</h3>
<p><strong>Message Broker</strong> (Kafka/Pulsar) por chat room. Cada mensaje se publica en un topic del chat. Los consumers son los dispositivos de los participantes. Cada partición del topic garantiza orden por chat.</p>
<p><strong>Persistencia:</strong> Cassandra (write-optimized) con clave compuesta <code>(chat_id, timestamp, message_id)</code>. Las queries son por chat_id ordenadas por timestamp.</p>
<h3>Presencia (online/offline)</h3>
<p>Heartbeat por WebSocket cada 5 segundos. Si no se recibe en 30s → marcar offline. <strong>Optimización:</strong> broadcast de cambios de estado con backoff exponencial para evitar storm de mensajes.</p>
<h3>Multi-dispositivo</h3>
<p>Mensajes se enrutan a todos los dispositivos activos vía <strong>message fan-out</strong>. Cada dispositivo tiene su propia cola de mensajes. El servidor entrega solo cuando el dispositivo confirma recepción.</p>`,
    exercise:{prompt:'¿Cómo garantizar orden de mensajes en un chat grupal de 1000 miembros?',
    code:'',answer:'Usar un Kafka topic por chat con 1 partición (orden estricto). Los mensajes se numeran secuencialmente. El cliente renderiza por sequence number. Los mensajes offline se descargan en batch ordenado.'}},

    {id:'12-03',title:'Uber / Ride Hailing',
    content:`<h1>🚗 Uber — diseño de ride hailing</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> ver conductores cercanos en mapa, solicitar viaje, matching conductor-pasajero, ETA tracking, pago.<br>
<strong>No funcionales:</strong> latencia <1s para matching, P99 <500ms para actualización de GPS, disponible 99.99%.</p>
<h3>Geolocalización — Quadtree vs Geohash vs S2</h3>
<table class="comp-table"><tr><th></th><th>Geohash</th><th>Quadtree</th><th>Google S2</th></tr>
<tr><td>Precisión</td><td>Variable (5-12 chars)</td><td>Según profundidad</td><td>Hasta cm</td></tr>
<tr><td>Vecinos</td><td>Computar prefix</td><td>Recorrer árbol</td><td>Cell covering</td></tr>
<tr><td>Index en DB</td><td>B-tree (prefix)</td><td>En memoria</td><td>B-tree (cell ID 64-bit)</td></tr>
<tr><td>Usado por</td><td>MongoDB, Redis</td><td>Uber (original)</td><td>Google Maps, Uber (actual)</td></tr>
</table>
<h3>Matching — el corazón del sistema</h3>
<p>Cuando un pasajero solicita viaje:</p>
<ol>
<li>Calcular bounding box alrededor de la ubicación</li>
<li>Consultar conductores activos en esa región (S2 cell covering)</li>
<li>Ordenar por ETA usando <strong>Google Maps Distance Matrix API</strong> (o modelo ML interno)</li>
<li>Enviar request al conductor más cercano (primera llegada = asignado)</li>
<li>Timeout de 15s si no acepta → siguiente conductor</li>
</ol>
<h3>Procesamiento de GPS (millones de eventos/s)</h3>
<p>Cada vehículo envía GPS cada 5 segundos. Flujo: Kafka → Spark Streaming → actualiza S2 cell index en memoria. El index en memoria se replica en shards por región geográfica.</p>`,
    exercise:{prompt:'¿Cómo manejar el problema de "match storm" en hora pico?',
    code:'',answer:'Usar cola de solicitudes con prioridad, batch matching (acumular 100ms de requests y hacer matching optimizado), y geo-fencing dinámico para ajustar tamaño de celdas S2 según densidad.'}},

    {id:'12-04',title:'YouTube / Video Streaming',
    content:`<h1>🎬 YouTube — sistema de video streaming</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> upload, transcoding, streaming adaptativo (HLS/DASH), búsqueda, recomendaciones, comentarios.<br>
<strong>No funcionales:</strong> 1B+ usuarios activos, buffering mínimo, latency de < 2s para start playback.</p>
<h3>Upload Pipeline</h3>
<p>Cliente → <strong>sharded blob store</strong> (original) → Kafka → <strong>Transcoding workers</strong> → CDN. Paralelización: video se divide en chunks independientes (ej: 5s GOP boundaries). Cada chunk se transcodea en paralelo a múltiples resoluciones/resolutiones.</p>
<h3>Transcoding — formatos y resoluciones</h3>
<table class="comp-table"><tr><th>Resolución</th><th>Bitrate (aprox)</th><th>Códec</th><th>Caso de uso</th></tr>
<tr><td>144p/240p</td><td>100-300 kbps</td><td>H.264</td><td>Red 3G, datos limitados</td></tr>
<tr><td>360p/480p</td><td>500-1500 kbps</td><td>H.264</td><td>Red móvil normal</td></tr>
<tr><td>720p</td><td>2.5-5 Mbps</td><td>H.264/VP9</td><td>WiFi, calidad estándar</td></tr>
<tr><td>1080p</td><td>5-10 Mbps</td><td>VP9/AV1</td><td>HD en WiFi</td></tr>
<tr><td>4K</td><td>20-50 Mbps</td><td>AV1/HEVC</td><td>Premium, TV</td></tr>
</table>
<h3>Streaming Adaptativo (HLS/DASH)</h3>
<p>Cliente descarga <strong>playlist .m3u8</strong> con URLs a chunks en múltiples resoluciones. El reproductor monitorea buffer y ancho de banda, selecciona la resolución óptima. Transcripción continua (ABR) evita rebuffering.</p>
<h3>CDN Strategy</h3>
<p>Videos populares se cachean en CDN (edge servers). Videos long-tail se sirven desde origen (caché regional). <strong>Predictive pre-fetching</strong>: basado en tendencias, precargar en CDN antes de que se vuelva viral.</p>`,
    exercise:{prompt:'¿Cómo decidir qué resoluciones transcodear para cada video?',
    code:'',answer:'Depende de popularidad esperada: videos populares → más resoluciones (hasta 4K). Videos pequeños → solo 360p/720p. ML predice popularidad basado en metadata del uploader, categoría, etc.'}},

    {id:'12-05',title:'Twitter / News Feed',
    content:`<h1>🐦 Twitter — News Feed, Timeline</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> post tweet, timeline home (tweets de seguidos), timeline de usuario, likes, retweets, comentarios, search.<br>
<strong>No funcionales:</strong> <500ms para carga de timeline, eventual consistency aceptable, escalar a 500M+ tweets/día.</p>
<h3>Fanout: Pull vs Push</h3>
<table class="comp-table"><tr><th></th><th>Push (Fanout on Write)</th><th>Pull (Fanout on Read)</th><th>Híbrido</th></tr>
<tr><td>Latencia lectura</td><td>~10ms (pre-generada)</td><td>~200ms</td><td>~50ms</td></tr>
<tr><td>Latencia escritura</td><td>Alta (muchas writes)</td><td>Baja (1 write)</td><td>Media</td></tr>
<tr><td>Celebridades</td><td>No escala (millones de writes)</td><td>Perfecto</td><td>Pull para celebridades</td></tr>
<tr><td>Usuarios normales</td><td>Bien (followers < 5000)</td><td>Ineficiente</td><td>Push</td></tr>
</table>
<h3>Arquitectura híbrida (Twitter actual)</h3>
<p>Usuarios con <strong>followers > 100k</strong> → pull (se consulta timeline aparte y merge). Usuarios normales → push en write. <strong>Timeline cache</strong> en Redis: lista ordenada por timestamp de tweet. Cuando un usuario abre la app, se hace O(log n) con <code>ZREVRANGE</code>.</p>
<h3>Ranking de Timeline</h3>
<p>Ya no es cronológico inverso — ML ranking con señales: recencia, afinidad con el autor, engagement esperado (likes, retweets), contenido multimedia.</p>
<h3>Search Index</h3>
<p>Inverted index en Elasticsearch. Se indexan tweets en tiempo real via Kafka. Sharding por hash del tweet ID. Ranking por TF-IDF + recencia + calidad del autor.</p>`,
    exercise:{prompt:'¿Por qué Twitter migró de push puro a fanout híbrido?',
    code:'',answer:'Push permite timeline instantáneo pero no escala para celebridades (cada tweet genera millones de writes). Híbrido: push para usuarios normales, pull para celebridades, mejor balance write/read.'}},

    {id:'12-06',title:'Web Crawler',
    content:`<h1>🕷️ Web Crawler — Googlebot design</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> descargar páginas, extraer links, respetar robots.txt, deduplicar URLs, politeness delay.<br>
<strong>No funcionales:</strong> crawl 10B+ páginas/semana, escalable horizontalmente, no sobrecargar servidores.</p>
<h3>Arquitectura General</h3>
<div class="code-block"><pre>URL Frontier (Prioridad) → DNS Resolver → Downloader → Parser → Link Extractor → Dedup → URL Frontier
                                        ↓
                                    Content Store (Blob)</pre></div>
<h3>URL Frontier — control de prioridad y politeness</h3>
<p>No es una simple cola FIFO. Se usan <strong>múltiples colas</strong>, una por dominio (para respetar politeness). Cada cola tiene prioridad. Se selecciona round-robin entre colas priorizadas. Un <strong>politeness timer</strong> asegura mínimo 1 segundo entre requests al mismo dominio.</p>
<h3>Deduplicación de URLs</h3>
<p><strong>Bloom Filter</strong> en memoria: O(1), 1% false positive rate con 10 bits/entry. Para alta precisión, chequear en DB (Cassandra). URL normalizada antes de check: eliminar trailing slash, ordenar query params, lowercase domain.</p>
<h3>robots.txt</h3>
<p>Cachear robots.txt por dominio (TTL 24h). Parsear reglas de exclusión. Si el servidor responde 429 (Too Many Requests), backoff exponencial y reindexar con menor prioridad.</p>
<h3>Detección de contenido duplicado</h3>
<p>Simhash o MinHash para near-duplicate detection (artículo igual con pocos cambios). Checksum SHA-256 del contenido para exact-duplicate.</p>`,
    exercise:{prompt:'¿Cómo manejar un sitio que responde lento o con errores?',
    code:'',answer:'Exponential backoff: 1s, 2s, 4s, 8s hasta max 1h. Si excede N intentos, marcar como error permanente y reducir frecuencia. Repositorio de sitios problemáticos con prioridad baja.'}},

    {id:'12-07',title:'Dropbox / File Storage & Sync',
    content:`<h1>📁 Dropbox — file sync & storage</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> upload/download archivos, sync entre dispositivos, conflict resolution, versionado (30 días), sharing.<br>
<strong>No funcionales:</strong> consistencia fuerte para sync, baja latencia (<1s para detectar cambios), almacenamiento eficiente.</p>
<h3>Chunking — el secreto de Dropbox</h3>
<p>Los archivos se dividen en <strong>chunks de 4MB</strong>. Cada chunk tiene hash SHA-256. Si un chunk ya existe (de otro archivo o versión anterior), se reusa. <strong>Deduplicación</strong>: a nivel de chunks, no de archivos completos.</p>
<h3>Delta Sync</h3>
<p>Al editar un archivo, solo los chunks modificados se suben. El cliente calcula diferencias con <strong>rsync-like algorithm</strong> o usando la versión local cacheada. Ahorro típico: 95%+ de datos no se retransmiten.</p>
<h3>Conflict Resolution</h3>
<table class="comp-table"><tr><th>Estrategia</th><th>Dropbox</th><th>Google Drive</th><th>iCloud</th></tr>
<tr><td>Auto-merge</td><td>No (solo texto con Smart Sync)</td><td>Sí (Google Docs)</td><td>No</td></tr>
<tr><td>Ambos lados</td><td>Archivo conflicto (v2) + original</td><td>Versión separada</td><td>Último escritor gana</td></tr>
<tr><td>Notificación</td><td>Sí</td><td>Sí</td><td>Silenciosa</td></tr>
</table>
<h3>Arquitectura de almacenamiento</h3>
<p><strong>Metadata DB</strong> (PostgreSQL): archivos, usuarios, permisos, versiones. <strong>Block Store</strong>: Amazon S3 (multi-región). <strong>Notification Service</strong>: WebSocket para notify cambios en tiempo real. <strong>LAN Sync</strong>: transferencia peer-to-peer entre dispositivos en misma red local.</p>`,
    exercise:{prompt:'¿Cómo manejar conflictos cuando dos dispositivos editan el mismo archivo sin conexión?',
    code:'',answer:'Dropbox crea ambas versiones: el archivo original y "Archivo (conflicto de v2)". Cuando el usuario se reconecta, recibe ambos y debe resolver manualmente. No hay auto-merge porque no entiende el contenido.'}},

    {id:'12-08',title:'Design Parking Lot (OOD + System Design)',
    content:`<h1>🅿️ Parking Lot — diseño orientado a objetos + sistémico</h1>
<h3>Requerimientos</h3>
<p>Múltiples niveles (floors), múltiples tipos de espacio (compacto, grande, moto, eléctrico), ticket al entrar, pago al salir, disponibilidad en tiempo real.</p>
<h3>Diseño OO — clases principales</h3>
<div class="code-block"><pre><span class="kw">enum</span> VehicleType { MOTO, COMPACTO, GRANDE, ELECTRICO }
<span class="kw">enum</span> SpotStatus { DISPONIBLE, OCUPADO, RESERVADO }

<span class="kw">class</span> ParkingSpot {
    String id; <span class="kw">int</span> floor; VehicleType type; SpotStatus status;
    Ticket assignTicket(Vehicle v) { ... }
}

<span class="kw">class</span> ParkingFloor {
    String floorId;
    Map&lt;VehicleType, Queue&lt;ParkingSpot&gt;&gt; spots;
    ParkingSpot findSpot(VehicleType t) { ... }
}

<span class="kw">class</span> ParkingLot {
    List&lt;ParkingFloor&gt; floors;
    ParkingSpot findAndAssign(Vehicle v) { ... }
    <span class="kw">double</span> calculateCharge(Ticket t) { ... }
}</pre></div>
<h3>Distribución de espacios</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Ancho (m)</th><th>Largo (m)</th><th>% en piso típico</th></tr>
<tr><td>Moto</td><td>1.0</td><td>2.5</td><td>10%</td></tr>
<tr><td>Compacto</td><td>2.5</td><td>5.0</td><td>40%</td></tr>
<tr><td>Grande</td><td>3.5</td><td>6.0</td><td>35%</td></tr>
<tr><td>Eléctrico (con cargador)</td><td>3.0</td><td>5.5</td><td>15%</td></tr>
</table>
<h3>Cálculo de tarifa</h3>
<p>Tarifa base por hora (primeros 30 min gratis), tarifa diferenciada por tipo de vehículo, max charge por día para evitar costo excesivo.</p>
<h3>Escalabilidad</h3>
<p>Parking lot de aeropuerto con 10000+ espacios: usar Redis para contadores de disponibilidad por tipo. Eventos de entrada/salida via Kafka para analytics. Display boards en tiempo real.</p>`,
    exercise:{prompt:'¿Cómo manejar un parking lot de 10000 espacios con disponibilidad en tiempo real?',
    code:'',answer:'Redis hash: "floor:1:compact" → contador atómico. Cada entrada DECR, cada salida INCR. Display boards se actualizan via WebSocket. Si contador llega a 0, marcar piso como lleno.'}},

    {id:'12-09',title:'Rate Limiter (Distribuido)',
    content:`<h1>⏱️ Rate Limiter — Token Bucket, Sliding Window, Distribuido</h1>
<h3>Algoritmos</h3>
<table class="comp-table"><tr><th>Algoritmo</th><th>Memoria</th><th>Precisión</th><th>Burst</th><th>Distribuido</th></tr>
<tr><td>Token Bucket</td><td>O(1) (refill rate + tokens)</td><td>Buena</td><td>Sí (hasta bucket size)</td><td>Sí (Redis atomic)</td></tr>
<tr><td>Leaky Bucket</td><td>O(1) (queue + rate)</td><td>Alta</td><td>No (cola fija)</td><td>Difícil</td></tr>
<tr><td>Sliding Window Log</td><td>O(n) (timestamp por request)</td><td>Perfecta</td><td>N/A</td><td>Mucha memoria</td></tr>
<tr><td>Sliding Window Counter</td><td>O(1) (2 contadores)</td><td>Aproximada (+-10%)</td><td>Parcial</td><td>Redis INCR</td></tr>
</table>
<h3>Token Bucket — implementación en producción</h3>
<div class="code-block"><pre><span class="cm">// Redis Lua script — atómico, distribuido</span>
<span class="str">"local key = KEYS[1]
 local rate = tonumber(ARGV[1])
 local capacity = tonumber(ARGV[2])
 local now = tonumber(ARGV[3])
 local cost = tonumber(ARGV[4])
 
 local tokens = redis.call('hget', key, 'tokens') or capacity
 local lastRefill = redis.call('hget', key, 'lastRefill') or now
 
 local elapsed = math.max(0, now - lastRefill)
 tokens = math.min(capacity, tokens + elapsed * rate)
 
 if tokens >= cost then
     redis.call('hset', key, 'tokens', tokens - cost)
     redis.call('hset', key, 'lastRefill', now)
     return 1  -- permitido
 else
     return 0  -- rate limited
 end"</span></pre></div>
<h3>Estrategias de rate limiting por capa</h3>
<p><strong>API Gateway</strong>: rate limit por IP, por API key, por endpoint. <strong>Microservicios</strong>: rate limit por usuario, por recurso. <strong>Global</strong>: límite total de requests para evitar DDoS. Combinación de Redis con lógica local (token bucket con refill periódico).</p>`,
    exercise:{prompt:'¿Qué pasa si Redis se cae en un rate limiter distribuido?',
    code:'',answer:'Fallback a rate limiter local en memoria (menos preciso pero funcional). Ej: permitir N requests por segundo local y sincronizar periódicamente. Modo degraded — priorizar disponibilidad sobre precisión.'}},

    {id:'12-10',title:'Key-Value Store (Redis-like)',
    content:`<h1>🗄️ Key-Value Store — diseño de Redis escalable</h1>
<h3>Requerimientos</h3>
<p><strong>Funcionales:</strong> get, set, delete, TTL, operaciones atómicas (INCR, LPUSH), estructuras de datos (list, set, hash, zset).<br>
<strong>No funcionales:</strong> latencia <1ms, persistencia opcional, replicación, alta disponibilidad.</p>
<h3>Arquitectura interna</h3>
<table class="comp-table"><tr><th>Componente</th><th>Descripción</th><th>Optimización</th></tr>
<tr><td>Hash Table</td><td>HashMap global de keys a entries</td><td>Rehashing progresivo (incremental)</td></tr>
<tr><td>Event Loop</td><td>Single-thread, reactor pattern</td><td>epoll/kqueue, O(1) por comando</td></tr>
<tr><td>String Encoding</td><td>int (8 bytes), embstr (<44 bytes), raw</td><td>Evita malloc para strings cortos</td></tr>
<tr><td>ZipList</td><td>Lista compacta (small list/hash/zset)</td><td>Menos memoria que linked list</td></tr>
<tr><td>SkipList</td><td>Zset implementation</td><td>O(log n) insert/search, más simple que AVL</td></tr>
</table>
<h3>Persistencia: RDB vs AOF</h3>
<table class="comp-table"><tr><th></th><th>RDB (snapshot)</th><th>AOF (append-only)</th><th>Ambos</th></tr>
<tr><td>Formato</td><td>Binario compacto</td><td>Texto (comandos Redis)</td><td>-</td></tr>
<tr><td>Pérdida datos</td><td>Hasta último snapshot</td><td>1 segundo (fsync=everysec)</td><td>Mínima</td></tr>
<tr><td>Restore</td><td>Rápido</td><td>Lento (replay)</td><td>Primero RDB + AOF replay</td></tr>
<tr><td>Overhead write</td><td>fork() pesado</td><td>Solo append, liviano</td><td>Más disco</td></tr>
</table>
<h3>Replicación</h3>
<p><strong>Leader-follower</strong> asíncrona. Leader escribe a disco + envía replica stream a followers. Sentinel monitorea y promueve follower si leader falla. Redis Cluster: sharding con 16384 slots hash, rebalanceo con resharding online.</p>`,
    exercise:{prompt:'¿Por qué Redis es single-threaded y cómo maneja múltiples clientes simultáneamente?',
    code:'',answer:'Usa epoll/kqueue (I/O multiplexing) + event loop. Un solo hilo evita race conditions y locks. Las operaciones de CPU como SORT o KEYS bloquean. Desde Redis 6, I/O threads opcionales para network read/write.'}}
  ]
});
})();
