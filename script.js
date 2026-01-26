const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progress = document.getElementById("progress");
const themeSelect = document.getElementById("themeSelect");

/* =====================
   ADD TASK
===================== */
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  task.innerHTML = `
    <input type="checkbox">
    <div class="task-text">${text}</div>
    <div class="actions">
      <span class="icon edit">✎</span>
      <span class="icon delete">✕</span>
    </div>
  `;

  taskList.appendChild(task);
  taskInput.value = "";

  attachEvents(task);
  updateProgress();
}

/* =====================
   TASK EVENTS
===================== */
function attachEvents(task) {
  const checkbox = task.querySelector("input");
  const text = task.querySelector(".task-text");
  const del = task.querySelector(".delete");
  const edit = task.querySelector(".edit");

  checkbox.addEventListener("change", () => {
    task.classList.toggle("completed");
    updateProgress();
  });

  del.addEventListener("click", () => {
    task.remove();
    updateProgress();
  });

  edit.addEventListener("click", () => {
    text.contentEditable = true;
    text.focus();
  });

  text.addEventListener("blur", () => {
    text.contentEditable = false;
  });

  /* DRAG */
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
  });
}

/* =====================
   DRAG & DROP
===================== */
taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const after = getAfterElement(e.clientY);
  const dragging = document.querySelector(".dragging");
  after ? taskList.insertBefore(dragging, after) : taskList.appendChild(dragging);
});

function getAfterElement(y) {
  const tasks = [...taskList.querySelectorAll(".task:not(.dragging)")];
  return tasks.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return offset < 0 && offset > closest.offset
      ? { offset, element: child }
      : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* =====================
   PROGRESS
===================== */
function updateProgress() {
  const total = document.querySelectorAll(".task").length;
  const done = document.querySelectorAll(".task.completed").length;
  progress.style.width = total ? (done / total) * 100 + "%" : "0%";
}

/* =====================
   THEME SWITCH
===================== */
themeSelect.addEventListener("change", () => {
  document.body.setAttribute("data-theme", themeSelect.value);
});
