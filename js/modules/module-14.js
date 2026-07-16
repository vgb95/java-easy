(() => {
MODULES.push({
  id: 14, icon: '🌐', title: 'Computer Networks',
  desc: 'TCP/IP, TCP en profundidad, HTTP/1.1-2-3, TLS, DNS, CDN, Load Balancing, WebSocket, REST vs gRPC, Seguridad',
  lessons: [
    {id:'14-01',title:'TCP/IP Stack — capas y encapsulación',
    content:`<h1>🌐 TCP/IP Stack — de la app al cable</h1>
<h3>Las 4 capas del modelo TCP/IP</h3>
<table class="comp-table"><tr><th>Capa</th><th>PDU</th><th>Protocolos</th><th>Función</th></tr>
<tr><td>4. Aplicación</td><td>Message</td><td>HTTP, DNS, TLS, SMTP, WebSocket</td><td>Datos de la aplicación</td></tr>
<tr><td>3. Transporte</td><td>Segment (TCP) / Datagram (UDP)</td><td>TCP, UDP, QUIC</td><td>Conexión extremo a extremo, confiabilidad</td></tr>
<tr><td>2. Internet</td><td>Packet</td><td>IP (v4/v6), ICMP, ARP</td><td>Enrutamiento entre redes</td></tr>
<tr><td>1. Acceso a Red</td><td>Frame</td><td>Ethernet, Wi-Fi, PPP</td><td>Enlace físico, MAC, detección errores</td></tr>
</table>
<h3>Encapsulación — envolviendo datos</h3>
<p>App (HTTP request) → TCP header (src/dst port, seq#, checksum) → IP header (src/dst IP, TTL, protocol) → Ethernet header (src/dst MAC, EtherType) → cable. Cada capa agrega su header, la siguiente lo trata como payload.</p>
<h3>MTU y Fragmentación</h3>
<p>MTU Ethernet = 1500 bytes. TCP MSS = MTU - IP(20) - TCP(20) = 1460 bytes. Si IP packet > MTU, se fragmenta en capa IP (evitar: path MTU discovery). IPv6 no fragmenta en routers, solo en origen.</p>
<h3>NAT (Network Address Translation)</h3>
<p>Traduce IP privada (10.x, 192.168.x) a IP pública. Conexiones salientes OK, entrantes requieren port forwarding o UPnP. <strong>Problemas:</strong> rompe extremo a extremo, dificulta P2P. IPv6 elimina necesidad de NAT.</p>`,
    exercise:{prompt:'¿Cuántos bytes de overhead hay por paquete TCP sobre Ethernet (sin opciones)?',
    code:'',answer:'Ethernet header 14 + IP header 20 + TCP header 20 = 54 bytes. Con Ethernet FCS 4 = 58 bytes. El payload máximo TCP es 1460 bytes (MTU 1500 - 20 IP - 20 TCP).'}},

    {id:'14-02',title:'TCP en Profundidad — handshake, flow control, congestion',
    content:`<h1>🔗 TCP — el protocolo confiable de Internet</h1>
<h3>3-Way Handshake — estableciendo conexión</h3>
<div class="code-block"><pre><span class="cm">// SYN → SYN-ACK → ACK</span>
<span class="cm">// Cliente envía SYN (seq=x)</span>
<span class="cm">// Servidor responde SYN-ACK (seq=y, ack=x+1)</span>
<span class="cm">// Cliente envía ACK (seq=x+1, ack=y+1)</span>
<span class="cm">// Tiempo: 1 RTT (Round Trip Time)</span>
<span class="cm">// SYN cookie: protección contra SYN flood (no guarda estado hasta ACK final)</span></pre></div>
<h3>Flow Control — ventana deslizante</h3>
<p>El receptor anuncia su <strong>Receive Window (rwnd)</strong> en cada segmento TCP. El emisor no envía más de rwnd bytes sin recibir ACK. Si rwnd = 0, el emisor envía <strong>window probes</strong> (1 byte) periódicamente.</p>
<h3>Congestion Control — 4 algoritmos clave</h3>
<table class="comp-table"><tr><th>Fase</th><th>Algoritmo</th><th>Comportamiento</th></tr>
<tr><td>Slow Start</td><td>cwnd = 1 MSS, dobla por RTT</td><td>Exponencial hasta ssthresh (típico ~64KB)</td></tr>
<tr><td>Congestion Avoidance</td><td>cwnd += 1/cwnd por ACK</td><td>Lineal (AIMD)</td></tr>
<tr><td>Fast Retransmit</td><td>3 ACK duplicados → retransmitir</td><td>No esperar timeout</td></tr>
<tr><td>Fast Recovery</td><td>cwnd = ssthresh, avoid slow start</td><td>TCP Reno, NewReno, CUBIC</td></tr>
</table>
<h3>TCP CUBIC (Linux default)</h3>
<p>cwnd = C(t - K)³ + Wmax. Curva cúbica: crecimiento agresivo después de pérdida (explora ancho de banda). Mejor que Reno (lineal) en redes de alta latencia. Hystart: detecta bottleneck bandwidth para salir de slow start.</p>
<h3>TCP vs QUIC</h3>
<p>QUIC (HTTP/3): corre sobre UDP, conexión 0-RTT (vs 1-RTT TCP + 1-2 RTT TLS), multiplexación sin head-of-line blocking, migración de conexión (cambio de IP no reinicia conexión).</p>`,
    exercise:{prompt:'¿Qué diferencia hay entre flow control y congestion control en TCP?',
    code:'',answer:'Flow control evita que el receptor se desborde (rwnd). Congestion control evita saturar la red (cwnd). El emisor envía min(cwnd, rwnd). Flow control es local, congestion control es global.'}},

    {id:'14-03',title:'HTTP/1.1 vs HTTP/2 vs HTTP/3',
    content:`<h1>📡 HTTP — evolución del protocolo web</h1>
<h3>HTTP/1.1 (1997) — el problema de head-of-line blocking</h3>
<p>Un request por conexión TCP. <strong>Persistent connections</strong> (keep-alive) reusan conexión. Pero: si request 1 tarda, request 2 espera (HOL blocking). Solución parcial: <strong>pipelining</strong> (varios requests sin esperar responses) pero servidores no lo implementan bien. Navegadores abren 6 conexiones paralelas por dominio.</p>
<h3>HTTP/2 (2015) — multiplexación</h3>
<table class="comp-table"><tr><th>Característica</th><th>HTTP/1.1</th><th>HTTP/2</th></tr>
<tr><td>Multiplexación</td><td>No (1 request por conexión)</td><td>Sí (streams concurrentes)</td></tr>
<tr><td>Headers</td><td>Texto plano, sin compresión</td><td>HPACK compresión (tabla estática + dinámica)</td></tr>
<tr><td>Server Push</td><td>No</td><td>Sí (envía recursos antes de request)</td></tr>
<tr><td>Priorización</td><td>No</td><td>Sí (árbol de dependencias)</td></tr>
<tr><td>Binary framing</td><td>No (ASCII)</td><td>Sí (frames binarios)</td></tr>
</table>
<p><strong>Problema:</strong> TCP HOL blocking — si un paquete TCP se pierde, todos los streams esperan (aunque sean independientes).</p>
<h3>HTTP/3 (QUIC) — sin HOL blocking</h3>
<p>QUIC sobre UDP. <strong>Conexión 0-RTT</strong> (si ya se conectó antes). Cada stream es independiente — pérdida de paquete afecta solo ese stream. Cifrado integrado (no se puede separar TLS). Migración de conexión: cambiar de WiFi a móvil sin reconectar.</p>
<h3>Comparativa de performance</h3>
<table class="comp-table"><tr><th>Métrica</th><th>HTTP/1.1</th><th>HTTP/2</th><th>HTTP/3</th></tr>
<tr><td>Time to First Byte</td><td>2-3 RTT</td><td>1 RTT</td><td>0-1 RTT</td></tr>
<tr><td>Requests en paralelo</td><td>6 por dominio</td><td>Ilimitados</td><td>Ilimitados</td></tr>
<tr><td>HOL blocking</td><td>Conexión</td><td>TCP</td><td>No</td></tr>
<tr><td>Adopción (2025)</td><td>Legacy</td><td>~80% sitios</td><td>~35% sitios</td></tr>
</table>`,
    exercise:{prompt:'¿Por qué HTTP/2 sigue teniendo HOL blocking aunque multiplexa requests?',
    code:'',answer:'Porque corre sobre TCP. Si un paquete se pierde, el stream de reassembly bloquea todos los streams que esperan ese paquete. HTTP/3 sobre QUIC resuelve esto con streams independientes en UDP.'}},

    {id:'14-04',title:'TLS/SSL — handshake, certificados, forward secrecy',
    content:`<h1>🔐 TLS — seguridad en la capa de transporte</h1>
<h3>Protocol Stack</h3>
<p>TLS corre entre Transporte y Aplicación. <strong>Subprotocolos:</strong> Handshake (autenticación + key exchange), Record (cifrado simétrico + MAC), Alert (errores, cierre).</p>
<h3>TLS 1.3 Handshake (1-RTT, 0-RTT optimista)</h3>
<div class="code-block"><pre><span class="cm">// TLS 1.3 Handshake (1 RTT)</span>
<span class="cm">// Cliente → Servidor: ClientHello (key_share, ciphersuites, version)</span>
<span class="cm">// Servidor → Cliente: ServerHello + EncryptedExtensions + Certificate + Finished</span>
<span class="cm">// Cliente → Servidor: Finished (datos de app ya pueden fluir)</span>
<span class="cm">// </span>
<span class="cm">// 0-RTT: Cliente envía datos en el primer vuelo (con PSK de sesión previa)</span>
<span class="cm">// Riesgo: replay attack si no se usa nonce + ticket</span></pre></div>
<h3>Ciphersuites — algoritmos negociados</h3>
<table class="comp-table"><tr><th>Componente</th><th>Ejemplo (TLS_AES_128_GCM_SHA256)</th><th>Opción alternativa</th></tr>
<tr><td>Key Exchange</td><td>ECDHE (Curve25519 o P-256)</td><td>DHE (RSA en TLS <1.3, obsoleto)</td></tr>
<tr><td>Cifrado simétrico</td><td>AES-128-GCM</td><td>ChaCha20-Poly1305 (móvil sin AES hw)</td></tr>
<tr><td>HMAC/Hash</td><td>SHA-256</td><td>SHA-384</td></tr>
</table>
<h3>Forward Secrecy</h3>
<p>Clave de sesión derivada de ephemeral Diffie-Hellman (ECDHE). Incluso si la clave privada del servidor se filtra, las sesiones pasadas no se pueden descifrar. <strong>TLS 1.3 exige ECDHE/DHE</strong> — no soporta key exchange estático.</p>
<h3>Certificate Chain — cadena de confianza</h3>
<p>Servidor envía certificado firmado por CA intermedia → CA raíz (en trust store del cliente). <strong>Let\'s Encrypt</strong> gratis con validación ACME (HTTP-01, DNS-01, TLS-ALPN-01). OCSP stapling: servidor presenta prueba de no revocación durante handshake.</p>`,
    exercise:{prompt:'¿Qué es forward secrecy y cómo se logra?',
    code:'',answer:'Forward secrecy: filtrar clave privada no compromete sesiones pasadas. Se logra con Diffie-Hellman efímero (ECDHE): cada sesión genera claves temporales que se descartan al terminar.'}},

    {id:'14-05',title:'DNS — resolución, caching, anycast',
    content:`<h1>📖 DNS — el directorio telefónico de Internet</h1>
<h3>Jerarquía DNS</h3>
<p><strong>Root servers</strong> (13 letras, cientos de instancias anycast) → <strong>TLD servers</strong> (.com, .org, .es) → <strong>Authoritative servers</strong> (dominio específico). Resolución recursiva: tu ISP o 8.8.8.8 recorre la jerarquía.</p>
<h3>Tipos de records</h3>
<table class="comp-table"><tr><th>Record</th><th>Qué contiene</th><th>Ejemplo</th></tr>
<tr><td>A</td><td>IPv4 del dominio</td><td>example.com → 93.184.216.34</td></tr>
<tr><td>AAAA</td><td>IPv6 del dominio</td><td>example.com → 2606:2800:220::1</td></tr>
<tr><td>CNAME</td><td>Alias a otro dominio</td><td>www.example.com → example.com</td></tr>
<tr><td>MX</td><td>Mail server + prioridad</td><td>@ → mail.example.com (10)</td></tr>
<tr><td>NS</td><td>Name servers del dominio</td><td>example.com → ns1.example.com</td></tr>
<tr><td>TXT</td><td>Texto arbitrario (SPF, DKIM, verificación)</td><td>v=spf1 include:_spf.google.com</td></tr>
<tr><td>SRV</td><td>Servicio específico + puerto</td><td>_xmpp._tcp → 0 5 5269 server</td></tr>
</table>
<h3>Caching DNS</h3>
<p>Cada record tiene <strong>TTL</strong> (segundos). Navegador → OS (systemd-resolved, dnscache) → router → ISP recursivo. TTL típico: 300s-86400s. <strong>DNS cache poisoning:</strong> ataque que inyecta records falsos. DNSSEC firma records con clave pública para autenticidad.</p>
<h3>DoH (DNS over HTTPS) y DoT (DNS over TLS)</h3>
<p>Cifran queries DNS para evitar snooping y spoofing. DoH en puerto 443 (indistinguible de HTTPS), DoT en 853. Usados por Firefox (Cloudflare), Chrome, 1.1.1.1, 8.8.8.8.</p>
<h3>Anycast</h3>
<p>Misma IP anunciada desde múltiples ubicaciones. BGP dirige al servidor más cercano. Usado por: root DNS, Cloudflare (1.1.1.1), Google (8.8.8.8). Ventajas: balanceo de carga, DDoS mitigation (tráfico distribuido).</p>`,
    exercise:{prompt:'¿Cuál es la diferencia entre resolución recursiva y autoritativa en DNS?',
    code:'',answer:'Recursiva: el servidor consulta toda la jerarquía en nombre del cliente (ej: ISP, Google DNS). Autoritativa: el servidor que tiene la respuesta definitiva para un dominio (ej: ns1.example.com).'}},

    {id:'14-06',title:'CDN — Content Delivery Networks',
    content:`<h1>📦 CDN — llevando contenido al borde</h1>
<h3>¿Por qué CDN?</h3>
<p>Latencia = distancia / velocidad de la luz (en fibra: ~200 km/ms). Un usuario en Chile a servidor en New York (~8000 km) → ~80ms RTT mínimo. CDN pone servidores en 100+ ubicaciones (edge) → 5-20ms.</p>
<h3>CDN Strategies</h3>
<table class="comp-table"><tr><th>Estrategia</th><th>Qué cachea</th><th>TTL</th><th>Invalidación</th></tr>
<tr><td>Static caching</td><td>JS, CSS, imágenes, video</td><td>Largo (1 año con hash)</td><td>Cache-busting (nuevo filename)</td></tr>
<tr><td>Dynamic caching</td><td>HTML personalizado</td><td>Corto (60s)</td><td>Purge por URL</td></tr>
<tr><td>Edge computing</td><td>Lógica de app en edge</td><td>N/A</td><td>Deploy global (Workers)</td></tr>
<tr><td>Origin Shield</td><td>Capa extra entre edge y origin</td><td>Medio</td><td>Reduce carga en origin</td></tr>
</table>
<h3>Cache hit ratio — métrica clave</h3>
<p>Hit ratio = requests servidos desde edge / total. Objetivo: >90%. Factores: TTL adecuado, popularidad del contenido, cache keys (incluir language, device type). <strong>Stale-while-revalidate:</strong> sirve contenido caducado mientras refresca en background.</p>
<h3>Content routing — cómo llega al edge correcto</h3>
<ol>
<li>DNS-based: servidor DNS devuelve IP del edge más cercano (GSLB)</li>
<li>Anycast: misma IP global, BGP dirige al edge más cercano</li>
<li>HTTP redirect: origen redirige al edge (poco usado)</li>
</ol>
<h3>CDN Providers</h3>
<p><strong>CloudFront (AWS):</strong> integración con S3, Lambda@Edge. <strong>Cloudflare:</strong> red masiva, anti-DDoS, Workers. <strong>Fastly:</strong> edge programable (VCL), purge instantáneo. <strong>Akamai:</strong> más grande legacy, apps enterprise.</p>`,
    exercise:{prompt:'¿Qué es origin shield y cuándo usarlo?',
    code:'',answer:'Capa de cache adicional entre edge servers y el origin. Evita que miles de edge servers golpeen el origin simultáneamente cuando expira el TTL. Útil para contenido popular con picos de tráfico.'}},

    {id:'14-07',title:'Load Balancing — algoritmos y arquitecturas',
    content:`<h1>⚖️ Load Balancing — distribuyendo la carga</h1>
<h3>Niveles de Load Balancer</h3>
<table class="comp-table"><tr><th></th><th>L4 (Transporte)</th><th>L7 (Aplicación)</th></tr>
<tr><td>Decisión basada en</td><td>IP + Puerto</td><td>URL, Cookie, Header, Body</td></tr>
<tr><td>Contenido</td><td>No ve payload</td><td>Puede inspeccionar/ruteá según contenido</td></tr>
<tr><td>Rendimiento</td><td>Más rápido (~10M pps)</td><td>Más lento (~1M pps)</td></tr>
<tr><td>Ejemplos</td><td>HAProxy (TCP mode), AWS NLB</td><td>NGINX, HAProxy (HTTP), AWS ALB</td></tr>
<tr><td>TLS termination</td><td>Pasa TCP</td><td>Puede terminar TLS</td></tr>
</table>
<h3>Algoritmos de balanceo</h3>
<table class="comp-table"><tr><th>Algoritmo</th><th>Distribución</th><th>Sticky?</th><th>Caso de uso</th></tr>
<tr><td>Round Robin</td><td>Equitativa secuencial</td><td>No</td><td>Backends homogéneos, stateless</td></tr>
<tr><td>Weighted RR</td><td>Proporcional al peso</td><td>No</td><td>Backends de diferente capacidad</td></tr>
<tr><td>Least Connections</td><td>Al servidor con menos conexiones activas</td><td>No</td><td>Conexiones largas (WebSocket)</td></tr>
<tr><td>IP Hash</td><td>Hash(IP) → servidor</td><td>Sí</td><td>Session persistence</td></tr>
<tr><td>Consistent Hashing</td><td>Hash ring, mínimo rebalanceo</td><td>Sí</td><td>Cache clusters, DB sharding</td></tr>
</table>
<h3>Health Checks</h3>
<p>Active: LB envía requests periódicos (HTTP /health, TCP connect). Passive: LB detecta errores (5xx, timeout) y marca servidor como down. <strong>Circuit Breaker:</strong> si N errores consecutivos, deja de enviar tráfico por un período.</p>
<h3>Sticky Sessions</h3>
<p>Problema: el usuario vuelve a diferente servidor y pierde sesión. Soluciones: <strong>sticky cookie</strong> (LB setea cookie con servidor), <strong>session store externo</strong> (Redis — recomendado), <strong>IP hash</strong> (no funciona si cambia IP).</p>`,
    exercise:{prompt:'¿Cuándo usar L4 vs L7 load balancer?',
    code:'',answer:'L4 para tráfico de alta velocidad (TCP/UDP), TLS pass-through, protocolos no HTTP. L7 para routing inteligente por URL/cookie, TLS termination, caching, WAF. L7 es más flexible pero más lento.'}},

    {id:'14-08',title:'WebSockets y SSE — tiempo real',
    content:`<h1>🔌 WebSockets y SSE — comunicación en tiempo real</h1>
<h3>WebSocket — handshake y frames</h3>
<div class="code-block"><pre><span class="cm">// Handshake: HTTP Upgrade</span>
<span class="cm">// GET /chat HTTP/1.1</span>
<span class="cm">// Upgrade: websocket</span>
<span class="cm">// Connection: Upgrade</span>
<span class="cm">// Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==</span>
<span class="cm">// </span>
<span class="cm">// Server response:</span>
<span class="cm">// HTTP/1.1 101 Switching Protocols</span>
<span class="cm">// Upgrade: websocket</span>
<span class="cm">// Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=</span>
<span class="cm">// </span>
<span class="cm">// Frame: FIN + opcode + mask + payload</span>
<span class="cm">// Opcodes: 0x1 (text), 0x2 (binary), 0x8 (close), 0x9 (ping), 0xA (pong)</span></pre></div>
<h3>WebSocket vs SSE vs Long Polling</h3>
<table class="comp-table"><tr><th></th><th>WebSocket</th><th>Server-Sent Events (SSE)</th><th>Long Polling</th></tr>
<tr><th>Dirección</th><td>Full duplex</td><td>Server → Client</td><td>Simulado bidireccional</td></tr>
<tr><th>Protocolo</th><td>ws:// / wss://</td><td>HTTP (text/event-stream)</td><td>HTTP</td></tr>
<tr><th>Reconexión</th><td>Manual</td><td>Automática (Last-Event-ID)</td><td>N/A</td></tr>
<tr><th>Binary</th><td>Sí (ArrayBuffer)</td><td>No (solo texto)</td><td>N/A</td></tr>
<tr><th>Firewall friendly</th><td>No (diferente puerto/protocolo)</td><td>Sí (mismo que HTTP)</td><td>Sí</td></tr>
<tr><th>Mejor para</th><td>Chat, gaming, trading</td><td>Notificaciones, feeds, logs</td><td>Legacy, fallback</td></tr>
</table>
<h3>Escalando WebSockets</h3>
<p>Cada WebSocket consume memoria (~20-50KB por conexión). Para 1M conexiones necesitas ~50GB RAM. Solución: mantén conexiones en servidores dedicados, usa Redis Pub/Sub para broadcast entre servidores. Proxy inverso (NGINX) soporta WebSocket load balancing.</p>`,
    exercise:{prompt:'¿Qué ventaja tiene SSE sobre WebSocket para notificaciones unidireccionales?',
    code:'',answer:'SSE es más simple (HTTP nativo), reconexión automática con Last-Event-ID, no requiere protocolo especial, funciona con firewalls/load balancers. WebSocket es overkill para solo server→client.'}},

    {id:'14-09',title:'REST vs gRPC — APIs modernas',
    content:`<h1>📮 REST vs gRPC — comparativa de APIs</h1>
<h3>REST — representational state transfer</h3>
<p>HTTP semántico: GET (leer), POST (crear), PUT (reemplazar), PATCH (modificar parcial), DELETE (borrar). Stateless, cacheable, discoverable (HATEOAS ideal). JSON/XML. Códigos de estado HTTP (200, 201, 400, 404, 500).</p>
<h3>gRPC — Remote Procedure Call moderno</h3>
<p>Protocol Buffers (IDL + serialización binaria). Corre sobre HTTP/2 (multiplexación, streaming). Genera código cliente/servidor automáticamente. 4 tipos: Unary, Server Streaming, Client Streaming, Bidirectional Streaming.</p>
<div class="code-block"><pre><span class="cm">// Protobuf IDL — contrato primero</span>
service UserService {
    rpc GetUser (GetUserRequest) returns (User);
    rpc ListUsers (Empty) returns (stream User);
    rpc UpdateUser (stream UpdateRequest) returns (User);
}

message User {
    string id = <span class="num">1</span>;
    string name = <span class="num">2</span>;
    string email = <span class="num">3</span>;
}</pre></div>
<h3>Comparativa detallada</h3>
<table class="comp-table"><tr><th></th><th>REST</th><th>gRPC</th></tr>
<tr><td>Serialización</td><td>JSON (legible, ~1.5x más grande)</td><td>Protobuf (binario, rápido, ~10x más rápido)</td></tr>
<tr><td>Schema</td><td>Implícito (OpenAPI opcional)</td><td>Explícito (.proto, genera código)</td></tr>
<tr><td>Streaming</td><td>No nativo (SSE, chunked)</td><td>Nativo (bidireccional)</td></tr>
<tr><td>Browser support</td><td>Nativo (fetch/XMLHttpRequest)</td><td>Requiere gRPC-web + proxy</td></tr>
<tr><td>Debugging</td><td>curl, navegador</td><td>Herramientas especiales (grpcurl)</td></tr>
<tr><td>Performance</td><td>Bueno (HTTP/2)</td><td>Excelente (Protobuf + HTTP/2)</td></tr>
<tr><td>Evolución</td><td>Versioning (v1, v2)</td><td>Field numbers (backward compat)</td></tr>
<tr><td>Ecosistema</td><td>Maduro (todos los lenguajes)</td><td>Creciente (Google, Netflix)</td></tr>
</table>
<h3>¿Qué elegir?</h3>
<p><strong>REST:</strong> APIs públicas, browser clients, equipo pequeño, debugging fácil. <strong>gRPC:</strong> microservicios internos, streaming de datos, alta performance, polyglot (múltiples lenguajes).</p>`,
    exercise:{prompt:'¿Por qué gRPC es más rápido que REST con JSON?',
    code:'',answer:'Protobuf serializa en binario (sin parsing JSON, sin reflection), payload más pequeño (~30% de JSON), y corre sobre HTTP/2 (multiplexación, header compression). Además genera código sin overhead de runtime reflection.'}},

    {id:'14-10',title:'Seguridad de Redes — DDoS, WAF, Zero Trust',
    content:`<h1>🛡️ Seguridad en Redes — protegiendo la infraestructura</h1>
<h3>DDoS — Distributed Denial of Service</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Capa</th><th>Ejemplo</th><th>Mitigación</th></tr>
<tr><td>Volumétrico</td><td>L3/L4</td><td>UDP flood, ICMP flood, DNS amplification</td><td>Scrubbing centers, blackhole routing</td></tr>
<tr><td>Protocolo</td><td>L4</td><td>SYN flood, Ping of Death</td><td>SYN cookies, rate limiting</td></tr>
<tr><td>Aplicación</td><td>L7</td><td>HTTP flood, Slowloris, Recursive GET</td><td>WAF, CAPTCHA, rate limiting por IP/UA</td></tr>
<tr><td>Amplificación</td><td>L3</td><td>NTP (x556), DNS (x50), Memcached (x50000)</td><td>Bloquear puertos no esenciales</td></tr>
</table>
<h3>WAF (Web Application Firewall)</h3>
<p>Filtra tráfico HTTP malicioso. Reglas OWASP Core Rule Set: SQL injection, XSS, path traversal, CSRF, file inclusion. <strong>ModSecurity:</strong> WAF open source. Manejo de false positives: modo log inicial, luego blocking.</p>
<h3>Zero Trust — "never trust, always verify"</h3>
<p>No hay perímetro de red seguro. Cada request se autentica, autoriza y cifra. <strong>Principios:</strong> mínimo privilegio, microsegmentación, inspección de todo el tráfico, acceso explícito. Google BeyondCorp es el ejemplo canónico.</p>
<h3>Mitigación de ataques comunes</h3>
<table class="comp-table"><tr><th>Ataque</th><th>Descripción</th><th>Prevención</th></tr>
<tr><td>SYN Flood</td><td>Miles de SYN sin ACK final</td><td>SYN cookies (Linux tcp_syncookies)</td></tr>
<tr><td>Slowloris</td><td>Headers lentos, mantiene conexiones abiertas</td><td>Timeout de headers, límite de conexiones por IP</td></tr>
<tr><td>DNS Spoofing</td><td>Respuesta falsa de DNS</td><td>DNSSEC, DoH/DoT</td></tr>
<tr><td>Man-in-the-Middle</td><td>Interceptar tráfico</td><td>TLS con certificados válidos, HSTS, HPKP</td></tr>
<tr><td>IP Spoofing</td><td>Falsificar IP origen</td><td>uRPF (unicast Reverse Path Forwarding)</td></tr>
</table>`,
    exercise:{prompt:'¿Qué diferencia hay entre DDoS volumétrico y de aplicación?',
    code:'',answer:'Volumétrico: satura ancho de banda (Gbps). Mitigación: filtrado en ISP/cloud. Aplicación: satura recursos del servidor (CPU, conexiones). Mitigación: WAF, rate limiting, auto-scaling.'}}
  ]
});
})();
