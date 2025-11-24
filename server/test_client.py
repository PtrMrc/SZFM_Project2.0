import pytest
from unittest.mock import patch, MagicMock
from app import app, socketio, solo_games, rooms

MOCK_QUESTION = {
    "question": "Ki írta a Python programozási nyelvet?",
    "choices": ["Guido van Rossum", "James Gosling", "Bjarne Stroustrup", "Yukihiro Matsumoto"],
    "correct": "Guido van Rossum"
}
MOCK_TOPICS = {"General Knowledge": 9, "Books": 10}
MOCK_TOPIC_NAME = "General Knowledge"
MOCK_AI_MESSAGES = ["Hello!", "Let's go!"]

@pytest.fixture
def client():
    """Létrehoz egy Socket.IO tesztklienset."""
    app.config['TESTING'] = True
    rooms.clear()
    solo_games.clear()
    with app.test_client() as client:
        yield socketio.test_client(app, flask_test_client=client)

@patch('app.get_all_topics', return_value=MOCK_TOPICS)
@patch('app.spin_wheel', return_value=MOCK_TOPIC_NAME)
@patch('app.generate_question', return_value=MOCK_QUESTION)
def test_game_creation_and_join(mock_gen_q, mock_spin, mock_topics, client):
    """Teszteli a szoba létrehozását és a játékosok csatlakozását."""
    
    client_host = client
    client_player2 = socketio.test_client(app)

    room_code = "TEST01"
    
    client_host.emit("join_room", {"username": "HostGamer", "room": room_code})
    received_host = client_host.get_received()
    assert received_host[0]['name'] == 'join_success'
    
    client_player2.emit("join_room", {"username": "PlayerTwo", "room": room_code})
    received_player2 = client_player2.get_received()
    assert received_player2[0]['name'] == 'join_success'
    
    received_host_after_p2 = client_host.get_received()
    assert any(msg['name'] == 'player_joined' for msg in received_host_after_p2)
    assert len(rooms[room_code]['players']) == 2


@patch('app.socketio.sleep')
@patch('app.generate_ai_commentator_messages', return_value=MOCK_AI_MESSAGES) 
@patch('app.get_all_topics', return_value=MOCK_TOPICS)
@patch('app.spin_wheel', return_value=MOCK_TOPIC_NAME)
@patch('app.generate_question', return_value=MOCK_QUESTION)
def test_multiplayer_game_flow_and_elimination(mock_gen_q, mock_spin, mock_topics, mock_ai_messages, mock_sleep, client):
    """Teszteli a teljes játékmenetet, a kérdésküldést és a kiesést."""
    mock_sleep.side_effect = lambda x: None
    
    client_host = client
    client_p2 = socketio.test_client(app)
    room_code = "GAME01"

    client_host.emit("join_room", {"username": "Alice", "room": room_code})
    client_p2.emit("join_room", {"username": "Bob", "room": room_code})
    client_host.get_received() 
    client_p2.get_received()
    
    client_host.emit("start_game", {"username": "Alice", "room": room_code})

    host_start = client_host.get_received()
    assert host_start[0]['name'] == 'game_starting'

    

@patch('app.socketio.sleep')
@patch('app.random.randint', return_value=50) 
@patch('app.get_all_topics', return_value=MOCK_TOPICS)
@patch('app.spin_wheel', return_value=MOCK_TOPIC_NAME)
@patch('app.generate_question', return_value=MOCK_QUESTION)
def test_solo_game_flow(mock_gen_q, mock_spin, mock_topics, mock_random, mock_sleep, client):
    """Teszteli a szóló játékmenetet és az AI pontozását."""
    mock_sleep.side_effect = lambda x: None
    
    client_solo = client
    username = "SoloPlayer"
    num_questions = 1 
    ai_difficulty = 50

    client_solo.emit("start_solo_game", {
        "username": username,
        "num_questions": num_questions,
        "ai_difficulty": ai_difficulty
    })

    created_data = client_solo.get_received()
    assert created_data[0]['name'] == 'solo_game_created'
    session_id = created_data[0]['args'][0]['session_id']

   
        