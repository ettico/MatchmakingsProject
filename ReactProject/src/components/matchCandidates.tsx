import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Match, Male, Women } from "../Models";
import { userContext } from "./UserContext";
import {
  Dialog,
//   DialogTitle,
//   DialogContent,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function MatchCandidates() {
  const { id, role } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const [matches, setMatches] = useState<Match[]>([]);
  const [viewingProfile, setViewingProfile] = useState<Male | Women | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const ApiUrl=process.env.REACT_APP_API_URL

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
    setError(null);

    try {
      const response = await axios.post(
        `${ApiUrl}/MatchAI/get-gpt-matches`,
        numericId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token ? `Bearer ${user.token}` : ""
          }
        }
      );
      const filteredMatches = response.data.filter((item: { score: number }) => item.score > 60);
      setMatches(filteredMatches);
    } catch (err: any) {
      setError(err.message || "אירעה שגיאה");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile(userId: number) {
    if (!role) {
      setError("סוג משתמש חסר.");
      return;
    }

    setProfileLoading(true);
    setViewingProfile(null);

    const url = role === "Women"
      ? `${ApiUrl}/Male/${userId}`
      : `${ApiUrl}/Women/${userId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : ""
        }
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
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            התאמות עבורך
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1000, margin: "auto", p: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: "#6B3E26" }}>
          המועמדים שיכולים להתאים  
        </Typography>

        {/* פרופיל מועמד מוצג מעל הטבלה */}
        {viewingProfile && (
          <Card sx={{ mb: 3, backgroundColor: "#fff6f0", boxShadow: 3, position: "relative" }}>
            <CardContent>
              <Typography variant="h6">
                {viewingProfile.firstName} {viewingProfile.lastName}
              </Typography>
              <Typography>עיר: {viewingProfile.city}</Typography>
              <Typography>גיל: {viewingProfile.age}</Typography>
              <Typography>רקע: {viewingProfile.backGround}</Typography>
              <Typography>גובה: {viewingProfile.height} ס"מ</Typography>
              <Typography>טלפון: {viewingProfile.phone}</Typography>
              <Typography>עוד מידע: {viewingProfile.moreInformation}</Typography>
              {profileLoading && (
                <Box mt={2} display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                onClick={() => setViewingProfile(null)}
                variant="contained"
                color="secondary"
                sx={{ backgroundColor: "#6B3E26" }}
              >
                סגור פרופיל
              </Button>
            </CardActions>
          </Card>
        )}

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        {matches.length > 0 && (
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
            <Box component="thead" sx={{ backgroundColor: "#6B3E26" }}>
              <Box component="tr">
                <Box component="th" sx={{ color: "#fff", padding: 1, border: "1px solid #ccc" }}>שם מלא</Box>
                <Box component="th" sx={{ color: "#fff", padding: 1, border: "1px solid #ccc" }}>ציון</Box>
                <Box component="th" sx={{ color: "#fff", padding: 1, border: "1px solid #ccc" }}>פעולה</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {matches.map((match) => (
                <Box component="tr" key={match.userId}>
                  <Box component="td" sx={{ padding: 1, border: "1px solid #ccc" }}>{match.fullName}</Box>
                  <Box component="td" sx={{ padding: 1, border: "1px solid #ccc" }}>{match.score}</Box>
                  <Box component="td" sx={{ padding: 1, border: "1px solid #ccc" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ color: "#6B3E26", borderColor: "#6B3E26" }}
                      onClick={() => fetchProfile(match.userId)}
                      disabled={profileLoading}
                    >
                      הצג פרופיל
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {!loading && matches.length === 0 && <Typography>אין התאמות עם ציון מעל 60</Typography>}
      </Box>
    </Dialog>
  );
}

export default MatchCandidates;
