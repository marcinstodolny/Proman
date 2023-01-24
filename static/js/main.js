import {boardsManager} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";

function init() {
    boardsManager.loadBoards();
    initModals()
    boardsManager.listenerNewBoard();
}

init();
