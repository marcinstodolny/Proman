import data_manager


def get_card_status(status_id):
    return data_manager.execute_select(
        """
        SELECT title FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})


def get_public_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE type = 'public'
        ORDER BY id;
        """)


def get_public_and_private_boards(username):
    return data_manager.execute_select(
        """
        (SELECT * FROM boards
        WHERE type = 'public')
        UNION
        (SELECT * FROM boards
        WHERE owner = %(username)s)
        ORDER BY id;
        """
        , {"username": username})


def delete_board(table_id, username=''):
    return data_manager.execute_insert(
        """
        DELETE FROM boards WHERE id = %(table_id)s AND owner = %(username)s;
        """, {'table_id': table_id, 'username': username}

    )


def get_board_type_by_id(board_id):
    return data_manager.execute_select(
        """
        SELECT type FROM boards
        WHERE id = %(board_id)s
        """, {"board_id": board_id})[0]['type']


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY card_order
        """
        , {"board_id": board_id})

    return matching_cards


def create_new_card(board_id, status_id, card_title):
    if get_last_order(board_id, status_id):
        order = get_last_order(board_id, status_id)[0]['card_order'] + 1
    else:
        order = 0
    new_card = data_manager.execute_insert(
        """
        INSERT INTO cards 
        (board_id, status_id, title, card_order)
        VALUES (%(b_id)s, %(s_id)s, %(title)s, %(order)s)
        """
        , {'b_id': board_id, 's_id': status_id, 'title': card_title, 'order': order})

    return new_card


def get_last_order(board_id, status_id):
    return data_manager.execute_select(
        """
        SELECT card_order 
        FROM cards
        WHERE board_id = %(b_id)s AND status_id = %(s_id)s
        ORDER BY card_order DESC
        LIMIT 1
        """
        , {'b_id': board_id, 's_id': status_id})


def get_last_card():
    return data_manager.execute_select(
        """
        SELECT id FROM cards ORDER BY id DESC LIMIT 1;
        """)


def get_card_by_id(card_id):
    return data_manager.execute_select(
        """
        SELECT * FROM cards 
        WHERE id = %(card_id)s;
        """
        , {'card_id': card_id})


def rename_card(card_id, title):
    return data_manager.execute_insert(
        """
        UPDATE cards
        SET title = %(title)s
        WHERE id = %(c_id)s
        """
        , {'c_id': card_id, 'title': title})


def delete_card(card_id):
    return data_manager.execute_insert(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        """
        , {'card_id': card_id})


def delete_boards_statuses(board_id):
    return data_manager.execute_insert(
        """
        DELETE FROM statuses
        WHERE board_id = %(board_id)s
        """
        , {'board_id': board_id})


def delete_status(status_id):
    return data_manager.execute_insert(
        """
        DELETE FROM statuses
        WHERE id = %(status_id)s
        """
        , {'status_id': status_id})


def get_statuses(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE board_id = %(board_id)s
        ORDER BY id
        """
        , {'board_id': board_id})


def get_last_status_id():
    return data_manager.execute_select(
        """
        SELECT id FROM statuses ORDER BY id DESC LIMIT 1;
        """)


def get_board_title(board_id):
    return data_manager.execute_select(
        """
        SELECT title FROM statuses
        WHERE id = %(board_id)s
        """
        , {'b_id': board_id})


def create_new_board(board_title, board_type, username=''):
    return data_manager.execute_insert(
        """
        INSERT INTO boards (title, type, owner)
        VALUES (%(title)s, %(type)s, %(owner)s)
        """
        , {"title": board_title, 'type': board_type, 'owner': username})


def create_default_statuses(board_id):
    return data_manager.execute_insert(
        """
        INSERT INTO statuses(title, board_id) VALUES ('new', %(board_id)s);
        INSERT INTO statuses(title, board_id) VALUES ('in progress', %(board_id)s);
        INSERT INTO statuses(title, board_id) VALUES ('testing', %(board_id)s);
        INSERT INTO statuses(title, board_id) VALUES ('done', %(board_id)s);
        """
        , {"board_id": board_id})


def create_new_status(board_id, title):
    return data_manager.execute_insert(
        """
        INSERT INTO statuses(title, board_id) VALUES (%(title)s, %(board_id)s);
        """
        , {"board_id": board_id, "title": title})


def rename_status(status_id, new_status):
    return data_manager.execute_insert(
        """
        UPDATE statuses
        SET title = (%(new_status)s)
        WHERE id = (%(status_id)s)
        """
        , {"new_status": new_status, "status_id": status_id})


def rename_board(board_id, board_new_name):
    return data_manager.execute_insert(
        """
        UPDATE boards
        SET title = (%(title)s)
        WHERE id = (%(id)s)
        """
        , {"title": board_new_name, "id": board_id})


def does_user_exist(username):
    return data_manager.execute_select(
        """
        SELECT username
        FROM users
        WHERE username = (%(username)s)
        """
        , {"username": username})


def insert_new_user(username, password, time):
    return data_manager.execute_insert(
        """
        INSERT INTO users (username, password, registration_date)
        VALUES (%(username)s, %(password)s, %(time)s)
        """
        , {"username": username, "password": password, "time": time})


def get_user_password(username):
    return data_manager.execute_select(
        """
            SELECT password
            FROM users
            WHERE username = %(username)s
        """
        , {"username": username})


def update_card_order(card_id, board_id, column_id, card_order):
    return data_manager.execute_insert(
        """
        UPDATE cards
        SET board_id = %(board_id)s, status_id = %(column_id)s, card_order = %(card_order)s
        WHERE id = %(card_id)s;
        """, {"card_id": card_id, "board_id": board_id, "column_id": column_id, "card_order": card_order})


def get_recently_created_board():
    return data_manager.execute_select(
        """
        SELECT *
        FROM boards
        ORDER BY id DESC
        LIMIT 1
        """
)
