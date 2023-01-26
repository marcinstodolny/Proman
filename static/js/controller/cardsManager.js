import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            let statusId = card.status_id;
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-column-content[data-column-id="board${boardId}_column{status[${statusId}}]"]`, content);
            domManager.addEventListener(
                `.card-remove[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(`.card[data-card-id="${card.id}"]`, "dragstart",startDrag)
            domManager.addEventListener(`.card[data-card-id="${card.id}"`, "dragend", endDrag)
        }
    },
    deleteCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            document.querySelector(`.card[data-card-id="${card.id}"]`).remove();
        }
    },
};

export function addCard(boardId, statusId) {
    let cardTitle = "new card"
    return dataHandler.createNewCard(cardTitle, boardId, statusId);
}

function deleteButtonHandler(clickEvent) {
    const card = clickEvent.target;
    let cardId = card.parentElement.dataset.cardId;
    card.parentElement.remove();
    dataHandler.deleteCard(cardId);
}

function startDrag(event) {
    localStorage.setItem('dragged-item', event.target.dataset.cardId);
}

function endDrag() {
    localStorage.removeItem('dragged-item');
}