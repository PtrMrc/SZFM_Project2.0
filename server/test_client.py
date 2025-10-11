import socketio

from question_generator import spin_wheel, generate_question

topic = spin_wheel()
print("Topic chosen:", topic)

question = generate_question(topic)
print("Generated question:", question["question"])
print("Choices:", question["choices"])
print("Correct answer:", question["correct"])

sio = socketio.Client()

@sio.event
def connect():
    print("Connected to server!")

@sio.event
def disconnect():
    print("Disconnected from server")

@sio.on("new_question")
def new_question(data):
    print("Question received:", data["question"])
    print("Choices:", data["choices"])
    print("Correct answer:", data["correct"])

@sio.on("error")
def error(data):
    print("Error:", data)


sio.connect("http://localhost:5000")

sio.emit("join_room", {"username": "Tester", "room": "ROOM123"})

sio.emit("start_game", {"room": "ROOM123"})

sio.wait()
