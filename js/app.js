// ---------- Element references ----------
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
const SAMPLE_TASKS = [
  "Review DOM selectors",
  "Practice createElement",
  "Study event delegation"
];

let taskCounter = 0;

// ---------- Helpers ----------
function showMessage(text) {
  taskMessage.textContent = text;
}

function clearMessage() {
  taskMessage.textContent = "";
}

function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = "task-" + taskCounter;
  } while (taskList.querySelector('[data-task-id="' + id + '"]'));
  return id;
}

// ---------- Task creation ----------
function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = "pending";

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.textContent = "Remove";

  taskItem.append(textSpan, completeBtn, editBtn, removeBtn);
  return taskItem;
}

function addTask(taskText) {
  const text = taskText.trim();
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);

  taskInput.value = "";
  clearMessage();
  updateTaskCounts();
}

// ---------- Task actions ----------
function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!textSpan || !editBtn) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.classList.add("edit-input");
  editInput.value = textSpan.textContent;

  textSpan.replaceWith(editInput);
  editBtn.textContent = "Save";
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  const editBtn = taskItem.querySelector(".edit-btn");
  if (!editInput || !editBtn) return;

  const newText = editInput.value.trim();
  if (newText === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const textSpan = document.createElement("span");
  textSpan.classList.add("task-text");
  textSpan.textContent = newText;

  editInput.replaceWith(textSpan);
  editBtn.textContent = "Edit";
  clearMessage();
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// ---------- Counts ----------
function updateTaskCounts() {
  const tasks = taskList.querySelectorAll(".task-item");
  let pending = 0;
  let completed = 0;

  tasks.forEach(function (task) {
    if (task.dataset.state === "completed") {
      completed += 1;
    } else {
      pending += 1;
    }
  });

  totalCount.textContent = tasks.length;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

// ---------- Event delegation ----------
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      beginTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

// ---------- Sample tasks ----------
function loadSampleTasks() {
  const fragment = document.createDocumentFragment();
  SAMPLE_TASKS.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });
  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

// ---------- Wiring ----------
taskList.addEventListener("click", handleTaskListClick);

addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

updateTaskCounts();
