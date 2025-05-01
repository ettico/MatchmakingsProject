from flask import Flask, request, jsonify
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)  # 👈 זו חייבת להיות לפני כל שימוש ב-@app.route

@app.route("/match", methods=["POST"])
def match_users():
    try:
        data = request.json
        print("📥 JSON received:", data)

        user = pd.DataFrame([data["user"]])
        candidates = pd.DataFrame(data["candidates"])

        # הסרת עמודות מזהות כמו Id, FirstName, LastName
        drop_cols = ["Id", "FirstName", "LastName"]
        candidates = candidates.drop(columns=[col for col in drop_cols if col in candidates.columns], errors='ignore')

        full_data = pd.concat([user, candidates], ignore_index=True)

        # מילוי ערכים חסרים כדי למנוע NaN
        full_data = full_data.fillna("חסר")

        encoded = pd.get_dummies(full_data)

        user_vector = encoded.iloc[[0]]
        candidates_vector = encoded.iloc[1:]

        scores = cosine_similarity(user_vector, candidates_vector)[0]
        candidates["score"] = scores

        top_matches = candidates.sort_values("score", ascending=False).head(5)
        return jsonify(top_matches.to_dict(orient="records"))

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)
