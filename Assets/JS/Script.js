// Class:

class Task
{

    // Propriedades.

    name;
    complete;

    // Método construtor (É executado para cada objeto desta classe, no momento em que é criado.).

    constructor(description, status)
    {

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

            Modify_Task_Status(parseInt(this.parentElement.querySelector(".index").value, 10));

        }

        // Evento dos nomes.

        descriptions[i].onclick = function() {

            // Função que edita uma tarefa.

            Edit_Task(parseInt(this.parentElement.querySelector(".index").value, 10));

        }

        // Evento dos botões.

        removal_buttons[i].onclick = function() {

            // Função que remove uma tarefa.

            Remove_Task(parseInt(this.parentElement.querySelector(".index").value, 10));

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
        alterações.

    */

    for(let i = 0; i < tasks.length; i++)
    {

        document.getElementById("list").innerHTML += `
            <div class="item">

                <input class="index" type="hidden" value="${i}">

                <input class="status" type="checkbox"${(tasks[i].complete) ? " checked" : ""}>

                <p class="description"> ${(tasks[i].complete) ? tasks[i].name.strike() : tasks[i].name} </p>

                <button class="removal"> <i class="bx bxs-trash-alt">  </i> </button>

            </div>
        `;
        
    }

    /*

        Redefinindo os eventos dos itens presentes na listagem, pois, como a listagem foi apagada e refeita, seus eventos 
        também precisam ser redefinidos.

    */

    Define_List_Events();

}

function Add_Task(task_description)
{

    // Adicionando uma nova tarefa ao Array de controle da página.

    tasks.push(new Task(task_description, false));

    // Atualizando a lista de tarefas.

    Reload_List();

}

function Edit_Task(index)
{

    // Salvando o nome atual da tarefa selecionada para que ele possa ser reutilizado, se necessário.

    const old_name = tasks[index].name;

    // Alterando o nome da tarefa selecionada, com base no que o usuário digitou.

    tasks[index].name = prompt("Insert the new name for the selected task:", old_name); 

    /*

        Removendo possíveis espaços em branco ao redor do texto informado. Caso esse texto seja composto apenas por 
        espaços em branco, o retorno é uma string vazia.

    */

    tasks[index].name = (typeof tasks[index].name === "string") ? tasks[index].name.trim() : null;

    // Verificando se o usuário realmente preencheu a propriedade com um valor aceitável.

    if(tasks[index].name === null || tasks[index].name === "")
    {

        // Redefinindo o valor da propriedade.

        tasks[index].name = old_name;

    }

    else
    {

        // Atualizando a lista de tarefas.

        Reload_List();

    }

}

function Remove_Task(index)
{

    // Exibindo uma mensagem de confirmação que pergunta ao usuário se ele realmente deseja excluir a tarefa selecionada.

    if(confirm(`Do you really want to remove the task "${tasks[index].name}"?`))
    {

        // Array de controle da estrutura de repetição a seguir.

        let new_list = [];

        /*

            O trecho de código abaixo adiciona todas as tarefas, exceto a que tem o mesmo índice de Array da tarefa selecionada, 
            dentro da variável acima. O valor dessa variável irá então sobrescrever o valor do Array de controle da página.

        */

        for(let i = 0; i < tasks.length; i++)
        {

            if(i !== index)
            {
    
                new_list.push(tasks[i]);
    
            }

        }

        // Alterando o valor do Array de controle da página.
    
        tasks = new_list;

        // Atualizando a lista de tarefas.
    
        Reload_List();

    }

}

function Modify_Task_Status(index)
{

    // Alterando o status de conclusão da tarefa selecionada.

    tasks[index].complete = !tasks[index].complete;

    // Atualizando a lista de tarefas.

    Reload_List();

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

    // Obtendo o valor da variável do formulário.

    const value = (new FormData(event.target)).get("task").trim();

    // Verificando se o valor da variável do formulário não possui apenas espaços em branco.

    if(value !== "")
    {

        // Função que adiciona uma tarefa.

        Add_Task(value);

    }

    else
    {

        // Exibindo um aviso ao usuário.

        alert("Insira uma descrição válida para continuar.");

    }

    // Limpando o campo do formulário.

    document.getElementById("task").value = "";

}