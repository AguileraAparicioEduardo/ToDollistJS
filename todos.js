import { saveTodos, loadTodos } from './storage.js';

let todos = loadTodos();

export function getTodos() {
  return todos;
}

export function addTodo(title, description) {
  const todo = {
    id: Date.now(),
    title,
    description,
    completed: false,
  };
  todos.push(todo);
  saveTodos(todos);
  return todo;
}

export function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos(todos);
}

export function updateTodo(id, title, description, completed) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, title, description, completed } : t
  );
  saveTodos(todos);
}

export function toggleTodo(id) {
  todos = todos.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTodos(todos);
}

export function filterTodos({ type = 'all', words = '' }) {
  return todos.filter((t) => {
    const matchType =
      type === 'all' ||
      (type === 'completed' && t.completed) ||
      (type === 'uncompleted' && !t.completed);
    const matchWords =
      !words ||
      t.title.toLowerCase().includes(words.toLowerCase()) ||
      t.description.toLowerCase().includes(words.toLowerCase());
    return matchType && matchWords;
  });
}
