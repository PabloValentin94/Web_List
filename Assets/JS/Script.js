// Class:

class Task
{

    // Propriedades.

    id;
    name;
    complete;

    // Método construtor (É executado para cada objeto desta classe, no momento em que é criado.).

    constructor(index, description, status)
    {

        this.id = index;
        this.name = description;
        this.complete = status;

    }

}

// Constants and Variables:

var tasks = []; // Array de controle da página.

// Functions:

function Define_List_Events()
{

    // Obtendo todas as caixas de seleção da lista de tarefas.

    const checkboxes = document.getElementsByClassName("status");

    // Obtendo os nomes de todas as tarefas inseridas na lista de tarefas.

    const descriptions = document.getElementsByClassName("description");

    // Obtendo todos os botões que removem alguma tarefa da lista de tarefas.

    const removal_buttons = document.getElementsByClassName("removal");

    // Definindo o que deve ocorrer, para cada tipo de elemento, quando o usuário clicar sobre ele.

    for(let i = 0; i < tasks.length; i++)
    {

        // Evento das caixas de seleção.

        checkboxes[i].onclick = function() {

            // Função que define o estado de uma caixa de seleção (Marcada ou desmarcada.).

            Modify_Task_Status(this.parentElement.querySelector(".id").value);

        }

        // Evento dos nomes.

        descriptions[i].onclick = function() {

            // Função que edita uma tarefa.

            Edit_Task(this.parentElement.querySelector(".id").value);

        }

        // Evento dos botões.

        removal_buttons[i].onclick = function() {

            // Função que remove uma tarefa.

            Remove_Task(this.parentElement.querySelector(".id").value);

        }

        /*

            O parâmetro dessas três funções acima segue a mesma lógica. O elemento que aciona o evento irá acessar seu 
            elemento pai, e, a partir dele, obter o valor de outro elemento, que, nesses casos, é um input ocultado 
            (Está no código HTML, mas não é exibido ao usuário.).

        */

    }

}

function Reload_List()
{

    // Atualizando o valor do item salvo no Local Storage.

    localStorage.setItem("to_do_list", JSON.stringify(tasks));

    // Apagando todo o conteúdo exibido ao usuário na lista de tarefas.

    document.getElementById("list").innerHTML = "";

    /*
    
        Adicionando as tarefas, uma por uma, na lista de tarefas da página. É preciso fazer isso pois o valor do item 
        salvo no Local Storage foi alterado, o que implica que a listagem precisa ser atualizada, pois podem haver novas 
        mudanças.

    */

    tasks.forEach(task => {

        document.getElementById("list").innerHTML += `
            <div class="item">

                <input class="id" type="hidden" value="${task.id}">

                <input class="status" type="checkbox"${(task.complete) ? " checked" : ""}>

                <p class="description"> ${task.name} </p>

                <button class="removal"> <i class="bx bxs-trash-alt">  </i> </button>

            </div>
        `;

    });

    /*

        Redefinindo os eventos dos itens presentes na listagem, pois, como a listagem foi apagada e refeita, seus eventos 
        também precisam ser redefinidos.

    */

    Define_List_Events();

}

function Add_Task(task_description)
{

    // Variável que será usada para definir o ID da próxima tarefa criada.

    let task_id = 0;

    /*

        O trecho de código abaixo obtém o ID de maior valor presente no Array de controle da página e então o salva na variável acima. 
        Essa variável então tem seu valor aumentado em uma unidade, garantindo que o ID da próxima tarefa criada sempre será o maior 
        existente dentro do Array de controle.

    */

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

    // Adicionando uma nova tarefa ao Array de controle da página.

    tasks.push(new Task(task_id, task_description, false));

    // Atualizando a lista de tarefas.

    Reload_List();

}

function Edit_Task(id)
{

    // Salvando o valor atual da tarefa selecionada para que ele possa ser reutilizado, caso o usuário não preencha nada a seguir.

    const old_name = tasks[id].name;

    // Alterando o nome da tarefa selecionada, com base no que o usuário digitou.

    tasks[id].name = prompt("Insert the new name for the selected task:", tasks[id].name);

    // Verificando se o usuário realmente preencheu a propriedade com um valor aceitável.

    if(tasks[id].name === null)
    {

        // Redefinindo o valor da propriedade.

        tasks[id].name = old_name;

    }

    else
    {

        // Atualizando a lista de tarefas.

        Reload_List();

    }

}

function Remove_Task(id)
{

    // Exibindo uma mensagem de confirmação que pergunta ao usuário se ele realmente deseja excluir a tarefa selecionada.

    if(confirm(`Do you really want to remove the task "${tasks[id].name}"?`))
    {

        // Array de controle da estrutura de repetição a seguir.

        let new_list = [];

        /*

            O trecho de código abaixo adiciona todas as tarefas, exceto a que tem o mesmo ID da tarefa selecionada, dentro da 
            variável acima. O valor dessa variável irá então sobrescrever o valor do Array de controle da página.

        */

        tasks.forEach(task => {
    
            if(task.id !== parseInt(id, 10))
            {
    
                new_list.push(task);
    
            }
    
        });

        // Alterando o valor do Array de controle da página.
    
        tasks = new_list;

        // Atualizando a lista de tarefas.
    
        Reload_List();

    }

}

function Modify_Task_Status(id)
{

    // Alterando o status de conclusão da tarefa selecionada.

    tasks[id].complete = !tasks[id].complete;

    // Atualizando o valor do item salvo no Local Storage.

    localStorage.setItem("to_do_list", JSON.stringify(tasks));

}

// Events:

window.onload = function() {

    // Verificando se o item salvo no Local Storage realmente existe.

    if(localStorage.getItem("to_do_list") !== null)
    {

        /*
        
            Obtendo o valor do item salvo no Local Storage e convertendo de um JSON para um array de objetos JavaScript. Após isso, o 
            retorno da conversão é salvo no Array de controle da página.

        */

        tasks = JSON.parse(localStorage.getItem("to_do_list"));

        // Atualizando a lista de tarefas.

        Reload_List();

    }

}

document.querySelector("form").onsubmit = function(event) {

    // Impedindo que o formulário redirecione para outra página.

    event.preventDefault();

    // Função que adiciona uma tarefa.

    Add_Task((new FormData(event.target)).get("task"));

    // Limpando o campo do formulário.

    document.getElementById("task").value = "";

}