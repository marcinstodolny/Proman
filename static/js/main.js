import {boardsManager} from "./controller/boardsManager.js";
import {initModals} from "./controller/usersManager.js";

async function init() {
    boardsManager.loadBoards().then(boardsManager.modifyingColumns);
    await initModals();
    await boardsManager.creatingNewBoard();
}

await init();
