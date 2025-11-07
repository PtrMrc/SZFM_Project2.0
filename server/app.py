from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room
from game.rooms import create_room, add_player, rooms
from question_generator import spin_wheel, generate_question, get_all_topics
import threading
import time

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

    # Ha elsőként lép be valaki, ő lesz a host
    if "host" not in room:
        room["host"] = username

    if username in room["players"]:
        emit("join_error", {"msg": f"A '{username}' nevű játékos már csatlakozott ehhez a szobához."})
        return
    
    add_player(room_code, username)
    join_room(room_code)

    print(f"✅ {username} joined {room_code}")

    emit("join_success", {"msg": f"Sikeresen csatlakoztál a(z) {room_code} szobához!"}, to=request.sid)
    emit("player_joined", {"players": room["players"], "host": room["host"],"new_player": username,}, room=room_code)

@socketio.on("request_room_state")
def handle_request_room_state(data):
    room_code = data.get("room")
    if not room_code or room_code not in rooms:
        emit("join_error", {"msg": "A szoba nem létezik."}, to=request.sid)
        return

    room = rooms[room_code]
    emit("room_state", {"players": room["players"], "host": room["host"]}, to=request.sid)

@socketio.on("start_game")
def handle_start(data):
    room_code = data.get("room")
    username = data.get("username")

    if room_code not in rooms:
        emit("error", {"msg": "Szoba nem létezik"})
        return

    room = rooms[room_code]

    # Csak a host indíthatja el
    if room.get("host") != username:
        emit("error", {"msg": "Csak a szoba létrehozója indíthatja el a játékot!"})
        return

    room["status"] = "in-progress"
    room["active_players"] = list(room["players"])
    room["answers"] = {}

    print(f"🎮 Game started in {room_code} by host {username}")

    send_new_question(room_code)

def send_new_question(room_code):
    """Új kérdés generálása és elküldése mindenkinek"""
    room = rooms[room_code]
    topics = get_all_topics()
    topic = spin_wheel(topics)
    question = generate_question(topic, topics[topic])
    room["current_question"] = question
    room["answers"] = {}

    print(f"🧠 Sending new question to {room_code}: {question['question']}")
    print(f"📤 Active players in room {room_code}: {room.get('active_players', [])}")
    print(f"📤 Players in global rooms list: {rooms[room_code]['players']}")

    socketio.emit("new_question", {"question": question, "timer": 10}, room=room_code)

    # Időzítő szál (10 másodperc után kiértékel)
    threading.Thread(target=evaluate_answers, args=(room_code, question["correct"]), daemon=True).start()

@socketio.on("answer_question")
def handle_answer(data):
    room_code = data.get("room")
    username = data.get("username")
    answer = data.get("answer")

    room = rooms.get(room_code)
    if not room or username not in room.get("active_players", []):
        return

    room["answers"][username] = answer
    print(f"📝 {username} answered {answer}")

def evaluate_answers(room_code, correct_answer):
    """10 mp után automatikus kiértékelés"""
    time.sleep(10)

    room = rooms.get(room_code)
    if not room:
        return

    active = room["active_players"]
    answers = room.get("answers", {})

    survivors = [p for p in active if answers.get(p) == correct_answer]
    eliminated = [p for p in active if p not in survivors]

    # Jelöljük, kik estek ki
    for p in eliminated:
        socketio.emit("player_eliminated", {"username": p}, room=room_code)

    room["active_players"] = survivors
    print(f"🏁 Survivors in {room_code}: {survivors}")

    # Eredmény visszajelzése
    socketio.emit(
        "round_result",
        {"survivors": survivors, "eliminated": eliminated, "correct": correct_answer},
        room=room_code,
    )

    if len(survivors) == 1:
        winner = survivors[0]
        print(f"🏆 Game over! Winner: {winner}")
        socketio.emit("game_over", {"winner": winner}, room=room_code)
    elif len(survivors) > 1:
        send_new_question(room_code)
    else:
        # Ha mindenki kiesett, nincs nyertes
        socketio.emit("game_over", {"winner": None}, room=room_code)

@socketio.on("request_current_question")
def handle_request_current_question(data):
    room_code = data.get("room")
    if not room_code or room_code not in rooms:
        return
    room = rooms[room_code]
    question = room.get("current_question")
    if question:
        print(f"📨 {request.sid} kérte az aktuális kérdést.")
        socketio.emit("new_question", {"question": question, "timer": 10}, room=request.sid)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
