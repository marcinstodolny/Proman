import {boardsManager, loadBoard, removeBoard, renameBoard} from "./controller/boardsManager.js";
import {dataHandler} from "./data/dataHandler.js";
import {initDropAndColumns} from "./controller/statusesManager.js";
import {cardsManager} from "./controller/cardsManager.js";

export let socket = io.connect('http://localhost:5000/');
export function webSocket(){
    socket.on('create board', async function(board) {
        let username = document.querySelector('#current_username').innerText
        if (board.owner === username || board.type === 'public'){
            await loadBoard(board)
            await initDropAndColumns(board)
            await boardsManager.modifyingColumns(document.querySelector(`.board[data-board-id="${board['id']}"]`))
        }

    });
    socket.on('delete board', function(boardId) {
        removeBoard(boardId)
    });
     socket.on('update title', async function(data) {
        let titleId = data['titleId']
        let boardTitle = document.querySelector(`#${data['boardId']}`);
        if (boardTitle !== null){
        boardTitle.outerHTML =  `<span class="board-title" id="${data['boardId']}" data-board-title-id="${titleId}">${data['inputText']}</span>`
            boardTitle = await document.querySelector(`#${data['boardId']}`);
         boardTitle.addEventListener('click', renameBoard);
    }});
     socket.on('update cards inside board', async function(boardId) {
         let board = document.getElementById(`${boardId}`)
         if (board !== null && !board.classList.contains('hide-board')) {
             await board.querySelectorAll('.board-column-content').forEach(card => {
                 card.innerHTML = ''
             })
             await cardsManager.loadCards(boardId);
         }
    });
}
