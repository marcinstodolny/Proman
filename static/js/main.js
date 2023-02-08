import {boardsManager, reloadBoardsAndCards} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";
import{webSocket} from "./websocket.js";

async function init() {
    await boardsManager.loadBoards().then(boardsManager.modifyingColumns);
    initModals();
    boardsManager.creatingNewBoard();
    document.getElementById('refresh').addEventListener("click", () =>{
       reloadBoardsAndCards()
    })
    webSocket()
}

init();
