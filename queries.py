import data_manager


def get_card_status(status_id):
    status = data_manager.execute_select(
        """
        SELECT title FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def create_new_card(board_id, status_id, card_title):
    new_card = data_manager.execute_select(
        """
        INSERT INTO cards 
        (board_id, status_id, title, card_order)
        VALUES (%(b_id)s, %(s_id)s, %(title)s)
        """
        , {'b_id': board_id, 's_id': status_id, 'title': card_title})

    return new_card


# def rename_card(card_id, title):
#     renamed_card = data_manager.execute_select(
#         """
#         UPDATE cards
#         SET title = %(title)s
#         WHERE id = %(card_id)s
#         """
#         , {'c_id': card_id, 'title': title})
#
#     return renamed_card


def delete_card(card_id):
    return data_manager.execute_select(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s
        """
        , {'card_id': card_id})


def get_statuses():
    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        ;
        """
    )


def get_board_title(board_id):
    return data_manager.execute_select(
        """
        SELECT title FROM statuses
        WHERE id = %(board_id)s
        """
        , {'b_id': board_id})


def create_new_board(board_title):
    return data_manager.execute_insert(
        """
        INSERT INTO boards (title)
        VALUES (%(title)s)
        """
        , {"title": board_title})


def rename_board(board_id, board_new_name):
    return data_manager.execute_insert(
        """
        UPDATE boards
        SET title = (%(title)s)
        WHERE id = (%(id)s)
        """
        , {"title": board_new_name, "id": board_id})


def is_user_exist(username):
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
