document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const timeInput = document.getElementById('timeInput');
  const unitInput = document.getElementById('unitInput');
  const setBtn = document.getElementById('setBtn');
  const taskList = document.getElementById('taskList');

  loadTasks();


  setBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    const timeValue = parseInt(timeInput.value);
    const unit = unitInput.value;


    if (!taskName) {
      showError('Please enter a task name!');
      return;
    }

    if (isNaN(timeValue) || timeValue <= 0) {
      showError('Please enter a valid time!');
      return;
    }

    if (timeValue > 10000) {
      showError('Time value is too large!');
      return;
    }


    const delayInMinutes = unit === 'hours' ? timeValue * 60 : timeValue;


    const alarmName = `task_${Date.now()}`;


    chrome.alarms.create(alarmName, {
      delayInMinutes: delayInMinutes
    });

    const task = {
      name: taskName,
      time: timeValue,
      unit: unit,
      createdAt: Date.now(),
      alarmName: alarmName
    };

    chrome.storage.local.set({ [alarmName]: task }, () => {

      taskInput.value = '';
      timeInput.value = '10';
      unitInput.value = 'minutes';


      showSuccess('Reminder set!');

      loadTasks();
    });
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      setBtn.click();
    }
  });

  timeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      setBtn.click();
    }
  });

  function loadTasks() {
    chrome.storage.local.get(null, (items) => {
      taskList.innerHTML = '';

      const tasks = Object.entries(items).filter(([key]) => key.startsWith('task_'));

      if (tasks.length === 0) {
        taskList.innerHTML = '<p style="text-align: center; color: #9ca3af; font-size: 14px; margin: 8px 0;">No reminders yet</p>';
        return;
      }


      tasks.sort((a, b) => b[1].createdAt - a[1].createdAt);

      tasks.forEach(([alarmName, task]) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const taskInfo = document.createElement('div');
        taskInfo.innerHTML = `
          <p class="task-name">${escapeHtml(task.name)}</p>
          <p class="task-time">In ${task.time} ${task.unit}</p>
        `;

        const dismissBtn = document.createElement('button');
        dismissBtn.textContent = 'Dismiss';
        dismissBtn.className = 'btn dismiss';
        dismissBtn.addEventListener('click', () => {

          chrome.alarms.clear(alarmName);
          chrome.storage.local.remove(alarmName);


          taskDiv.style.transition = 'opacity 0.3s ease';
          taskDiv.style.opacity = '0';
          setTimeout(() => {
            loadTasks();
          }, 300);
        });

        taskDiv.appendChild(taskInfo);
        taskDiv.appendChild(dismissBtn);
        taskList.appendChild(taskDiv);
      });
    });
  }


  function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      background: #fee2e2;
      color: #991b1b;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      text-align: center;
    `;

    setBtn.parentNode.insertBefore(errorDiv, setBtn);

    setTimeout(() => {
      errorDiv.style.transition = 'opacity 0.3s ease';
      errorDiv.style.opacity = '0';
      setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
  }


  function showSuccess(message) {
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
      background: #d1fae5;
      color: #065f46;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      text-align: center;
    `;

    setBtn.parentNode.insertBefore(successDiv, setBtn);

    setTimeout(() => {
      successDiv.style.transition = 'opacity 0.3s ease';
      successDiv.style.opacity = '0';
      setTimeout(() => successDiv.remove(), 300);
    }, 2000);
  }

    function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
