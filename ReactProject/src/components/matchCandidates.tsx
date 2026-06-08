// MatchCandidates.tsx - גרסה משודרגת
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Match, Male, Women } from "../Models";
import { userContext } from "./UserContext";
import {
  Dialog,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserProfile from "../components/Candidateprofile"; // ודאי שזה הנתיב לקובץ של הקומפוננטה המעוצבת

function MatchCandidates() {
  const { id, role } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(userContext);

  const [matches, setMatches] = useState<Match[]>([]);
  const [viewingProfile, setViewingProfile] = useState<Male | Women | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ApiUrl = "https://matchmakingsprojectserver.onrender.com/api";

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    const numericId = parseInt(id ?? "");
    if (isNaN(numericId)) {
      setError("המזהה אינו מספר תקני");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${ApiUrl}/MatchAI/get-gpt-matches`, { id: numericId }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      const filteredMatches = response.data.filter((item: { score: number }) => item.score > 60);
      setMatches(filteredMatches);
    } catch (err: any) {
      setError("אירעה שגיאה בטעינת ההתאמות");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile(userId: number) {
    if (!role) return;
    setProfileLoading(true);
    // בחירת ה-URL לפי התפקיד (שימי לב שהתאמתי את זה לפי הצורך)
    const url = `${ApiUrl}/${role === "Women" ? "Male" : "Women"}/${userId}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      setViewingProfile(response.data);
    } catch (err) {
      console.error("שגיאה בעת שליפת פרופיל:", err);
    } finally {
      setProfileLoading(false);
    }
  }

  return (
    <Dialog open fullScreen onClose={() => navigate(-1)}>
      <AppBar sx={{ position: "relative", backgroundColor: "#6B3E26" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">התאמות עבורך</Typography>
        </Toolbar>
      </AppBar>

      {/* תצוגת פרופיל מלאה (השדרוג) */}
      {viewingProfile && (
        <Box sx={{ p: 0 }}>
          <UserProfile 
            candidateData={{ ...viewingProfile, role: role === "Women" ? "Male" : "Women" }} 
            onClose={() => setViewingProfile(null)} 
          />
        </Box>
      )}

      {/* רשימת המועמדים - מוסתרת רק אם פרופיל פתוח, או נשארת כרשימה */}
      {!viewingProfile && (
        <Box sx={{ maxWidth: 1000, margin: "auto", p: 4 }}>
          <Typography variant="h4" align="center" sx={{ color: "#6B3E26", mb: 4 }}>
            המועמדים שיכולים להתאים
          </Typography>
          
          {loading && <CircularProgress />}
          {matches.map((match) => (
             <Box key={match.userId} sx={{ display: "flex", justifyContent: "space-between", p: 2, borderBottom: "1px solid #eee" }}>
               <Typography>{match.fullName}</Typography>
               <Typography>ציון: {match.score}</Typography>
               <Button onClick={() => fetchProfile(match.userId)} disabled={profileLoading}>
                 הצג פרופיל
               </Button>
             </Box>
          ))}
        </Box>
      )}
    </Dialog>
  );
}

export default MatchCandidates;