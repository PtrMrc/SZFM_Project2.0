from flask import Flask
from flask_socketio import SocketIO, emit, join_room
from game.rooms import create_room, add_player, rooms

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

    question = {
        "question": "Mennyi 2 + 2?",
        "choices": ["3", "4", "5", "6"],
        "correct": "4"
    }

    rooms[room_code]["current_question"] = question
    emit("new_question", question, room=room_code)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
