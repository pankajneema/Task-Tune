document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const taskList = document.getElementById('taskList');
    const newTaskInput = document.getElementById('newTaskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const elapsedTimeDisplay = document.getElementById('elapsedTimeDisplay');
    const total_task_count  =document.getElementById('total_task_count');
  
    let timerInterval;
    let timeLeft = 25 * 60;

 


    // Fetch and display the elapsed time since Chrome was opened
    chrome.storage.local.get('loginTime', (data) => {
        const loginTime = new Date(data.loginTime);
        updateElapsedTimeDisplay(loginTime);
        setInterval(() => updateElapsedTimeDisplay(loginTime), 1000); // Update every second
      });
   
    // Retrieve total_aline_task from Chrome storage
      // This is a global variable
    var  total_aline_task = 0;
        // Function to get total_aline_task value from Chrome storage
    function getTotalAlineTask(callback) {
      chrome.storage.sync.get('total_aline_task', function(result) {
          var taskValue = result['total_aline_task'];
          callback(taskValue);
      });
    }

    // Usage of the callback
    getTotalAlineTask(function(taskValue) {
      // Update total_aline_task with the retrieved value
      if (taskValue !== undefined) {
          total_aline_task = taskValue;
          console.log('Value of total_aline_task:', total_aline_task);
      }

      // Here you can perform operations dependent on total_aline_task
      console.log('Outside callback, updated value:', total_aline_task);


      // PANKAJ 1 HAI 

      console.log(total_aline_task); 
      total_task_count.textContent = `${total_aline_task}`;
      
      // Retrieve task list data from Chrome storage
      if (typeof total_aline_task === 'number' && total_aline_task > 0) {
        for (var i = 1; i <= total_aline_task; i++) {
            (function(i) {
                var storageKey = 'task_' + i;
                console.log("storageKey", storageKey);
                chrome.storage.sync.get(storageKey, function(result) {
                    var taskData = result[storageKey];
                    if (taskData) {
                        // Create elements to display task information
                        var li = document.createElement('li');
                        var serialSpan = document.createElement('span');
                        var taskNameSpan = document.createElement('span');
                        var dueDateSpan = document.createElement('span');
    
                        // Set text content for spans
                        serialSpan.textContent = i; // Display the correct serial number
                        taskNameSpan.textContent = taskData.name;
                        dueDateSpan.textContent = taskData.dueDate;
    
                        // Append spans to list item
                        li.appendChild(serialSpan);
                        li.appendChild(taskNameSpan);
                        li.appendChild(dueDateSpan);
                        
                        // Append list item to taskList (assuming taskList is defined)
                        taskList.appendChild(li);
                        console.log('Task data retrieved from Chrome storage and displayed');
                    } else {
                        console.log('No task data found for key:', storageKey);
                    }
                });
            })(i);
        }
    }
    
  
      // Retrieve data from Chrome storage
      
  
    
      if (total_aline_task == 0){
        taskContainer.style.display = "none";
      }
      addTaskButton.addEventListener('click', function() {
        total_aline_task += 1;
        if (total_aline_task > 5){
          alert("Limit Reach , Max 5 Task")
          return;
        }
        addTask(newTaskInput.value,taskDueDate.value);
        taskContainer.style.display = "";
        total_task_count.textContent = `${total_aline_task}`;
          chrome.storage.sync.set({ "total_aline_task": total_aline_task }, function() {
            console.log('total_aline_task saved to Chrome storage',total_aline_task);
        });
        // newTaskInput.value = '';
  
      });
    
      function startTimer() {
        timerInterval = setInterval(function() {
          timeLeft--;
          updateTimerDisplay();
    
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            chrome.runtime.sendMessage({ action: 'startBreakInterval', duration: 5 });
          }
        }, 1000);
      }
    
      function stopTimer() {
        clearInterval(timerInterval);
      }
    
      function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.querySelector('#timer h2').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      }
    
      function addTask(task,taskDueDate) {
        if (!taskDueDate){
          alert("Please Mention Due Date.");
        }
        if (task && taskDueDate) {
        
  
        // Create an object with task data
        var taskData = {
            name: task,
            dueDate: taskDueDate
        };
  
        // Construct key for storage
        var storageKey = 'task_' + total_aline_task;
  
        // Store data in Chrome storage
        chrome.storage.sync.set({ [storageKey]: taskData }, function() {
            
            console.log('Task data stored:', taskData);

            // Set alarm for this task
            var alarmName = 'task_alarm_' + total_aline_task;
            var dueDateTime = new Date(taskData.dueDate).getTime();
            console.log(dueDateTime);
            chrome.alarms.create(alarmName, { when: dueDateTime });
            console.log('Alarm set for task:', storageKey);
            console.log('Task data saved to Chrome storage');
            
            // Now retrieve data and display
            chrome.storage.sync.get(storageKey, function(result) {
                var taskData = result[storageKey];
                if (taskData) {
                    // Create elements to display task information
                    var li = document.createElement('li');
                    var serialSpan = document.createElement('span');
                    var taskNameSpan = document.createElement('span');
                    var dueDateSpan = document.createElement('span');
  
                    // Set text content for spans
                    serialSpan.textContent = total_aline_task;
                    taskNameSpan.textContent = taskData.name;
                    dueDateSpan.textContent = taskData.dueDate;
  
                    // Append spans to list item
                    li.appendChild(serialSpan);
                    li.appendChild(taskNameSpan);
                    li.appendChild(dueDateSpan);
  
                    // Append list item to taskList (assuming taskList is defined)
                    taskList.appendChild(li);
  
                    // Clear input field (assuming newTaskInput is defined)
                    newTaskInput.value = '';
  
                    console.log('Task data retrieved from Chrome storage and displayed');
                } else {
                    console.log('Task data not found in Chrome storage');
                }
            });
        });
        }
      }

      // PANKAJ END HAI 
    });
    
    
  
    function updateElapsedTimeDisplay(loginTime) {
      const now = new Date();
      const elapsedMilliseconds = now - loginTime;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      const hours = Math.floor(elapsedSeconds / 3600);
      const minutes = Math.floor((elapsedSeconds % 3600) / 60);
      const seconds = elapsedSeconds % 60;
      elapsedTimeDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }
  });
  