rooms = {
    "ROOM123": {
        "players": ["Anna", "Béla"],
        "status": "waiting",
        "current_question": None
    }
}

def create_room(room_code):
    if room_code not in rooms:
        rooms[room_code] = {
            "players": [],
            "status": "waiting",
            "current_question": None
        }
    return rooms[room_code]

def add_player(room_code, username):
    if room_code in rooms:
        rooms[room_code]["players"].append(username)