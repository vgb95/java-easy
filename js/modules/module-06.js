(() => {
MODULES.push({
  id: 6, icon: '🚀', title: 'Proyecto Integrador: CineBox',
  desc: 'Sistema de gestión de películas con Clean Architecture, REST API, persistencia, caché y despliegue',
  lessons: [
    {id:'6-01',title:'Modelo de dominio y value objects',
content:`<h1>🚀 CineBox — Modelo de dominio puro</h1>
<p>Construimos <strong>CineBox</strong>, un sistema tipo IMDb pero más simple: películas, actores, reseñas. Con Clean Architecture y TDD.</p>
<div class="code-block"><pre><span class="kw">record</span> <span class="typ">PeliculaId</span>(<span class="kw">int</span> valor) { }  <span class="cm">// value object</span>
<span class="kw">record</span> <span class="typ">Rating</span>(<span class="kw">double</span> valor) {
    <span class="kw">public</span> <span class="typ">Rating</span> {
        <span class="kw">if</span> (valor < <span class="num">0</span> || valor > <span class="num">10</span>)
            <span class="kw">throw new</span> <span class="typ">IllegalArgumentException</span>(<span class="str">"Rating 0-10"</span>);
    }
}

<span class="kw">public record</span> <span class="typ">Pelicula</span>(<span class="typ">PeliculaId</span> id, <span class="typ">String</span> titulo, <span class="kw">int</span> anio,
                       <span class="typ">String</span> genero, <span class="typ">Rating</span> rating) { }

<span class="kw">public record</span> <span class="typ">Actor</span>(<span class="kw">int</span> id, <span class="typ">String</span> nombre) { }

<span class="kw">public record</span> <span class="typ">Reseña</span>(<span class="typ">String</span> usuario, <span class="typ">PeliculaId</span> peliculaId,
                       <span class="kw">int</span> puntuacion, <span class="typ">String</span> comentario) { }</pre></div>
<h3>🏗️ Puertos (interfaces en dominio)</h3>
<div class="code-block"><pre><span class="kw">public interface</span> <span class="typ">RepositorioPelicula</span> {
    <span class="typ">Optional</span>&lt;<span class="typ">Pelicula</span>&gt; porId(<span class="typ">PeliculaId</span> id);
    <span class="typ">List</span>&lt;<span class="typ">Pelicula</span>&gt; todas();
    <span class="typ">List</span>&lt;<span class="typ">Pelicula</span>&gt; porGenero(<span class="typ">String</span> genero);
    <span class="typ">Pelicula</span> guardar(<span class="typ">Pelicula</span> p);
    <span class="kw">void</span> eliminar(<span class="typ">PeliculaId</span> id);
}</pre></div>`,
exercise:{prompt:'¿Qué ventaja tiene PeliculaId como value object vs un int?',
code:'',answer:'Type safety, validación centralizada, semántica explícita, fácil modificar futuro'}},

    {id:'6-02',title:'Casos de uso y lógica de negocio',
content:`<h1>⚙️ Casos de uso de CineBox</h1>
<div class="code-block"><pre><span class="kw">public class</span> <span class="typ">BuscarPeliculas</span> {
    <span class="kw">private final</span> <span class="typ">RepositorioPelicula</span> repo;
    <span class="kw">private final</span> <span class="typ">CachePeliculas</span> cache;  <span class="cm">// otro puerto</span>
    
    <span class="kw">public</span> <span class="typ">BuscarPeliculas</span>(<span class="typ">RepositorioPelicula</span> repo, <span class="typ">CachePeliculas</span> cache) {
        <span class="kw">this</span>.repo = repo; <span class="kw">this</span>.cache = cache;
    }
    
    <span class="kw">public</span> <span class="typ">List</span>&lt;<span class="typ">Pelicula</span>&gt; porGenero(<span class="typ">String</span> genero) {
        <span class="cm">// Cache-aside pattern</span>
        <span class="kw">var</span> cached = cache.obtener(<span class="str">"genero:"</span> + genero);
        <span class="kw">if</span> (cached != <span class="kw">null</span>) <span class="kw">return</span> cached;
        
        <span class="kw">var</span> resultados = repo.porGenero(genero);
        cache.guardar(<span class="str">"genero:"</span> + genero, resultados);
        <span class="kw">return</span> resultados;
    }
    
    <span class="kw">public</span> <span class="typ">Optional</span>&lt;<span class="typ">Pelicula</span>&gt; mejorCalificada() {
        <span class="kw">return</span> repo.todas().stream()
            .max(<span class="typ">Comparator</span>.comparing(<span class="typ">Pelicula</span>::rating));
    }
}</pre></div>
<h3>📐 Patrón Cache-Aside</h3>
<ol><li>Buscar en caché → si está (hit), devolver</li>
<li>Si no (miss), buscar en BD → guardar en caché → devolver</li>
<li>Invalidar caché al escribir/actualizar</li></ol>
<p><strong>Problema clásico:</strong> <em>cache stampede</em> — cuando un elemento expira, N requests simultáneos golpean la BD. Solución: <em>mutex</em> o <em>probabilistic early recomputation</em>.</p>`,
exercise:{prompt:'¿Qué patrón de caché usa BuscarPeliculas?',
code:'',answer:'Cache-Aside (lazy loading + TTL)'}},

    {id:'6-03',title:'Adaptadores — JPA, REST API, caché Redis',
content:`<h1>🔌 Adaptadores de infraestructura</h1>
<h3>Repositorio JPA</h3>
<div class="code-block"><pre><span class="at">@Repository</span>
<span class="kw">class</span> <span class="typ">RepositorioPeliculaJPA</span> <span class="kw">implements</span> <span class="typ">RepositorioPelicula</span> {
    <span class="at">@PersistenceContext</span> <span class="kw">private</span> <span class="typ">EntityManager</span> em;
    <span class="at">@Override</span> <span class="kw">public</span> <span class="typ">Optional</span>&lt;<span class="typ">Pelicula</span>&gt; porId(<span class="typ">PeliculaId</span> id) {
        <span class="kw">return</span> <span class="typ">Optional</span>.ofNullable(em.find(<span class="typ">PeliculaEntity</span>.class, id.valor()))
            .map(PeliculaMapper::toDomain);
    }
}</pre></div>
<h3>REST Controller</h3>
<div class="code-block"><pre><span class="at">@RestController</span>
<span class="at">@RequestMapping</span>(<span class="str">"/api/peliculas"</span>)
<span class="kw">class</span> <span class="typ">PeliculaController</span> {
    <span class="kw">private final</span> <span class="typ">BuscarPeliculas</span> buscar;
    <span class="kw">private final</span> <span class="typ">RegistrarPelicula</span> registrar;
    
    <span class="at">@GetMapping</span>(<span class="str">"/genero/{genero}"</span>)
    <span class="typ">ResponseEntity</span>&lt;<span class="typ">List</span>&lt;<span class="typ">PeliculaDTO</span>&gt;&gt; porGenero(<span class="at">@PathVariable</span> <span class="typ">String</span> genero) {
        <span class="kw">var</span> pelis = buscar.porGenero(genero);
        <span class="kw">return</span> <span class="typ">ResponseEntity</span>.ok(pelis.stream().map(PeliculaMapper::toDTO).toList());
    }
}</pre></div>`,
exercise:{prompt:'¿Por qué separar PeliculaEntity (JPA) de Pelicula (domain)?',
code:'',answer:'El dominio no debe depender de JPA. Separación evita acoplamiento a ORM, facilita testing'}},

    {id:'6-04',title:'Manejo de errores, validación y logging',
content:`<h1>🛡️ Errores y logging en producción</h1>
<h3>Manejo de errores — Result tipo</h3>
<div class="code-block"><pre><span class="cm">// Result<T> — Either monad simple</span>
<span class="kw">sealed interface</span> <span class="typ">Resultado</span>&lt;<span class="typ">T</span>&gt; {
    <span class="kw">record</span> <span class="typ">Exito</span>&lt;<span class="typ">T</span>&gt;(<span class="typ">T</span> valor) <span class="kw">implements</span> <span class="typ">Resultado</span>&lt;<span class="typ">T</span>&gt; { }
    <span class="kw">record</span> <span class="typ">Error</span>(<span class="typ">String</span> mensaje, <span class="typ">String</span> codigo) <span class="kw">implements</span> <span class="typ">Resultado</span>&lt;<span class="typ">Object</span>&gt; { }
}

<span class="cm">// Uso en caso de uso</span>
<span class="kw">public</span> <span class="typ">Resultado</span>&lt;<span class="typ">Pelicula</span>&gt; ejecutar(<span class="typ">String</span> titulo, <span class="kw">int</span> anio) {
    <span class="kw">if</span> (titulo.isBlank()) <span class="kw">return new</span> <span class="typ">Resultado</span>.Error(<span class="str">"Título requerido"</span>, <span class="str">"ERR_001"</span>);
    <span class="kw">if</span> (anio < <span class="num">1888</span>) <span class="kw">return new</span> <span class="typ">Resultado</span>.Error(<span class="str">"Año inválido"</span>, <span class="str">"ERR_002"</span>);
    <span class="kw">return new</span> <span class="typ">Resultado</span>.Exito<>(repo.guardar(<span class="kw">new</span> <span class="typ">Pelicula</span>(...)));
}</pre></div>
<h3>📐 Logging estructurado (ELK stack)</h3>
<div class="code-block"><pre><span class="cm">// logback.xml con JSON encoder</span>
&lt;appender name=<span class="str">"JSON"</span> class=<span class="str">"ch.qos.logback.core.ConsoleAppender"</span>&gt;
    &lt;encoder class=<span class="str">"net.logstash.logback.encoder.LogstashEncoder"</span>/&gt;
&lt;/appender&gt;

<span class="cm">// En código — usar MDC para correlación</span>
<span class="at">@Slf4j</span>
<span class="kw">class</span> <span class="typ">Servicio</span> {
    <span class="kw">void</span> procesar(<span class="typ">String</span> requestId) {
        <span class="typ">MDC</span>.put(<span class="str">"requestId"</span>, requestId);
        log.info(<span class="str">"Procesando solicitud"</span>);
        <span class="kw">try</span> { ... } <span class="kw">catch</span> (<span class="typ">Exception</span> e) {
            log.error(<span class="str">"Error procesando"</span>, e);  <span class="cm">// stacktrace</span>
        } <span class="kw">finally</span> { <span class="typ">MDC</span>.clear(); }
    }
}</pre></div>`,
exercise:{prompt:'¿Por qué usar Resultado< T> en vez de lanzar excepciones para validación?',
code:'',answer:'Las excepciones son caras (stack trace), Resultado es un valor, tipado, obliga al llamante a manejar ambos casos'}},

    {id:'6-05',title:'Despliegue y CI/CD — el cuadro completo',
content:`<h1>🚀 Deploy de CineBox</h1>
<h3>Docker multi-stage build</h3>
<div class="code-block"><pre><span class="cm"># Etapa 1: compilar</span>
FROM maven:3-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml . && RUN mvn dependency:go-offline
COPY src src && RUN mvn package -DskipTests

<span class="cm"># Etapa 2: ejecutar (imagen pequeña)</span>
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</pre></div>
<h3>📐 CI/CD con GitHub Actions (3 pasos)</h3>
<ol><li>PR → <code>mvn verify</code> (tests unitarios + integración)</li>
<li>Merge a main → <code>mvn package</code> + <code>docker build</code> + push a registry</li>
<li>Deploy a Kubernetes con helm upgrade</li></ol>
<h3>💡 Monitoreo: métricas + tracing + logs</h3>
<table class="comp-table"><tr><th>Dato</th><th>Herramienta</th><th>Qué vigilar</th></tr>
<tr><td>Métricas</td><td>Micrometer + Prometheus</td><td>P99 latency, error rate, GC pauses, heap usage</td></tr>
<tr><td>Tracing</td><td>OpenTelemetry + Jaeger</td><td>Rastrear requests entre microservicios</td></tr>
<tr><td>Logs</td><td>Logstash + Elasticsearch</td><td>Errores con contexto, structured logging</td></tr>
<tr><td>Health</td><td>Spring Actuator + k8s probes</td><td>/health, /ready, /metrics</td></tr>
</table>`,
exercise:{prompt:'¿Por qué multi-stage build en Docker?',
code:'',answer:'Imagen final más pequeña (sin herramientas de compilación), menor superficie de ataque, deploys más rápidos'}}
  ]
});
})();
