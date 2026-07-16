let currentModuleIdx = 0;
let currentLessonIdx = 0;
let completedLessons = new Set();
let theme = 'dark';

document.addEventListener('DOMContentLoaded', () => {
  theme = localStorage.getItem('java-easy-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '🌙' : '☀️';

  renderSidebar();
  renderWelcome();

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
});

function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('java-easy-theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '🌙' : '☀️';
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = MODULES.map((mod, mi) => `
    <div class="module-group">
      <button class="module-header" onclick="toggleModule(${mi})">
        <span class="icon">${mod.icon}</span>
        <span>${mod.title}</span>
        <span class="arrow">▼</span>
      </button>
      <div class="lesson-list" id="lesson-list-${mi}">
        ${mod.lessons.map((lesson, li) => {
          const active = currentModuleIdx === mi && currentLessonIdx === li ? 'active' : '';
          const completed = completedLessons.has(lesson.id) ? 'completed' : '';
          return `<button class="lesson-item ${active} ${completed}" onclick="navigateToLesson(${mi}, ${li})">${lesson.title}</button>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function toggleModule(mi) {
  const header = document.querySelector(`.module-header[data-module="${mi}"]`) || document.querySelectorAll('.module-header')[mi];
  const list = document.getElementById(`lesson-list-${mi}`);
  if (!list) return;
  header.classList.toggle('open');
  list.classList.toggle('open');
  if (list.classList.contains('open')) {
    list.style.height = list.scrollHeight + 'px';
  } else {
    list.style.height = '0px';
  }
}

function openLessonList(mi) {
  const header = document.querySelectorAll('.module-header')[mi];
  const list = document.getElementById(`lesson-list-${mi}`);
  if (list && !list.classList.contains('open')) {
    header.classList.add('open');
    list.classList.add('open');
    list.style.height = list.scrollHeight + 'px';
  }
}

function navigateToLesson(mi, li) {
  currentModuleIdx = mi;
  currentLessonIdx = li;
  const lesson = MODULES[mi].lessons[li];

  openLessonList(mi);
  renderSidebar();

  const content = document.getElementById('content');
  content.innerHTML = buildPage(lesson, mi, li);
  content.classList.add('page-enter');
  setTimeout(() => content.classList.remove('page-enter'), 400);

  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function buildPage(lesson, mi, li) {
  const prevBtn = li > 0
    ? `<button class="btn-reset" onclick="navigateToLesson(${mi}, ${li - 1})">← ${MODULES[mi].lessons[li - 1].title}</button>`
    : mi > 0 && MODULES[mi - 1].lessons.length > 0
    ? `<button class="btn-reset" onclick="navigateToLesson(${mi - 1}, ${MODULES[mi - 1].lessons.length - 1})">← ${MODULES[mi - 1].title}</button>`
    : '';

  const nextBtn = li < MODULES[mi].lessons.length - 1
    ? `<button class="btn-run" onclick="navigateToLesson(${mi}, ${li + 1})">${MODULES[mi].lessons[li + 1].title} →</button>`
    : mi < MODULES.length - 1 && MODULES[mi + 1].lessons.length > 0
    ? `<button class="btn-run" onclick="navigateToLesson(${mi + 1}, 0)">${MODULES[mi + 1].title} →</button>`
    : '';

  return `
    <div class="animate-in">
      ${lesson.content || ''}

      ${lesson.exercise ? `
        <div class="exercise-card" id="exercise-card">
          <div class="exercise-title">🧪 Practica</div>
          <p class="exercise-desc">${lesson.exercise.prompt}</p>
          <div class="code-block">
            <div class="code-header"><span>📄 Ejemplo</span></div>
            <pre><code>${syntaxHighlight(lesson.exercise.code || '')}</code></pre>
          </div>
          <button class="btn-verify" onclick="revealAnswer(this, '${escapeAttr(lesson.exercise.answer)}')">🔍 Mostrar salida</button>
          <div class="ex-feedback" id="ex-feedback"></div>
        </div>
      ` : ''}

      <div style="display:flex;gap:12px;justify-content:space-between;margin-top:32px;flex-wrap:wrap">
        ${prevBtn}
        <div style="font-size:0.78rem;color:var(--text-muted);text-align:center;flex:1;display:flex;align-items:center;justify-content:center">
          ${MODULES[mi].icon} ${MODULES[mi].title} · ${lesson.title}
        </div>
        ${nextBtn ? '<div style="text-align:right">' + nextBtn + '</div>' : ''}
      </div>
    </div>
  `;
}

function revealAnswer(btn, answer) {
  const card = btn.closest('.exercise-card');
  const feedback = card.querySelector('#ex-feedback');
  feedback.className = 'ex-feedback show success';
  feedback.innerHTML = `<strong>Salida:</strong><br><pre style="margin:6px 0 0;font-family:var(--font);font-size:0.9rem;background:var(--bg-tertiary);padding:10px;border-radius:8px">${syntaxHighlight(answer)}</pre>`;
  btn.textContent = '✅ Mostrado';
  btn.disabled = true;
  btn.style.opacity = '0.5';

  completedLessons.add(MODULES[currentModuleIdx].lessons[currentLessonIdx].id);
  renderSidebar();

  const title = card.querySelector('.exercise-title');
  if (title) title.textContent = '✅ Practica resuelta';
}

function renderWelcome() {
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalEx = MODULES.reduce((sum, m) => sum + m.lessons.filter(l => l.exercise).length, 0);

  document.getElementById('content').innerHTML = `
    <div id="welcome-page" class="animate-in">
      <div class="welcome-icon">☕</div>
      <h1>Java<span style="color:var(--accent)">Easy</span></h1>
      <p>Aprende Java desde cero con ejemplos interactivos, visualizaciones y ejercicios mentales.</p>
      <div class="welcome-stats">
        <div class="stat"><span class="stat-value">${MODULES.length}</span><span class="stat-label">Módulos</span></div>
        <div class="stat"><span class="stat-value">${totalLessons}</span><span class="stat-label">Lecciones</span></div>
        <div class="stat"><span class="stat-value">${totalEx}</span><span class="stat-label">Ejercicios</span></div>
      </div>
      <button class="welcome-start-btn" onclick="navigateToLesson(0, 0)">Comenzar →</button>
      <div class="welcome-modules">
        ${MODULES.map((m, i) => `
          <button class="welcome-module-btn" onclick="navigateToLesson(${i}, 0)">
            <span style="font-size:1.2rem">${m.icon}</span>
            <span>${m.title}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function syntaxHighlight(code) {
  const rules = [
    { pattern: /\/\/.*$/gm, cls: 'cm' },
    { pattern: /\/\*[\s\S]*?\*\//g, cls: 'cm' },
    { pattern: /\b(public|private|protected|static|final|class|interface|enum|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|void|int|double|float|long|boolean|char|byte|short|null|true|false|this|super|instanceof|synchronized|abstract|native|transient|volatile|strictfp|var|record|sealed|permits|yield)\b/g, cls: 'kw' },
    { pattern: /\b(String|Integer|Double|Float|Long|Boolean|Character|Byte|Short|Math|Arrays|List|ArrayList|Set|HashSet|Map|HashMap|Stream|Optional|System|Object|Class|Runnable|Thread|Exception|RuntimeException|Error|Throwable|Collection|Iterator|Comparable|Comparator)\b/g, cls: 'typ' },
    { pattern: /@\w+/g, cls: 'at' },
    { pattern: /"(\\.|[^"\\])*"/g, cls: 'str' },
    { pattern: /'(\\.|[^'\\])?'/g, cls: 'str' },
    { pattern: /\b\d+\.?\d*\b/g, cls: 'num' }
  ];

  let html = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  for (const rule of rules) {
    html = html.replace(rule.pattern, m => `<span class="${rule.cls}">${m}</span>`);
  }
  return html;
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
