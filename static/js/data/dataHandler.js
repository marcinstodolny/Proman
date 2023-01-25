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
        return await apiPost('/api/new-board', [{board_title : boardTitle}])
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        return await apiGet(`/api/boards/${boardId}/${statusId}/${cardTitle}`)
        // creates new card, saves it and calls the callback function with its data
    },
    loginAttempt: async function(username, password) {
        let response = ''
         await apiPost("/login", [{username: username, password: password}])
             .then(data => data.json())
             .then(data => response = data['message']);
        if (response === 'Invalid login attempt'){
            alert(response)
        } else {
            window.location.reload();
        }

    },
    register: async function(username, password) {
         return await apiPost("/register", [{username: username, password: password}]);
    },
    is_user_exist: async function(username) {
        let result = ''
        await apiPost("/is_user_exist", [{username: username}]).then(data => data.json())
             .then(data => result = data['message']);
         return result;
    },
    logout: async function(){
        return await apiGet('/logout')
    }
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
