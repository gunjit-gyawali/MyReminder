 Task Reminder - Chrome Extension
A simple, efficient Chrome extension that helps you stay on top of your tasks with customizable reminders and notifications.

Features
- Quick Task Creation**: Set tasks with custom titles and descriptions
- Flexible Timing**: Choose reminder times from minutes to hours
- Desktop Notifications**: Get notified even when Chrome is minimized
- Task Management**: View, edit, and delete upcoming reminders
- Persistent Storage**: Your reminders are saved locally and persist across sessions
- Clean Interface**: Minimalist design focused on usability
- Sound Alerts**: Optional audio notification when reminders trigger
- Snooze Option**: Postpone reminders for later

Installation

Step 1: Prepare the Extension
1. Download or clone this extension folder to your computer

Step 2: Load in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable Developer mode (toggle in the top-right corner)
3. Click Load unpacked
4. Select the `chrome-extension` folder
5. The extension icon should appear in your toolbar

Usage

Creating a Reminder
1. Click the extension icon in your toolbar
2. Enter your task title (e.g., "Team meeting")
3. Add an optional description for more details
4. Set the reminder time:
   - Use the time picker for hours and minutes
   - Or select a preset (5 min, 15 min, 30 min, 1 hour)
5. Click "Set Reminder"

Managing Reminders
View Active Reminders: All upcoming reminders are listed in the popup with:
- Task title and description
- Time remaining until notification
- Quick delete button

  **Important Note: Make Sure to to keep Chrome open to get notifications.**

File Structure

MyReminder/
├── manifest.json
├── background.js
├── popup.html
├──popup.css
|── popup.js
├── icon16.png
├── icon32.png
├── icon48.png
|── icon128.png
└── README.md

How It Works

Alarm System
The extension uses Chrome's `chrome.alarms` API to:
- Schedule reminders accurately
- Run in the background even when popup is closed
- Trigger at the exact time you specified
- Persist across browser restarts

Notification System
Desktop notifications are created using `chrome.notifications` API:
- Rich notifications with title, message, and icon
- Action buttons for quick responses
- Persistent until user interacts
- Works even when Chrome is minimized

Data Storage
All reminder data is stored locally using `chrome.storage.local`:
- Task details (title, description, time)
- No data leaves your browser

Privacy
-  100% Local: All data stored on your device
-  No Tracking: Zero analytics or data collection
-  Open Source: Review the code yourself


Styling
Modify the appearance by editing:
- Popup design: popup.css
- Layout: `popup.html`


Troubleshooting

 Reminders not triggering?
1. Ensure Chrome is running (can be minimized)
2. Check that the alarm was set correctly in storage
3. Reload the extension and try again
4. Check browser console for error messages

Popup not opening?
1. Reload the extension in `chrome://extensions/`
2. Check for JavaScript errors in the console
3. Verify all files are present in the folder


 Future Enhancements
Potential features for future versions:
-  Recurring reminders (daily, weekly, monthly)
-  Categories and color-coding
-  Task completion statistics
-  Integration with calendar apps
-  Optional cloud sync
-  Mobile companion app

Contributing
Feel free to fork, modify, and improve this extension!
- Report bugs via GitHub issues
- Submit pull requests for new features
- Share your customizations
