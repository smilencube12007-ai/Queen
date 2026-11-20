const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const storageKey = "todo-list-tasks";

let tasks = loadTasks();

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    if (!taskText) {
        taskInput.focus();
        return;
    }

    tasks.push({
        id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        text: taskText,
        completed: false
    });
    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
});

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(storageKey));
        return Array.isArray(savedTasks) ? savedTasks.filter((task) =>
            task &&
            typeof task.id === "string" &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        ) : [];
    } catch {
        return [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {
        // The app still works for the current session when storage is unavailable.
    }
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.classList.toggle("completed", task.completed);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.completed ? "incomplete" : "complete"}`);
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const taskLabel = document.createElement("span");
        taskLabel.className = "task-text";
        taskLabel.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
            saveTasks();
            renderTasks();
        });

        listItem.append(checkbox, taskLabel, deleteButton);
        taskList.appendChild(listItem);
    });
}

renderTasks();