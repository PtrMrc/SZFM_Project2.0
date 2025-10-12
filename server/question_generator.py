import random
import requests
import html

def get_all_topics():
    """
    Lekéri az összes elérhető kategóriát az Open Trivia DB API-ból.
    """
    url = "https://opentdb.com/api_category.php"
    response = requests.get(url)
    data = response.json()

    # Dictionary: {"Category Name": id, ...}
    topics = {cat["name"]: cat["id"] for cat in data["trivia_categories"]}
    return topics

def spin_wheel(topics):
    """
    Véletlenszerű témakör kiválasztása az elérhető listából.
    """
    chosen_topic = random.choice(list(topics.keys()))
    return chosen_topic

def generate_question(topic, category_id):
    """
    Kérdés lekérése az Open Trivia DB API-ból az adott kategória alapján.
    """
    url = f"https://opentdb.com/api.php?amount=1&category={category_id}&type=multiple"

    try:
        response = requests.get(url)
        data = response.json()

        if data["response_code"] != 0 or not data["results"]:
            raise ValueError("No results from Open Trivia DB")

        q = data["results"][0]
        question = html.unescape(q["question"])
        correct = html.unescape(q["correct_answer"])
        choices = [html.unescape(ans) for ans in q["incorrect_answers"]]
        choices.append(correct)
        random.shuffle(choices)

        question_json = {
            "question": question,
            "choices": choices,
            "correct": correct
        }

    except Exception as e:
        print(f"Hiba a kérdés lekérésekor: {e}")
        question_json = {
            "question": f"Minta kérdés a következő témakörben: {topic}",
            "choices": ["A", "B", "C", "D"],
            "correct": "A"
        }

    return question_json


# Példa használat
if __name__ == "__main__":
    TOPICS = get_all_topics()
    print(f"Elérhető témakörök száma: {len(TOPICS)}")
    topic = spin_wheel(TOPICS)
    print("Kiválasztott témakör:", topic)
    question = generate_question(topic, TOPICS[topic])
    print(question)
