from flask import Flask
import os
from flask import request
from flask_socketio import SocketIO, emit, join_room
from game.rooms import create_room, add_player, rooms
from question_generator import get_all_topics, spin_wheel, generate_question


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return "Quiz Royale backend is running!"

@socketio.on("join_room")
def handle_join(data):
    username = data.get("username")
    room_code = data.get("room")

    if not username or not room_code:
        emit("error", {"msg": "username és room szükséges"})
        return

    room = create_room(room_code)
    add_player(room_code, username)
    join_room(room_code)

    emit("player_joined", {"players": room["players"], "player": username}, room=room_code)

@socketio.on("start_game")
def handle_start(data):
    room_code = data.get("room")
    if room_code not in rooms:
        emit("error", {"msg": "Szoba nem létezik"})
        return

    rooms[room_code]["status"] = "in-progress"

    # Témakör választás kerékpörgetés szimulálásával
    topic = spin_wheel()

    # Az adott témakörhöz kérdés generálása
    question = generate_question(topic)


    rooms[room_code]["current_question"] = question
    emit("new_question", question, room=room_code)

@socketio.on("answer_question")
def handle_answer(data):
    room_code = data.get("room")
    username = data.get("username")
    answer = data.get("answer")

    question = rooms[room_code]["current_question"]
    correct = question["correct"]

    # Emit only to the player who answered
    if answer == correct:
        emit("answer_result", {"correct": True}, room=request.sid)
    else:
        emit("answer_result", {"correct": False}, room=request.sid)


#----------------------------------------------------------
"""
TESZT ENDPOINT - véletlenszerű kérdés visszaadása
"""
@app.route('/api/question')
def get_question():
    topics = get_all_topics()
    topic = spin_wheel(topics)
    question = generate_question(topic, topics[topic])
    question["topic"] = topic
    return question

from flask import send_from_directory

@app.route('/test')
def serve_frontend():
    client_dir = os.path.join(os.path.dirname(__file__), '..', 'client')
    return send_from_directory(client_dir, 'teszt_index.html')


#-----------------------------------------------------------


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
