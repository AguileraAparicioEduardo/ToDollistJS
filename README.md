#  ToDo List JS

Aplicación de gestión de tareas construida con **HTML, CSS y JavaScript vanilla**. Sin frameworks, sin dependencias — corre directo en el navegador.

---

##  Demo rápida

Abre `index.html` en tu navegador y listo. No requiere servidor ni instalación.

---

## Funcionalidades

- **Agregar tareas** con título, descripción y nivel de prioridad
- **3 niveles de prioridad** — Urgente · Necesario · No urgente
- **Editar tareas** desde un modal sin recargar la página
- **Marcar como completada** con checkbox
- **Eliminar tareas** individualmente
- **Filtros** — Todas · Completadas · Pendientes
- **Búsqueda** por título o descripción en tiempo real
- **Persistencia** — las tareas se guardan en `localStorage` y sobreviven al recargar
- **Dos temas visuales** — Oscuro y Cálido  con transición suave

---

## Estructura del proyecto

```
ToDollistJS/
├── index.html      # App completa (HTML + CSS + JS en un solo archivo)
├── index.js        # Versión modular — lógica de UI
├── todos.js        # Versión modular — CRUD de tareas
├── storage.js      # Versión modular — lectura/escritura en localStorage
└── README.md
```

> **Nota:** El proyecto tiene dos versiones. `index.html` es standalone y funciona solo. Los archivos `.js` son la versión modular que requiere un servidor local (por los `import/export` de ES Modules).

---

## Cómo correrlo

### Opción 1 — Abrir directamente (más fácil)

```bash
# Solo abre el archivo en tu navegador
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Opción 2 — Servidor local con Node.js (versión modular)

```bash
# Instala un servidor estático una sola vez
npm install -g serve

# Entra a la carpeta del proyecto
cd ToDollistJS

# Levanta el servidor
serve .
```

Luego entra a `http://localhost:3000` en tu navegador.

### Opción 3 — Live Server en VS Code

Instala la extensión **Live Server** y haz clic derecho sobre `index.html` → *Open with Live Server*.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y semántica |
| CSS3 (Custom Properties) | Estilos y sistema de temas |
| JavaScript ES6+ | Lógica, módulos, DOM |
| localStorage | Persistencia de datos |
| Google Fonts | Space Mono + DM Sans |

---

## 📦 Instalación desde cero

```bash
# 1. Clonar el repositorio
git clone https://github.com/AguileraAparicioEduardo/ToDollistJS.git

# 2. Entrar a la carpeta
cd ToDollistJS

# 3. Abrir en VS Code
code .

# 4. Abrir index.html en el navegador o usar Live Server
```

---

## Autor

Eduardo Aguilera Aparicio  
Martin Arce Rodriguez
[GitHub](https://github.com/AguileraAparicioEduardo)

## Link al deploy
[Render](https://todollistjs.onrender.com/)



