import {boardsManager, reloadBoardsAndCards} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";

function init() {
    boardsManager.loadBoards().then(boardsManager.modifyingColumns);
    initModals()
    boardsManager.creatingNewBoard();
    document.getElementById('refresh').addEventListener("click", () =>{
       reloadBoardsAndCards()
    })
}
init();
