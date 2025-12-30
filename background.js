chrome.runtime.onInstalled.addListener(() => {
    console.log("My Reminder extension installed successfully!");

    chrome.notifications.create('test-notification', {
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Reminder Extension Ready!',
        message: '',
        priority: 2
    }, (notificationId) => {
        if (chrome.runtime.lastError) {
            console.error('Notification error:', chrome.runtime.lastError);
        } else {
            console.log('Test notification created:', notificationId);
            setTimeout(() => {
                chrome.notifications.clear(notificationId);
            }, 3000);
        }
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm.name);

    chrome.storage.local.get([alarm.name], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Storage error:', chrome.runtime.lastError);
            return;
        }

        const task = result[alarm.name];

        if (task) {
            console.log('Creating notification for task:', task.name);

            chrome.notifications.create(alarm.name, {
                type: 'basic',
                iconUrl: 'icon128.png',
                title: 'Reminder!',
                message: task.name,
                priority: 2,
                requireInteraction: true
            }, (notificationId) => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to create notification:', chrome.runtime.lastError);
                } else {
                    console.log('Notification created successfully:', notificationId);
                }
            });

            chrome.storage.local.remove(alarm.name, () => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to remove task:', chrome.runtime.lastError);
                } else {
                    console.log('Task removed from storage:', alarm.name);
                }
            });
        } else {
            console.warn('No task found for alarm:', alarm.name);
        }
    });
});

chrome.notifications.onClicked.addListener((notificationId) => {
    console.log('Notification clicked:', notificationId);
    chrome.notifications.clear(notificationId);
});

chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    console.log('Notification closed:', notificationId, 'by user:', byUser);
});

chrome.alarms.create('keep-alive', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keep-alive') {
        console.log('Service worker keep-alive ping');
    }
});
