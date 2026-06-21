let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];

let draggedElement = null;

const addTaskBtn = document.getElementById("toggle-modal");
const modal = document.querySelector(".modal");
const bg = document.querySelector(".modal .bg");
const createTaskBtn = document.querySelector(".add-task-btn");

// ==========================
// 🔹 Create Task Element
// ==========================
function createTaskElement(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
      <h2>${title}</h2>
      <p>${desc}</p>
      <button>Delete</button>
  `;

  column.appendChild(div);

  // Drag start
  div.addEventListener("dragstart", () => {
    draggedElement = div;
  });

  // Delete
  div.querySelector("button").addEventListener("click", () => {
    div.remove();
    updateCounts();
    saveToLocalStorage();
  });
}

// ==========================
// 🔹 Update Task Counts
// ==========================
function updateCounts() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");
    count.innerText = tasks.length;
  });
}

// ==========================
// 🔹 Save to LocalStorage
// ==========================
function saveToLocalStorage() {
  taskData = {};

  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");

    taskData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText,
      desc: t.querySelector("p").innerText,
    }));
  });

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

// ==========================
// 🔹 Load From LocalStorage
// ==========================
if (localStorage.getItem("tasks")) {
  taskData = JSON.parse(localStorage.getItem("tasks"));

  for (const col in taskData) {
    const column = document.querySelector(`#${col}`);

    taskData[col].forEach((task) => {
      createTaskElement(task.title, task.desc, column);
    });
  }

  updateCounts();
}

// ==========================
// 🔹 Drag & Drop
// ==========================
function addDragEvents(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(draggedElement);
    column.classList.remove("hover-over");

    updateCounts();
    saveToLocalStorage();
  });
}

columns.forEach((col) => addDragEvents(col));

// ==========================
// 🔹 Modal Controls
// ==========================
addTaskBtn.addEventListener("click", () => {
  modal.classList.toggle("active");
});

bg.addEventListener("click", () => {
  modal.classList.remove("active");
});

// ==========================
// 🔹 Create New Task
// ==========================
createTaskBtn.addEventListener("click", () => {
  const title = document.querySelector("#task-title-input").value.trim();
  const desc = document.querySelector("#task-discription-input").value.trim();

  if (!title || !desc) return;

  createTaskElement(title, desc, todo);

  updateCounts();
  saveToLocalStorage();

  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-discription-input").value = "";
});
