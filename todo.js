const todoInput = document.getElementById("todo-input");

const todolistElement = document.getElementById("todos-list");
const prioritySelect = document.getElementById("priority-select");
const dateInput =  document.getElementById("duedate");
const categoryFilter = document.getElementById("category-filter");


let todos = JSON.parse(localStorage.getItem('todos') )|| [];
let editId =-1;

// if(todos.length===0){
// fetch("https://jsonplaceholder.typicode.com/todos")
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error('Network response was not OK');
//     }
//     return response.json();
//   })
//   .then((data) => {
//     // Process the received data
    
//     data.forEach((dat) => {
//       todos.push({
//         value: dat.title,
//         color: "#" + Math.floor(Math.random() * 16777215).toString(16),
//         checked: false,
        
//       });
//     });
//     // , console.log(data.length)
//     console.log(todos.length);
//     renderTodos();
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch request
//     console.log('Error:', error.message);
//   });
// }
//First render as we might have already exisiting todos in storage
renderTodos();

function addTodo() {
  const todoValue = todoInput.value;
  const dateValue = dateInput.value;
  const priorityValue = prioritySelect.value;

  //check if todo is empty
  const isEmpty = todoValue === "" ||dateValue==="" || priorityValue==="" ||categoryFilter.value==="";

  //check for duplicate
  const isDuplicate = todos.some(
    (todo) => {
      todo.value.toUpperCase() === todoValue.toUpperCase() && todo.date === dateValue && priorityValue === todo.priority && categoryFilter.value===todo.category;

    }
  );

  if (isEmpty) {
    alert("Please enter all input fields");
  } else if (isDuplicate) {
    alert("entry already exists");
  } else {
    if(editId>=0){
         todos = todos.map((todo,index)=>{
                return{
                    value:index===editId?todoValue:todo.value,
                    color:todo.color,
                    checked:todo.checked,
                    date:index===editId?dateValue:todo.date,
                    priority: index === editId ? priorityValue : todo.priority, // Update priority
                    category: index === editId ? categoryFilter.value : todo.category,
                    
                }
            }
          );
          editId=-1;
        }
    else{
        todos.push( {
            value: todoValue,
            checked: false,
            color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            date:dateValue,
            priority:priorityValue,
            category:categoryFilter.value,
            
          });
        
    }
    todoInput.value = "";
    categoryFilter.value="";
    dateInput.value = "";
    prioritySelect.value = "low";
    
  }
  logActivity("Add", `Added task "${todoValue}"`);
}

//added eventlisteners to filters
document.getElementById("filter-priority-select").addEventListener("change", applyFilters);
document.getElementById("filter-duedate").addEventListener("change", applyFilters);
document.getElementById("filter-category").addEventListener("input", applyFilters);

// Function to filter todos based on the filter options
function applyFilters() {
  const priorityValue = document.getElementById("filter-priority-select").value;
  const dateValue = document.getElementById("filter-duedate").value;
  const categoryValue = document.getElementById("filter-category").value.trim().toLowerCase();
  const sortBy = document.getElementById("sort-by").value;

  const filteredTodos = todos.filter((todo) => {
    const isPriorityMatch = priorityValue === "all" || todo.priority === priorityValue;
    const isDateMatch = dateValue === "" || todo.date === dateValue;
    const isCategoryMatch = categoryValue === "" || todo.category.toLowerCase().includes(categoryValue);

    return isPriorityMatch && isDateMatch && isCategoryMatch;
  });

  const sortedTodos = sortTodos(filteredTodos, sortBy); 
  renderFilteredTodos(sortedTodos);
}

function renderFilteredTodos(filteredTodos) {
  todolistElement.innerHTML = "";

  filteredTodos.forEach((todo, index) => {
    todolistElement.innerHTML += `
      <div class="todo" id="${index}" draggable="true">
        <i class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}" style="color:${todo.color}" data-action="check"></i>
        <span class="${todo.checked ? "checked" : ""}" data-action="check">${todo.value}</span>
        <span class="${todo.checked ? "checked" : ""}">${todo.date}</span> 
        <span class="priority ${todo.checked ? "checked" : ""}">Priority:${todo.priority}</span>
        <span class="priority ${todo.checked ? "checked" : ""}">Category:${todo.category}</span>
        <i class="bi bi-pencil-square" data-action="edit"></i>
        <i class="bi bi-trash" data-action="delete"></i>
      </div>
    `;
  });
}

