(() => {
MODULES.push({
  id: 8, icon: '🏗️', title: 'System Design & Arquitectura',
  desc: 'Caching, CAP, bases de datos, escalabilidad, patrones distribuidos, colas, event sourcing',
  lessons: [
    {id:'8-01',title:'Caching — estrategias y tradeoffs',
content:`<h1>⚡ Caching: la herramienta más poderosa</h1>
<h3>Estrategias de caché</h3>
<table class="comp-table"><tr><th>Patrón</th><th>Ventaja</th><th>Desventaja</th><th>Usar cuando</th></tr>
<tr><td>Cache-Aside (lazy)</td><td>Solo datos accedidos, simple</td><td>Miss inicial (3 trips)</td><td>Caché general, equilibrio</td></tr>
<tr><td>Read-Through</td><td>API simple para el cliente</td><td>Caché debe saber cargar</td><td>Bibliotecas de caché (Caffeine)</td></tr>
<tr><td>Write-Through</td><td>Consistencia fuerte</td><td>Latencia en escritura</td><td>Datos críticos, escritura frecuente</td></tr>
<tr><td>Write-Behind</td><td>Baja latencia escritura</td><td>Riesgo de pérdida</td><td>Logs, métricas, datos eventuales</td></tr>
<tr><td>Cache-Aside + TTL</td><td>Auto-invalidación</td><td>Datos obsoletos hasta TTL</td><td>La más común en APIs REST</td></tr>
</table>
<h3>📐 Problemas clásicos</h3>
<ul><li><strong>Cache stampede</strong>: N requests simultáneos ante un miss. Solución: mutex (locks) o <em>probabilistic early recomputation</em>.</li>
<li><strong>Thundering herd</strong>: similar, pero el origen es un evento que invalida muchas claves a la vez.</li>
<li><strong>Cache penetration</strong>: peticiones por datos que no existen (ej: userId inválido). Solución: cachear <em>null</em> con TTL corto o <em>Bloom filter</em>.</li></ul>
<h3>💡 Local vs Distributed cache</h3>
<table class="comp-table"><tr><th></th><th>Local (Caffeine)</th><th>Distributed (Redis)</th></tr>
<tr><td>Latencia</td><td>Microsegundos (misma JVM)</td><td>Milisegundos (red)</td></tr>
<tr><td>Consistencia</td><td>Perfecta en un nodo</td><td>Eventual (replicación)</td></tr>
<tr><td>Capacidad</td><td>Heap de la JVM</td><td>TB (sharded)</td></tr>
<tr><td>Topología</td><td>Un solo proceso</td><td>Cluster</td></tr>
</table>`,
exercise:{prompt:'¿Qué problema resuelve el Bloom Filter en caching?',
code:'',answer:'Cache penetration — evita consultar datos que no existen sin saturar la BD'}},

    {id:'8-02',title:'Bases de datos — SQL vs NoSQL, sharding, replicación',
content:`<h1>🗄️ Bases de datos en sistemas distribuidos</h1>
<h3>SQL vs NoSQL</h3>
<table class="comp-table"><tr><th></th><th>SQL (PostgreSQL)</th><th>NoSQL (MongoDB)</th></tr>
<tr><th>Modelo</th><td>Relacional, esquema fijo</td><td>Documentos/grafos/clave-valor</td></tr>
<tr><th>ACID</th><td>Sí</td><td>BASE (eventual consistency)</td></tr>
<tr><th>Escalabilidad</th><td>Vertical (más CPU/ram)</td><td>Horizontal (sharding nativo)</td></tr>
<tr><th>Joins</th><td>Nativos, optimizados</td><td>En aplicación (lentos)</td></tr>
<tr><th>Consultas complejas</th><td>SQL completo</td><td>Aggregation pipeline limitado</td></tr>
</table>
<h3>📐 Teorema CAP — solo 2 de 3</h3>
<p><strong>Consistency</strong> (todos ven lo mismo), <strong>Availability</strong> (siempre responde), <strong>Partition tolerance</strong>(tolera fallos de red). Particiones ocurren siempre → eliges CP o AP.</p>
<ul><li><strong>CP</strong> (sacrifica disponibilidad): sistemas bancarios, transaccionales — prefieren parar a dar datos inconsistentes</li>
<li><strong>AP</strong> (sacrifica consistencia): redes sociales, CDN — prefieren servir (quizás dato viejo) a no servir</li></ul>
<h3>🎯 Sharding (particionamiento horizontal)</h3>
<p>Dividir datos entre servidores por clave (hash de userId, rango de fechas). Problema: <strong>resharding</strong> cuando añades nodos. Solución: <em>consistent hashing</em> (solo mueve 1/N de los datos en vez de todos).</p>`,
exercise:{prompt:'Un sistema bancario prefiere CP o AP? ¿Por qué?',
code:'',answer:'CP — prefieren negar transacciones a tener datos inconsistentes ($$$)'}},

    {id:'8-03',title:'Microservicios, colas y event-driven',
content:`<h1>🔗 Microservicios y comunicación asíncrona</h1>
<h3>Comunicación síncrona (REST/gRPC) vs asíncrona (cola)</h3>
<table class="comp-table"><tr><th></th><th>Síncrona (HTTP)</th><th>Asíncrona (Kafka/RabbitMQ)</th></tr>
<tr><td>Acoplamiento</td><td>Alto — emisor espera respuesta</td><td>Bajo — emisor publica evento</td></tr>
<tr><td>Disponibilidad</td><td>Si receptor cae, emisor falla</td><td>Cola bufferiza, receptor procesa cuando vuelve</td></tr>
<tr><td>Latencia</td><td>Baja (si todo va bien)</td><td>Mayor (persistencia + procesamiento)</td></tr>
<tr><td>Trazabilidad</td><td>Request-response simple</td><td>Requiere tracing distribuido</td></tr>
<tr><td>Consistencia</td><td>Más fácil de lograr</td><td>Eventual (Saga pattern)</td></tr>
</table>
<h3>📐 Saga Pattern — transacciones distribuidas</h3>
<p>En vez de transacciones distribuidas (XA — caras y no escalan), cada servicio ejecuta su transacción local y publica un evento. Si algo falla, eventos compensatorios (<em>rollback</em>). Coreografía (cada servicio reacciona a eventos) vs Orquestación (un servicio coordina).</p>
<h3>💡 Idempotencia — clave en sistemas distribuidos</h3>
<p>La misma petición procesada múltiples veces debe tener el mismo efecto. Soluciones: <em>idempotency key</em> en el header, <em>deduplication</em> en la BD, <em>optimistic locking</em> con version.</p>`,
exercise:{prompt:'¿Cómo manejas una transacción distribuida sin XA?',
code:'',answer:'Saga Pattern — transacciones locales + eventos compensatorios'}}
  ]
});
})();
