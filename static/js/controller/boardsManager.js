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
        const newPrivateBoardBtn = document.querySelector('#new-private-board-btn');
        const newPrivateBoardContainer = document.querySelector('#new-private-board-input-container');
        const newPrivateBoardSaveBtn = document.querySelector('#save-new-private-board');
        add_event(newBoardBtn, newBoardContainer)
        add_event(newPrivateBoardBtn, newPrivateBoardContainer)
        await add_event2(newBoardSaveBtn, document.querySelector('#new-board-input'), 'public')
        await add_event2(newPrivateBoardSaveBtn, document.querySelector('#new-private-board-input'), 'private')
    }
};
function add_event(boardBtn, BoardContainer){
    boardBtn.addEventListener('click', () => {
            let newBoardContainerVisibility = BoardContainer.style.display;
            if (newBoardContainerVisibility === "block"){
                BoardContainer.style.display = "none"
            } else {
                BoardContainer.style.display = "block"
            }
        });
}
async function add_event2(BoardSaveBtn, boardName, type){
    BoardSaveBtn.addEventListener('click', () => {
            if (boardName.value) {
                dataHandler.createNewBoard(boardName.value, type)
                window.location.reload();
            }
        })
}

function showHideButtonHandler(clickEvent) {
    const boardId = checkChildren(clickEvent.target);
    cardsManager.loadCards(boardId);
}

function checkChildren(target) {
    if (target.children.length > 0){
        return target.dataset.boardId;
    } else {
        return target.parentElement.dataset.boardId;
    }
}
