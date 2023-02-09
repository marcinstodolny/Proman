import os
from flask import Flask, render_template, url_for, request, session, Response
from dotenv import load_dotenv
import datetime
from flask_socketio import SocketIO, emit
import password_management
from util import json_response
import mimetypes
import queries


mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
app.secret_key = b'DevTeamMDM'
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', session=session)


@socketio.on('create board')
def board_created():
    board = queries.get_recently_created_board()[0]
    emit('create board', board, broadcast=True)


@socketio.on('delete board')
def delete_board(board_id):
    emit('delete board', board_id, broadcast=True)


@socketio.on('update title')
def update_title(data):
    emit('update title', data, broadcast=True)


@socketio.on('update cards inside board')
def update_cards_inside_board(data):
    emit('update cards inside board', data, broadcast=True)


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


@app.route('/api/new-board', methods=['POST'])
def create_new_board():
    data = request.json[0]
    if data['board_type'] == 'public':
        queries.create_new_board(data['board_title'], data['board_type'])
    else:
        queries.create_new_board(data['board_title'], data['board_type'], session['username'])
    board_id = queries.get_recently_created_board()[0]['id']
    queries.create_default_statuses(board_id)
    return Response('', status=201)


@app.route('/api/board/<int:board_id>', methods=["PATCH"])
def rename_board(board_id: int):
    data = request.json[0]
    queries.rename_board(board_id, data['title'])
    return Response('', status=204)


@app.route('/api/card/<int:card_id>', methods=["PATCH"])
def rename_card(card_id: int):
    data = request.json[0]
    queries.rename_card(card_id, data['title'])
    return Response('', status=204)


@app.route("/api/<int:board_id>/statuses")
@json_response
def get_statuses_for_board(board_id: int):
    return queries.get_statuses(board_id)


@app.route("/api/boards/<int:board_id>")
@json_response
def get_board_title(board_id: int):
    return queries.get_board_title(board_id)


@app.route("/api/delete-card/<card_id>", methods=['DELETE'])
def delete_card(card_id):
    queries.delete_card(card_id)
    return Response('', status=204)


@app.route("/api/delete-board/<board_id>", methods=['DELETE'])
def delete_board(board_id):
    if queries.get_board_type_by_id(board_id) == 'private' and session:
        queries.delete_board(board_id, session['username'])
    else:
        queries.delete_board(board_id)
    queries.delete_boards_statuses(board_id)
    return Response('', status=204)


@app.route("/api/delete-status/<status_id>", methods=['DELETE'])
def delete_status(status_id):
    queries.delete_status(status_id)
    return Response('', status=204)


@app.route("/api/statuses/<int:status_id>")
@json_response
def get_status_title(status_id: int):
    return queries.get_card_status(status_id)


@app.route("/api/boards/<int:board_id>/<int:status_id>/<card_title>", methods=['POST'])
@json_response
def create_new_card(board_id: int, status_id: int, card_title):
    return queries.create_new_card(board_id, status_id, card_title)


@app.route("/api/last-card")
@json_response
def get_last_card():
    return queries.get_last_card()


@app.route("/api/last-status")
@json_response
def get_last_status():
    return queries.get_last_status_id()[0]['id']


@app.route("/api/get-card/<int:card_id>")
@json_response
def get_card_by_id(card_id: int):
    return queries.get_card_by_id(card_id)


@app.route("/api/update_card/<int:card_id>", methods=['PATCH'])
def update_card_on_empty_column(card_id: int):
    column_id = request.json[0]['column_id']
    board_id = request.json[0]['board_id']
    card_order = 0
    queries.update_card_order(card_id, board_id, column_id, card_order)
    return Response('', status=204)


@app.route('/api/update_cards_order', methods=['PATCH'])
def update_cards_order():
    ordered_cards = request.json[0]['ordered_cards_list']
    board_id = request.json[0]['board_id']
    column_id = request.json[0]['column_id']
    for count, id in enumerate(ordered_cards):
        queries.update_card_order(id, board_id, column_id, count)
    return Response('', status=204)


@app.route('/api/new-status', methods=['POST'])
def create_new_status():
    data = request.json[0]
    queries.create_new_status(data['board_id'], data['new_status'])
    return Response('', status=201)


@app.route('/api/rename-status', methods=['PATCH'])
def rename_status():
    data = request.json[0]
    queries.rename_status(data['status_id'], data['new_status'])
    return Response('', status=201)


@app.route('/login', methods=['POST'])
def login_attempt():
    data = request.json[0]
    if queries.does_user_exist(data['username']) \
            and password_management.verify_password(data['password'],
                                                    queries.get_user_password(data['username'])[0]['password']):
        session['username'] = data['username']
        return {'message': 'Ok'}
    return {'message': 'Invalid login attempt'}


@app.route('/register', methods=['POST'])
def register():
    data = request.json[0]
    hashed_password = password_management.hash_password(data['password'])
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    queries.insert_new_user(data['username'], hashed_password, time)
    session['username'] = data['username']
    return 'ok'


@app.route("/does_user_exist", methods=['POST'])
def does_user_exist():
    username = request.json[0]['username']
    return {'message': bool(queries.does_user_exist(username))}


@app.route('/logout')
def logout():
    session.pop('username', None)
    return {'message': 'Ok'}


def main():
    # app.run(debug=True)
    socketio.run(app, host='0.0.0.0', port=os.environ.get('PORT'), allow_unsafe_werkzeug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
