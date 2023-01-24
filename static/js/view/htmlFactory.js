export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <section class="board" data-board-id=${board.id}>
                    <div class="board-header"><span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class ="board-columns">
                        <div class="board-column">
                            <div class="board-column-title">{board.status[0]}New</div>
                            <div class="board-column-content" data-column-id="board${board.id}_column{board.status[1]}"></div>
                        </div>
                        <div class="board-column">
                            <div class="board-column-title">{board.status[1]}In Progress</div>
                            <div class="board-column-content" data-column-id="board${board.id}_column{board.status[2]}"></div>
                        </div>
                        <div class="board-column">
                            <div class="board-column-title">{board.status[2]}Testing</div>
                            <div class="board-column-content" data-column-id="board${board.id}_column{board.status[3]}"></div>
                        </div>
                        <div class="board-column">
                            <div class="board-column-title">{board.status[3]}Done</div>
                            <div class="board-column-content" data-column-id="board${board.id}_column{board.status[4]}"></div>
                        </div>
                    </div>
                </section>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`;
}

