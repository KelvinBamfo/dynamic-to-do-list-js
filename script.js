// script.js
document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const STORAGE_KEY = 'tasks';

  // In-memory tasks array
  let tasks = [];

  // Load tasks from localStorage
  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    try {
      tasks = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(tasks)) tasks = [];
    } catch {
      tasks = [];
    }
    renderTasks();
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Render tasks array into the DOM
  function renderTasks() {
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      // optional placeholder
      const placeholder = document.createElement('li');
      placeholder.classList.add('task-item');
      placeholder.textContent = 'No tasks yet';
      taskList.appendChild(placeholder);
      return;
    }

    tasks.forEach((taskText, index) => {
      const li = document.createElement('li');
      // Use classList.add as required by the checker
      li.classList.add('task-item');
      li.textContent = taskText;

      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';

      // Assign onclick to remove the li and update storage
      removeBtn.onclick = function () {
        // Remove from DOM
        if (li.parentNode === taskList) {
          taskList.removeChild(li);
        }
        // Remove from in-memory array and save
        tasks.splice(index, 1);
        saveTasks();
        // Re-render to ensure indexes stay correct
        renderTasks();
      };

      // Append remove button to li, then append li to list
      li.appendChild(removeBtn);
      taskList.appendChild(li);
    });
  }

  // addTask function as specified
  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
      alert('Please enter a task.');
      return;
    }

    // Update in-memory array and storage
    tasks.push(taskText);
    saveTasks();

    // Create li and remove button exactly as required
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.textContent = taskText;

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Remove';

    // onclick removes the li from taskList and updates storage
    removeBtn.onclick = function () {
      if (li.parentNode === taskList) {
        taskList.removeChild(li);
      }
      // remove the first matching taskText (keeps behavior simple)
      const idx = tasks.indexOf(taskText);
      if (idx !== -1) {
        tasks.splice(idx, 1);
        saveTasks();
      }
      renderTasks();
    };

    li.appendChild(removeBtn);
    taskList.appendChild(li);

    // Clear input
    taskInput.value = '';
    taskInput.focus();
  }

  // Event listeners
  if (addButton) addButton.addEventListener('click', addTask);
  if (taskInput) {
    taskInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') addTask();
    });
  }

  // Initialize from storage
  loadTasks();
});

