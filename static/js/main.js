import {boardsManager, reloadBoardsAndCards} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";
import{webSocket} from "./webSocket.js";

async function init() {
    await boardsManager.loadBoards().then(boardsManager.modifyingColumns);
    await initModals();
    await boardsManager.creatingNewBoard();
    document.getElementById('refresh').addEventListener("click", () =>{
       reloadBoardsAndCards()
    })
    webSocket()
}

await init();
