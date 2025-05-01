from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

@app.route("/match", methods=["POST"])
def match_users():
    data = request.json
    user = pd.DataFrame([data["user"]])
    candidates = pd.DataFrame(data["candidates"])

    # ממירים ערכים טקסטואליים למספרים פשוטים
    full_data = pd.concat([user, candidates], ignore_index=True)
    encoded = pd.get_dummies(full_data)

    user_vector = encoded.iloc[[0]]
    candidates_vector = encoded.iloc[1:]

    # חישוב דמיון קוסינוס
    scores = cosine_similarity(user_vector, candidates_vector)[0]
    candidates["score"] = scores

    top_matches = candidates.sort_values("score", ascending=False).head(5)
    return jsonify(top_matches.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(port=5001)

