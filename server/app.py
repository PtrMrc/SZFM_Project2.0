from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room
from game.rooms import create_room, add_player, rooms
from question_generator import spin_wheel, generate_question, get_all_topics
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
question_timer_seconds=20

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

def start_game_after_delay(room_code):
    
    print(f"⏰ Várakozás (2s), hogy a {room_code} kliensei betöltsenek...")
    socketio.sleep(2) 
    
    print(f"🚀 Játék indítása és első kérdés küldése ({room_code})")
    send_new_question(room_code)

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
    room["next_question_cache"] = None

    try:
        room["topics"] = get_all_topics()
        print(f"✅ Témakörök sikeresen lekérve a {room_code} szobához ({len(room['topics'])} db)")
    except Exception as e:
        print(f"🆘 CRITICAL: Nem sikerült lekérni a témaköröket: {e}")
        emit("error", {"msg": "Hiba a témakörök lekérésekor. Próbáld újra."})
        return

    print(f"🎮 Game started in {room_code} by host {username}")
    socketio.emit("game_starting", {"msg": "A játék indul!"}, room=room_code)
    socketio.start_background_task(
        target=start_game_after_delay,
        room_code=room_code)

def send_new_question(room_code):
    room = rooms.get(room_code)
    if not room:
        print(f"⚠️ Hiba: {room_code} szoba nem található a kérdésküldésnél.")
        return
    
    question = room.get("next_question_cache")

    if question:
        print(f"🧠 Using cached question for {room_code}")
        room["next_question_cache"] = None 
    else:
        print(f"⚠️ Cache was empty or invalid. Generating fresh question...")
        try:
            topics = room.get("topics")
            if not topics:
                print(f"🆘 CRITICAL: Nincsenek mentett témakörök {room_code}-ban. Újrapróbálkozás...")
                topics = get_all_topics()
                room["topics"] = topics
            

            topic = spin_wheel(topics)
            question = generate_question(topic, topics[topic])
            
            if not question:
                 raise Exception("Question generation returned None")

            print(f"🧠 Generated fresh question for {room_code}")

        except Exception as e:
            print(f"🆘 CRITICAL: Hiba történt a kérdés generálás közben: {e}. A játék {room_code} szobában megállhat.")
            return

    room["current_question"] = question
    room["answers"] = {}
    round_id = f"{room_code}_{int(time.time() * 1000)}"
    room["current_round_id"] = round_id
    
    start_time = time.time()
    room["round_start_time"] = start_time
    room["round_end_time"] = start_time + question_timer_seconds

    print(f"🧠 Sending new question to {room_code}: {question['question']}")

    socketio.emit("new_question", {
        "question": question, 
        "timer": question_timer_seconds,
        "round_id": round_id,
        "round_end_time": room["round_end_time"]
    }, room=room_code)

    socketio.start_background_task(target=delayed_prefetch, room_code=room_code, delay_seconds=7)
    socketio.start_background_task( target=evaluate_answers,  room_code=room_code, round_id=round_id)

def prefetch_next_question(room_code):
    """A következő kérdés előtöltése a háttérben"""
    room = rooms.get(room_code)
    if not room:
        return 

    try:
        print(f"⏳ Pre-fetching next question for {room_code}...")
        
        topics = room.get("topics")
        if not topics:
            print(f"🆘 CRITICAL (prefetch): Nincsenek mentett témakörök {room_code}-ban. Újrapróbálkozás...")
            topics = get_all_topics() 
            room["topics"] = topics

        topic = spin_wheel(topics)
        question = generate_question(topic, topics[topic])
        
        if room and question:
            room["next_question_cache"] = question
            print(f"✅ Pre-fetched next question for {room_code}")
        elif room:
            room["next_question_cache"] = None 
            print(f"⚠️ Prefetch failed, generate_question returned None for {room_code}.")
    except Exception as e:
        print(f"⚠️ Failed to pre-fetch question for {room_code}: {e}")
        if room:
            room["next_question_cache"] = None

