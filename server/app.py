from flask import Flask
from flask import request
from flask_socketio import SocketIO, emit, join_room
from game.rooms import create_room, add_player, rooms
from question_generator import spin_wheel, generate_question


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

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
