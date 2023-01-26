from flask import Flask, render_template, url_for, request, session
from dotenv import load_dotenv
import datetime

import password_management
from util import json_response
import mimetypes
import queries


mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = b'DevTeamMDM'
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', session=session)


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    if session:
        return queries.get_public_and_private_boards(session['username'])
    else:
        return queries.get_public_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route('/api/board', methods=['POST', 'PATCH'])
def board_manipulate():
    data = request.json[0]
    if request.method == 'POST':
        if data['board_type'] == 'public':
            queries.create_new_board(data['board_title'], data['board_type'])
        else:
            queries.create_new_board(data['board_title'], data['board_type'], session['username'])
    elif request.method == 'PATCH':
        queries.rename_board(data['id'], data['title'])
    return "ok"


@app.route("/api/statuses")
@json_response
def get_statuses_for_board():
    return queries.get_statuses()


@app.route("/api/boards/<int:board_id>")
@json_response
def get_board_title(board_id: int):
    return queries.get_board_title(board_id)


@app.route("/api/delete-card/<card_id>", methods=['DELETE'])
@json_response
def delete_card(card_id):
    return queries.delete_card(card_id)


@app.route("/api/statuses/<int:status_id>")
@json_response
def get_status_title(status_id: int):
    return queries.get_card_status(status_id)


@app.route("/api/boards/<int:board_id>/<int:status_id>/<card_title>")
@json_response
def create_new_card(board_id: int, status_id: int, card_title):
    return queries.create_new_card(board_id, status_id, card_title)



@app.route('/login', methods=['POST'])
def login_attempt():
    data = request.json[0]
    if queries.is_user_exist(data['username']) \
            and password_management.verify_password(data['password'],
                                                    queries.get_user_password(data['username'])[0]['password']):
        session['username'] = data['username']
        # session['id'] = data_manager.get_user_id(session['username'])[0]['id']
        return {'message': 'Ok'}
    return {'message': 'Invalid login attempt'}


@app.route('/register', methods=['POST'])
def register():
    data = request.json[0]
    hashed_password = password_management.hash_password(data['password'])
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    queries.insert_new_user(data['username'], hashed_password, time)
    session['username'] = data['username']
    # session['id'] = data_manager.get_user_id(session['username'])[0]['id']
    return 'ok'


@app.route("/is_user_exist", methods=['POST'])
def is_user_exist():
    username = request.json[0]['username']
    return {'message': bool(queries.is_user_exist(username))}


@app.route('/logout')
def logout():
    session.pop('username', None)
    # session.pop('id', None)
    return {'message': 'Ok'}


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
