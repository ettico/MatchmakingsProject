import  { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Match } from "../Models";
import  { userContext } from "./UserContext";

function MatchCandidates() {
  const { user} = useContext(userContext); // קבלת ה-id מהקונטקסט
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMatches() {
    if (!user?.id) {
      setError("לא נמצא מזהה משתמש");
      return;
    }
// const token=user.token
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://localhost:7012/api/MatchAI/get-gpt-matches",
        { candidateId: user.id },
//         {
//     headers: {
//   Authorization: token ? `Bearer ${token}` : ''
// }
//   }
      );

      // סינון מועמדים עם ציון מעל 60 בלבד
      const filteredMatches = response.data.filter((item: { score: number }) => item.score > 60);
      setMatches(filteredMatches);
    } catch (err: any) {
    setError(
  typeof err.response?.data === "string"
    ? err.response.data
    : JSON.stringify(err.response?.data) || err.message || "אירעה שגיאה"
);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchMatches();
    }
  }, [user?.id]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>המועמדים המתאימים עבורך</h2>

      {loading && <p>טוען התאמות...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {matches.length > 0 ? (
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>שם מלא</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ציון</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>אזהרות</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <tr key={match.userId}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.fullName}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{match.score}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {match.warnings.length > 0 ? match.warnings.join(", ") : "ללא"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>אין התאמות עם ציון מעל 60</p>
      )}
    </div>
  );
}

export default MatchCandidates;
