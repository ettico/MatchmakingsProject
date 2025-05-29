import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Match, Male, Women } from "../Models";
import { userContext } from "./UserContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  Button,
  AppBar,
  Toolbar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function MatchCandidates() {
  const { id, role } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(userContext);

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Male | Women | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

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
        "https://localhost:7012/api/MatchAI/get-gpt-matches",
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
    setSelectedProfile(null);

    const url = role === "Women"
      ? `https://localhost:7012/api/Male/${userId}`
      : `https://localhost:7012/api/Women/${userId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : ""
        }
      });

      setSelectedProfile(response.data);
    } catch (err) {
      console.error("שגיאה בעת שליפת פרופיל:", err);
    } finally {
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <Dialog open={true} fullScreen onClose={() => navigate(-1)}>
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

      <Box sx={{ maxWidth: 800, margin: "auto", p: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: "#6B3E26" }}>
          המועמדים המתאימים עבורך
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}

        <Dialog open={!!selectedProfile} onClose={() => setSelectedProfile(null)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ backgroundColor: "#6B3E26", color: "#fff" }}>
            פרופיל של: {selectedProfile?.firstName} {selectedProfile?.lastName}
            <IconButton
              aria-label="close"
              onClick={() => setSelectedProfile(null)}
              sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ backgroundColor: "#fef9f4" }}>
            {profileLoading ? (
              <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : (
              <>
                <Typography>עיר: {selectedProfile?.city}</Typography>
                <Typography>גיל: {selectedProfile?.age}</Typography>
                <Typography>רקע: {selectedProfile?.backGround}</Typography>
                <Typography>גובה: {selectedProfile?.height} ס"מ</Typography>
                <Typography>טלפון: {selectedProfile?.phone}</Typography>
                <Typography>עוד מידע: {selectedProfile?.moreInformation}</Typography>
              </>
            )}
          </DialogContent>
        </Dialog>

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
