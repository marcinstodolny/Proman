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

function boardBuilder(board, statuses) {
    let columns = "";
    for (let index= 0; index < statuses.length; index++) {
        columns += `
        <div class="board-column">
            <div class="board-column-title">
                <div class="status">
                    <div class="status-title">${statuses[index].title}</div>
                    <div class="status-options">
                        <div class="hamburger-btn" id="hamburger-btn-${statuses[index].id}${board.id}">
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                        </div>
                        <ul class="options-menu" id="options-menu-hamburger-btn-${statuses[index].id}${board.id}">
                            <li class="menu-item newCard" id="newCard${board.id}${statuses[index].id}">
                                Add new card
                            </li>
                            <li class="menu-item">Rename column</li>
                            <li class="menu-item">Delete column</li>
                        </ul>
                    </div>
                    </div>
                </div>
            <div class="board-column-content" 
            data-column-id="board${board.id}_column{status[${index + 1}}]"></div>
        </div>`;
        }

    return `<div class="board-container">
                <section class="board" data-board-id=${board.id}>
                    <div class="board-header">
                        <span class="board-title" id="board-title_${board.id}" data-board-title-id="${board.id}">
                            ${board.title}
                        </span>
                        <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
                    </div>            
                    <div class ="board-columns hide-board" id=${board.id}>
                        ${columns}
                    </div>
                </section>
            </div>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`;
}
