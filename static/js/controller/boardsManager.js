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
            domManager.addEventListener(
                `#board-title_${board.id}`,
                'click',
                renameBoard
            )
        }
    },
    creatingNewBoard: async function () {
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
    console.log(board);
    console.log(window.getComputedStyle(board).visibility);
    // if (board.children.length === 0) {

    // }
    if (window.getComputedStyle(board).visibility === "hidden") {
        cardsManager.loadCards(boardId);
        board.style.visibility = "visible";
    }
    else {
        cardsManager.deleteCards(boardId);
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

function renameBoard (board) {
    let text = board.target.innerHTML;
    const boardId = board.target.id;
    board.target.outerHTML = `<input class="board-title" id="input-${boardId}" value="${text}">`
    const input = document.querySelector(`#input-${boardId}`)
    input.addEventListener('keyup', function test(event) {
        if (event.code === "Enter" ) {
            const titleId = board.target.dataset['boardTitleId'];
            const inputText = event.target.value;
            event.target.outerHTML = `<span class="board-title" id="${boardId}">${inputText}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            dataHandler.renameBoard(titleId, inputText);
            boardTitle.addEventListener('click', renameBoard);
        }
    })
}