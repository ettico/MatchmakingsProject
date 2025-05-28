import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday,
  Notes as NotesIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";
import { userContext } from "./UserContext";
import type { Candidate, Male, Note, Women } from "../Models";

const colors = {
  background: "#111111",
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A",
  primaryDark: "#8B5A2B",
  text: "#FFFFFF", // טקסט לבן
  darkText: "#111111",
  inputBorder: "#B87333",
  inputText: "#FFFFFF", // טקסט באינפוטים
  inputBackground: "#333333", // רקע כהה לאינפוטים
};

const MatchmakerNotes = () => {
  const { user } = useContext(userContext);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    candidateId: 0,
    candidateRole: "",
    text: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterByGender, setFilterByGender] = useState("all");
  const [importantNotes, setImportantNotes] = useState<number[]>([]);

  const fetchNotes = async () => {
    if (!user?.id) {
      console.log("user id is null");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get<Note[]>("https://localhost:7012/api/Note");
      const matchmakerNotes = response.data.filter((note) => note.matchMakerId === user.id);
      setNotes(matchmakerNotes);
    } catch (error) {
      console.error("שגיאה בטעינת הערות:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const malesResponse = await axios.get<Male[]>("https://localhost:7012/api/Male");
      const males = malesResponse.data.map((male) => ({
        ...male,
        role: "Male" as const,
      }));

      const femalesResponse = await axios.get<Women[]>("https://localhost:7012/api/Women");
      const females = femalesResponse.data.map((female) => ({
        ...female,
        role: "Women" as const,
      }));

      setCandidates([...males, ...females]);
    } catch (error) {
      console.error("שגיאה בטעינת מועמדים:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotes();
      fetchCandidates();
    }
  }, [user?.id]);
console.log(user?.firstName);
console.log(user?.lastName);
console.log(user?.id);
console.log(user?.role);
console.log(user?.token);


  const addNote = async () => {
    if (!user?.id || !newNote.text.trim() || !newNote.candidateId || !newNote.candidateRole) return;

    try {
      const noteData: Note = {
        matchMakerId: user.id,
        userId: newNote.candidateId,
        content: newNote.text,
        createdAt: new Date().toISOString(),
        id: 0 // אם ה-id לא נדרש במשלוח, תוכל להשאיר את זה
      };

      const response = await axios.post("https://localhost:7012/api/Note", noteData);
      setNotes((prev) => [...prev, response.data]);
      setNewNote({
        candidateId: 0,
        candidateRole: "",
        text: "",
      });
      setOpenDialog(false);
    } catch (error) {
      console.error("שגיאה בהוספת הערה:", error);
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;

    try {
      await axios.put(`https://localhost:7012/api/Note/${editingNote.id}`, editingNote);
      setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? editingNote : note)));
      setEditingNote(null);
    } catch (error) {
      console.error("שגיאה בעדכון הערה:", error);
    }
  };

  const deleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await axios.delete(`https://localhost:7012/api/Note/${noteToDelete}`);
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete));
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("שגיאה במחיקת הערה:", error);
    }
  };

  const openDeleteDialog = (noteId: number) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const toggleImportantNote = (noteId: number) => {
    if (importantNotes.includes(noteId)) {
      setImportantNotes((prev) => prev.filter((id) => id !== noteId));
    } else {
      setImportantNotes((prev) => [...prev, noteId]);
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = note.content.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    if (filterByGender !== "all") {
      if (note.userId && filterByGender === "Women") return false;
      if (note.userId && filterByGender === "Male") return false;
    }

    return true;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const groupedNotes: Record<string, Note[]> = {};
  sortedNotes.forEach((note) => {
    const key = `User-${note.userId}`;
    if (!groupedNotes[key]) {
      groupedNotes[key] = [];
    }
    groupedNotes[key].push(note);
  });

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto", backgroundColor: colors.background }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: colors.primary }}>
          הערות שדכנית
        </Typography>
        <Badge badgeContent={notes.length} color="warning">
          <NotesIcon sx={{ fontSize: 28, color: colors.primary }} />
        </Badge>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: "rgba(30, 30, 30, 0.7)" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              placeholder="חיפוש הערות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.primary }} />
                  </InputAdornment>
                ),
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.inputBorder,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primaryLight,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                  "& input": {
                    color: colors.inputText, // צבע טקסט באינפוט
                  },
                },
              }}
            />
          </Grid>

        <Grid item xs={12} md={7}>
  <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" }, flexWrap: "wrap" }}>
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="filter-select-label" sx={{ color: colors.text }}>סנן לפי מגדר</InputLabel>
      <Select
        labelId="filter-select-label"
        value={filterByGender}
        onChange={(e) => setFilterByGender(e.target.value)}
        label="סנן לפי מגדר"
        sx={{
          backgroundColor: colors.inputBackground,
          color: colors.inputText,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.inputBorder,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primaryLight,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primary,
          },
          "& .MuiSelect-icon": {
            color: colors.primary,
          },
        }}
      >
        <MenuItem value="all">הכל</MenuItem>
        <MenuItem value="Male">גברים</MenuItem>
        <MenuItem value="Women">נשים</MenuItem>
      </Select>
    </FormControl>

    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel id="sort-select-label" sx={{ color: colors.text }}>מיין לפי</InputLabel>
      <Select
        labelId="sort-select-label"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        label="מיין לפי"
        sx={{
          backgroundColor: colors.inputBackground,
          color: colors.inputText,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.inputBorder,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primaryLight,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.primary,
          },
          "& .MuiSelect-icon": {
            color: colors.primary,
          },
        }}
      >
        <MenuItem value="date">תאריך</MenuItem>
        <MenuItem value="name">שם</MenuItem>
      </Select>
    </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{ backgroundColor: colors.primary, color: colors.darkText }}
              >
                הוסף הערה חדשה
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress sx={{ color: colors.primary }} />
        </Box>
      ) : Object.keys(groupedNotes).length > 0 ? (
        <Grid container spacing={3}>
          {Object.entries(groupedNotes).map(([userKey, userNotes]) => {
            const userId = userKey.split("-")[1];
            const candidate = candidates.find((c) => c.id === Number(userId));

            if (!candidate) return null;

            return (
              <Grid item xs={12} md={6} key={userKey}>
                <Card sx={{ backgroundColor: "rgba(30, 30, 30, 0.7)", color: colors.text }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: colors.primaryDark, color: colors.darkText, mr: 2 }}>
                        {candidate.firstName?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: colors.primary }}>
                          {candidate.firstName} {candidate.lastName}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <Chip size="small" label={candidate.role} sx={{ backgroundColor: colors.primaryDark, color: colors.darkText, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: colors.text + "80" }}>
                            {userNotes.length} הערות
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ backgroundColor: colors.primary + "30", my: 2 }} />

                    {userNotes.map((note) => (
                      <Box key={note.id} sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: "rgba(40, 40, 40, 0.7)" }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {note.content}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" sx={{ color: colors.text + "80", display: "flex", alignItems: "center" }}>
                            <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: colors.primary }} />
                            {new Date(note.createdAt).toLocaleDateString("he-IL", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>

                          <Box>
                            <IconButton size="small" onClick={() => setEditingNote(note)} sx={{ color: colors.primary }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => openDeleteDialog(note.id)} sx={{ color: colors.primary }}>
                              <DeleteIcon />
                            </IconButton>
                            <IconButton size="small" onClick={() => toggleImportantNote(note.id)} sx={{ color: colors.primary }}>
                              {importantNotes.includes(note.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Paper sx={{ p: 5, textAlign: "center", backgroundColor: "rgba(30, 30, 30, 0.7)", borderRadius: 3 }}>
          <NotesIcon sx={{ fontSize: 60, color: colors.primary, opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" sx={{ color: colors.primary }}>
            אין הערות להצגה
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mt: 3, backgroundColor: colors.primary, color: colors.darkText }}
          >
            הוסף הערה ראשונה
          </Button>
        </Paper>
      )}

      {/* דיאלוג הוספת הערה */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>הוספת הערה חדשה</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="candidate-select-label">בחר מועמד</InputLabel>
            <Select
              labelId="candidate-select-label"
              value={`${newNote.candidateRole}-${newNote.candidateId}`}
              onChange={(e) => {
                const [role, id] = e.target.value.split("-");
                setNewNote({
                  ...newNote,
                  candidateRole: role,
                  candidateId: Number(id),
                });
              }}
              label="בחר מועמד"
            >
              {candidates.map((candidate) => (
                <MenuItem key={`${candidate.role}-${candidate.id}`} value={`${candidate.role}-${candidate.id}`}>
                  {candidate.firstName} {candidate.lastName} ({candidate.role === "Male" ? "גבר" : "אישה"})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="תוכן ההערה"
            value={newNote.text}
            onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}   sx={{ mt: 3, color: colors.darkText }}>בטל</Button>
          <Button variant="contained" onClick={addNote} disabled={!newNote.text.trim() || !newNote.candidateId || !newNote.candidateRole}  sx={{ mt: 3, backgroundColor: colors.primary, color: colors.background }}>
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג מחיקת הערה */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>מחיקת הערה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק הערה זו?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>בטל</Button>
          <Button variant="contained" color="error" onClick={deleteNote}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עדכון הערה */}
      <Dialog open={!!editingNote} onClose={() => setEditingNote(null)} maxWidth="sm" fullWidth>
        <DialogTitle>עדכון הערה</DialogTitle>
        <DialogContent>
          {editingNote && (
            <>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="תוכן ההערה"
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingNote(null)}  sx={{ mt: 3, color: colors.darkText }}>בטל</Button>
          <Button variant="contained" onClick={updateNote} disabled={!editingNote?.content.trim()}  sx={{ mt: 3, backgroundColor: colors.primary, color: colors.darkText }}>
            עדכן
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MatchmakerNotes;