function renderTodos() {
  
    if(todos.length===0){
        todolistElement.innerHTML= '<center>Nothing To-Do</center>'
        return;
    }
  //Clear element before a re render

  // todolistElement.innerHTML = "";
  // todos.forEach((todo, index) => {
  //   todolistElement.innerHTML += `
  // <div class ="todo" id =${index}>
  // <i class="bi ${
  //   todo.checked ? "bi-check-circle-fill" : "bi-circle"
  // }" style="color:${todo.color}"  data-action="check"></i>
  // <span class="${ todo.checked ? "checked" : ""} " data-action="check">${todo.value}</span>
  // <span class="${ todo.checked ? "checked" : ""}">${todo.date}</span> 
  // <span class="priority ${ todo.checked ? "checked" : ""}">Priority:${todo.priority}</span>
  // <span class="priority ${ todo.checked ? "checked" : ""}">Category:${todo.category}</span>

  // <i class="bi bi-pencil-square" data-action="edit"></i>
  // <i class="bi bi-trash" data-action="delete"></i>
  // </div>
  // `;
  // });


  if (prioritySelect.value === "all" && dateInput.value === "" && categoryFilter.value.trim() === "") {
    renderAllTodos();
  } else {
    applyFilters();
  }
}

function renderAllTodos(todos) {
  todolistElement.innerHTML = "";

  todos.forEach((todo, index) => {
    todolistElement.innerHTML += `
      <div class="todo" id="${index}" draggable="true">
        <i class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"}" style="color:${todo.color}" data-action="check"></i>
        <span class="${todo.checked ? "checked" : ""}" data-action="check">${todo.value}</span>
        <span class="${todo.checked ? "checked" : ""}">${todo.date}</span> 
        <span class="priority ${todo.checked ? "checked" : ""}">Priority:${todo.priority}</span>
        <span class="priority ${todo.checked ? "checked" : ""}">Category:${todo.category}</span>
        <i class="bi bi-pencil-square" data-action="edit"></i>
        <i class="bi bi-trash" data-action="delete"></i>
      </div>
    `;
  });
}


//CLICK EVENT LISTENER FOR ALL THE TODOS

todolistElement.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;
 
  if(parentElement.className !== 'todo')return;
  
  
  //getting hold if id
  const todo = parentElement;
  const todoId = Number(todo.id);

  //action on clicking respective icons
  const action = target.dataset.action

  action==='check' && checkTodo(todoId)
  action==='edit' && editTodo(todoId)
  action==='delete' && deleteTodo(todoId)



//   console.log(todoId,action);
});

function checkTodo(todoId){
    
   let newArr= todos.map((todo,index)=>{

        if(index===todoId){
            return{
                value:todo.value,
                color:todo.color,
                checked:!todo.checked,
                date: todo.date,
                priority:todo.priority,
                category: todo.category,
            }
        }
        else{
            
                return{
                    value:todo.value,
                    color:todo.color,
                    checked:todo.checked,
                    date:todo.date,
                    priority:todo.priority,
                    category: todo.category,
                }
            
        }
    })

    todos=newArr
    renderTodos();
    localStorage.setItem('todos',JSON.stringify(todos))

    const action = todo.checked ? "Uncheck" : "Check";
    logActivity(action, `Marked task "${todo.value}" as ${action.toLowerCase()}`);
}

function editTodo(todoId){
    
    todoInput.value = todos[todoId].value;
    dateInput.value = todos[todoId].date;
    prioritySelect.value = todos[todoId].priority;
    categoryFilter.value = todos[todoId].category;
    editId = todoId;

    logActivity("Edit", `Edited task "${todos[todoId].value}"`);
}

function deleteTodo(todoId){
    todos = todos.filter((todo,index)=>index!=todoId)

    //initialize editTodo=-1 so that if we delete while editing the same id doesn't get rerendered
    editId=-1
    renderTodos()
    localStorage.setItem('todos',JSON.stringify(todos))
    logActivity("Delete", `Deleted task "${todo.value}"`);
}

submitBtn.addEventListener("click", (e) => {
    // e.preventDefault();
    console.log("working")
    addTodo();
    renderTodos();
    
    localStorage.setItem('todos',JSON.stringify(todos));
  });

  todoInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
      // e.preventDefault();
    console.log("working")
    addTodo();
    renderTodos();
    localStorage.setItem('todos',JSON.stringify(todos));

  }   
});


