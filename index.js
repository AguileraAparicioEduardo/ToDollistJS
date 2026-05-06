import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  toggleTodo,
  filterTodos,
} from './todos.js';

// ── DOM References ──────────────────────────────────────────────
const titleInput       = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const addBtn           = document.getElementById('add');
const alertBox         = document.getElementById('alert');
const tableBody        = document.querySelector('#table tbody');
const filtersForm      = document.getElementById('filters');
const searchBtn        = document.getElementById('search');

// Modal
const modal            = document.getElementById('modal');
const modalTitle       = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalCompleted   = document.getElementById('modal-completed');
const modalAlert       = document.getElementById('modal-alert');
const modalBtn         = document.getElementById('modal-btn');

// ── State ───────────────────────────────────────────────────────
let currentFilter = { type: 'all', words: '' };
let editingId     = null;

// ── Render ──────────────────────────────────────────────────────
function renderTodos() {
  const filtered = filterTodos(currentFilter);
  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-msg">
          <span>No hay tareas que mostrar</span>
        </td>
      </tr>`;
    return;
  }

  filtered.forEach((todo) => {
    const tr = document.createElement('tr');
    tr.classList.toggle('completed-row', todo.completed);
    tr.innerHTML = `
      <td class="todo-title ${todo.completed ? 'done' : ''}">${todo.title}</td>
      <td class="todo-desc ${todo.completed ? 'done' : ''}">${todo.description}</td>
      <td class="text-center">
        <input type="checkbox" class="check-input" data-id="${todo.id}" ${todo.completed ? 'checked' : ''}>
      </td>
      <td class="actions-cell">
        <button class="btn-edit" data-id="${todo.id}" title="Editar">
          <i class="fa fa-pencil"></i>
        </button>
        <button class="btn-delete" data-id="${todo.id}" title="Eliminar">
          <i class="fa fa-trash"></i>
        </button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

// ── Alert helpers ───────────────────────────────────────────────
function showAlert(box, msg) {
  box.textContent = msg;
  box.classList.remove('d-none');
  setTimeout(() => box.classList.add('d-none'), 3000);
}

// ── Add ─────────────────────────────────────────────────────────
addBtn.addEventListener('click', () => {
  const title       = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    showAlert(alertBox, 'El título es obligatorio.');
    return;
  }

  addTodo(title, description);
  titleInput.value       = '';
  descriptionInput.value = '';
  renderTodos();
});

// Permite agregar con Enter en el campo título
titleInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// ── Table events (delegación) ────────────────────────────────────
tableBody.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.btn-delete');
  const editBtn   = e.target.closest('.btn-edit');
  const checkbox  = e.target.closest('.check-input');

  if (deleteBtn) {
    deleteTodo(Number(deleteBtn.dataset.id));
    renderTodos();
  }

  if (editBtn) {
    const id   = Number(editBtn.dataset.id);
    const todo = getTodos().find((t) => t.id === id);
    if (!todo) return;

    editingId              = id;
    modalTitle.value       = todo.title;
    modalDescription.value = todo.description;
    modalCompleted.checked = todo.completed;
    modalAlert.classList.add('d-none');

    // Bootstrap 4 modal open
    $(modal).modal('show');
  }

  if (checkbox) {
    toggleTodo(Number(checkbox.dataset.id));
    renderTodos();
  }
});

// ── Modal Save ──────────────────────────────────────────────────
modalBtn.addEventListener('click', () => {
  const title       = modalTitle.value.trim();
  const description = modalDescription.value.trim();
  const completed   = modalCompleted.checked;

  if (!title) {
    showAlert(modalAlert, 'El título es obligatorio.');
    return;
  }

  updateTodo(editingId, title, description, completed);
  $(modal).modal('hide');
  renderTodos();
});

// ── Filters ─────────────────────────────────────────────────────
filtersForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data        = new FormData(filtersForm);
  currentFilter     = {
    type  : data.get('type')  || 'all',
    words : data.get('words') || '',
  };
  renderTodos();
});

// Filtros de radio en tiempo real
filtersForm.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    currentFilter.type = radio.value;
    renderTodos();
  });
});

// ── Init ─────────────────────────────────────────────────────────
renderTodos();
