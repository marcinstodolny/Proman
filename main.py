from flask import Flask, render_template, url_for
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/statuses")
@json_response
def get_statuses_for_board():
    return queries.get_statuses()


@app.route("/api/boards/<int:board_id>")
@json_response
def get_board_title(board_id: int):
    return queries.get_board_title(board_id)


@app.route("/api/statuses/<int:status_id>")
@json_response
def get_status_title(status_id: int):
    return get_status_title(status_id)


# @app.route("/api/boards/<board_title>")
# @json_response
# def create_new_board(board_title):
#     return create_new_board(board_title)

@app.route("/api/boards/<int:board_id>/<int:status_id>/<card_title>")
@json_response
def create_new_card(board_id: int, status_id: int, card_title):
    return create_new_card(board_id, status_id, card_title)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
