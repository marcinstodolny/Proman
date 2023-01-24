export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}`);
    },
    getStatuses: async function () {
        return await apiGet(`/api/statuses`);
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        return await apiGet(`/api/statuses/${statusId}`);
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
        // the board is retrieved and then the callback function is called with the cards
    },
    getCard: async function (cardId) {
        return await apiGet(`/api/boards/${cardId}`);
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        return await apiPost('/api/new-board', {board_title : boardTitle})
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        return await apiGet(`/api/boards/${boardId}/${statusId}/${cardTitle}`)
        // creates new card, saves it and calls the callback function with its data
    },
    loginAttempt: async function(username, password) {
        console.log(username, password)
         return await apiPost("/login/");
    },
    register: async function(username, password) {
        console.log(username, password)
         return await apiPost("/register/");
    },
    is_user_exist: async function(username) {
        console.log(username)
         return await apiPost("/is_user_exist/");
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        return response
    }
}

async function apiDelete(url) {
}

async function apiPut(url) {
}

async function apiPatch(url) {
}
