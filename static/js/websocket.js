import {loadBoard, removeBoard} from "./controller/boardsManager.js";
import {dataHandler} from "./data/dataHandler.js";

export function webSocket(){
    let socket = io.connect('http://localhost:5000/');
    setInterval(() => {
      const start = Date.now();

      socket.emit("ping", () => {
        const duration = Date.now() - start;
        console.log(duration);
      });
    }, 1000);
    $('button.syncPublic').on('click',  async function(event) {
        await dataHandler.createNewBoard(document.querySelector(`#new-public-board-input`).value, 'public')
        socket.emit('create board')
        return false;
    });
    $('button.syncPrivate').on('click', async function(event) {
        await dataHandler.createNewBoard(document.querySelector(`#new-private-board-input`).value, 'private')
        socket.emit('create board')
        return false;
    });
    boardRemoveHandler()
    boardTitleHandler()
    socket.on('create board', async function(board) {
        let username = document.querySelector('#username').innerText
        if (board.owner === username || board.type === 'public'){
            await loadBoard(board)
            boardRemoveHandler()
            boardTitleHandler("board-title_"+board.id)
            // initDropdown, button event and card creation ONLY to this one after creation
        }

    });
    socket.on('delete board', function(boardId) {
        removeBoard(boardId)
    });
    function boardRemoveHandler(){
        // console.log(document.querySelectorAll('.board-remove'))
        $('button.board-remove').on('click', function(event) {
        const board = event.target;
        const boardId = board.dataset.boardId
        socket.emit('delete board', boardId)
        return false;
    })}
    function boardTitleHandler(boardId=null){
        if (boardId === null){
            $('span.board-title').on('click', function(event) {
                boardTitleInput(event)
    })}else{
            $("#"+boardId).on('click', function(event) {
                boardTitleInput(event)
        })}
    }
    function boardTitleInput(event){
        const titleId = event.target.dataset['boardTitleId'];
        let text = event.target.innerText;
        const boardId = event.target.id;
        event.target.outerHTML = `<input class="board-title" id="input-${boardId}" data-board-title-id="${titleId}" value="${text}">`
        renameBoard(titleId, boardId, text)
        return false;
    }
    function renameBoard(titleId, boardId, text){
        $("#input-"+boardId).on('keyup', function(event) {
        if (event.key === "Enter" ) {
            const inputText = event.target.value;
            event.target.outerHTML = `<span class="board-title" id="${boardId}" data-board-title-id="${titleId}">${inputText}</span>`
            dataHandler.renameBoard(titleId, inputText);
            socket.emit('update title', {'boardId': boardId, 'titleId': titleId, 'inputText': inputText})
        } else if (event.key === "Escape") {
            event.target.outerHTML = `<span class="board-title" id="${boardId}" data-board-title-id="${titleId}">${text}</span>`
            boardTitleHandler(boardId)
        }}
    )}
    socket.on('update title', async function(data) {
        let titleId = data['titleId']
        const boardTitle = document.querySelector(`.board-title[data-board-title-id="${titleId}"]`);
        boardTitle.outerHTML = `<span class="board-title" id="${data['boardId']}" data-board-title-id="${titleId}">${data['inputText']}</span>`
        boardTitleHandler(data['boardId'])
    });

}