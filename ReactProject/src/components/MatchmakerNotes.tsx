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
  Alert,
  Snackbar,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday,
  Notes as NotesIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import axios from "axios"
import { userContext } from "./UserContext"
import { Candidate, Male, Note, Women } from "../Models"

// // ממשקים
// interface User {
//   id: number
//   firstName: string
//   lastName: string
//   username: string
//   role: string
// }

// interface Note {
//   id: number
//   matchMakerId: number
//   userId: number
//   content: string
//   createdAt: string
//   userRole?: string
// }

// interface Male {
//   id: number
//   firstName: string
//   lastName: string
//   email: string
//   age: number
//   city: string
//   role: "Male"
// }

// interface Women {
//   id: number
//   firstName: string
//   lastName: string
//   email: string
//   age: number
//   city: string
//   role: "Women"
// }

// type Candidate = Male | Women

// צבעים
const colors = {
  background: "#111111",
  primary: "#B87333",
  primaryLight: "#D4A76A",
  primaryDark: "#8B5A2B",
  text: "#FFFFFF",
  darkText: "#111111",
  inputBorder: "#B87333",
  inputText: "#FFFFFF",
  inputBackground: "#333333",
  cardBackground: "rgba(30, 30, 30, 0.7)",
  noteBackground: "rgba(40, 40, 40, 0.7)",
}

