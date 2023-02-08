import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {addCard, cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const statuses = await dataHandler.getStatuses(board.id);
            const boardBuilder = htmlFactory(htmlTemplates.board, statuses);
            const content = boardBuilder(board, statuses);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.board-remove[data-board-id="${board.id}"]`,
                "click",
                deleteBoardButtonHandler
            );
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
        }
        await initDropdown();
    },
    creatingNewBoard: async function () {
        const newBoardBtn = document.querySelector('#new-board-btn');
        const newBoardContainer = document.querySelector('#new-board-input-container');
        const newBoardSaveBtn = document.querySelector('#save-new-board');
        const newPrivateBoardBtn = document.querySelector('#new-private-board-btn');
        const newPrivateBoardContainer = document.querySelector('#new-private-board-input-container');
        const newPrivateBoardSaveBtn = document.querySelector('#save-new-private-board');
        toggleBoardNameInput(newBoardBtn, newBoardContainer)
        toggleBoardNameInput(newPrivateBoardBtn, newPrivateBoardContainer)
        await createBoardButtonEvent(newBoardSaveBtn, document.querySelector('#new-board-input'), 'public')
        await createBoardButtonEvent(newPrivateBoardSaveBtn, document.querySelector('#new-private-board-input'), 'private')
    },
    modifyingColumns: function () {
        const boardsColumnsContainers = document.querySelectorAll('.board-column-content');
        boardsColumnsContainers.forEach((element) => {
            element.addEventListener('drop', (event) => {
                event.preventDefault()
                const cardId = localStorage.getItem('dragged-item')
                const card = document.querySelector(`.card[data-card-id="${cardId}"]`)
                if (card.classList.contains("card")) {
                    element.appendChild(card)
                }
            });
            element.addEventListener('dragover', (event) => {
                event.preventDefault()
            })
        })
    }
};
function toggleBoardNameInput(boardBtn, BoardContainer){
    boardBtn.addEventListener('click', () => {
            let newBoardContainerVisibility = BoardContainer.style.display;
            if (newBoardContainerVisibility === "block"){
                BoardContainer.style.display = "none"
            } else {
                BoardContainer.style.display = "block"
            }
        });
}
async function createBoardButtonEvent(BoardSaveBtn, boardName, type){
    BoardSaveBtn.addEventListener('click', () => {
            if (boardName.value) {
                dataHandler.createNewBoard(boardName.value, type)
                window.location.reload();
            }
        })
}

async function showHideButtonHandler(clickEvent) {
    clickEvent.target.classList.toggle("flip");
    const boardId = checkChildren(clickEvent.target);
    let board = document.getElementById(boardId);
    if (board.classList.contains("hide-board")) {
        await cardsManager.loadCards(boardId);
        board.classList.remove("hide-board");

    }
    else {
        await cardsManager.deleteCards(boardId);
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
    let text = board.target.innerText;
    const boardId = board.target.id;
    board.target.outerHTML = `<input class="board-title" id="input-${boardId}" data-board-title-id="${titleId}" value="${text}">`
    const input = document.querySelector(`#input-${boardId}`)
    input.addEventListener('keyup', async function test(event) {
        if (event.code === "Enter" ) {
            const inputText = event.target.value;
            event.target.outerHTML = `<span class="board-title" id="${boardId}">${inputText}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            await dataHandler.renameBoard(titleId, inputText);
            boardTitle.addEventListener('click', renameBoard);
        } else if (event.code === "Escape") {
            event.target.outerHTML = `<span class="board-title" id="${boardId}" data-board-title-id="${titleId}">${text}</span>`
            const boardTitle = document.querySelector(`#${boardId}`);
            boardTitle.addEventListener('click', renameBoard);
        }
    })
}

async function deleteBoardButtonHandler(clickEvent) {
    const board = clickEvent.target;
    let boardId = board.dataset.boardId;
    board.parentElement.parentElement.parentElement.remove();
    await dataHandler.deleteBoard(boardId);
}


export async function initDropdown() {
    let hamburgerButtons = document.querySelectorAll('.hamburger-btn');
    let optionMenus = document.querySelectorAll('.options-menu');
    hamburgerButtons.forEach(button => {
        let buttonId = button.id;
        const columnId = button.dataset.statusId;
        let options = document.getElementById("btn-options-"+columnId);
        button.addEventListener('click', () => {
            optionMenus.forEach(currentOptions => {
                console.log(currentOptions, options);
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


