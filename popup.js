document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const timeInput = document.getElementById('timeInput');
  const unitInput = document.getElementById('unitInput');
  const setBtn = document.getElementById('setBtn');
  const taskList = document.getElementById('taskList');

  checkNotificationPermissions();
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
    }, () => {
      if (chrome.runtime.lastError) {
        showError('Failed to create reminder: ' + chrome.runtime.lastError.message);
        return;
      }

      const task = {
        name: taskName,
        time: timeValue,
        unit: unit,
        createdAt: Date.now(),
        alarmName: alarmName
      };

      chrome.storage.local.set({ [alarmName]: task }, () => {
        if (chrome.runtime.lastError) {
          showError('Failed to save reminder: ' + chrome.runtime.lastError.message);
          return;
        }

        taskInput.value = '';
        timeInput.value = '10';
        unitInput.value = 'minutes';

        showSuccess('Reminder set!');
        loadTasks();
      });
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
      if (chrome.runtime.lastError) {
        console.error('Failed to load tasks:', chrome.runtime.lastError);
        return;
      }

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
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = `
          <p class="task-name">${escapeHtml(task.name)}</p>
          <p class="task-time">In ${task.time} ${task.unit}</p>
        `;

        const dismissBtn = document.createElement('button');
        dismissBtn.textContent = 'Dismiss';
        dismissBtn.className = 'btn dismiss';
        dismissBtn.addEventListener('click', () => {
          chrome.alarms.clear(alarmName, (wasCleared) => {
            if (chrome.runtime.lastError) {
              console.error('Failed to clear alarm:', chrome.runtime.lastError);
            }
          });
          
          chrome.storage.local.remove(alarmName, () => {
            if (chrome.runtime.lastError) {
              console.error('Failed to remove task:', chrome.runtime.lastError);
            }
          });

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

  function checkNotificationPermissions() {
    chrome.notifications.create('permission-test', {
      type: 'basic',
      iconUrl: 'icon128.png',
      title: '',
      message: '',
      priority: 0
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification permission issue:', chrome.runtime.lastError);
        showWarning('Notifications may not work. Please check your browser settings.');
      } else {
        setTimeout(() => {
          chrome.notifications.clear(notificationId);
        }, 2000);
      }
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

  function showWarning(message) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-message';
    warningDiv.textContent = message;
    warningDiv.style.cssText = `
      background: #fef3c7;
      color: #92400e;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 13px;
      text-align: center;
    `;

    document.body.insertBefore(warningDiv, document.body.firstChild);

    setTimeout(() => {
      warningDiv.style.transition = 'opacity 0.3s ease';
      warningDiv.style.opacity = '0';
      setTimeout(() => warningDiv.remove(), 300);
    }, 5000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
