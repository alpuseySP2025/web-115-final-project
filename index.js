// Realistically, this should be done by adding/removing css classes, not using style strings
const importantStyle = "font-weight: bold; background-color: rgb(207, 75, 31);";
const completeStyle = "text-decoration: line-through";

// Contains object representations of all tasks
const tasks = [];

// An ID that is incremented for each task
let nextId = 0;


function onFormSubmit(event) {
    // Prevent page from refreshing
    event.preventDefault();

    // Grab form values. Task names are required in the html
    const name = event.target["name"].value;
    const priority = event.target["priority"].value;
    const important = event.target["important"].checked;

    // Add the task
    addTask(name, priority, important);

    // Clear values
    event.target.reset();
}

// Add submission handler
const form = document.getElementById("addTask");
form.addEventListener("submit", onFormSubmit);

// Utility for finding a task by its ID
function findTaskIndex(id) {
    return tasks.findIndex(t => t.id === id);
}

function addTask(name, priority, isImportant) {
    const addedDate = new Date();
    const id = nextId;
    nextId++;

    // Create and store task object
    tasks.push({
        id,
        name,
        priority,
        isImportant,
        isComplete: false,
        date: addedDate,
    });

    const parent = document.getElementById("taskmanager");

    // Create task element
    const taskElement = document.createElement("div");
    taskElement.className = "taskContainer flex splitSides";
    if (isImportant) {
        taskElement.style = importantStyle;
    }

    taskElement.id = `task${id}`;
    
    // Create a place to put info
    const taskInfo = document.createElement("div");
    taskElement.appendChild(taskInfo);

    // Set up task name with label
    const taskName = document.createElement("p");
    const taskLabel = isImportant ? "Task (IMPORTANT)" : "Task";
    taskName.innerHTML = `<b>${taskLabel}:</b> ${name}`;
    taskInfo.appendChild(taskName);
    
    // Set up task priority with label
    const taskPriority = document.createElement("p");
    taskPriority.innerHTML = `<b>Priority:</b> ${priority}`;
    taskInfo.appendChild(taskPriority);

    // Set up task date with label
    const taskDate = document.createElement("p");
    taskDate.innerHTML = `<b>Created On:</b> ${addedDate.toDateString()}`;
    taskInfo.appendChild(taskDate);

    // Create a place to put actions
    const taskActions = document.createElement("div");
    taskElement.appendChild(taskActions);
    
    // Set up checkbox for marking task complete
    const markComplete = document.createElement("div");
    const checkbox = `<input type="checkbox" id="completed${id}" onchange="markTask(${id})">`;

    markComplete.innerHTML = `<label for="completed${id}">Completed</label>${checkbox}`;

    taskActions.appendChild(markComplete);

    // Set up button to delete task
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteButton";
    deleteBtn.innerHTML = "Delete";
    deleteBtn.setAttribute("onclick", `deleteTask(${id})`);

    taskActions.appendChild(deleteBtn);

    // Disable no task blurb if needed
    if (tasks.length == 1) {
        const blurb = document.getElementById("blurb");
        blurb.hidden = true;
    }

    // Add to the task list.
    // Why are we still using innerHTML and craeting html manually at this point in the course?
    // It's such an unreliable way to set content, as it's incredibly prone to syntax errors and can't transfer event listeners.
    // Why not have us use nodes and appendChild?
    parent.innerHTML += taskElement.outerHTML;

    // Print all the tasks
    printTasks();
}

function deleteTask(id) {
    // Find the task object to remove
    const index = tasks.findIndex(t => t.id === id);
    if (index != -1) {
        tasks.splice(index, 1);
    } else {
        // Task not found, display an error
        console.log(`Unable to find task ${id}`);
    }
    
    // Remove the element from the list
    const element = document.getElementById(`task${id}`);
    if (element) {
        element.parentElement.removeChild(element);
    }
    
    // Enable no task blurb if needed
    if (tasks.length == 0) {
        const blurb = document.getElementById("blurb");
        blurb.hidden = false;
    }

    // Display all remaining tasks
    printTasks();
}

function markTask(id) {
    // Find the task to change the completion status of
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Toggle completion status and display all tasks
    task.isComplete = !task.isComplete;
    printTasks();

    // Determine which initial style to use, then add strikethrough if completed
    let style = task.isImportant ? importantStyle : "";
    if (task.isComplete) {
        style += completeStyle;
    }

    // Set the element style 
    const element = document.getElementById(`task${id}`);
    if (element) {
        element.style = style;
    }

}

function printTasks() {
    // Print all tasks to the console
    console.log(JSON.stringify(tasks, null, 2));
}