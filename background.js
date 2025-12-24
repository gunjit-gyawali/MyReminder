chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get([alarm.name], (result) => {
        const task = result[alarm.name];

        if (task) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon128.png',
                title: 'Reminder!',
                message: task.name,
                priority: 2
            });

            chrome.storage.local.remove(alarm.name);
        }
    });
});

chrome.notifications.onClicked.addListener((notificationsId) => {
    chrome.notifications.clear(notificationsId);
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("My Reminder extension installed sucessfully!");
});