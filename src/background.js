// src/background.js

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['loginTime'], (result) => {
      if (!result.loginTime) {
        const loginTime = new Date();
        chrome.storage.local.set({ loginTime: loginTime.getTime() }); // Save login time as milliseconds
      }
    });
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    const loginTime = new Date();
    chrome.storage.local.set({ loginTime: loginTime.getTime() }); // Save login time as milliseconds
  });
  
  // chrome.alarms.onAlarm.addListener((alarm) => {
  //   if (alarm.name === 'workInterval') {
  //     chrome.notifications.create({
  //       type: 'basic',
  //       iconUrl: 'public/img/icon48.png',
  //       title: 'Time to take a break!',
  //       message: 'Your work interval is over. Take a short break.'
  //     });
  //   } else if (alarm.name === 'breakInterval') {
  //     chrome.notifications.create({
  //       type: 'basic',
  //       iconUrl: 'public/img/icon48.png',
  //       title: 'Break is over!',
  //       message: 'Time to get back to work.'
  //     });
  //   }
  // });
  
  // function startWorkInterval(duration) {
  //   chrome.alarms.create('workInterval', { delayInMinutes: duration });
  // }
  
  // function startBreakInterval(duration) {
  //   chrome.alarms.create('breakInterval', { delayInMinutes: duration });
  // }
  


// Function to handle alarm events
function handleAlarm(alarm) {
  console.log('Alarm fired:', alarm);

  // Extract task index from alarm name
  var alarmNameParts = alarm.name.split('_');
  var taskIndex = parseInt(alarmNameParts[1]); // Adjust to correct index extraction

  // Retrieve task data from Chrome storage based on task index
  var storageKey = 'task_' + taskIndex;
  chrome.storage.sync.get(storageKey, function(result) {
      var taskData = result[storageKey];
      if (taskData) {
          // Perform actions based on taskData when alarm fires
          console.log('Task alarm fired for:', taskData.name);

          // Example: Show notification or perform specific action
          chrome.notifications.create({
              type: 'basic',
              iconUrl: 'public/img/bell.png',
              title: 'Task Alarm',
              message: `Alarm fired for task "${taskData.name}"`
          });
      } else {
          console.log('Task data not found for:', storageKey);
      }
  });
}

// Add listener for alarm events
chrome.alarms.onAlarm.addListener(handleAlarm);

// Initial check when extension starts (in case due dates have already passed)
checkDueDates();

// Debugging: Log the current alarms set
chrome.alarms.getAll(function(alarms) {
  console.log('All alarms:', alarms);
});
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== 'install') {
    console.log("HIIIIIIIIIIIIIIIIIIIIi");
    return;
  }

  // Create an alarm so we have something to look at in the demo
  await chrome.alarms.create('demo-default-alarm', {
    delayInMinutes: 1,
    periodInMinutes: 1
  });
});