@socketio.on("answer_question")
def handle_answer(data):
    room_code = data.get("room")
    username = data.get("username")
    answer = data.get("answer")
    round_id = data.get("round_id")

    room = rooms.get(room_code)
    if not room or username not in room.get("active_players", []):
        return

    if round_id != room.get("current_round_id"):
        print(f"⚠️ {username} sent answer for old round {round_id}, ignoring")
        return
    
    if time.time() > room.get("round_end_time", 0):
        print(f"⏰ {username}'s answer arrived too late")
        return
    
    if username not in room["answers"]:
        room["answers"][username] = answer
        print(f"📝 {username} answered {answer}")

def evaluate_answers(room_code, round_id):
    """x mp után automatikus kiértékelés"""
    room = rooms.get(room_code)
    if not room:
        return
    
    end_time = room.get("round_end_time", 0)
    wait_time = end_time - time.time()
    
    if wait_time > 0:
        socketio.sleep(wait_time) 
    
    if room.get("current_round_id") != round_id:
        print(f"🧟 Zombie timer for {room_code}/{round_id} detected. Aborting.")
        return
    
    print(f"✅ Evaluating round {round_id} for {room_code}...")

    question = room.get("current_question")
    if not question:
        return
    
    correct_answer =question["correct"]
    active = room["active_players"]
    answers = room.get("answers", {})

    survivors = [p for p in active if answers.get(p) == correct_answer]
    eliminated = [p for p in active if p not in survivors]

    # Jelöljük, kik estek ki
    for p in eliminated:
        socketio.emit("player_eliminated", {"username": p}, room=room_code)

    room["active_players"] = survivors
    print(f"🏁 Survivors in {room_code}: {survivors}")

    if len(survivors) == 0:
        print(f"⚠️ No one answered correctly in {room_code}. Keeping all players.")

        socketio.emit(
            "round_result",
            {
                "survivors": active,
                "eliminated": [],
                "correct": correct_answer,
                "message": "Senki sem találta el! Új kérdés jön...",
                "round_id": round_id
            },
            room=room_code,
        )

        room["active_players"] = active
        socketio.sleep(5)
        send_new_question(room_code)

    elif len(survivors) == 1:
        winner = survivors[0]
        print(f"🏆 Game over! Winner: {winner}")

        socketio.emit(
            "round_result",
            {
                "survivors": survivors,
                "eliminated": eliminated,
                "correct": correct_answer,
                "round_id": round_id
            },
            room=room_code,
        )

        socketio.emit("game_over", {"winner": winner}, room=room_code)

    else:
        socketio.emit(
            "round_result",
            {
                "survivors": survivors,
                "eliminated": eliminated,
                "correct": correct_answer,
                "round_id": round_id
            },
            room=room_code,
        )
        socketio.sleep(5) 
        send_new_question(room_code)

def delayed_next_question(room_code, delay):
    """Send next question after delay without blocking"""
    socketio.sleep(delay)
    room = rooms.get(room_code)
    if room and room.get("status") == "in-progress":
        send_new_question(room_code)

def delayed_prefetch(room_code, delay_seconds):
    print(f"⏰ Prefetch timer started for {room_code}, will run in {delay_seconds}s...")
    socketio.sleep(delay_seconds)
    
    room = rooms.get(room_code)
    if room and room.get("status") == "in-progress":
        print(f"🚀 Running delayed prefetch for {room_code}")
        prefetch_next_question(room_code)
    else:
        print(f"ℹ️ Delayed prefetch for {room_code} cancelled (game not in progress).")

@socketio.on("request_current_question")
def handle_request_current_question(data):
    room_code = data.get("room")
    if not room_code or room_code not in rooms:
        return
    room = rooms[room_code]
    question = room.get("current_question")
    round_id = room.get("current_round_id")
    end_time = room.get("round_end_time") 


    if question and round_id and end_time:
        remaining = max(0, end_time - time.time())
        
        print(f"📨 {request.sid} requested current question, {remaining:.1f}s remaining")
        socketio.emit("new_question", {
            "question": question, 
            "timer": int(remaining),
            "round_id": round_id,
            "round_end_time": end_time
        }, room=request.sid)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True,use_reloader=False)
