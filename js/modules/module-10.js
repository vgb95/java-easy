(() => {
MODULES.push({
  id: 10, icon: '🔒', title: 'Seguridad y Buenas Prácticas',
  desc: 'OWASP Top 10, autenticación, autorización, cifrado, inyección SQL, XSS, CSRF, HTTPS, secrets management',
  lessons: [
    {id:'10-01',title:'OWASP Top 10 — las vulnerabilidades más críticas',
content:`<h1>🔒 OWASP Top 10: cómo proteger tu app Java</h1>
<h3>1. Inyección (SQL, OS, LDAP)</h3>
<p>La vulnerabilidad #1 de todos los tiempos. Nunca concatenes strings en SQL.</p>
<div class="code-block"><pre><span class="cm">// ❌ Vulnerable a inyección SQL</span>
<span class="typ">Statement</span> stmt = conn.createStatement();
<span class="typ">ResultSet</span> rs = stmt.executeQuery(<span class="str">"SELECT * FROM users WHERE name='"</span> + input + <span class="str">"'"</span>);

<span class="cm">// ✅ PreparedStatement — parametrizado</span>
<span class="typ">PreparedStatement</span> ps = conn.prepareStatement(<span class="str">"SELECT * FROM users WHERE name=?"</span>);
ps.setString(<span class="num">1</span>, input);  <span class="cm">// la BD escapa el input automáticamente</span></pre></div>
<h3>2. Broken Authentication</h3>
<ul><li>BCrypt/Argon2 para contraseñas (NUNCA MD5, SHA-1 o SHA-256 directo)</li>
<li>JWT con secret fuerte y expiración corta</li>
<li>Rate limiting en login (evita brute force)</li>
<li>OAuth2 / OpenID Connect para SSO</li></ul>
<h3>3. Cross-Site Scripting (XSS)</h3>
<ul><li>Escapa toda salida HTML: <code>&lt; → &amp;lt;</code></li>
<li>Content-Security-Policy header</li>
<li>NUNCA pongas input de usuario directamente en HTML sin escapar</li></ul>
<h3>📐 Spring Security mínimo</h3>
<div class="code-block"><pre><span class="at">@Bean</span>
<span class="kw">public</span> <span class="typ">SecurityFilterChain</span> filterChain(<span class="typ">HttpSecurity</span> http) {
    <span class="kw">return</span> http
        .csrf(Customizer.withDefaults())
        .headers(h -> h.xssProtection(...).contentSecurityPolicy(<span class="str">"script-src 'self'"</span>))
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers(<span class="str">"/api/admin/**"</span>).hasRole(<span class="str">"ADMIN"</span>)
            .anyRequest().authenticated()
        )
        .build();
}</pre></div>`,
exercise:{prompt:'¿Qué usas en vez de concatenar strings en SQL?',
code:'',answer:'PreparedStatement con ? y setString/setInt — la BD escapa automáticamente'}},

    {id:'10-02',title:'Secrets Management, cifrado y compliance',
content:`<h1>🔐 Gestión de secretos y cifrado</h1>
<h3>⚠️ Lo que NUNCA debes hacer</h3>
<div class="code-block"><pre><span class="cm">// ❌ NUNCA — hardcodear credenciales</span>
<span class="kw">private static final</span> <span class="typ">String</span> DB_PASSWORD = <span class="str">"super_secret_123"</span>;

<span class="cm">// ❌ NUNCA — subir secrets a Git</span>
<span class="cm">// ❌ NUNCA — poner secrets en variables de entorno sin cifrar</span>
<span class="cm">// ❌ NUNCA — loguear secrets</span></pre></div>
<h3>✅ Prácticas correctas</h3>
<ul><li>Usa <strong>Vault</strong> (HashiCorp) o <strong>AWS Secrets Manager</strong> / <strong>Azure Key Vault</strong></li>
<li>Spring Cloud Config + Vault para inyectar secrets en runtime</li>
<li>Cifra datos sensibles en reposo: AES-256-GCM</li>
<li>Cifra en tránsito: TLS 1.3 (HTTPS, gRPC con TLS)</li>
<li>Rotación de claves automática</li></ul>
<h3>📐 Cifrado en Java</h3>
<div class="code-block"><pre><span class="cm">// Cifrado simétrico AES-GCM (recomendado)</span>
<span class="kw">byte</span>[] clave = <span class="str">"0123456789abcdef"</span>.getBytes();  <span class="cm">// 128 bits</span>
<span class="typ">Cipher</span> cipher = <span class="typ">Cipher</span>.getInstance(<span class="str">"AES/GCM/NoPadding"</span>);
cipher.init(<span class="typ">Cipher</span>.ENCRYPT_MODE, <span class="kw">new</span> <span class="typ">SecretKeySpec</span>(clave, <span class="str">"AES"</span>));
<span class="kw">byte</span>[] cifrado = cipher.doFinal(datos.getBytes());
<span class="kw">byte</span>[] iv = cipher.getIV();  <span class="cm">// guardar IV</span></pre></div>
<h3>💡 Auditoría: logs de acceso con contexto</h3>
<p>Toda operación sensible debe loguearse con: quién (userId), qué (acción), cuándo (timestamp), desde dónde (IP), resultado (éxito/fallo). Estos logs son inmutables (append-only).</p>`,
exercise:{prompt:'¿Dónde almacenarías contraseñas de BD en producción?',
code:'',answer:'Vault o AWS Secrets Manager — nunca en código, propiedades, o Git'}}
  ]
});
})();
