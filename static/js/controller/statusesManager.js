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
        const addCardButtonId = "newCard"+columnId;
        const addCardButton = document.getElementById(addCardButtonId);
        const renameColumnButtonId = "renameColumn"+columnId;
        const renameColumnButton = document.getElementById(renameColumnButtonId);
        const deleteColumnButtonId = "deleteColumn"+columnId;
        const deleteColumnButton = document.getElementById(deleteColumnButtonId);
        addCardButton.addEventListener('click', () => {
            options.classList.remove('show');
            addCard(boardId, columnId);
        });
        renameColumnButton.addEventListener('click', () => {
            options.classList.remove('show');
            columnRenaming(columnId);
        });
        deleteColumnButton.addEventListener('click', () => {
            options.classList.remove('show');
            dataHandler.deleteStatus(columnId);
        });
    });
}


async function columnRenaming(columnId){
    let targetElement = document.querySelector(`.status-title[data-status-id="${columnId}"]`);
    const oldStatus = targetElement.innerText;
    targetElement.innerText = "";

    domManager.addChild(`.status-title[data-status-id="${columnId}"]`, `<input id="new-status-input" value="${oldStatus}" placeholder="${oldStatus}">`);

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
