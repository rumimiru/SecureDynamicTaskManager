const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskIdCounter = 1;

function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = taskText;

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.classList.add("complete-btn");
    completeButton.textContent = "Complete";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remove";

    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(removeButton);

    return taskItem;
}

function generateUniqueTaskId() {
    let taskId;

    do {
        taskId = "task-" + taskIdCounter;
        taskIdCounter += 1;
    } while (taskList.querySelector('[data-task-id="' + taskId + '"]'));

    return taskId;
}

function addTask(taskText) {
    const trimmedText = taskText.trim();

    if (!trimmedText) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const taskId = generateUniqueTaskId();
    const taskItem = createTaskElement(trimmedText, taskId);

    taskList.appendChild(taskItem);
    taskInput.value = "";
    taskMessage.textContent = "";
    updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");
    taskItem.dataset.state = isCompleted ? "completed" : "pending";
    updateTaskCounts();
}

function beginTaskEdit(taskItem) {
    const taskTextSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!taskTextSpan || !editButton) {
        return;
    }

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = taskTextSpan.textContent;

    taskTextSpan.replaceWith(editInput);
    editButton.textContent = "Save";
    editInput.focus();
}

function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editButton = taskItem.querySelector(".edit-btn");

    if (!editInput || !editButton) {
        return;
    }

    const editedText = editInput.value.trim();

    if (!editedText) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = editedText;

    editInput.replaceWith(taskTextSpan);
    editButton.textContent = "Edit";
    taskMessage.textContent = "";
}

function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

function updateTaskCounts() {
    const taskItems = taskList.querySelectorAll(".task-item");

    let pending = 0;
    let completed = 0;

    taskItems.forEach(function (taskItem) {
        if (taskItem.dataset.state === "completed") {
            completed += 1;
        } else if (taskItem.dataset.state === "pending") {
            pending += 1;
        }
    });

    totalCount.textContent = taskItems.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

function handleTaskListClick(event) {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (event.target.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
    } else if (event.target.matches(".edit-btn")) {
        if (taskItem.querySelector(".edit-input")) {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
    } else if (event.target.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}

function loadSampleTasks() {
    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTasks.forEach(function (sampleTask) {
        const taskId = generateUniqueTaskId();
        const taskItem = createTaskElement(sampleTask, taskId);
        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
}

addTaskBtn.addEventListener("click", function () {
    addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

taskList.addEventListener("click", handleTaskListClick);

updateTaskCounts();
