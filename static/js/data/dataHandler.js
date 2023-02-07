export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}`);
    },
    getStatuses: async function (boardId) {
        return await apiGet(`/api/${boardId}/statuses`);
    },
    createStatus: async function (boardId, newStatus) {
        return await apiPost(`/api/new-status`, [{board_id : boardId, new_status: newStatus}]);
    },
    renameStatus: async function (statusId, newStatus) {
        return await apiPatch(`/api/rename-status`, [{status_id : statusId, new_status: newStatus}]);
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCardWithHighestId: async function() {
        return await apiGet(`/api/last-card`);
    },
    getCard: async function (cardId) {
        return await apiGet(`/api/get-card/${cardId}`);
    },
    createNewBoard: async function (boardTitle, board_type) {
        return await apiPost('/api/new-board', [{board_title : boardTitle, board_type: board_type}])
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        return await apiPost(`/api/boards/${boardId}/${statusId}/${cardTitle}`)
    },
    deleteCard: async function (cardId) {
        return await apiDelete(`/api/delete-card/${cardId}`)},

    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/delete-board/${boardId}`)},

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

    does_user_exist: async function(username) {
        let result = ''
        await apiPost("/does_user_exist", [{username: username}]).then(data => data.json())
             .then(data => result = data['message']);
         return result;
    },
    logout: async function(){
        return await apiGet('/logout')
    },
    renameCard: async function(cardId, cardNewName){
        return await apiPatch(`/api/card/${cardId}`, [{title : cardNewName}]);
    },
    renameBoard: async function(boardId, boardNewName){
        return await apiPatch(`/api/board/${boardId}`, [{title : boardNewName}]);
    },
    update_card_status: async function(cardId, boardId, status){
        return await apiPatch(`/api/update_card/${cardId}`, [{board_id: boardId, status_id: status}]);
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
    let response = fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        });
    if (response.ok) {
        return response;
    }
}

async function apiPut(url) {
}

async function apiPatch(url, body) {
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (response.ok) {
        return response
    }
}
