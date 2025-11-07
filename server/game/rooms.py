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
        players = rooms[room_code]["players"]
        if username not in players:
            players.append(username)
            return True
        else:
            return False
    return False