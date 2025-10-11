import random
import cohere
import json

# Api kulcs beillesztése
COHERE_API_KEY = "Generáltass egy trialt a coherevel és másold be ide"
co = cohere.Client(COHERE_API_KEY)

#Témakörök
TOPICS = ["Matematika", "Történelem", "Tudomány", "Földrajz", "Filmek", "Sport"]

def spin_wheel():
    """
    Lestimulál egy szerencsekerék pörgetést és visszaad egy véletlenszerű témakört.
    """
    chosen_topic = random.choice(TOPICS)
    return chosen_topic

def generate_question(topic):
    """
    Kérdésgenerálás a Cohere API segítségével adott témakör alapján.
    """
    prompt = (
        f"Generate a multiple-choice question about '{topic}' in hungarian. "
        "Include 4 choices and mark the correct answer. "
        "Return the result in JSON format like this:\n"
        "{\n  'question': '...',\n  'choices': ['a','b','c','d'],\n  'correct': '...'\n}"
    )

    response = co.chat(
    model="command-a-03-2025",
    message=prompt,
    max_tokens=150,
    temperature=0.7
    )

    try:
        # A helyes attribútum használata
        response_text = response.text
        
        # Markdown kódblokk eltávolítása, ha van
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        # JSON parse
        question_json = json.loads(response_text)
        
        # Ellenőrzés, hogy minden szükséges mező megvan-e
        if not all(key in question_json for key in ["question", "choices", "correct"]):
            raise ValueError("Missing required fields in JSON")
            
    except Exception as e:
        print(f"Error parsing Cohere response: {e}")
        print(f"Raw response: {response.text[:200]}...")  
        question_json = {
            "question": f"Minta kérdés a következő témakörben: {topic}",
            "choices": ["A", "B", "C", "D"],
            "correct": "A"
        }

    return question_json
