document.addEventListener('DOMContentLoaded', function () {
  
  const taskInput = document.getElementById('task-input');
  const addButton = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  
  const STORAGE_KEY = 'tasks';

  
  let tasks = [];

  
  function loadTasksFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      tasks = [];
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      
      tasks = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      
      tasks = [];
      console.warn('Failed to parse tasks from localStorage, resetting.', e);
    }
  }
  
  function saveTasksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  function renderTasks() {
    
    taskList.innerHTML = '';

    if (tasks.length === 0) {
      const li = document.createElement('li');
      li.className = 'task-item';
      li.textContent = 'No tasks yet';
      taskList.appendChild(li);
      return;
    }

    tasks.forEach((taskText, index) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = taskText;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', `Remove task ${taskText}`);

      
      removeBtn.addEventListener('click', () => {
        removeTaskAtIndex(index);
      });

      li.appendChild(span);
      li.appendChild(removeBtn);
      taskList.appendChild(li);
    });
  }

  
  function addTask(taskText) {
    if (!taskText || !taskText.trim()) return;
    tasks.push(taskText.trim());
    saveTasksToStorage();
    renderTasks();
  }

  
  function removeTaskAtIndex(idx) {
    if (idx < 0 || idx >= tasks.length) return;
    tasks.splice(idx, 1);
    saveTasksToStorage();
    renderTasks();
  }

  
  function handleAddFromInput() {
    if (!taskInput) return;
    const text = taskInput.value;
    if (!text || !text.trim()) {
      taskInput.focus();
      return;
    }
    addTask(text);
    taskInput.value = '';
    taskInput.focus();
  }

  function init() {
    
    loadTasksFromStorage();
    renderTasks();

    if (addButton) {
      addButton.addEventListener('click', handleAddFromInput);
    }
    if (taskInput) {
      taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddFromInput();
      });
    }
  }

  init();
});
