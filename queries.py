import data_manager


# def get_card_status(status_id):
#     status = data_manager.execute_select(
#         """
#         SELECT title FROM statuses s
#         WHERE s.id = %(status_id)s
#         ;
#         """
#         , {"status_id": status_id})
#
#     return status

def get_status_title(status_id):
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


def create_card(board_id, status_id, card_title):
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
