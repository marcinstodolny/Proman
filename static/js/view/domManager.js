import {addCard} from "../controller/cardsManager.js";

export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertAdjacentHTML("beforeend", childContent);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    addEventListener(parentIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },

};

export function initDropdown() {
    let hamburgerButtons = document.querySelectorAll('.hamburger-btn');
    let optionMenus = document.querySelectorAll('.options-menu');
    hamburgerButtons.forEach(button => {
        let buttonId = button.id;
        let optionsId = "options-menu-"+buttonId;
        let options = document.getElementById(optionsId);
        button.addEventListener('click', () => {
            optionMenus.forEach(currentOptions => {
                if(currentOptions!==options) {
                    currentOptions.classList.remove('show');
                }
            });
            options.classList.toggle('show');
            let boardId = optionsId.slice(-1);
            let columnId = optionsId.slice(-2, -1);
            let addCardButtonId = "newCard"+boardId+columnId;
            let addCardButton = document.getElementById(addCardButtonId);
            addCardButton.addEventListener('click', () => {
                options.classList.remove('show');
                addCard(boardId, columnId);
                window.location.reload();
            });
        });
    });
}