import {addCard} from "./cardsManager.js";
import {dataHandler} from "../data/dataHandler.js";
import {domManager} from "../view/domManager.js";

export async function initDropdown() {
    let hamburgerButtons = document.querySelectorAll('.hamburger-btn');
    let optionMenus = document.querySelectorAll('.options-menu');
    hamburgerButtons.forEach(button => {
        let buttonId = button.id;
        const columnId = button.dataset.statusId;
        let options = document.getElementById("btn-options-"+columnId);
        button.addEventListener('click', () => {
            optionMenus.forEach(currentOptions => {
                if(currentOptions!==options) {
                    currentOptions.classList.remove('show');
                }
            });
            options.classList.toggle('show');
        });
        const boardId = buttonId.slice(4);
        getActionButton("newCard", columnId).addEventListener('click', () => {
            options.classList.remove('show');
            addCard(boardId, columnId);
        });
        getActionButton("renameColumn", columnId).addEventListener('click', () => {
            options.classList.remove('show');
            columnRenaming(columnId);
        });
        getActionButton("deleteColumn", columnId).addEventListener('click', () => {
            options.classList.remove('show');
            statusRemoval(columnId);
        });
    });
}

function getActionButton(actionName, columnId){
    return document.getElementById(actionName+columnId);
}

async function columnRenaming(columnId){
    let targetElement = document.querySelector(`.status-title[data-status-id="${columnId}"]`);
    const oldStatus = targetElement.innerText;
    targetElement.innerText = "";
    domManager.addChild(`.status-title[data-status-id="${columnId}"]`,
        `<input id="new-status-input" value="${oldStatus}" placeholder="${oldStatus}">`);
    const inputElement = document.getElementById("new-status-input");
    function handleColumnRename(){
        if (inputElement.value) {
            const newStatus = inputElement.value;
            targetElement.innerText = newStatus;
            dataHandler.renameStatus(columnId, newStatus);
        }
        else {
            targetElement.innerText = oldStatus;
        }
        document.getElementById("new-status-input").remove();
    }
    inputElement.addEventListener("blur", handleColumnRename);
    inputElement.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            handleColumnRename();
        }
    });
    inputElement.focus();
}

async function statusRemoval(columnId){
    await dataHandler.deleteStatus(columnId);
    let targetElement = document.querySelector(`.board-column[data-status-id="${columnId}"]`);
    targetElement.innerHTML = "";
    targetElement.remove();

}