(() => {
MODULES.push({
  id: 2, icon: '🏗️', title: 'POO Avanzado + Arquitectura',
  desc: 'SOLID, patrones GoF, composición, inyección de dependencias, arquitectura hexagonal, clean code, testing, refactoring',
  lessons: [
    {id:'2-01',title:'SOLID — los 5 principios del diseño OO',
content:`<h1>🏗️ SOLID: cada letra explicada con código</h1>
<h3>S — Single Responsibility (SRP)</h3>
<p>Una clase debe tener una sola razón para cambiar. No mezcles lógica de negocio con persistencia.</p>
<div class="code-block"><pre><span class="cm">// ❌ Viola SRP</span>
<span class="kw">class</span> <span class="typ">Factura</span> { <span class="kw">void</span> calcularTotal() { } <span class="kw">void</span> guardarEnBD() { } <span class="kw">void</span> imprimirPDF() { } }

<span class="cm">// ✅ SRP</span>
<span class="kw">class</span> <span class="typ">Factura</span> { <span class="kw">void</span> calcularTotal() { } }
<span class="kw">class</span> <span class="typ">FacturaRepository</span> { <span class="kw">void</span> guardar(<span class="typ">Factura</span> f) { } }
<span class="kw">class</span> <span class="typ">FacturaPDF</span> { <span class="kw">void</span> imprimir(<span class="typ">Factura</span> f) { } }</pre></div>
<h3>O — Open/Closed (OCP)</h3>
<p>Abierto a extensión, cerrado a modificación. Usa herencia/composición, no switches.</p>
<h3>L — Liskov Substitution (LSP)</h3>
<p>Ejemplo clásico: Rectángulo ↔ Cuadrado. Un cuadrado NO es un subtipo válido de rectángulo si el rectángulo permite setAncho y setAlto independientes.</p>
<div class="code-block"><pre><span class="cm">// ❌ Viola LSP</span>
<span class="kw">class</span> <span class="typ">Rectangulo</span> { <span class="kw">void</span> setAncho(<span class="kw">int</span> w) { ancho = w; } }
<span class="kw">class</span> <span class="typ">Cuadrado</span> <span class="kw">extends</span> <span class="typ">Rectangulo</span> {
    <span class="kw">void</span> setAncho(<span class="kw">int</span> w) { ancho = alto = w; }  <span class="cm">// cambia invariante</span>
}
<span class="cm">// Cliente espera: setAncho(5); setAlto(10); area=50</span>
<span class="cm">// Con Cuadrado: setAncho(5) → alto=5 también; area=25 — ¡roto!</span></pre></div>
<h3>I — Interface Segregation (ISP)</h3>
<p>Mejor interfaces pequeñas y específicas que una grande.</p>
<h3>D — Dependency Inversion (DIP)</h3>
<p>Depende de abstracciones, no de concreciones. El módulo de alto nivel no debe depender del de bajo nivel.</p>
<div class="code-block"><pre><span class="cm">// ❌ Viola DIP</span>
<span class="kw">class</span> <span class="typ">GestorUsuario</span> { <span class="typ">MySQLDatabase</span> db = <span class="kw">new</span> <span class="typ">MySQLDatabase</span>(); }

<span class="cm">// ✅ DIP</span>
<span class="kw">interface</span> <span class="typ">RepositorioUsuario</span> { }
<span class="kw">class</span> <span class="typ">GestorUsuario</span> { <span class="kw">private final</span> <span class="typ">RepositorioUsuario</span> repo; }</pre></div>`,
exercise:{prompt:'¿Qué principio SOLID viola este código?',
code:'class Servicio {\\n    void procesar() {\\n        Connection c = DriverManager.getConnection(...);\\n        // lógica + SQL + creación de conexión\\n    }\\n}',answer:'SRP (procesar + conexión), DIP (depende de DriverManager concreto)'}},

    {id:'2-02',title:'Inyección de dependencias y contenedores',
content:`<h1>💉 Inyección de Dependencias (DI)</h1>
<p>DI es entregar las dependencias desde fuera, no crearlas dentro. Reduce acoplamiento, facilita testing.</p>
<h3>Sin DI vs Con DI</h3>
<div class="code-block"><pre><span class="cm">// Sin DI — acoplado, imposible testear con mock</span>
<span class="kw">class</span> <span class="typ">Servicio</span> { <span class="kw">private</span> <span class="typ">Repositorio</span> repo = <span class="kw">new</span> <span class="typ">RepositorioMySQL</span>(); }

<span class="cm">// Con DI — desacoplado, testeable</span>
<span class="kw">class</span> <span class="typ">Servicio</span> {
    <span class="kw">private final</span> <span class="typ">Repositorio</span> repo;
    <span class="typ">Servicio</span>(<span class="typ">Repositorio</span> repo) { <span class="kw">this</span>.repo = repo; }  <span class="cm">// constructor injection</span>
}
<span class="cm">// Test: new Servicio(new RepositorioMock());</span></pre></div>
<h3>📐 Tipos de DI</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Implementación</th><th>Recomendado</th></tr>
<tr><td>Constructor</td><td>Parámetros del constructor</td><td>✅ Sí — inmutabilidad, explícito</td></tr>
<tr><td>Setter</td><td>método setX()</td><td>⚠️ Opcional, circular refs</td></tr>
<tr><td>Field</td><td>@Autowired en campo</td><td>❌ Testing difícil, reflection</td></tr>
</table>
<h3>💡 Spring DI: cómo funciona</h3>
<p>Spring escanea el classpath, encuentra beans (<code>@Component</code>, <code>@Service</code>, <code>@Repository</code>), analiza dependencias en constructores, y las inyecta. Usa reflection para crear instancias. El <code>ApplicationContext</code> es el contenedor de DI. Por defecto, los beans son <strong>singleton scope</strong> (una instancia por ApplicationContext).</p>`,
exercise:{prompt:'¿Qué ventaja tiene constructor injection sobre field injection?',
code:'',answer:'Inmutabilidad (final), testing sin reflection, dependencias explícitas en el constructor'}},

    {id:'2-03',title:'Patrones creacionales — Singleton, Factory, Builder',
content:`<h1>🏭 Patrones Creacionales</h1>
<h3>Singleton — el más usado (y abusado)</h3>
<div class="code-block"><pre><span class="cm">// Thread-safe con lazy initialization (double-checked locking)</span>
<span class="kw">public class</span> <span class="typ">Config</span> {
    <span class="kw">private static volatile</span> <span class="typ">Config</span> instancia;
    <span class="kw">private</span> <span class="typ">Config</span>() { }
    <span class="kw">public static</span> <span class="typ">Config</span> getInstance() {
        <span class="kw">if</span> (instancia == <span class="kw">null</span>) {
            <span class="kw">synchronized</span> (<span class="typ">Config</span>.class) {
                <span class="kw">if</span> (instancia == <span class="kw">null</span>) instancia = <span class="kw">new</span> <span class="typ">Config</span>();
            }
        }
        <span class="kw">return</span> instancia;
    }
}
<span class="cm">// Alternativa más simple: enum singleton</span>
<span class="kw">public enum</span> <span class="typ">Config</span> { INSTANCIA; }  <span class="cm">// thread-safe por definición, serialization-safe</span></pre></div>
<h3>Builder — para objetos con muchos parámetros</h3>
<div class="code-block"><pre><span class="typ">Usuario</span> u = <span class="typ">Usuario</span>.builder()
    .nombre(<span class="str">"Ana"</span>)
    .edad(<span class="num">25</span>)
    .email(<span class="str">"ana@email.com"</span>)
    .build();</pre></div>
<h3>Factory Method — delegar creación</h3>
<div class="code-block"><pre><span class="kw">class</span> <span class="typ">ConexionFactory</span> {
    <span class="kw">static</span> <span class="typ">Conexion</span> crear(<span class="typ">String</span> tipo) {
        <span class="kw">return switch</span> (tipo) {
            <span class="kw">case</span> <span class="str">"mysql"</span> -> <span class="kw">new</span> <span class="typ">ConexionMySQL</span>();
            <span class="kw">case</span> <span class="str">"postgres"</span> -> <span class="kw">new</span> <span class="typ">ConexionPostgreSQL</span>();
            <span class="kw">default</span> -> <span class="kw">throw new</span> <span class="typ">IllegalArgumentException</span>();
        };
    }
}</pre></div>`,
exercise:{prompt:'¿Qué patrón y sus ventajas?',
code:'Usuario u = Usuario.builder().nombre("A").email("a@b.c").build();',answer:'Builder. Ventajas: legible, parámetros opcionales, objeto inmutable'}},

    {id:'2-04',title:'Patrones estructurales — Adapter, Decorator, Proxy',
content:`<h1>🔌 Patrones Estructurales</h1>
<h3>Adapter — conectar interfaces incompatibles</h3>
<div class="code-block"><pre><span class="kw">class</span> <span class="typ">PagoPayPal</span> { <span class="kw">void</span> enviarPago(<span class="kw">double</span> monto) { } }

<span class="kw">interface</span> <span class="typ">ProcesadorPago</span> { <span class="kw">void</span> cobrar(<span class="typ">String</span> email, <span class="kw">double</span> total); }

<span class="kw">class</span> <span class="typ">PayPalAdapter</span> <span class="kw">implements</span> <span class="typ">ProcesadorPago</span> {
    <span class="kw">private</span> <span class="typ">PagoPayPal</span> api = <span class="kw">new</span> <span class="typ">PagoPayPal</span>();
    <span class="kw">public void</span> cobrar(<span class="typ">String</span> email, <span class="kw">double</span> total) { api.enviarPago(total); }
}</pre></div>
<h3>Decorator — añadir comportamiento sin modificar</h3>
<div class="code-block"><pre><span class="kw">interface</span> <span class="typ">Notificador</span> { <span class="kw">void</span> enviar(<span class="typ">String</span> msg); }
<span class="kw">class</span> <span class="typ">NotificadorSMS</span> <span class="kw">implements</span> <span class="typ">Notificador</span> { }

<span class="cm">// Decorador: añade logging sin cambiar NotificadorSMS</span>
<span class="kw">class</span> <span class="typ">NotificadorConLog</span> <span class="kw">implements</span> <span class="typ">Notificador</span> {
    <span class="kw">private final</span> <span class="typ">Notificador</span> wrapped;
    <span class="kw">public void</span> enviar(<span class="typ">String</span> msg) {
        <span class="typ">System</span>.out.println(<span class="str">"Enviando: "</span> + msg);
        wrapped.enviar(msg);
    }
}</pre></div>
<h3>Proxy — control de acceso (lazy loading, cache, remoto)</h3>
<p>Spring AOP usa proxies para <code>@Transactional</code>, <code>@Cacheable</code>, <code>@Secured</code>. Un proxy envuelve el bean real y añade comportamiento transversal.</p>`,
exercise:{prompt:'¿Qué patrón usas para añadir logging a una clase sin modificarla?',
code:'',answer:'Decorator'}},

    {id:'2-05',title:'Patrones de comportamiento — Strategy, Observer, Chain',
content:`<h1>🔄 Patrones de Comportamiento</h1>
<h3>Strategy — algoritmos intercambiables en runtime</h3>
<div class="code-block"><pre><span class="kw">interface</span> <span class="typ">EstrategiaDescuento</span> { <span class="kw">double</span> aplicar(<span class="kw">double</span> precio); }
<span class="kw">class</span> <span class="typ">SinDescuento</span> <span class="kw">implements</span> <span class="typ">EstrategiaDescuento</span> { ... }
<span class="kw">class</span> <span class="typ">Descuento10</span> <span class="kw">implements</span> <span class="typ">EstrategiaDescuento</span> { ... }

<span class="cm">// Elegir en runtime según el tipo de cliente</span>
<span class="typ">EstrategiaDescuento</span> e = esVip ? <span class="kw">new</span> <span class="typ">Descuento10</span>() : <span class="kw">new</span> <span class="typ">SinDescuento</span>();
<span class="kw">double</span> total = e.aplicar(precioBase);</pre></div>
<h3>Observer — evento → múltiples suscriptores</h3>
<div class="code-block"><pre><span class="kw">class</span> <span class="typ">GestorEventos</span> {
    <span class="kw">private final</span> <span class="typ">List</span>&lt;<span class="typ">Observador</span>&gt; obs = <span class="kw">new</span> <span class="typ">ArrayList</span>&lt;&gt;();
    <span class="kw">void</span> suscribir(<span class="typ">Observador</span> o) { obs.add(o); }
    <span class="kw">void</span> emitir(<span class="typ">String</span> evento) { obs.forEach(o -> o.notificar(evento)); }
}</pre></div>
<h3>Chain of Responsibility — cadena de handlers</h3>
<p>Usado en Spring Security (FilterChain), servlets, middlewares.</p>
<div class="code-block"><pre><span class="kw">abstract class</span> <span class="typ">Middleware</span> {
    <span class="kw">private</span> <span class="typ">Middleware</span> next;
    <span class="kw">void</span> manejar(<span class="typ">Request</span> r) {
        <span class="kw">if</span> (puedeManejar(r)) procesar(r);
        <span class="kw">else if</span> (next != <span class="kw">null</span>) next.manejar(r);
    }
}</pre></div>`,
exercise:{prompt:'¿Qué patrón cambia algoritmos en tiempo de ejecución?',
code:'',answer:'Strategy'}},

    {id:'2-06',title:'Arquitectura Hexagonal (Puertos y Adaptadores)',
content:`<h1>🧱 Arquitectura Hexagonal (Ports & Adapters)</h1>
<h3>Principio fundamental</h3>
<p>El dominio (núcleo) NO depende de la infraestructura. Las dependencias apuntan hacia adentro.</p>
<div class="code-block"><pre><span class="cm">// DOMINIO — puro Java, sin frameworks, sin BD</span>
<span class="kw">record</span> <span class="typ">Usuario</span>(<span class="typ">String</span> email, <span class="typ">String</span> nombre) { }

<span class="cm">// PUERTO (interfaz en dominio)</span>
<span class="kw">interface</span> <span class="typ">RepositorioUsuario</span> { <span class="kw">void</span> guardar(<span class="typ">Usuario</span> u); }

<span class="cm">// CASO DE USO (aplicación)</span>
<span class="kw">class</span> <span class="typ">RegistrarUsuario</span> {
    <span class="kw">private final</span> <span class="typ">RepositorioUsuario</span> repo;
    <span class="typ">RegistrarUsuario</span>(<span class="typ">RepositorioUsuario</span> repo) { <span class="kw">this</span>.repo = repo; }
    <span class="typ">Resultado</span> ejecutar(<span class="typ">String</span> email, <span class="typ">String</span> nombre) { ... }
}

<span class="cm">// ADAPTADOR (infraestructura)</span>
<span class="kw">class</span> <span class="typ">RepositorioUsuarioJPA</span> <span class="kw">implements</span> <span class="typ">RepositorioUsuario</span> { }
<span class="kw">class</span> <span class="typ">ControladorREST</span> { <span class="cm">// HTTP adapter</span> }</pre></div>
<h3>💡 Ventajas para entrevistas FAANG</h3>
<ul><li><strong>Testeable</strong>: el dominio se testea sin BD, sin HTTP, sin Spring</li>
<li><strong>Intercambiable</strong>: cambiar de MySQL a PostgreSQL no toca ni una línea de dominio</li>
<li><strong>Dependencias explícitas</strong>: el constructor de cada caso de uso muestra sus dependencias</li></ul>`,
exercise:{prompt:'¿En qué capa vive la interfaz RepositorioUsuario en hexagonal?',
code:'',answer:'En dominio (es un puerto que define el contrato)'}},

    {id:'2-07',title:'Composición vs Herencia — el debate definitivo',
content:`<h1>🔄 Composición > Herencia</h1>
<h3>Problemas de la herencia</h3>
<ul><li><strong>Fragile base class</strong>: cambiar la clase padre puede romper hijas sin saberlo</li>
<li><strong>Jerarquías rígidas</strong>: difícil añadir comportamiento transversal</li>
<li><strong>Explosión de clases</strong>: cada combinación de comportamientos requiere una subclase</li>
<li><strong>Encapsulamiento roto</strong>: subclases dependen de la implementación interna del padre</li></ul>
<h3>Composición al rescate</h3>
<div class="code-block"><pre><span class="cm">// ❌ Herencia — cada combinación nueva requiere clase</span>
<span class="kw">class</span> <span class="typ">PatoVolador</span> <span class="kw">extends</span> <span class="typ">Pato</span> { }
<span class="kw">class</span> <span class="typ">PatoVoladorYFlotador</span> <span class="kw">extends</span> <span class="typ">PatoVolador</span> { }  <span class="cm">// explota combinatorio</span>

<span class="cm">// ✅ Composición — comportamientos inyectados</span>
<span class="kw">class</span> <span class="typ">Pato</span> {
    <span class="kw">private final</span> <span class="typ">ComportamientoVuelo</span> vuelo;
    <span class="kw">private final</span> <span class="typ">ComportamientoNado</span> nado;
}
<span class="cm">// Combinaciones sin explotar jerarquías</span>
<span class="kw">new</span> <span class="typ">Pato</span>(<span class="kw">new</span> <span class="typ">VueloNormal</span>(), <span class="kw">new</span> <span class="typ">NadoNormal</span>());
<span class="kw">new</span> <span class="typ">Pato</span>(<span class="kw">new</span> <span class="typ">VueloNormal</span>(), <span class="kw">new</span> <span class="typ">NoNado</span>());</pre></div>`,
exercise:{prompt:'¿Por qué composición es mejor que herencia? (3 razones)',
code:'',answer:'Jerarquías flexibles, evita fragile base class, mejor encapsulamiento'}},

    {id:'2-08',title:'Inmutabilidad y objetos value — diseño defensivo',
content:`<h1>🔒 Inmutabilidad: el arma secreta del código correcto</h1>
<h3>Cómo crear una clase inmutable</h3>
<div class="code-block"><pre><span class="kw">public final class</span> <span class="typ">Punto</span> {           <span class="cm">// 1. clase final</span>
    <span class="kw">private final int</span> x;              <span class="cm">// 2. campos private final</span>
    <span class="kw">private final int</span> y;
    <span class="kw">public</span> <span class="typ">Punto</span>(<span class="kw">int</span> x, <span class="kw">int</span> y) {      <span class="cm">// 3. constructor único</span>
        <span class="kw">this</span>.x = x; <span class="kw">this</span>.y = y;
    }
    <span class="kw">public int</span> x() { <span class="kw">return</span> x; }      <span class="cm">// 4. solo getters</span>
    <span class="kw">public</span> <span class="typ">Punto</span> mover(<span class="kw">int</span> dx, <span class="kw">int</span> dy) { <span class="cm">// 5. operaciones devuelven NUEVO objeto</span>
        <span class="kw">return new</span> <span class="typ">Punto</span>(x + dx, y + dy);
    }
}</pre></div>
<h3>⚠️ Defensive copying — nunca expongas tu interior mutable</h3>
<div class="code-block"><pre><span class="kw">public final class</span> <span class="typ">Equipo</span> {
    <span class="kw">private final</span> <span class="typ">List</span>&lt;<span class="typ">String</span>&gt; miembros;
    <span class="kw">public</span> <span class="typ">Equipo</span>(<span class="typ">List</span>&lt;<span class="typ">String</span>&gt; miembros) {
        <span class="kw">this</span>.miembros = <span class="typ">List</span>.copyOf(miembros);  <span class="cm">// copia defensiva en entrada</span>
    }
    <span class="kw">public</span> <span class="typ">List</span>&lt;<span class="typ">String</span>&gt; miembros() {
        <span class="kw">return</span> miembros;  <span class="cm">// ya es inmutable por List.copyOf</span>
    }
}</pre></div>`,
exercise:{prompt:'¿Qué falta para que esta clase sea inmutable?',
code:'class Persona {\\n    String nombre;\\n    int edad;\\n    Persona(String n, int e) { nombre=n; edad=e; }\\n}',answer:'Campos final, clase final, copia defensiva si hay campos mutables'}},

    {id:'2-09',title:'Testing — JUnit 5, Mockito, TDD, pirámide',
content:`<h1>🧪 Testing en Java</h1>
<h3>Pirámide de testing</h3>
<p>Muchos unitarios (rápidos), algunos integración, pocos E2E.</p>
<h3>JUnit 5 — Arrange-Act-Assert</h3>
<div class="code-block"><pre><span class="at">@Test</span>
<span class="kw">void</span> calcularTotal_conDescuento() {
    <span class="cm">// Arrange</span>
    <span class="typ">Carrito</span> c = <span class="kw">new</span> <span class="typ">Carrito</span>();
    c.agregar(<span class="kw">new</span> <span class="typ">Producto</span>(<span class="str">"Laptop"</span>, <span class="num">1000</span>));
    <span class="cm">// Act</span>
    <span class="kw">double</span> total = c.totalConDescuento(<span class="num">0.1</span>);
    <span class="cm">// Assert</span>
    assertEquals(<span class="num">900</span>, total, <span class="num">0.01</span>);
}</pre></div>
<h3>Mockito — aislar dependencias</h3>
<div class="code-block"><pre><span class="at">@Test</span>
<span class="kw">void</span> registrar_usuario_nuevo() {
    <span class="typ">RepositorioUsuario</span> repo = mock(<span class="typ">RepositorioUsuario</span>.class);
    <span class="kw">when</span>(repo.porEmail(<span class="str">"a@b.com"</span>)).thenReturn(<span class="typ">Optional</span>.empty());
    
    <span class="typ">RegistrarUsuario</span> caso = <span class="kw">new</span> <span class="typ">RegistrarUsuario</span>(repo);
    <span class="typ">Resultado</span> r = caso.ejecutar(<span class="str">"a@b.com"</span>, <span class="str">"Ana"</span>);
    
    assertTrue(r.exito());
    verify(repo).guardar(any());  <span class="cm">// verifica que se llamó</span>
}</pre></div>
<h3>💡 Cobertura: no es la meta</h3>
<p>80% de cobertura no significa 80% de código correcto. Mide <strong>branch coverage</strong>, no line coverage. Prioriza lógica de negocio sobre getters/setters. Un test que no falla cuando debería no sirve.</p>`,
exercise:{prompt:'¿Qué patrón de testing es este?',
code:'// Arrange, Act, Assert',answer:'AAA (Arrange-Act-Assert)'}}
  ]
});
})();
