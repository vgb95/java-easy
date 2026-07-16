(() => {
MODULES.push({
  id: 17, icon: '🧑‍💼', title: 'Behavioral — FAANG Strategy',
  desc: 'STAR Method, Leadership Principles, Conflicto Resolución, Diseño de Preguntas, Estrategia de Carrera',
  lessons: [
    {id:'17-01',title:'STAR Method — estructura tu respuesta',
    content:`<h1>⭐ STAR Method — Situation, Task, Action, Result</h1>
<h3>La estructura que esperan en FAANG</h3>
<table class="comp-table"><tr><th>Componente</th><th>Qué incluir</th><th>Duración</th><th>Error común</th></tr>
<tr><td><strong>S</strong>ituation</td><td>Contexto: equipo, proyecto, timeline, stakeholders (1-2 frases)</td><td>10-15%</td><td>Demasiado detalle de fondo</td></tr>
<tr><td><strong>T</strong>ask</td><td>Tu responsabilidad específica: qué se esperaba de ti</td><td>5-10%</td><td>Hablar de "nosotros" — usa "yo"</td></tr>
<tr><td><strong>A</strong>ction</td><td>QUÉ hiciste (decisiones técnicas, tradeoffs, liderazgo)</td><td>50-60%</td><td>No mencionar alternativas descartadas</td></tr>
<tr><td><strong>R</strong>esult</td><td>Impacto cuantificable (tiempo ahorrado, $$, rendimiento, learning)</td><td>20-25%</td><td>Olvidar métricas concretas</td></tr>
</table>
<h3>Ejemplo completo — STAR para "conflicto técnico"</h3>
<div class="code-block"><pre><span class="cm">// S: En mi equipo de 6 ingenieros en Uber, discutíamos la arquitectura</span>
<span class="cm">//    del sistema de matching. El TL quería migrar a microservicios, yo</span>
<span class="cm">//    proponía mejorar el monolito existente. Deadline: 3 meses.</span>
<span class="cm">// T: Mi task era presentar un análisis objetivo de ambas opciones y</span>
<span class="cm">//    facilitar una decisión informada que el equipo apoyara.</span>
<span class="cm">// A: Construí un POC de ambas opciones con benchmarks de latencia (P99)</span>
<span class="cm">//    y throughput. Organicé un architectural review con datos concretos:</span>
<span class="cm">//    microservicios: +35% throughput, +20ms latencia, 3 meses vs</span>
<span class="cm">//    monolito optimizado: +20% throughput, -5ms latencia, 1 mes.</span>
<span class="cm">//    Propusimos enfoque híbrido: extraer solo matching service.</span>
<span class="cm">// R: Decision unánime, implementamos en 6 semanas, P99 mejoró 40%,</span>
<span class="cm">//    y el TL me promovió a tech lead del nuevo servicio.</span></pre></div>
<h3>Prepárate 5-8 historias versátiles</h3>
<p>Cubre estas categorías con historias reales: conflicto técnico, liderazgo sin autoridad, error/fracaso, mentoring/crecimiento, impacto positivo, toma de decisiones difíciles, trabajo bajo presión.</p>`,
    exercise:{prompt:'¿Cuál es el error más común al responder preguntas STAR?',
    code:'',answer:'Hablar en plural ("hicimos", "decidimos") en lugar de singular. El entrevistador quiere saber TU contribución específica. Usa "yo analicé...", "yo propuse...", "yo implementé..." sin sonar arrogante.'}},

    {id:'17-02',title:'Leadership Principles — Amazon, Google, Meta',
    content:`<h1>👑 Leadership Principles — lo que buscan</h1>
<h3>FAANG leadership principles comparados</h3>
<table class="comp-table"><tr><th>Amazon (16 LP)</th><th>Google</th><th>Meta</th><th>Netflix</th></tr>
<tr><td>Customer Obsession</td><td>Focus on the User</td><td>Focus on Impact</td><td>Judgment</td></tr>
<tr><td>Ownership</td><td>Ship and Iterate</td><td>Move Fast</td><td>Communication</td></tr>
<tr><td>Dive Deep</td><td>Have a Backbone</td><td>Be Direct</td><td>Curiosity</td></tr>
<tr><td>Insist on Highest Standards</td><td>Technical Excellence</td><td>Build Trust</td><td>Courage</td></tr>
<tr><td>Bias for Action</td><td>Be Bold</td><td>Be Open</td><td>Selflessness</td></tr>
<tr><td>Deliver Results</td><td>Data-driven</td><td>Be the Change</td><td>Inclusion</td></tr>
</table>
<h3>Cómo mapear tu historia al LP</h3>
<p>No memorices los principios. Enfócate en <strong>comportamientos</strong> que demuestren:</p>
<table class="comp-table"><tr><th>Comportamiento</th><th>Ejemplo de historia</th><th>LP que cubre</th></tr>
<tr><td>Tomar initiative sin que te lo pidan</td><td>Encontré un bug en producción y lo fixeé antes de que impactara usuarios</td><td>Ownership, Bias for Action</td></tr>
<tr><td>Desacuerdo productivo</td><td>Discrepé con el diseño de mi TL y propuse alternativa con datos</td><td>Have Backbone, Insist on Highest Standards</td></tr>
<tr><td>Mentoría y crecimiento</td><td>Entrené a 3 juniors que se volvieron autónomos en 6 meses</td><td>Hire and Develop the Best</td></tr>
<tr><td>Manejo de fracaso</td><td>Un deploy causó outage, hice post-mortem, sistema ahora es más robusto</td><td>Ownership, Dive Deep</td></tr>
</table>
<h3>La pregunta trampa: "tell me about a time you failed"</h3>
<p>No cuentes un fracaso trivial ("llegué 5 min tarde") ni uno catastrófico ("borré la BD de producción"). Elige un fracaso real donde <strong>aprendiste algo valioso</strong>. Muestra: qué salió mal, tu responsabilidad, qué hiciste para mitigar, qué cambiaste para prevenir recurrencia.</p>`,
    exercise:{prompt:'Si te preguntan "describe un momento en que tuviste que tomar una decisión sin datos suficientes", ¿qué principio buscan evaluar?',
    code:'',answer:'Bias for Action / Be Bold (Amazon/Google). Quieren ver que puedes actuar con información incompleta, usar judgment, y ajustar el rumbo después con más datos. No quieren indecisión paralizante.'}},

    {id:'17-03',title:'Conflicto y Desacuerdo — disagree & commit',
    content:`<h1>🤝 Conflicto y Desacuerdo — cómo manejarlos</h1>
<h3>Disagree and Commit (Amazon)</h3>
<p>Principio: puedes discrepar respetuosamente, pero una vez que se toma una decisión, te comprometes 100% aunque no estés de acuerdo. <strong>NO</strong> es: sabotear pasivamente o hacer "I told you so" si falla.</p>
<h3>Escalabilidad del conflicto</h3>
<table class="comp-table"><tr><th>Nivel</th><th>Qué hacer</th><th>Lo que NO hacer</th></tr>
<tr><td>1. Desacuerdo técnico</td><td>Datasheet con pros/cons, POC, benchmarks</td><td>Hacerlo personal ("eres incompetente")</td></tr>
<tr><td>2. Bloqueo en decisión</td><td>Involucrar a un tercero (TL, staff engineer)</td><td>Escalar sin intentar resolver primero</td></tr>
<tr><td>3. Diferencia de visión</td><td>Presentar a skip-level con datos y alternativas</td><td>Quejarse con colegas sin proponer solución</td></tr>
</table>
<h3>Técnicas de resolución</h3>
<ul>
<li><strong>Objection handling:</strong> escuchar activamente, repetir el punto del otro, preguntar "¿qué evidencia cambiaría tu opinión?"</li>
<li><strong>Yes, and...</strong>: construir sobre la idea del otro en lugar de descartarla</li>
<li><strong>Data over opinion:</strong> ninguna opinión gana contra un benchmark bien diseñado</li>
<li><strong>Written proposals:</strong> Amazon manda documentos de 6 páginas antes de la reunión (silent reading)</li>
</ul>
<h3>Ejemplo de respuesta</h3>
<p><strong>S:</strong> En mi equipo de plataforma, propusimos migrar de MongoDB a PostgreSQL. El TL quería mantener MongoDB. <strong>T:</strong> Mi task era evaluar objetivamente. <strong>A:</strong> Construí benchmark con nuestras queries reales (join-heavy, agregaciones). PostgreSQL fue 4x más rápido. Presenté datos, no opinión. El TL aceptó el cambio. <strong>R:</strong> Migración completada en 2 meses, P95 de queries bajó de 800ms a 45ms.</p>`,
    exercise:{prompt:'¿Qué significa "disagree and commit" en la práctica?',
    code:'',answer:'Dar tu opinión fundamentada durante la discusión. Una vez que se decide, ejecutas la decisión como si fuera tuya, sin sabotaje ni actitud pasiva-agresiva. Si falla, no dices "te lo advertí" — haces post-mortem y mejoras.'}},

    {id:'17-04',title:'Preguntas de Diseño — behavioral abierto',
    content:`<h1>🎯 Preguntas de Diseño en Entrevistas Behavioral</h1>
<h3>Tipos de preguntas de diseño behavioral</h3>
<table class="comp-table"><tr><th>Tipo</th><th>Ejemplo</th><th>Lo que evalúan</th></tr>
<tr><td>Diseño de proceso</td><td>"Diseña un proceso de code review para tu equipo"</td><td>Pensamiento sistémico, liderazgo, experiencia</td></tr>
<tr><td>Diseño de equipo</td><td>"Cómo estructurarías un equipo de 10 ingenieros para un proyecto nuevo"</td><td>Organización, comunicación, ownership</td></tr>
<tr><td>Mejora de sistema existente</td><td>"El equipo tiene deuda técnica. ¿Cómo la priorizas?"</td><td>Tradeoffs, roadmap, comunicación con stakeholders</td></tr>
<tr><td>Incidente/on-call</td><td>"Diseña el proceso de on-call para un servicio crítico"</td><td>Operaciones, responsabilidad, escalabilidad</td></tr>
</table>
<h3>Framework para responder</h3>
<ol>
<li><strong>Clarificar alcance:</strong> ¿cuántos ingenieros? ¿qué nivel de autonomía? ¿stack existente?</li>
<li><strong>Enumerar opciones:</strong> trunk-based vs feature branches, CI/CD pipeline, ownership por equipo vs por servicio</li>
<li><strong>Tradeoffs:</strong> velocidad vs calidad, autonomía vs alineación, deuda técnica vs features</li>
<li><strong>Recomendación:</strong> basada en contexto específico (no hay solución única)</li>
<li><strong>Métrica de éxito:</strong> cómo saber si funciona (DORA metrics: deploy frequency, lead time, MTTR, change failure rate)</li>
</ol>
<h3>Ejemplo: "Diseña el proceso de code review"</h3>
<table class="comp-table"><tr><th>Decisión</th><th>Opción A</th><th>Opción B</th><th>Mi elección</th></tr>
<tr><td>Número de reviewers</td><td>2 siempre</td><td>1 o 2 según complejidad</td><td>B (flexible, colas cortas)</td></tr>
<tr><td>Tamaño del PR</td><td>Máximo 400 líneas</td><td>Sin límite pero recomendar pequeños</td><td>A (límite duro mejora review)</td></tr>
<tr><td>SLAs</td><td>Review en 24h hábiles</td><td>Best effort</td><td>A (predecible, respeta tiempo)</td></tr>
<tr><td>Herramienta</td><td>GitHub + CODEOWNERS</td><td>Gerrit</td><td>A (más adopción, simpler)</td></tr>
</table>`,
    exercise:{prompt:'En una pregunta de diseño de proceso, ¿qué buscan realmente los entrevistadores de FAANG?',
    code:'',answer:'Buscan tu capacidad de pensar en sistemas sociotécnicos: no solo la tecnología sino cómo las personas, procesos y herramientas interactúan. Quieren ver que consideras tradeoffs, stakeholders y métricas.'}},

    {id:'17-05',title:'Estrategia de Carrera — preparación y crecimiento',
    content:`<h1>🚀 Estrategia de Carrera — de Senior a Staff y más allá</h1>
<h3>La escalera de ingeniería en FAANG</h3>
<table class="comp-table"><tr><th>Nivel</th><th>Impacto</th><th>Autonomía</th><th>Esperado</th></tr>
<tr><td>L3/E3 (New Grad)</td><td>Tareas definidas, 1-2 semanas</td><td>Baja (supervisión cercana)</td><td>Ejecutar bien, aprender rápido</td></tr>
<tr><td>L4/E4 (Mid)</td><td>Feature completo, 1-3 meses</td><td>Media (independiente)</td><td>Entregas consistentes sin supervisión</td></tr>
<tr><td>L5/E5 (Senior)</td><td>Equipo/sistema, 3-6 meses</td><td>Alta (define roadmap)</td><td>Liderazgo técnico, mentoría, desbloquear otros</td></tr>
<tr><td>L6/E6 (Staff)</td><td>Multi-equipo, 6-12 meses</td><td>Muy alta (visión técnica)</td><td>Cross-team, estrategia técnica, influencia sin autoridad</td></tr>
<tr><td>L7/E7 (Senior Staff)</td><td>Organización, 12+ meses</td><td>Autónoma total</td><td>Dirección técnica de org, estándares, cultura</td></tr>
<tr><td>L8+ (Principal/Distinguished)</td><td>Compañía/Industria</td><td>Define futuro</td><td>Reconocimiento externo, patentes, papers</td></tr>
</table>
<h3>Cómo preparar la entrevista behavioral</h3>
<table class="comp-table"><tr><th>Semana</th><th>Actividad</th><th>Entregable</th></tr>
<tr><td>1-2</td><td>Inventario de historias: lista 15 experiencias relevantes</td><td>Matriz historia × principio LP</td></tr>
<tr><td>3-4</td><td>Escribir STAR completo para las 8 mejores historias</td><td>Documento de 1 página cada una</td></tr>
<tr><td>5-6</td><td>Practicar en voz alta con grabación</td><td>Autoevaluación (tiempo, claridad)</td></tr>
<tr><td>7-8</td><td>Mock interviews con amigos/coaches</td><td>Feedback sobre tono y estructura</td></tr>
</table>
<h3>Preguntas frecuentes por nivel</h3>
<ul>
<li><strong>Mid (L4):</strong> "Cuéntame de un proyecto exitoso", "Cómo manejas feedback", "Un error que tuviste"</li>
<li><strong>Senior (L5):</strong> "Conflicto técnico", "Mentoría a junior", "Proyecto más complejo", "Deuda técnica"</li>
<li><strong>Staff (L6+):</strong> "Visión técnica a largo plazo", "Cambio cultural en el equipo", "Cross-team alignment", "Contratación y estándares"</li>
</ul>
<h3>Consejo final</h3>
<p>Las preguntas behavioral en FAANG no son un check de personalidad — son <strong>predictores de desempeño futuro</strong>. Cada historia debe demostrar que eres la persona que resolverá los problemas que ellos tienen. Conecta tus experiencias con sus desafíos actuales.</p>`,
    exercise:{prompt:'¿Cuál es la diferencia entre una respuesta de Senior (L5) y Staff (L6) para la misma pregunta?',
    code:'',answer:'Senior habla de su impacto individual en un equipo (entregó X, mentoró a Y). Staff habla de impacto multi-equipo (cambió proceso que afectó a 3 equipos, influyó sin autoridad, definió estándares organizacionales). El Staff piensa en sistema, no en tarea.'}}
  ]
});
})();
