// DOM Element Selections
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

// Counter for generating unique task IDs
let taskCounter = 1;

// 1. Create and return one task element without appending to DOM
function createTaskElement(taskText, taskId) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.taskId = taskId;
    li.dataset.state = "pending";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText;

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);

    return li;
}

// 2. Validate input, create dynamic ID, append task, reset fields, and update counts
function addTask(taskText) {
    const trimmedText = taskText.trim();
    if (!trimmedText) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    taskMessage.textContent = "";
    const taskId = `task-${taskCounter++}`;
    const taskElement = createTaskElement(trimmedText, taskId);

    taskList.appendChild(taskElement);
    taskInput.value = "";
    updateTaskCounts();
}

// 3. Toggle completed state visually and update data-state attribute
function toggleTaskComplete(taskItem) {
    const isCompleted = taskItem.classList.toggle("completed");
    taskItem.dataset.state = isCompleted ? "completed" : "pending";
    updateTaskCounts();
}

// 4. Enter edit mode by replacing the text span with an edit input
function beginTaskEdit(taskItem) {
    const textSpan = taskItem.querySelector(".task-text");
    if (!textSpan) return;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = textSpan.textContent;

    const editBtn = taskItem.querySelector(".edit-btn");
    if (editBtn) {
        editBtn.textContent = "Save";
    }

    taskItem.replaceChild(editInput, textSpan);
    editInput.focus();
}

// 5. Validate edit input and safely save changes using textContent
function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    if (!editInput) return;

    const trimmedText = editInput.value.trim();
    if (!trimmedText) {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    taskMessage.textContent = "";
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = trimmedText;

    const editBtn = taskItem.querySelector(".edit-btn");
    if (editBtn) {
        editBtn.textContent = "Edit";
    }

    taskItem.replaceChild(textSpan, editInput);
}

// 6. Remove selected task item and recalculate counts
function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

// 7. Calculate and update summary counts dynamically from the live DOM
function updateTaskCounts() {
    const allTasks = taskList.querySelectorAll(".task-item");
    const total = allTasks.length;
    let pending = 0;
    let completed = 0;

    allTasks.forEach((task) => {
        if (task.dataset.state === "completed") {
            completed++;
        } else {
            pending++;
        }
    });

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// 8. Single delegated click event handler for task action buttons
function handleTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest(".task-item");

    if (!taskItem) return;

    if (target.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
    } else if (target.matches(".edit-btn")) {
        if (target.textContent === "Edit") {
            beginTaskEdit(taskItem);
        } else if (target.textContent === "Save") {
            saveTaskEdit(taskItem);
        }
    } else if (target.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}

// 9. Batch load the three required sample tasks via DocumentFragment
function loadSampleTasks() {
    const sampleTexts = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTexts.forEach((text) => {
        const taskId = `task-${taskCounter++}`;
        const taskElement = createTaskElement(text, taskId);
        fragment.appendChild(taskElement);
    });

    taskList.appendChild(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
}

// Event Listeners
addTaskBtn.addEventListener("click", () => addTask(taskInput.value));
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskList.addEventListener("click", handleTaskListClick);

// Allow adding tasks using the Enter key
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask(taskInput.value);
    }
});