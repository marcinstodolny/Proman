import {boardsManager, reloadBoardsAndCards} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";

async function init() {
    boardsManager.loadBoards().then(boardsManager.modifyingColumns);
    await initModals();
    await boardsManager.creatingNewBoard();
    document.getElementById('refresh').addEventListener("click", () =>{
       reloadBoardsAndCards()
    })
}

await init();
