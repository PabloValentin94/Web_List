// Class:

class Task
{

    id;
    name;
    complete;

    constructor(index, description, status)
    {

        this.id = index;
        this.name = description;
        this.complete = status;

    }

}

// Constants and Variables:

var tasks = [];

// Functions:

function Define_List_Events()
{

    const checkboxes = document.getElementsByClassName("status");

    const descriptions = document.getElementsByClassName("description");

    const removal_buttons = document.getElementsByClassName("removal");

    for(let i = 0; i < tasks.length; i++)
    {

        checkboxes[i].onclick = function() {

            Modify_Task_Status(this.parentElement.querySelector(".id").value);

        }

        descriptions[i].onclick = function() {

            Edit_Task(this.parentElement.querySelector(".id").value);

        }

        removal_buttons[i].onclick = function() {

            Remove_Task(this.parentElement.querySelector(".id").value);

        }

    }

}

function Reload_List()
{

    localStorage.setItem("to_do_list", JSON.stringify(tasks));

    document.getElementById("list").innerHTML = "";

    tasks.forEach(task => {

        document.getElementById("list").innerHTML += `
            <div class="item">

                <input class="id" type="hidden" value="${(task.id)}">

                <input class="status" type="checkbox"${(task.complete) ? " checked" : ""}>

                <p class="description"> ${task.name} </p>

                <button class="removal"> <i class="bx bxs-trash-alt">  </i> </button>

            </div>
        `;

    });

    Define_List_Events();

}

function Add_Task(task_description)
{

    let task_id = 0;

    if(tasks.length > 0)
    {

        tasks.forEach(task => {

            if(task.id > task_id)
            {

                task_id = task.id;

            }

        });

        task_id++;

    }

    tasks.push(new Task(task_id, task_description, false));

    Reload_List();

}

function Edit_Task(id)
{

    const old_name = tasks[id].name;

    tasks[id].name = prompt("Insert the new name for the selected task:", tasks[id].name);

    if(tasks[id].name === null)
    {

        tasks[id].name = old_name;

    }

    else
    {

        Reload_List();

    }

}

function Remove_Task(id)
{

    if(confirm(`Do you really want to remove the task "${tasks[id].name}"?`))
    {

        let new_list = [];

        tasks.forEach(task => {
    
            if(task.id !== parseInt(id, 10))
            {
    
                new_list.push(task);
    
            }
    
        });
    
        tasks = new_list;
    
        Reload_List();

    }

}

function Modify_Task_Status(id)
{

    tasks[id].complete = !tasks[id].complete;

    localStorage.setItem("to_do_list", JSON.stringify(tasks));

}

// Events:

window.onload = function() {

    // localStorage.clear();

    if(localStorage.getItem("to_do_list") !== null)
    {

        tasks = JSON.parse(localStorage.getItem("to_do_list"));

        Reload_List();

    }

}

document.querySelector("form").onsubmit = function(event) {

    event.preventDefault();

    Add_Task((new FormData(event.target)).get("task"));

    document.getElementById("task").value = "";

}