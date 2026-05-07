import { getTodos, addTodo, deleteTodo, updateTodo, toggleTodo, filterTodos } from './todos.js';
import { saveTheme, loadTheme } from './storage.js';

// ── DOM refs ────────────────────────────────────────────────────
const titleInput       = document.getElementById('title');
const descInput        = document.getElementById('description');
const prioritySelect   = document.getElementById('priority');
const addBtn           = document.getElementById('add');
const alertBox         = document.getElementById('alert');
const tableBody        = document.querySelector('#table tbody');
const filtersForm      = document.getElementById('filters');
const themeToggleBtn   = document.getElementById('theme-toggle');

// Modal
const modal            = document.getElementById('modal');
const modalTitleEl     = document.getElementById('modal-title');
const modalDescEl      = document.getElementById('modal-description');
const modalCompletedEl = document.getElementById('modal-completed');
const modalPriorityEl  = document.getElementById('modal-priority');
const modalAlertEl     = document.getElementById('modal-alert');
const modalSaveBtn     = document.getElementById('modal-btn');
const modalCloseBtn    = document.getElementById('modal-close');
const modalCloseBtnX   = document.getElementById('modal-close-x');

// ── State ───────────────────────────────────────────────────────
let currentFilter = { type: 'all', words: '' };
let editingId     = null;
let currentTheme  = loadTheme();

// ── Priority config ─────────────────────────────────────────────
const PRIORITY = {
  urgent:     { label: 'Urgente',      color: 'var(--p-urgent)',     bg: 'var(--p-urgent-bg)'    },
  necessary:  { label: 'Necesario',    color: 'var(--p-necessary)',  bg: 'var(--p-necessary-bg)' },
  'not-urgent':{ label: 'No urgente',  color: 'var(--p-low)',        bg: 'var(--p-low-bg)'       },
};

// ── Theme ───────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  currentTheme = theme;
  saveTheme(theme);
  themeToggleBtn.innerHTML = theme === 'dark'
    ? '<span class="theme-icon">☀</span> Tema cálido'
    : '<span class="theme-icon">🌙</span> Tema oscuro';
}

themeToggleBtn.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'warm' : 'dark');
});

// ── Render ──────────────────────────────────────────────────────
function renderTodos() {
  const filtered = filterTodos(currentFilter);
  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-msg">— No hay tareas que mostrar —</td>
      </tr>`;
    return;
  }

  filtered.forEach(todo => {
    const p   = PRIORITY[todo.priority] || PRIORITY.necessary;
    const tr  = document.createElement('tr');
    tr.classList.toggle('completed-row', todo.completed);
    tr.innerHTML = `
      <td>
        <span class="priority-badge" style="color:${p.color};background:${p.bg};">
          ${p.label}
        </span>
      </td>
      <td class="todo-title ${todo.completed ? 'done' : ''}">${escHtml(todo.title)}</td>
      <td class="todo-desc  ${todo.completed ? 'done' : ''}">${escHtml(todo.description)}</td>
      <td class="text-center">
        <input type="checkbox" class="check-input" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
      </td>
      <td class="actions-cell">
        <button class="btn-edit"   data-id="${todo.id}" title="Editar">✏</button>
        <button class="btn-delete" data-id="${todo.id}" title="Eliminar">✕</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Alert ───────────────────────────────────────────────────────
function showAlert(box, msg) {
  box.textContent = msg;
  box.classList.remove('d-none');
  clearTimeout(box._timer);
  box._timer = setTimeout(() => box.classList.add('d-none'), 3000);
}

// ── Add ─────────────────────────────────────────────────────────
function handleAdd() {
  const title    = titleInput.value.trim();
  const desc     = descInput.value.trim();
  const priority = prioritySelect.value;

  if (!title) { showAlert(alertBox, 'El título es obligatorio.'); return; }

  addTodo(title, desc, priority);
  titleInput.value = '';
  descInput.value  = '';
  prioritySelect.value = 'necessary';
  renderTodos();
}

addBtn.addEventListener('click', handleAdd);
titleInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdd(); });

// ── Table delegation ────────────────────────────────────────────
tableBody.addEventListener('click', e => {
  const del  = e.target.closest('.btn-delete');
  const edit = e.target.closest('.btn-edit');
  const chk  = e.target.closest('.check-input');

  if (del) {
    deleteTodo(Number(del.dataset.id));
    renderTodos();
  }

  if (chk) {
    toggleTodo(Number(chk.dataset.id));
    renderTodos();
  }

  if (edit) {
    const id   = Number(edit.dataset.id);
    const todo = getTodos().find(t => t.id === id);
    if (!todo) return;
    editingId = id;
    modalTitleEl.value       = todo.title;
    modalDescEl.value        = todo.description;
    modalCompletedEl.checked = todo.completed;
    modalPriorityEl.value    = todo.priority || 'necessary';
    modalAlertEl.classList.add('d-none');
    openModal();
  }
});

// ── Modal ───────────────────────────────────────────────────────
function openModal()  { modal.classList.add('is-open'); }
function closeModal() { modal.classList.remove('is-open'); }

modalCloseBtn.addEventListener('click',  closeModal);
modalCloseBtnX.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

modalSaveBtn.addEventListener('click', () => {
  const title     = modalTitleEl.value.trim();
  const desc      = modalDescEl.value.trim();
  const completed = modalCompletedEl.checked;
  const priority  = modalPriorityEl.value;

  if (!title) { showAlert(modalAlertEl, 'El título es obligatorio.'); return; }

  updateTodo(editingId, title, desc, completed, priority);
  closeModal();
  renderTodos();
});

// ── Filters ─────────────────────────────────────────────────────
filtersForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(filtersForm);
  currentFilter = { type: data.get('type') || 'all', words: data.get('words') || '' };
  renderTodos();
});

filtersForm.querySelectorAll('input[name="type"]').forEach(radio => {
  radio.addEventListener('change', () => {
    currentFilter.type = radio.value;
    renderTodos();
  });
});

// ── Init ────────────────────────────────────────────────────────
applyTheme(currentTheme);
renderTodos();
