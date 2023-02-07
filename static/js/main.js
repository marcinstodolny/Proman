import {boardsManager} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";

function init() {
    boardsManager.loadBoards().then(boardsManager.modifyingColumns);
    initModals();
    boardsManager.creatingNewBoard();
}

init();
