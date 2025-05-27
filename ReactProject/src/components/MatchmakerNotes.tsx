"use client"

import { useState, useEffect, useContext } from "react"
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
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  CalendarToday,
  Notes as NotesIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from "@mui/icons-material"
import axios from "axios"
import { userContext } from "./UserContext"
import type { Candidate, Male, Note, Women } from "../Models"

// צבעים חדשים
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

// interface Candidate {
//   id: number
//   firstName: string
//   lastName: string
//   role: string
// }

const MatchmakerNotes = () => {
  const { user } = useContext(userContext)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    candidateId: 0,
    candidateRole: "",
    text: "",
  })
  const [openDialog, setOpenDialog] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date") // date, name
  const [filterByGender, setFilterByGender] = useState("all") // all, Male, Women
  const [importantNotes, setImportantNotes] = useState<number[]>([])

  // טעינת הערות
  const fetchNotes = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const response = await axios.get<Note[]>("https://localhost:7012/api/Note")
      // סינון הערות לפי ID של השדכנית
      const matchmakerNotes = response.data.filter((note) => note.matchmakerId === user.id)
      setNotes(matchmakerNotes)
    } catch (error) {
      console.error("שגיאה בטעינת הערות:", error)
    } finally {
      setLoading(false)
    }
  }

  // טעינת מועמדים
  const fetchCandidates = async () => {
    try {
      // טעינת גברים
      const malesResponse = await axios.get<Male[]>("https://localhost:7012/api/Male")
      const males = malesResponse.data.map((male) => ({
        ...male,
        role: "Male" as const,
      }))

      // טעינת נשים
      const femalesResponse = await axios.get<Women[]>("https://localhost:7012/api/Women")
      const females = femalesResponse.data.map((female) => ({
        ...female,
        role: "Women" as const,
      }))

      // איחוד הנתונים
      setCandidates([...males, ...females])

      // הוספת לוג לבדיקה
      console.log("נטענו:", males.length, "גברים,", females.length, "נשים")
      console.log("סה״כ מועמדים:", males.length + females.length)

      console.log("מועמדים נטענו בהצלחה:", candidates.length)
    } catch (error) {
      console.error("שגיאה בטעינת מועמדים:", error)
      // הוספת מידע נוסף לדיבוג
      if (axios.isAxiosError(error)) {
        console.error("פרטי השגיאה:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        })
      }
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchNotes()
      fetchCandidates()
    }
  }, [user?.id])

  // הוספת הערה חדשה
  const addNote = async () => {
    if (!user?.id || !newNote.text.trim() || !newNote.candidateId || !newNote.candidateRole) return

    try {
      const noteData: Partial<Note> = {
        matchmakerId: user.id,
        candidateId: newNote.candidateId,
        candidateRole: newNote.candidateRole,
        text: newNote.text,
        createdAt: new Date().toISOString(),
      }

      const response = await axios.post("https://localhost:7012/api/Note", noteData)
      setNotes((prev) => [...prev, response.data])
      setNewNote({
        candidateId: 0,
        candidateRole: "",
        text: "",
      })
      setOpenDialog(false)
    } catch (error) {
      console.error("שגיאה בהוספת הערה:", error)
    }
  }

  // עדכון הערה
  const updateNote = async () => {
    if (!editingNote) return

    try {
      await axios.put(`https://localhost:7012/api/Note/${editingNote.id}`, editingNote)
      setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? editingNote : note)))
      setEditingNote(null)
    } catch (error) {
      console.error("שגיאה בעדכון הערה:", error)
    }
  }

  // מחיקת הערה
  const deleteNote = async () => {
    if (!noteToDelete) return

    try {
      await axios.delete(`https://localhost:7012/api/Note/${noteToDelete}`)
      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete))
      setDeleteDialogOpen(false)
      setNoteToDelete(null)

      // Remove from important notes if it was marked
      if (importantNotes.includes(noteToDelete)) {
        setImportantNotes((prev) => prev.filter((id) => id !== noteToDelete))
      }
    } catch (error) {
      console.error("שגיאה במחיקת הערה:", error)
    }
  }

  // פתיחת דיאלוג מחיקה
  const openDeleteDialog = (noteId: number) => {
    setNoteToDelete(noteId)
    setDeleteDialogOpen(true)
  }

  // Toggle important note
  const toggleImportantNote = (noteId: number) => {
    if (importantNotes.includes(noteId)) {
      setImportantNotes((prev) => prev.filter((id) => id !== noteId))
    } else {
      setImportantNotes((prev) => [...prev, noteId])
    }
  }

  // סינון הערות לפי חיפוש
  const filteredNotes = notes.filter((note) => {
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const candidate = candidates.find((c) => c.id === note.candidateId && c.role === note.candidateRole)

      const matchesSearch =
        note.text.toLowerCase().includes(searchLower) ||
        (candidate &&
          (candidate.firstName.toLowerCase().includes(searchLower) ||
            candidate.lastName.toLowerCase().includes(searchLower)))

      if (!matchesSearch) return false
    }

    // Filter by gender - תיקון החיפוש לפי מין
    if (filterByGender !== "all") {
      if (note.candidateRole !== filterByGender) return false
    }

    return true
  })

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "name") {
      const candidateA = candidates.find((c) => c.id === a.candidateId && c.role === a.candidateRole)
      const candidateB = candidates.find((c) => c.id === b.candidateId && c.role === b.candidateRole)

      if (!candidateA || !candidateB) return 0

      return `${candidateA.firstName} ${candidateA.lastName}`.localeCompare(
        `${candidateB.firstName} ${candidateB.lastName}`,
      )
    }
    return 0
  })

  // Group notes by candidate
  const groupedNotes: Record<string, Note[]> = {}
  sortedNotes.forEach((note) => {
    const key = `${note.candidateRole}-${note.candidateId}`
    if (!groupedNotes[key]) {
      groupedNotes[key] = []
    }
    groupedNotes[key].push(note)
  })

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: colors.primary,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: "60px",
              height: "3px",
              backgroundColor: colors.primary,
            },
          }}
        >
          הערות שדכנית
        </Typography>

        <Badge
          badgeContent={notes.length}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: colors.primary,
              color: colors.darkText,
            },
          }}
        >
          <NotesIcon sx={{ fontSize: 28, color: colors.primary }} />
        </Badge>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: "rgba(30, 30, 30, 0.7)",
          border: `1px solid ${colors.primary}30`,
        }}
      >
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
                  borderRadius: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: colors.text,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.primary}50`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" }, flexWrap: "wrap" }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.primary}50`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                  "& .MuiSelect-select": {
                    color: colors.text,
                  },
                  "& .MuiSvgIcon-root": {
                    color: colors.primary,
                  },
                }}
              >
                <InputLabel id="filter-gender-label" sx={{ color: colors.text }}>
                  סינון לפי
                </InputLabel>
                <Select
                  labelId="filter-gender-label"
                  value={filterByGender}
                  label="סינון לפי"
                  onChange={(e) => setFilterByGender(e.target.value)}
                  startAdornment={<FilterListIcon sx={{ color: colors.primary, mr: 1 }} />}
                >
                  <MenuItem value="all">הכל</MenuItem>
                  <MenuItem value="Male">גברים</MenuItem>
                  <MenuItem value="Women">נשים</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${colors.primary}50`,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                  "& .MuiSelect-select": {
                    color: colors.text,
                  },
                  "& .MuiSvgIcon-root": {
                    color: colors.primary,
                  },
                }}
              >
                <InputLabel id="sort-by-label" sx={{ color: colors.text }}>
                  מיון לפי
                </InputLabel>
                <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="מיון לפי"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={<SortIcon sx={{ color: colors.primary, mr: 1 }} />}
                >
                  <MenuItem value="date">תאריך</MenuItem>
                  <MenuItem value="name">שם</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  backgroundColor: colors.primary,
                  color: colors.darkText,
                  "&:hover": {
                    backgroundColor: colors.primaryLight,
                  },
                  borderRadius: 3,
                  boxShadow: `0 4px 10px ${colors.primary}40`,
                }}
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
          {Object.entries(groupedNotes).map(([candidateKey, candidateNotes]) => {
            const [role, idStr] = candidateKey.split("-")
            const candidate = candidates.find((c) => c.id === Number.parseInt(idStr) && c.role === role)

            if (!candidate) return null

            return (
              <Grid item xs={12} md={6} key={candidateKey}>
                <Card
                  sx={{
                    backgroundColor: "rgba(30, 30, 30, 0.7)",
                    color: colors.text,
                    borderRadius: 3,
                    border: `1px solid ${colors.primary}30`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: `0 10px 20px ${colors.primary}30`,
                      transform: "translateY(-5px)",
                      border: `1px solid ${colors.primary}70`,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: role === "Male" ? colors.primaryDark : colors.primary,
                          color: colors.darkText,
                          mr: 2,
                        }}
                      >
                        {candidate.firstName?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: colors.primary }}>
                          {candidate.firstName} {candidate.lastName}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={role === "Male" ? "גבר" : "אישה"}
                            sx={{
                              backgroundColor: role === "Male" ? colors.primaryDark : colors.primary,
                              color: colors.darkText,
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: colors.text + "80" }}>
                            {candidateNotes.length} הערות
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ backgroundColor: colors.primary + "30", my: 2 }} />

                    {candidateNotes.map((note) => (
                      <Box
                        key={note.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "rgba(40, 40, 40, 0.7)",
                          border: importantNotes.includes(note.id)
                            ? `1px solid ${colors.primary}`
                            : `1px solid transparent`,
                          position: "relative",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(50, 50, 50, 0.7)",
                            "& .note-actions": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        {editingNote && editingNote.id === note.id ? (
                          <Box>
                            <TextField
                              fullWidth
                              multiline
                              rows={3}
                              value={editingNote.text}
                              onChange={(e) => setEditingNote({ ...editingNote, text: e.target.value })}
                              sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                  color: colors.text,
                                  "& fieldset": {
                                    borderColor: `${colors.primary}50`,
                                  },
                                  "&:hover fieldset": {
                                    borderColor: colors.primary,
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: colors.primary,
                                  },
                                },
                              }}
                            />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<SaveIcon />}
                                onClick={updateNote}
                                disabled={!editingNote.text.trim()}
                                sx={{
                                  backgroundColor: colors.primary,
                                  color: colors.darkText,
                                  "&:hover": {
                                    backgroundColor: colors.primaryLight,
                                  },
                                }}
                              >
                                שמור
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setEditingNote(null)}
                                sx={{
                                  borderColor: colors.primary,
                                  color: colors.primary,
                                  "&:hover": {
                                    borderColor: colors.primaryLight,
                                    backgroundColor: `${colors.primary}10`,
                                  },
                                }}
                              >
                                בטל
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                              {note.text}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography
                                variant="caption"
                                sx={{ color: colors.text + "80", display: "flex", alignItems: "center" }}
                              >
                                <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: colors.primary }} />
                                {new Date(note.createdAt).toLocaleDateString("he-IL", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() => toggleImportantNote(note.id)}
                                sx={{ color: colors.primary }}
                              >
                                {importantNotes.includes(note.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                              </IconButton>
                            </Box>
                            <Box
                              className="note-actions"
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                display: "flex",
                                gap: 1,
                                opacity: 0,
                                transition: "opacity 0.2s ease",
                              }}
                            >
                              <IconButton
                                size="small"
                                sx={{ color: colors.primary }}
                                onClick={() => setEditingNote(note)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{ color: "#f44336" }}
                                onClick={() => openDeleteDialog(note.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            backgroundColor: "rgba(30, 30, 30, 0.7)",
            borderRadius: 3,
            border: `1px solid ${colors.primary}30`,
          }}
        >
          <NotesIcon sx={{ fontSize: 60, color: colors.primary, opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" sx={{ color: colors.primary }}>
            אין הערות להצגה
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text + "80", mt: 1 }}>
            {searchQuery ? "לא נמצאו הערות התואמות את החיפוש" : "התחל להוסיף הערות למועמדים"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              mt: 3,
              backgroundColor: colors.primary,
              color: colors.darkText,
              "&:hover": {
                backgroundColor: colors.primaryLight,
              },
              borderRadius: 3,
            }}
          >
            הוסף הערה ראשונה
          </Button>
        </Paper>
      )}

      {/* דיאלוג הוספת הערה */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#222222",
            color: colors.text,
            borderRadius: 3,
            border: `1px solid ${colors.primary}40`,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.primary, borderBottom: `1px solid ${colors.primary}30`, pb: 2 }}>
          הוספת הערה חדשה
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl
            fullWidth
            sx={{
              mt: 2,
              mb: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${colors.primary}50`,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.primary,
              },
              "& .MuiSelect-select": {
                color: colors.text,
              },
              "& .MuiSvgIcon-root": {
                color: colors.primary,
              },
              "& .MuiInputLabel-root": {
                color: colors.text,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: colors.primary,
              },
            }}
          >
            <InputLabel id="candidate-select-label">בחר מועמד</InputLabel>
            <Select
              labelId="candidate-select-label"
              value={`${newNote.candidateRole}-${newNote.candidateId}`}
              onChange={(e) => {
                const [role, id] = e.target.value.split("-")
                setNewNote({
                  ...newNote,
                  candidateRole: role,
                  candidateId: Number(id),
                })
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
            sx={{
              "& .MuiOutlinedInput-root": {
                color: colors.text,
                "& fieldset": {
                  borderColor: `${colors.primary}50`,
                },
                "&:hover fieldset": {
                  borderColor: colors.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.primary,
                },
              },
              "& .MuiInputLabel-root": {
                color: colors.text,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: colors.primary,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.primary}30` }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: colors.text,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            בטל
          </Button>
          <Button
            variant="contained"
            onClick={addNote}
            disabled={!newNote.text.trim() || !newNote.candidateId || !newNote.candidateRole}
            sx={{
              backgroundColor: colors.primary,
              color: colors.darkText,
              "&:hover": {
                backgroundColor: colors.primaryLight,
              },
              "&.Mui-disabled": {
                backgroundColor: `${colors.primary}50`,
              },
            }}
          >
            הוסף
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג מחיקת הערה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#222222",
            color: colors.text,
            borderRadius: 3,
            border: `1px solid ${colors.primary}40`,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.primary }}>מחיקת הערה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק הערה זו?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: colors.text,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            בטל
          </Button>
          <Button variant="contained" color="error" onClick={deleteNote}>
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MatchmakerNotes