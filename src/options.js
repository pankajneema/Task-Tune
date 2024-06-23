document.addEventListener('DOMContentLoaded', function() {
    const optionsForm = document.getElementById('optionsForm');
  
    // Load saved options
    chrome.storage.sync.get(['workDuration', 'shortBreakDuration', 'longBreakDuration'], function(data) {
      document.getElementById('workDuration').value = data.workDuration || 25;
      document.getElementById('shortBreakDuration').value = data.shortBreakDuration || 5;
      document.getElementById('longBreakDuration').value = data.longBreakDuration || 15;
    });
  
    // Save options on form submit
    optionsForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const workDuration = document.getElementById('workDuration').value;
      const shortBreakDuration = document.getElementById('shortBreakDuration').value;
      const longBreakDuration = document.getElementById('longBreakDuration').value;
  
      chrome.storage.sync.set({
        workDuration: workDuration,
        shortBreakDuration: shortBreakDuration,
        longBreakDuration: longBreakDuration
      }, function() {
        alert('Options saved!');
      });
    });
  });
  