//sorting
function sortTodos(filteredTodos, sortBy) {
  switch (sortBy) {
    case "duedate":
      return filteredTodos.sort((a, b) => new Date(a.date) - new Date(b.date));
    case "priority":
      return filteredTodos.sort((a, b) => {
        const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    default:
      return filteredTodos;
  }
}

document.getElementById("sort-by").addEventListener("change", function () {
  applyFilters();
});


//activity log


let activityLog = (JSON.parse(localStorage.getItem('activityLog'))|| []).slice(-5);

  // activityLog=activityLog.slice(-5);
activityLog.reverse();

// Function to add an activity log
function logActivity(type, details) {
  const timestamp = new Date().toISOString();
  activityLog.push({ timestamp, type, details });
  localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function displayActivityLogs() {
  
  const activityLogContainer = document.getElementById("activity-log-container");
  
  let logsHTML = "<h4>Activity Logs</h4>";
  
  if (activityLog.length === 0) {
    logsHTML += "<p>No activity logs available.</p>";
  } else {
    logsHTML += "<ul>";
    activityLog.forEach((log) => {
      logsHTML += `<li><strong>${log.timestamp}</strong> - ${log.type}: ${log.details}</li>`;
    });
    logsHTML += "</ul>";
  }

  activityLogContainer.innerHTML = logsHTML;

  let get = document.getElementById("activity-log-container");
setTimeout(() => {
  get.style.display='none';
}, 6000);
}


//activity log
const viewLogsBtn = document.getElementById("view-logs-btn");
viewLogsBtn.addEventListener("click", displayActivityLogs);

//search
function performSearch() {
  const searchTerm = document.getElementById("search-term").value.trim().toLowerCase();
  const searchType = document.getElementById("search-type").value;

  if (searchTerm === "") {
    alert("Please enter a search term.");
    return;
  }

  let searchResults = [];

  if (searchType === "similar") {
    searchResults = todos.filter((todo) => todo.value.toLowerCase().includes(searchTerm));
  } else if (searchType === "partial") {
    searchResults = todos.filter((todo) => todo.value.toLowerCase().indexOf(searchTerm) !== -1);
  }

  renderAllTodos(searchResults);
}

const searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", performSearch);


//backlog
function renderBacklogs() {
  console.log("bl")
  const backlogs = getBacklogs();

  if (backlogs.length === 0) {
    todolistElement.innerHTML = '<center>No Backlogs</center>';
    return;
  }

  todolistElement.innerHTML = "";
  backlogs.forEach((backlog, index) => {
    todolistElement.innerHTML += `
      <div class="todo backlog" id=${index}>
        <i class="bi bi-circle" style="color:${backlog.color}" data-action="check"></i>
        <span data-action="check">${backlog.value}</span>
        <span>${backlog.date}</span>
        <span class="priority">Priority:${backlog.priority}</span>
        <span class="category">Category:${backlog.category}</span>
        <i class="bi bi-pencil-square" data-action="edit"></i>
        <i class="bi bi-trash" data-action="delete"></i>
      </div>
    `;
  });
}

function getBacklogs() {
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  const backlogs = todos.filter((todo) => {
    const dueDate = new Date(todo.date).toISOString().slice(0, 10);
    return !todo.checked && dueDate <= today;
  });

  return backlogs;
}




// Add event listeners to handle drag and drop operations
const todosList = document.getElementById("todos-list");

todosList.addEventListener("dragstart", handleDragStart);

todosList.addEventListener("dragover", handleDragOver);
todosList.addEventListener("dragenter", handleDragEnter);
todosList.addEventListener("dragleave", handleDragLeave);
todosList.addEventListener("drop", handleDrop);

let dragItemId = null;
let dropTarget = null;

function handleDragStart(event) {
  console.log('dragging')
  dragItemId = event.target.id;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", ""); // Use a custom data type (text/plain) and set an empty value
  event.dataTransfer.setDragImage(new Image(), 0, 0);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDragEnter(event) {
  event.preventDefault();
  const target = event.target.closest(".todo");
  if(target===null)return;
  dropTarget = target;
  target.classList.add("drop-target");
}

function handleDragLeave(event) {
  event.preventDefault();
  const target = event.target.closest(".todo");
  if (target === dropTarget) {
    dropTarget.classList.remove("drop-target");
    dropTarget = null;
  }
}

function handleDrop(event) {
  event.preventDefault();
  const target = event.target.closest(".todo");
  if (target === dropTarget) {
    const draggedItem = document.getElementById(dragItemId);
    target.parentNode.insertBefore(draggedItem, target);
    dropTarget.classList.remove("drop-target");
  }
}






