import {addCard} from "./cardsManager.js";

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
        const addCardButtonId = "newCard"+boardId+columnId;
        const addCardButton = document.getElementById(addCardButtonId);
        addCardButton.addEventListener('click', () => {
            options.classList.remove('show');
            addCard(boardId, columnId);
        });
    });
}