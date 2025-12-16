// script.js
// Ensure DOM is ready before running any DOM-dependent code
document.addEventListener('DOMContentLoaded', function () {
  // Select DOM elements by ID (as required)
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  // Key used in localStorage
  const STORAGE_KEY = 'tasks';

  // In-memory array of tasks (keeps UI and storage in sync)
  let tasks = [];

  /**
   * loadTasks
   * - Reads tasks from localStorage (STORAGE_KEY)
   * - Parses JSON into the tasks array
   * - Renders tasks into the DOM
   */
  function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      tasks = [];
      renderTasks();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      tasks = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      // If stored data is corrupted, reset to empty array
      console.warn('Could not parse tasks from localStorage, resetting.', err);
      tasks = [];
    }

    renderTasks();
  }

  /**
   * saveTasks
   * - Serializes the tasks array and writes it to localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage', err);
    }
  }

  /**
   * renderTasks
   * - Clears the taskList element and recreates list items for each task
   * - Each list item contains the task text and a Remove button
   */
  function renderTasks() {
    // Clear existing list
    taskList.innerHTML = '';

    // If no tasks, optionally show a placeholder item (or leave empty)
    if (tasks.length === 0) {
      // Optional: show a friendly placeholder
      const placeholder = document.createElement('li');
      placeholder.className = 'task-item';
      placeholder.textContent = 'No tasks yet';
      taskList.appendChild(placeholder);
      return;
    }

    // Create list items for each task
    tasks.forEach((taskText, index) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      // Task text
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = taskText;

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove task ${taskText}`);

      // When clicked, remove the task at this index
      removeBtn.addEventListener('click', function () {
        removeTaskAtIndex(index);
      });

      // Assemble and append
      li.appendChild(span);
      li.appendChild(removeBtn);
      taskList.appendChild(li);
    });
  }

  /**
   * addTask
   * - Reads trimmed text from the input
   * - Alerts if empty
   * - Adds the task to the tasks array, saves to storage, and re-renders
   */
  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
      alert('Please enter a task.');
      return;
    }

    // Update in-memory array and storage
    tasks.push(taskText);
    saveTasks();

    // Re-render UI
    renderTasks();

    // Clear input and focus for next entry
    taskInput.value = '';
    taskInput.focus();
  }

  /**
   * removeTaskAtIndex
   * - Removes the task from the tasks array by index
   * - Saves updated array to storage and re-renders
   */
  function removeTaskAtIndex(idx) {
    if (idx < 0 || idx >= tasks.length) return;
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
  }

  // Attach event listeners as specified
  if (addButton) {
    addButton.addEventListener('click', addTask);
  }

  if (taskInput) {
    taskInput.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        addTask();
      }
    });
  }

  // Initialize: load tasks from localStorage and render them
  loadTasks();
});