const MatchmakerNotes = () => {
  const { user, token } = useContext(userContext)
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
  const [sortBy, setSortBy] = useState("date")
  const [filterByGender, setFilterByGender] = useState("all")
  const [importantNotes, setImportantNotes] = useState<number[]>([])
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({
    open: false,
    message: "",
    severity: "info",
  })

  const ApiUrl = process.env.REACT_APP_API_URL 

  // פונקציה להצגת הודעות
  const showNotification = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

  // טעינת הערות
  const fetchNotes = async () => {
    if (!user?.id || !token) {
      console.log("חסרים פרטי משתמש או טוקן")
      return
    }

    setLoading(true)
    try {
      console.log("טוען הערות עבור שדכן ID:", user.id)

      const response = await axios.get<Note[]>(`${ApiUrl}/Note`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("כל ההערות מהשרת:", response.data)

      // סינון הערות של השדכן הנוכחי
      const matchmakerNotes = response.data.filter((note) => note.matchMakerId === user.id)
      console.log("הערות של השדכן:", matchmakerNotes)

      setNotes(matchmakerNotes)
      showNotification(`נטענו ${matchmakerNotes.length} הערות`, "success")
    } catch (error: any) {
      console.error("שגיאה בטעינת הערות:", error)
      showNotification("שגיאה בטעינת הערות", "error")
    } finally {
      setLoading(false)
    }
  }

  // טעינת מועמדים
  const fetchCandidates = async () => {
    if (!token) {
      console.log("אין טוקן זמין")
      return
    }

    try {
      console.log("טוען מועמדים...")

      // טעינת גברים
      const malesResponse = await axios.get<Male[]>(`${ApiUrl}/Male`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const males = malesResponse.data.map((male) => ({
        ...male,
        role: "Male" as const,
      }))

      console.log("גברים שנטענו:", males.length)

      // טעינת נשים
      const femalesResponse = await axios.get<Women[]>(`${ApiUrl}/Women`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const females = femalesResponse.data.map((female) => ({
        ...female,
        role: "Women" as const,
      }))

      console.log("נשים שנטענו:", females.length)

      const allCandidates = [...males, ...females]
      setCandidates(allCandidates)
      console.log("סך הכל מועמדים:", allCandidates.length)

      showNotification(`נטענו ${allCandidates.length} מועמדים`, "success")
    } catch (error: any) {
      console.error("שגיאה בטעינת מועמדים:", error)
      showNotification("שגיאה בטעינת מועמדים", "error")
    }
  }

  // טעינה ראשונית
  useEffect(() => {
    if (user?.id && token) {
      console.log("משתמש מחובר:", user)
      fetchNotes()
      fetchCandidates()
    } else {
      console.log("משתמש לא מחובר או אין טוקן")
    }
  }, [user, token])

  // הוספת הערה
  const addNote = async () => {
    if (!user?.id || !token || !newNote.text.trim() || !newNote.candidateId || !newNote.candidateRole) {
      showNotification("אנא מלא את כל השדות", "warning")
      return
    }

    try {
      const noteData = {
        matchMakerId: user.id,
        userId: newNote.candidateId,
        content: newNote.text,
        createdAt: new Date().toISOString(),
        userRole: newNote.candidateRole,
      }

      console.log("שולח הערה חדשה:", noteData)

      const response = await axios.post(`${ApiUrl}/Note`, noteData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("הערה נוספה:", response.data)

      setNotes((prev) => [...prev, response.data])
      setNewNote({
        candidateId: 0,
        candidateRole: "",
        text: "",
      })
      setOpenDialog(false)
      showNotification("הערה נוספה בהצלחה!", "success")
    } catch (error: any) {
      console.error("שגיאה בהוספת הערה:", error)
      showNotification("שגיאה בהוספת הערה", "error")
    }
  }

  // עדכון הערה
  const updateNote = async () => {
    if (!editingNote || !token) return

    try {
      console.log("מעדכן הערה:", editingNote)

      await axios.put(`${ApiUrl}/Note/${editingNote.id}`, editingNote, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? editingNote : note)))
      setEditingNote(null)
      showNotification("הערה עודכנה בהצלחה!", "success")
    } catch (error: any) {
      console.error("שגיאה בעדכון הערה:", error)
      showNotification("שגיאה בעדכון הערה", "error")
    }
  }

  // מחיקת הערה
  const deleteNote = async () => {
    if (!noteToDelete || !token) return

    try {
      console.log("מוחק הערה:", noteToDelete)

      await axios.delete(`${ApiUrl}/Note/${noteToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNotes((prev) => prev.filter((note) => note.id !== noteToDelete))
      setDeleteDialogOpen(false)
      setNoteToDelete(null)
      showNotification("הערה נמחקה בהצלחה!", "success")
    } catch (error: any) {
      console.error("שגיאה במחיקת הערה:", error)
      showNotification("שגיאה במחיקת הערה", "error")
    }
  }

  // פתיחת דיאלוג מחיקה
  const openDeleteDialog = (noteId: number) => {
    setNoteToDelete(noteId)
    setDeleteDialogOpen(true)
  }

  // סימון הערה כחשובה
  const toggleImportantNote = (noteId: number) => {
    if (importantNotes.includes(noteId)) {
      setImportantNotes((prev) => prev.filter((id) => id !== noteId))
    } else {
      setImportantNotes((prev) => [...prev, noteId])
    }
  }

  // סינון הערות
  const filteredNotes = notes.filter((note) => {
    // סינון לפי חיפוש
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const candidate = candidates.find((c) => c.id === note.userId)
      const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase() : ""
      const matchesSearch = note.content.toLowerCase().includes(searchLower) || candidateName.includes(searchLower)

      if (!matchesSearch) return false
    }

    // סינון לפי מגדר
    if (filterByGender !== "all") {
      const candidate = candidates.find((c) => c.id === note.userId)
      if (!candidate) return false

      if (filterByGender === "Male" && candidate.role !== "Male") return false
      if (filterByGender === "Women" && candidate.role !== "Women") return false
    }

    return true
  })

  // מיון הערות
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === "name") {
      const candidateA = candidates.find((c) => c.id === a.userId)
      const candidateB = candidates.find((c) => c.id === b.userId)
      const nameA = candidateA ? `${candidateA.firstName} ${candidateA.lastName}` : ""
      const nameB = candidateB ? `${candidateB.firstName} ${candidateB.lastName}` : ""
      return nameA.localeCompare(nameB, "he")
    }
    return 0
  })

  // קיבוץ הערות לפי מועמד
  const groupedNotes: Record<string, Note[]> = {}
  sortedNotes.forEach((note) => {
    const key = `User-${note.userId}`
    if (!groupedNotes[key]) {
      groupedNotes[key] = []
    }
    groupedNotes[key].push(note)
  })

  // סגירת הודעות
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // אם אין משתמש מחובר
  if (!user || !token) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto", backgroundColor: colors.background }}>
        <Paper sx={{ p: 4, textAlign: "center", backgroundColor: colors.cardBackground }}>
          <Typography variant="h5" sx={{ color: colors.primary, mb: 2 }}>
            🔒 נדרשת התחברות
          </Typography>
          <Typography sx={{ color: colors.text }}>אנא התחבר למערכת כדי לצפות בהערות</Typography>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto", backgroundColor: colors.background, minHeight: "100vh" }}>
      {/* כותרת */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: colors.primary }}>
          📝 הערות שדכנית
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge badgeContent={notes.length} color="warning">
            <NotesIcon sx={{ fontSize: 28, color: colors.primary }} />
          </Badge>
          <Typography variant="body2" sx={{ color: colors.text }}>
            שלום {user.firstName} {user.lastName}
          </Typography>
        </Box>
      </Box>

      {/* פאנל חיפוש וסינון */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: colors.cardBackground }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              placeholder="חיפוש הערות או שמות מועמדים..."
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
                  backgroundColor: colors.inputBackground,
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
                    color: colors.inputText,
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "flex-start", md: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-select-label" sx={{ color: colors.text }}>
                  סנן לפי מגדר
                </InputLabel>
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
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: colors.inputBackground,
                        "& .MuiMenuItem-root": {
                          color: colors.inputText,
                          "&:hover": {
                            backgroundColor: colors.primaryDark,
                          },
                          "&.Mui-selected": {
                            backgroundColor: colors.primary,
                            color: colors.darkText,
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="all">הכל</MenuItem>
                  <MenuItem value="Male">גברים</MenuItem>
                  <MenuItem value="Women">נשים</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-select-label" sx={{ color: colors.text }}>
                  מיין לפי
                </InputLabel>
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
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: colors.inputBackground,
                        "& .MuiMenuItem-root": {
                          color: colors.inputText,
                          "&:hover": {
                            backgroundColor: colors.primaryDark,
                          },
                          "&.Mui-selected": {
                            backgroundColor: colors.primary,
                            color: colors.darkText,
                          },
                        },
                      },
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
                sx={{
                  backgroundColor: colors.primary,
                  color: colors.darkText,
                  "&:hover": {
                    backgroundColor: colors.primaryDark,
                  },
                }}
              >
                הוסף הערה חדשה
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* תוכן ראשי */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress sx={{ color: colors.primary }} size={60} />
          <Typography sx={{ ml: 2, color: colors.text, alignSelf: "center" }}>טוען נתונים...</Typography>
        </Box>
      ) : Object.keys(groupedNotes).length > 0 ? (
        <Grid container spacing={3}>
          {Object.entries(groupedNotes).map(([userKey, userNotes]) => {
            const userId = userKey.split("-")[1]
            const candidate = candidates.find((c) => c.id === Number(userId))

            if (!candidate) {
              console.log(`לא נמצא מועמד עם ID: ${userId}`)
              return null
            }

            return (
              <Grid item xs={12} md={6} key={userKey}>
                <Card
                  sx={{
                    backgroundColor: colors.cardBackground,
                    color: colors.text,
                    border: `1px solid ${colors.primary}30`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 16px ${colors.primary}40`,
                    },
                  }}
                >
                  <CardContent>
                    {/* כותרת מועמד */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: candidate.role === "Male" ? colors.primaryDark : colors.primary,
                          color: colors.darkText,
                          mr: 2,
                          width: 50,
                          height: 50,
                        }}
                      >
                        {candidate.firstName?.charAt(0) || "?"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold" }}>
                          {candidate.firstName} {candidate.lastName}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 1 }}>
                          <Chip
                            size="small"
                            label={candidate.role === "Male" ? "גבר" : "אישה"}
                            sx={{
                              backgroundColor: candidate.role === "Male" ? colors.primaryDark : colors.primary,
                              color: colors.darkText,
                            }}
                          />
                          <Typography variant="body2" sx={{ color: colors.text + "80" }}>
                            {userNotes.length} הערות
                          </Typography>
                          {candidate.age && (
                            <Typography variant="body2" sx={{ color: colors.text + "80" }}>
                              • גיל {candidate.age}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ backgroundColor: colors.primary + "30", my: 2 }} />

                    {/* הערות */}
                    {userNotes.map((note) => (
                      <Box
                        key={note.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: colors.noteBackground,
                          border: importantNotes.includes(note.id) ? `2px solid ${colors.primary}` : "none",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                          {note.content}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.text + "80",
                              display: "flex",
                              alignItems: "center",
                            }}
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

                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => setEditingNote(note)}
                              sx={{
                                color: colors.primary,
                                "&:hover": { backgroundColor: colors.primary + "20" },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteDialog(note.id)}
                              sx={{
                                color: colors.primary,
                                "&:hover": { backgroundColor: colors.primary + "20" },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => toggleImportantNote(note.id)}
                              sx={{
                                color: importantNotes.includes(note.id) ? colors.primary : colors.text + "60",
                                "&:hover": { backgroundColor: colors.primary + "20" },
                              }}
                            >
                              {importantNotes.includes(note.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </IconButton>
                          </Box>
                        </Box>
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
            backgroundColor: colors.cardBackground,
            borderRadius: 3,
            border: `2px dashed ${colors.primary}40`,
          }}
        >
          <NotesIcon sx={{ fontSize: 80, color: colors.primary, opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" sx={{ color: colors.primary, mb: 2 }}>
            {searchQuery || filterByGender !== "all" ? "לא נמצאו הערות התואמות לחיפוש" : "אין הערות להצגה"}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text + "80", mb: 3 }}>
            {searchQuery || filterByGender !== "all"
              ? "נסה לשנות את פרמטרי החיפוש"
              : "התחל לכתוב הערות על המועמדים שלך"}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: colors.primary,
              color: colors.darkText,
              "&:hover": { backgroundColor: colors.primaryDark },
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
            backgroundColor: colors.cardBackground,
            color: colors.text,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.primary, fontWeight: "bold" }}>הוספת הערה חדשה</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel id="candidate-select-label" sx={{ color: colors.text }}>
              בחר מועמד
            </InputLabel>
            <Select
              labelId="candidate-select-label"
              value={newNote.candidateId ? `${newNote.candidateRole}-${newNote.candidateId}` : ""}
              onChange={(e) => {
                const [role, id] = e.target.value.split("-")
                setNewNote({
                  ...newNote,
                  candidateRole: role,
                  candidateId: Number(id),
                })
              }}
              label="בחר מועמד"
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
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: colors.inputBackground,
                    maxHeight: 300,
                    "& .MuiMenuItem-root": {
                      color: colors.inputText,
                      "&:hover": {
                        backgroundColor: colors.primaryDark,
                      },
                      "&.Mui-selected": {
                        backgroundColor: colors.primary,
                        color: colors.darkText,
                      },
                    },
                  },
                },
              }}
            >
              {candidates.map((candidate) => (
                <MenuItem key={`${candidate.role}-${candidate.id}`} value={`${candidate.role}-${candidate.id}`}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 16 }} />
                    {candidate.firstName} {candidate.lastName} ({candidate.role === "Male" ? "גבר" : "אישה"})
                    {candidate.age && <span> - גיל {candidate.age}</span>}
                  </Box>
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
              },
              "& .MuiInputLabel-root": {
                color: colors.text,
                "&.Mui-focused": {
                  color: colors.primary,
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: colors.text }}>
            בטל
          </Button>
          <Button
            variant="contained"
            onClick={addNote}
            disabled={!newNote.text.trim() || !newNote.candidateId || !newNote.candidateRole}
            sx={{
              backgroundColor: colors.primary,
              color: colors.darkText,
              "&:hover": { backgroundColor: colors.primaryDark },
              "&:disabled": {
                backgroundColor: colors.text + "20",
                color: colors.text + "50",
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
            backgroundColor: colors.cardBackground,
            color: colors.text,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.primary }}>מחיקת הערה</DialogTitle>
        <DialogContent>
          <Typography>האם אתה בטוח שברצונך למחוק הערה זו?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: colors.text }}>
            בטל
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteNote}
            sx={{
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עדכון הערה */}
      <Dialog
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.cardBackground,
            color: colors.text,
          },
        }}
      >
        <DialogTitle sx={{ color: colors.primary }}>עדכון הערה</DialogTitle>
        <DialogContent>
          {editingNote && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="תוכן ההערה"
              value={editingNote.content}
              onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              sx={{
                mt: 1,
                "& .MuiOutlinedInput-root": {
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
                },
                "& .MuiInputLabel-root": {
                  color: colors.text,
                  "&.Mui-focused": {
                    color: colors.primary,
                  },
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingNote(null)} sx={{ color: colors.text }}>
            בטל
          </Button>
          <Button
            variant="contained"
            onClick={updateNote}
            disabled={!editingNote?.content.trim()}
            sx={{
              backgroundColor: colors.primary,
              color: colors.darkText,
              "&:hover": { backgroundColor: colors.primaryDark },
              "&:disabled": {
                backgroundColor: colors.text + "20",
                color: colors.text + "50",
              },
            }}
          >
            עדכן
          </Button>
        </DialogActions>
      </Dialog>

      {/* הודעות */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            width: "100%",
            backgroundColor: colors.cardBackground,
            color: colors.text,
            border: `1px solid ${colors.primary}`,
            "& .MuiAlert-icon": {
              color: colors.primary,
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MatchmakerNotes
