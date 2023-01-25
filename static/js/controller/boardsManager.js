import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        const statuses = await dataHandler.getStatuses();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board, statuses);
            const content = boardBuilder(board, statuses);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.board-toggle[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
    listenerNewBoard: async function () {
        const newBoardBtn = document.querySelector('#new-board-btn');
        const newBoardContainer = document.querySelector('#new-board-input-container');
        const newBoardSaveBtn = document.querySelector('#save-new-board');
        newBoardBtn.addEventListener('click', () => {
            let newBoardContainerVisibility = newBoardContainer.style.display;
            if (newBoardContainerVisibility === "block"){
                newBoardContainer.style.display = "none"
            } else {
                newBoardContainer.style.display = "block"
            }
        });
        newBoardSaveBtn.addEventListener('click', () => {
            const boardName = document.querySelector('#new-board-input');
            if (boardName.value) {
                dataHandler.createNewBoard(boardName.value)
                window.location.reload();
            }
        })
    }
};

function showHideButtonHandler(clickEvent) {
    const boardId = checkChildren(clickEvent.target);
    let board = document.getElementById(boardId);
    // if (board.children.length === 0) {
        cardsManager.loadCards(boardId);
    // }
    if (window.getComputedStyle(board).visibility === "hidden") {

        board.style.visibility = "visible";
    }
    else {
        board.style.visibility = "hidden";
    }

}

function checkChildren(target) {
    if (target.children.length > 0){
        return target.dataset.boardId;
    } else {
        return target.parentElement.dataset.boardId;
    }
}
