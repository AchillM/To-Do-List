/* ===========================
   TASKR — app.js
   Core Logic + LocalStorage
   =========================== */

'use strict';

// ── STATE ───────────────────────────────────────────────
let tasks  = [];
let filter = 'all';

// ── DOM REFS ────────────────────────────────────────────
const taskInput    = document.getElementById('taskInput');
const deadlineInput= document.getElementById('deadlineInput');
const addBtn       = document.getElementById('addBtn');
const taskList     = document.getElementById('taskList');
const emptyState   = document.getElementById('emptyState');
const taskCount    = document.getElementById('taskCount');
const currentDate  = document.getElementById('currentDate');
const progressFill = document.getElementById('progressFill');
const progressLabel= document.getElementById('progressLabel');
const clearBtn     = document.getElementById('clearCompleted');
const filterBtns   = document.querySelectorAll('.filter-btn');

// ── INIT ────────────────────────────────────────────────
(function init() {
  loadFromStorage();
  renderDateHeader();
  render();
  bindEvents();
})();

// ── EVENTS ──────────────────────────────────────────────
function bindEvents() {
  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  clearBtn.addEventListener('click', clearCompleted);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });
}

// ── ADD TASK ─────────────────────────────────────────────
function addTask() {
  const text     = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (!text) {
    taskInput.focus();
    shake(taskInput);
    return;
  }

  const task = {
    id:       crypto.randomUUID(),
    text,
    deadline: deadline || null,
    done:     false,
    createdAt: Date.now(),
  };

  tasks.unshift(task);
  saveToStorage();
  render();

  taskInput.value   = '';
  deadlineInput.value = '';
  taskInput.focus();

  showToast('Task ditambahkan ✓');
}

// ── TOGGLE DONE ──────────────────────────────────────────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveToStorage();
  render();
  showToast(task.done ? 'Marked as done ✓' : 'Marked as pending');
}

// ── DELETE TASK ──────────────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  render();
  showToast('Task dihapus');
}

// ── CLEAR COMPLETED ──────────────────────────────────────
function clearCompleted() {
  const count = tasks.filter(t => t.done).length;
  if (!count) { showToast('Tidak ada task selesai'); return; }
  tasks = tasks.filter(t => !t.done);
  saveToStorage();
  render();
  showToast(`${count} task selesai dihapus`);
}

// ── RENDER ───────────────────────────────────────────────
function render() {
  const filtered = getFiltered();

  // Update header count
  const total     = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  taskCount.textContent = `${total} task${total !== 1 ? 's' : ''}`;

  // Progress bar
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  progressFill.style.width  = pct + '%';
  progressLabel.textContent = pct + '%';

  // Empty state
  emptyState.classList.toggle('visible', filtered.length === 0);

  // Render list
  taskList.innerHTML = '';
  filtered.forEach(task => {
    taskList.appendChild(createTaskElement(task));
  });
}

// ── CREATE TASK ELEMENT ──────────────────────────────────
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' completed' : ''}`;
  li.dataset.id = task.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', 'Toggle task');
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const body = document.createElement('div');
  body.className = 'task-body';

  const textEl = document.createElement('span');
  textEl.className = 'task-text';
  textEl.textContent = task.text;

  body.appendChild(textEl);

  if (task.deadline) {
    const deadlineEl = createDeadlineEl(task.deadline);
    body.appendChild(deadlineEl);
  }

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.setAttribute('aria-label', 'Hapus task');
  delBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>`;
  delBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(delBtn);

  return li;
}

// ── DEADLINE ELEMENT ─────────────────────────────────────
function createDeadlineEl(deadlineStr) {
  const el      = document.createElement('span');
  el.className  = 'task-deadline';

  const today   = new Date();
  today.setHours(0,0,0,0);
  const dDate   = new Date(deadlineStr + 'T00:00:00');
  const diffDay = Math.round((dDate - today) / 86400000);

  let statusClass = '';
  let statusLabel = '';

  if (diffDay < 0)      { statusClass = 'overdue'; statusLabel = `Overdue ${Math.abs(diffDay)}d`; }
  else if (diffDay === 0){ statusClass = 'today';   statusLabel = 'Today!'; }
  else if (diffDay <= 3) { statusClass = 'soon';    statusLabel = `${diffDay}d left`; }
  else                   {                           statusLabel = formatDate(dDate); }

  el.classList.add(statusClass);

  el.innerHTML = `
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
    ${statusLabel}`;

  return el;
}

// ── FILTER ───────────────────────────────────────────────
function getFiltered() {
  if (filter === 'pending')   return tasks.filter(t => !t.done);
  if (filter === 'completed') return tasks.filter(t => t.done);
  return tasks;
}

// ── STORAGE ──────────────────────────────────────────────
function saveToStorage() {
  try {
    localStorage.setItem('taskr_tasks', JSON.stringify(tasks));
  } catch(e) {
    console.warn('[TASKR] localStorage unavailable:', e);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('taskr_tasks');
    tasks = raw ? JSON.parse(raw) : [];
  } catch(e) {
    tasks = [];
  }
}

// ── HELPERS ──────────────────────────────────────────────
function renderDateHeader() {
  const now = new Date();
  currentDate.textContent = now.toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  }).toUpperCase();
}

function formatDate(d) {
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shakeInput 0.35s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

// ── TOAST ────────────────────────────────────────────────
let toastTimer;

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── EXTRA KEYFRAME (injected) ─────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes shakeInput {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px); }
  }`;
document.head.appendChild(style);
