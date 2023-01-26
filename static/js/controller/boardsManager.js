import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {initDropdown} from "../view/domManager.js";
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
            );
        };
        initDropdown();
    },
    creatingNewBoard: async function () {
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
    let board = document.getElementById(boardId);
    if (board.classList.contains("hide-board")) {
        cardsManager.loadCards(boardId);
        board.classList.remove("hide-board");

    }
    else {
        cardsManager.deleteCards(boardId);
        board.classList.add("hide-board");
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
    const titleId = board.target.dataset['boardTitleId'];
    let text = board.target.innerHTML;
    const boardId = board.target.id;
    board.target.outerHTML = `<input class="board-title" id="input-${boardId}" data-board-title-id="${titleId}" value="${text}">`
    const input = document.querySelector(`#input-${boardId}`)
    input.addEventListener('keyup', function test(event) {
        if (event.code === "Enter" ) {
            const inputText = event.target.value;
            event.target.outerHTML = `<span class="board-title" id="${boardId}">${inputText}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            dataHandler.renameBoard(titleId, inputText);
            boardTitle.addEventListener('click', renameBoard);
        } else if (event.code === "Escape") {
            event.target.outerHTML = `<span class="board-title" id="${boardId}" data-board-title-id="${titleId}">${text}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            boardTitle.addEventListener('click', renameBoard);
        }
    })
}