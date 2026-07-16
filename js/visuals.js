const JavaVisuals = {
  memoryStack: [],
  memoryHeap: {},
  heapCounter: 0,
  currentTab: 'stack',

  initMemoryViewer() {
    const tabs = document.querySelectorAll('.memory-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.renderMemory();
      });
    });
  },

  resetMemory() {
    this.memoryStack = [];
    this.memoryHeap = {};
    this.heapCounter = 0;
    this.renderMemory();
  },

  pushFrame(name) {
    this.memoryStack.push({ name, vars: {} });
    this.renderMemory();
  },

  popFrame() {
    this.memoryStack.pop();
    this.renderMemory();
  },

  setVar(name, value, type) {
    if (this.memoryStack.length === 0) return;
    const frame = this.memoryStack[this.memoryStack.length - 1];
    frame.vars[name] = { value, type };
    this.renderMemory();
  },

  allocObject(type, fields) {
    const id = `0x${(++this.heapCounter).toString(16).padStart(4, '0')}`;
    this.memoryHeap[id] = { type, fields };
    this.renderMemory();
    return id;
  },

  renderMemory() {
    const container = document.getElementById('memory-content');
    if (!container) return;

    let html = '';
    if (this.currentTab === 'stack') {
      if (this.memoryStack.length === 0) {
        html = '<div style="color:var(--text-muted);text-align:center;padding:20px">Stack vacío — ejecuta código para ver frames</div>';
      } else {
        for (let i = this.memoryStack.length - 1; i >= 0; i--) {
          const frame = this.memoryStack[i];
          html += `<div class="memory-frame memory-pop">
            <div class="frame-name">${escapeHtml(frame.name)}</div>`;
          for (const [name, info] of Object.entries(frame.vars)) {
            let valStr = formatValue(info.value, info.type);
            html += `<div class="frame-var">${escapeHtml(name)}: ${valStr}</div>`;
          }
          html += '</div>';
        }
      }
    } else {
      const entries = Object.entries(this.memoryHeap);
      if (entries.length === 0) {
        html = '<div style="color:var(--text-muted);text-align:center;padding:20px">Heap vacío — crea objetos con <code>new</code></div>';
      } else {
        for (const [id, obj] of entries) {
          html += `<div class="heap-object memory-pop">
            <div class="obj-id">${escapeHtml(id)} — ${escapeHtml(obj.type)}</div>`;
          for (const [field, val] of Object.entries(obj.fields)) {
            html += `<div class="obj-field">${escapeHtml(field)} = ${escapeHtml(String(val))}</div>`;
          }
          html += '</div>';
        }
      }
    }
    container.innerHTML = html;
  },

  showMemory() {
    const viz = document.getElementById('memory-viz');
    if (viz) {
      viz.style.display = 'flex';
      document.getElementById('memory-close').onclick = () => { viz.style.display = 'none'; };
      this.renderMemory();
    }
  },

  hideMemory() {
    const viz = document.getElementById('memory-viz');
    if (viz) viz.style.display = 'none';
  },

  // ── Type Cards ──
  typeCardsHTML(types) {
    return `<div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0">
      ${types.map(t => `
        <div class="type-card animate-in">
          <div class="type-name">${escapeHtml(t.name)}</div>
          <div class="type-size">${escapeHtml(t.size)}</div>
          <div class="type-desc">${escapeHtml(t.desc)}</div>
        </div>
      `).join('')}
    </div>`;
  },

  // ── Execution Steps ──
  execStepsHTML(steps, activeIdx = -1) {
    return `<div style="margin:16px 0">
      ${steps.map((s, i) => `
        <div class="exec-step ${i === activeIdx ? 'active' : ''}">
          <div class="step-num">${i + 1}</div>
          <div class="step-code">${s.code}</div>
          ${s.state ? `<div class="step-state">→ ${escapeHtml(s.state)}</div>` : ''}
        </div>
      `).join('')}
    </div>`;
  },

  // ── Algorithm Array Visualization ──
  algArrayHTML(arr, highlights = {}) {
    const maxVal = Math.max(...arr.map(Math.abs), 1);
    return `<div class="alg-container">
      <div class="array-viz">
        ${arr.map((val, idx) => {
          const height = Math.max(20, (Math.abs(val) / maxVal) * 100);
          const cls = highlights[idx] || '';
          return `<div class="array-bar ${cls}" style="height:${height}px">
            <span class="bar-value">${escapeHtml(String(val))}</span>
            <span class="bar-idx">${idx}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  },

  // ── Data Flow ──
  flowHTML(nodes) {
    return `<div class="visual-flow">
      ${nodes.map((n, i) => `
        <div class="flow-node animate-in">${escapeHtml(n)}</div>
        ${i < nodes.length - 1 ? '<div class="flow-arrow">→</div>' : ''}
      `).join('')}
    </div>`;
  },

  // ── Memory Layout Diagram ──
  layoutHTML(stack, heap) {
    return `<div class="memory-layout">
      <div class="memory-region">
        <h4>Stack</h4>
        ${stack.map(s => `<div class="mem-row stack-row"><span class="mem-addr">${escapeHtml(s.addr)}</span><span class="mem-val">${escapeHtml(s.val)}</span></div>`).join('')}
      </div>
      <div class="memory-region">
        <h4>Heap</h4>
        ${heap.map(h => `<div class="mem-row heap-row"><span class="mem-addr">${escapeHtml(h.addr)}</span><span class="mem-val">${escapeHtml(h.val)}</span></div>`).join('')}
      </div>
    </div>`;
  }
};

// ── Helpers ──
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatValue(value, type) {
  if (type === 'String') return `<span class="str">"${escapeHtml(String(value))}"</span>`;
  if (type === 'int' || type === 'double') return `<span class="num">${escapeHtml(String(value))}</span>`;
  if (type === 'boolean') return `<span class="kw">${value}</span>`;
  if (typeof value === 'string' && value.startsWith('0x')) return `<span class="at">${escapeHtml(value)}</span>`;
  return escapeHtml(String(value));
}
