"use client"
import type React from "react"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Dialog,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  CircularProgress,
  useMediaQuery,
  TextField,
  Slider,
  Autocomplete,
  Button,
  Collapse,
  Drawer,
  Avatar,
  ThemeProvider,
  createTheme,
  Alert,
  AlertTitle,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
} from "@mui/material"
import { styled, useTheme, alpha } from "@mui/material/styles"
import {
  Close,
  Person,
  LocationOn,
  School,
  Work,
  CalendarMonth,
  Height,
  Search,
  FilterAltOutlined,
  ClearAll,
  Edit,
  Delete,
  Save,
  Notes as NotesIcon,
  Male,
  Female,
  Login,
  Refresh,
  MoreVert,
  CheckCircle,
  Cancel,
  Psychology,
  Visibility,
  Share,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material"
import { userContext } from "./UserContext"
import type { Candidate, Male as MaleType, Women, Note } from "../Models"
import { Outlet, useNavigate } from "react-router-dom"
import UserProfile from "./Candidateprofile" // ייבוא הקומפוננטה החדשה

// Custom theme with copper colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#b87333", // Copper
      light: "#d9a875",
      dark: "#8c5319",
    },
    secondary: {
      main: "#000000", // Black
      light: "#333333",
      dark: "#000000",
    },
    background: {
      default: "#ffffff", // White
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    error: {
      main: "#d32f2f",
    },
    success: {
      main: "#388e3c",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        contained: {
          boxShadow: "0 4px 6px rgba(184, 115, 51, 0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})

// קומפוננטים מעוצבים
const StyledCard = styled(Card)(() => ({
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  height: "100%",
  borderRadius: 16,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
    "& .card-overlay": {
      opacity: 1,
    },
    "& .card-actions": {
      opacity: 1,
    },
  },
}))

const CardOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
  padding: theme.spacing(2),
  opacity: 0,
  transition: "opacity 0.3s ease",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}))

const CardActions = styled(Box)(() => ({
  position: "absolute",
  top: 10,
  right: 10,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 2,
}))

const StatusChip = styled(Chip)(({ theme, status }: { theme: any; status: boolean }) => ({
  position: "absolute",
  top: 10,
  left: 10,
  backgroundColor: status ? theme.palette.success.main : theme.palette.error.main,
  color: "white",
  zIndex: 1,
}))

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 30,
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    transition: theme.transitions.create(["background-color", "box-shadow"]),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 1),
    },
    "&.Mui-focused": {
      backgroundColor: alpha(theme.palette.common.white, 1),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
}))

const NotesDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 400,
    maxWidth: "100%",
    padding: theme.spacing(2),
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
}))

const NoteItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 8,
  position: "relative",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: theme.shadows[3],
    "& .note-actions": {
      opacity: 1,
    },
  },
}))

const NoteActions = styled(Box)(({}) => ({
  position: "absolute",
  top: 8,
  right: 8,
  display: "flex",
  gap: 8,
  opacity: 0,
  transition: "opacity 0.2s ease",
}))

const CopperGradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: "white",
  borderRadius: "12px",
  padding: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(184, 115, 51, 0.25)",
}))

const CandidatesPage = () => {
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNoteText, setNewNoteText] = useState("")
  const { user, token, logout } = useContext(userContext)
  const [error, setError] = useState<string | null>(null)
  // const [, setOpen] = useState(false)
  // const [, setModalType] = useState("")
  const navigate = useNavigate()
  const [genderTab, setGenderTab] = useState<"all" | "male" | "female">("all")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuCandidate, setMenuCandidate] = useState<Candidate | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [aiSearchLoading, setAiSearchLoading] = useState(false)

  // API URL
  const ApiUrl = "https://matchmakingsprojectserver.onrender.com/api"

  // פונקציה לקבלת headers עם אימות
  const getAuthHeaders = () => {
    if (!token) {
      throw new Error("אין טוקן אימות")
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  // פונקציה לטיפול בשגיאות 401
  const handle401Error = () => {
    setError("פג תוקף ההתחברות. נא להתחבר מחדש.")
    logout()
    navigate("/login")
  }

  // const handleNavigate = (path: string, type: string) => {
  //   navigate(path)
  //   setModalType(type)
  //   setOpen(true)
  // }

  // פילטרים פשוטים יותר - ללא סינון פרופילים
  const [filters, setFilters] = useState({
    statusFilter: "all",
    genderFilter: "all",
    ageRange: [18, 50],
    heightRange: [150, 200],
    cities: [] as string[],
    classes: [] as string[],
    occupations: [] as string[],
    backgrounds: [] as string[],
  })

  // פונקציה לטעינת נתונים עם אימות - מציגה את כל המועמדים
  const fetchCandidates = async () => {
    setLoading(true)
    setError(null)
    if (!token) {
      setError("נדרש להתחבר למערכת כדי לצפות במועמדים")
      setLoading(false)
      return
    }
    try {
      console.log("מנסה להתחבר לשרת עם טוקן:", token.substring(0, 20) + "...")
      const headers = getAuthHeaders()

      // טעינת גברים
      console.log("טוען גברים...")
      const malesResponse = await axios.get<MaleType[]>(`${ApiUrl}/Male`, {
        headers,
        timeout: 30000,
      })
      console.log("תגובת גברים:", malesResponse.status, malesResponse.data.length)
      const males = malesResponse.data.map((male) => ({
        ...male,
        role: "Male" as const,
      }))

      // טעינת נשים
      console.log("טוען נשים...")
      const femalesResponse = await axios.get<Women[]>(`${ApiUrl}/Women`, {
        headers,
        timeout: 30000,
      })
      console.log("תגובת נשים:", femalesResponse.status, femalesResponse.data.length)
      const females = femalesResponse.data.map((female) => ({
        ...female,
        role: "Women" as const,
      }))

      console.log("גברים:", males.length)
      console.log("נשים:", females.length)

      // איחוד הנתונים - מציג את כל המועמדים ללא סינון
      const allCandidates = [...males, ...females]

      // מיון פשוט לפי ID (החדשים קודם)
      const sortedCandidates = allCandidates.sort((a, b) => b.id - a.id)

      setCandidates(sortedCandidates)
      console.log("סה״כ מועמדים:", sortedCandidates.length)

      if (sortedCandidates.length === 0) {
        setError("לא נמצאו מועמדים במערכת.")
      }
    } catch (error) {
      console.error("שגיאה מפורטת:", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios Error Details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config,
        })
        if (error.response?.status === 401) {
          handle401Error()
          return
        } else if (error.response?.status === 404) {
          setError("לא נמצא נתיב API (404). נא לבדוק את כתובת השרת.")
        } else if (error.response?.status === 403) {
          setError("אין הרשאה לגשת לנתונים (403).")
        } else if (error.response?.status === 500) {
          setError("שגיאת שרת פנימית (500). נא לנסות שוב מאוחר יותר.")
        } else if (error.code === "ECONNABORTED") {
          setError("תם הזמן הקצוב לחיבור. נא לנסות שוב.")
        } else if (error.code === "ERR_NETWORK") {
          setError("שגיאת רשת. נא לבדוק את החיבור לאינטרנט.")
        } else {
          setError(`שגיאה בטעינת נתונים: ${error.response?.status || error.code} - ${error.message}`)
        }
      } else {
        setError("שגיאה לא צפויה בטעינת נתונים.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCandidates()
      loadFavorites()
    } else {
      setLoading(false)
      setError("נדרש להתחבר למערכת")
    }
  }, [token])

  useEffect(() => {
    if (notesDrawerOpen && user?.id && token) {
      fetchNotes()
    }
  }, [notesDrawerOpen, user?.id, token])

  // טעינת מועמדים מועדפים
  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }

  // הוספה/הסרה ממועדפים
  const toggleFavorite = (candidateId: number) => {
    const newFavorites = favorites.includes(candidateId)
      ? favorites.filter((id) => id !== candidateId)
      : [...favorites, candidateId]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  // פתיחת דיאלוג פרטים - עכשיו עם הקומפוננטה החדשה
  const handleOpenDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setOpenDialog(true)
  }

  // סגירת דיאלוג
  const handleCloseDetails = () => {
    setOpenDialog(false)
    setSelectedCandidate(null)
  }

  // // פונקציה להורדת קובץ
  // const downloadFile = (fileName: string) => {
  //   if (!fileName) return
  //   const downloadUrl = `${ApiUrl}/files/download/${fileName}`
  //   window.open(downloadUrl, "_blank")
  // }

  // פונקציה לקבלת URL של תמונה
  const getImageUrl = (candidate: Candidate) => {
    if (candidate.photoUrl) return candidate.photoUrl
    if (candidate.photoName) return `${ApiUrl}/files/${candidate.photoName}`
    if ((candidate as any).photo) return (candidate as any).photo
    if ((candidate as any).image) return (candidate as any).image
    if ((candidate as any).profileImage) return (candidate as any).profileImage
    return null
  }

  // עדכון פילטרים
  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  // איפוס פילטרים
  const resetFilters = () => {
    setFilters({
      statusFilter: "all",
      genderFilter: "all",
      ageRange: [18, 50],
      heightRange: [150, 200],
      cities: [],
      classes: [],
      occupations: [],
      backgrounds: [],
    })
    setSearchQuery("")
    setGenderTab("all")
  }

  // חיפוש AI
  const handleAISearch = async () => {
    if (!searchQuery.trim()) return

    setAiSearchLoading(true)
    try {
      const headers = getAuthHeaders()
      const response = await axios.post(
        `${ApiUrl}/ai/search-candidates`,
        { query: searchQuery },
        { headers, timeout: 30000 },
      )

      if (response.data && response.data.length > 0) {
        setCandidates(response.data)
      } else {
        setError("לא נמצאו מועמדים מתאימים לחיפוש AI")
      }
    } catch (error) {
      console.error("שגיאה בחיפוש AI:", error)
      setError("שגיאה בחיפוש AI. נסה שוב מאוחר יותר.")
    } finally {
      setAiSearchLoading(false)
    }
  }

  // עדכון סטטוס מועמד
  const updateCandidateStatus = async (candidateId: number, newStatus: boolean) => {
    try {
      const headers = getAuthHeaders()
      const candidate = candidates.find((c) => c.id === candidateId)
      if (!candidate) return

      const endpoint = candidate.role === "Male" ? "Male" : "Women"
      await axios.put(
        `${ApiUrl}/${endpoint}/${candidateId}`,
        { ...candidate, statusVacant: newStatus },
        { headers, timeout: 10000 },
      )

      // עדכון המועמד ברשימה
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, statusVacant: newStatus } : c)))

      setAnchorEl(null)
    } catch (error) {
      console.error("שגיאה בעדכון סטטוס:", error)
      setError("שגיאה בעדכון סטטוס המועמד")
    }
  }

  // הוספת הערות מהשרת
  const fetchNotes = async () => {
    if (!token) return
    try {
      const headers = getAuthHeaders()
      console.log("טוען הערות...")
      const response = await axios.get(`${ApiUrl}/Note`, {
        headers,
        timeout: 10000,
      })
      console.log("הערות נטענו:", response.data.length)
      setNotes(response.data)
    } catch (error) {
      console.error("שגיאה בהבאת הערות:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          handle401Error()
        } else if (error.response?.status === 404) {
          console.log("נתיב הערות לא נמצא - ייתכן שאין הערות במערכת")
          setNotes([])
        }
      }
    }
  }

  // הוספת הערה חדשה
  const addNote = async () => {
    if (!user?.id || !newNoteText.trim() || !selectedCandidate || !token) return
    try {
      const headers = getAuthHeaders()
      const newNote = {
        matchMakerId: user.id,
        userId: selectedCandidate.id,
        content: newNoteText,
        createdAt: new Date().toISOString(),
      }
      console.log("מוסיף הערה:", newNote)
      const response = await axios.post(`${ApiUrl}/Note`, newNote, {
        headers,
        timeout: 10000,
      })
      console.log("הערה נוספה:", response.data)
      setNotes((prev) => [...prev, response.data])
      setNewNoteText("")
    } catch (error) {
      console.error("שגיאה בהוספת הערה:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          handle401Error()
        } else {
          setError(`שגיאה בהוספת הערה: ${error.response?.data?.message || error.message}`)
        }
      }
    }
  }

  // עדכון הערה
  const updateNote = async () => {
    if (!editingNote || !token) return
    try {
      const headers = getAuthHeaders()
      console.log("מעדכן הערה:", editingNote.id)
      await axios.put(
        `${ApiUrl}/Note/${editingNote.id}`,
        {
          id: editingNote.id,
          matchMakerId: editingNote.matchMakerId,
          userId: editingNote.userId,
          content: editingNote.content,
          createdAt: editingNote.createdAt,
        },
        {
          headers,
          timeout: 10000,
        },
      )
      setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? editingNote : note)))
      setEditingNote(null)
      console.log("הערה עודכנה בהצלחה")
    } catch (error) {
      console.error("שגיאה בעדכון הערה:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          handle401Error()
        } else {
          setError(`שגיאה בעדכון הערה: ${error.response?.data?.message || error.message}`)
        }
      }
    }
  }

  // מחיקת הערה
  const deleteNote = async (noteId: number) => {
    if (!token) return
    try {
      const headers = getAuthHeaders()
      console.log("מוחק הערה:", noteId)
      await axios.delete(`${ApiUrl}/Note/${noteId}`, {
        headers,
        timeout: 10000,
      })
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
      console.log("הערה נמחקה בהצלחה")
    } catch (error) {
      console.error("שגיאה במחיקת הערה:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          handle401Error()
        } else {
          setError(`שגיאה במחיקת הערה: ${error.response?.data?.message || error.message}`)
        }
      }
    }
  }

  // // Handle gender tab change
  // const handleGenderTabChange = (_event: React.SyntheticEvent, newValue: "all" | "male" | "female") => {
  //   setGenderTab(newValue)
  // }

  // פונקציה לטיפול בניסיון חוזר
  const handleRetry = () => {
    setError(null)
    if (token) {
      fetchCandidates()
    }
  }

  // פונקציה לניווט לדף התחברות
  const handleLogin = () => {
    navigate("/login")
  }

  // פתיחת תפריט פעולות
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, candidate: Candidate) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setMenuCandidate(candidate)
  }

  // סגירת תפריט פעולות
  const handleMenuClose = () => {
    setAnchorEl(null)
    setMenuCandidate(null)
  }

  // שיתוף מועמד
  const shareCandidate = (candidate: Candidate) => {
    if (navigator.share) {
      navigator.share({
        title: `${candidate.firstName} ${candidate.lastName}`,
        text: `מועמד/ת לשידוך: ${candidate.firstName} ${candidate.lastName}, גיל ${candidate.age}`,
        url: window.location.href,
      })
    } else {
      // Fallback - העתקה ללוח
      const text = `מועמד/ת לשידוך: ${candidate.firstName} ${candidate.lastName}, גיל ${candidate.age}`
      navigator.clipboard.writeText(text)
      alert("הפרטים הועתקו ללוח")
    }
    handleMenuClose()
  }

  // סינון מועמדים - פשוט יותר ללא סינון פרופילים
  const filteredCandidates = candidates.filter((candidate) => {
    try {
      if (!candidate || typeof candidate.id === "undefined") {
        console.log("מועמד לא תקין:", candidate)
        return false
      }

      // Filter by gender tab
      if (genderTab === "male" && candidate.role !== "Male") return false
      if (genderTab === "female" && candidate.role !== "Women") return false

      // חיפוש טקסטואלי
      if (searchQuery && searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase()
        const searchFields = [
          candidate.firstName || "",
          candidate.lastName || "",
          candidate.city || "",
          candidate.class || "",
          candidate.occupation || "",
          candidate.backGround || "",
        ]
        if (candidate.role === "Women") {
          searchFields.push((candidate as Women).currentOccupation || "")
          searchFields.push((candidate as Women).seminar || "")
          searchFields.push((candidate as Women).highSchool || "")
        }
        if (candidate.role === "Male") {
          searchFields.push((candidate as MaleType).bigYeshiva || "")
          searchFields.push((candidate as MaleType).smallYeshiva || "")
        }
        const matchesSearch = searchFields.some((field) => field.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // סינון לפי סטטוס
      if (filters.statusFilter !== "all") {
        const isAvailable = filters.statusFilter === "available"
        if (candidate.statusVacant !== isAvailable) return false
      }

      // סינון לפי מגדר
      if (filters.genderFilter !== "all") {
        const expectedRole = filters.genderFilter === "Male" ? "Male" : "Women"
        if (candidate.role !== expectedRole) return false
      }

      // סינון לפי גיל
      if (candidate.age && typeof candidate.age === "number") {
        if (candidate.age < filters.ageRange[0] || candidate.age > filters.ageRange[1]) return false
      }

      // סינון לפי גובה
      if (candidate.height && typeof candidate.height === "number") {
        if (candidate.height < filters.heightRange[0] || candidate.height > filters.heightRange[1]) return false
      }

      // סינון לפי עיר
      if (filters.cities.length > 0) {
        if (!candidate.city || !filters.cities.includes(candidate.city)) return false
      }

      // סינון לפי חוג
      if (filters.classes.length > 0) {
        if (!candidate.class || !filters.classes.includes(candidate.class)) return false
      }

      // סינון לפי עיסוק
      if (filters.occupations.length > 0) {
        const occupation = candidate.role === "Male" ? candidate.occupation : (candidate as Women).currentOccupation
        if (!occupation || !filters.occupations.includes(occupation)) return false
      }

      // סינון לפי רקע
      if (filters.backgrounds.length > 0) {
        if (!candidate.backGround || !filters.backgrounds.includes(candidate.backGround)) return false
      }

      return true
    } catch (error) {
      console.error("שגיאה בסינון מועמד:", error, candidate)
      return true
    }
  })

  // רשימות ערכים לפילטרים
  const uniqueCities = [...new Set(candidates.map((c) => c.city).filter(Boolean))]
  const uniqueClasses = [...new Set(candidates.map((c) => c.class).filter(Boolean))]
  const uniqueOccupations = [
    ...new Set(
      candidates
        .map((c) => {
          if (c.role === "Women" && (c as Women).currentOccupation) {
            return (c as Women).currentOccupation
          }
          return c.occupation || ""
        })
        .filter(Boolean),
    ),
  ]
  const uniqueBackgrounds = [...new Set(candidates.map((c) => c.backGround).filter(Boolean))]

  // הערות למועמד הנוכחי
  const candidateNotes = notes.filter((note) => note.userId === selectedCandidate?.id)

  // Count candidates by gender
  const maleCount = candidates.filter((c) => c.role === "Male").length
  const femaleCount = candidates.filter((c) => c.role === "Women").length

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
        <CopperGradientBox sx={{ mb: 4, p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2, fontWeight: "bold" }}>
            מאגר המועמדים לשידוכים
          </Typography>
          <Typography variant="subtitle1" align="center">
            סה"כ {candidates.length} מועמדים במערכת • {maleCount} גברים • {femaleCount} נשים
          </Typography>
        </CopperGradientBox>

        {/* הודעת שגיאה או אימות */}
        {error && (
          <Alert
            severity={error.includes("אין הרשאה") || error.includes("נדרש להתחבר") ? "warning" : "error"}
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Box sx={{ display: "flex", gap: 1 }}>
                {error.includes("אין הרשאה") || error.includes("נדרש להתחבר") ? (
                  <Button color="inherit" size="small" startIcon={<Login />} onClick={handleLogin}>
                    התחבר
                  </Button>
                ) : (
                  <Button color="inherit" size="small" startIcon={<Refresh />} onClick={handleRetry}>
                    נסה שוב
                  </Button>
                )}
              </Box>
            }
          >
            <AlertTitle>שגיאה</AlertTitle>
            {error}
          </Alert>
        )}

        {/* חיפוש ופילטרים */}
        {token && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              background: "linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <SearchTextField
                  fullWidth
                  placeholder="חיפוש לפי שם, עיר, חוג... או תיאור AI"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                    endAdornment: (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={aiSearchLoading ? <CircularProgress size={16} /> : <Psychology />}
                        onClick={handleAISearch}
                        disabled={!searchQuery.trim() || aiSearchLoading}
                        sx={{ mr: 1 }}
                      >
                        חיפוש AI
                      </Button>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FilterAltOutlined />}
                    onClick={() => setExpandedFilters(!expandedFilters)}
                  >
                    {expandedFilters ? "הסתר פילטרים" : "הצג פילטרים"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ClearAll />}
                    onClick={resetFilters}
                    disabled={
                      filters.statusFilter === "all" &&
                      filters.genderFilter === "all" &&
                      filters.ageRange[0] === 18 &&
                      filters.ageRange[1] === 50 &&
                      filters.heightRange[0] === 150 &&
                      filters.heightRange[1] === 200 &&
                      filters.cities.length === 0 &&
                      filters.classes.length === 0 &&
                      filters.occupations.length === 0 &&
                      filters.backgrounds.length === 0 &&
                      !searchQuery &&
                      genderTab === "all"
                    }
                  >
                    נקה פילטרים
                  </Button>
                  {user?.id && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<NotesIcon />}
                      onClick={() => setNotesDrawerOpen(true)}
                    >
                      הערות שדכנית
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Collapse in={expandedFilters}>
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="status-filter-label">סטטוס</InputLabel>
                      <Select
                        labelId="status-filter-label"
                        value={filters.statusFilter}
                        label="סטטוס"
                        onChange={(e) => handleFilterChange("statusFilter", e.target.value)}
                      >
                        <MenuItem value="all">הכל</MenuItem>
                        <MenuItem value="available">פנוי להצעות</MenuItem>
                        <MenuItem value="unavailable">לא פנוי להצעות</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      multiple
                      options={uniqueCities}
                      value={filters.cities}
                      onChange={(_, newValue) => handleFilterChange("cities", newValue)}
                      renderInput={(params) => <TextField {...params} label="ערים" size="small" />}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      multiple
                      options={uniqueClasses}
                      value={filters.classes}
                      onChange={(_, newValue) => handleFilterChange("classes", newValue)}
                      renderInput={(params) => <TextField {...params} label="חוגים" size="small" />}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Autocomplete
                      multiple
                      options={uniqueOccupations}
                      value={filters.occupations}
                      onChange={(_, newValue) => handleFilterChange("occupations", newValue)}
                      renderInput={(params) => <TextField {...params} label="עיסוקים" size="small" />}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography gutterBottom>
                      טווח גילאים: {filters.ageRange[0]} - {filters.ageRange[1]}
                    </Typography>
                    <Slider
                      value={filters.ageRange}
                      onChange={(_, newValue) => handleFilterChange("ageRange", newValue)}
                      valueLabelDisplay="auto"
                      min={18}
                      max={70}
                      sx={{
                        "& .MuiSlider-thumb": {
                          backgroundColor: theme.palette.primary.main,
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography gutterBottom>
                      טווח גבהים: {filters.heightRange[0]} - {filters.heightRange[1]} ס"מ
                    </Typography>
                    <Slider
                      value={filters.heightRange}
                      onChange={(_, newValue) => handleFilterChange("heightRange", newValue)}
                      valueLabelDisplay="auto"
                      min={140}
                      max={210}
                      sx={{
                        "& .MuiSlider-thumb": {
                          backgroundColor: theme.palette.primary.main,
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      options={uniqueBackgrounds}
                      value={filters.backgrounds}
                      onChange={(_, newValue) => handleFilterChange("backgrounds", newValue)}
                      renderInput={(params) => <TextField {...params} label="רקע" size="small" />}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        )}

        {/* Gender Tabs */}
        {token && candidates.length > 0 && (
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant={genderTab === "all" ? "contained" : "outlined"}
                onClick={() => setGenderTab("all")}
                startIcon={<Person />}
              >
                כל המועמדים ({candidates.length})
              </Button>
              <Button
                variant={genderTab === "male" ? "contained" : "outlined"}
                onClick={() => setGenderTab("male")}
                startIcon={<Male />}
              >
                גברים ({maleCount})
              </Button>
              <Button
                variant={genderTab === "female" ? "contained" : "outlined"}
                onClick={() => setGenderTab("female")}
                startIcon={<Female />}
              >
                נשים ({femaleCount})
              </Button>
            </Box>
          </Box>
        )}

        {/* רשימת מועמדים */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : !token ? (
          <Paper sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              נדרש להתחבר למערכת
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              כדי לצפות במועמדים, נדרש להתחבר למערכת
            </Typography>
            <Button variant="contained" color="primary" startIcon={<Login />} onClick={handleLogin}>
              התחבר למערכת
            </Button>
          </Paper>
        ) : (
          <>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" color="text.secondary">
                {filteredCandidates.length} מועמדים נמצאו
              </Typography>
            </Box>
            {filteredCandidates.length === 0 ? (
              <Paper sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
                <Typography variant="h6">לא נמצאו מועמדים מתאימים</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  נסה לשנות את הפילטרים או לנקות את החיפוש
                </Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={resetFilters}>
                  נקה את כל הפילטרים
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {filteredCandidates.map((candidate) => {
                  const imageUrl = getImageUrl(candidate)
                  const candidateNoteCount = notes.filter((note) => note.userId === candidate.id).length
                  const isFavorite = favorites.includes(candidate.id)

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`${candidate.role}-${candidate.id}`}>
                      <StyledCard onClick={() => handleOpenDetails(candidate)}>
                        {/* תג סטטוס */}
                        <StatusChip
                          status={candidate.statusVacant}
                          label={candidate.statusVacant ? "פנוי/ה להצעות" : "לא פנוי/ה כרגע"}
                          size="small"
                          theme={undefined}
                        />

                        {/* פעולות כרטיס */}
                        <CardActions className="card-actions">
                          <Tooltip title={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(candidate.id)
                              }}
                              sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                              }}
                            >
                              {isFavorite ? (
                                <Favorite sx={{ color: "#d32f2f" }} />
                              ) : (
                                <FavoriteBorder sx={{ color: "#666" }} />
                              )}
                            </IconButton>
                          </Tooltip>

                          {candidateNoteCount > 0 && (
                            <Badge badgeContent={candidateNoteCount} color="primary">
                              <IconButton
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                                }}
                              >
                                <NotesIcon sx={{ color: theme.palette.primary.main }} />
                              </IconButton>
                            </Badge>
                          )}

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, candidate)}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                            }}
                          >
                            <MoreVert />
                          </IconButton>
                        </CardActions>

                        {/* תמונת פרופיל */}
                        <Box
                          sx={{
                            height: 200,
                            bgcolor:
                              candidate.role === "Male"
                                ? alpha(theme.palette.primary.main, 0.1)
                                : alpha(theme.palette.primary.light, 0.2),
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                          }}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={`${candidate.firstName}'s profile`}
                              style={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: `3px solid ${candidate.role === "Male" ? theme.palette.primary.main : theme.palette.primary.light}`,
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                const parent = target.parentElement
                                if (parent && !parent.querySelector(".fallback-avatar")) {
                                  const avatar = document.createElement("div")
                                  avatar.className = "fallback-avatar"
                                  avatar.style.cssText = `
                                    width: 120px;
                                    height: 120px;
                                    border-radius: 50%;
                                    background-color: ${candidate.role === "Male" ? theme.palette.primary.main : theme.palette.primary.light};
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: white;
                                    font-size: 3rem;
                                    font-weight: bold;
                                    border: 3px solid white;
                                  `
                                  avatar.textContent = (
                                    candidate.firstName || (candidate.role === "Male" ? "M" : "W")
                                  ).charAt(0)
                                  parent.appendChild(avatar)
                                }
                              }}
                            />
                          ) : candidate.role === "Male" ? (
                            <Avatar
                              sx={{
                                width: 120,
                                height: 120,
                                bgcolor: theme.palette.primary.main,
                                fontSize: "3rem",
                                border: `3px solid white`,
                              }}
                            >
                              {(candidate.firstName || "M").charAt(0)}
                            </Avatar>
                          ) : (
                            <Avatar
                              sx={{
                                width: 120,
                                height: 120,
                                bgcolor: theme.palette.primary.light,
                                fontSize: "3rem",
                                border: `3px solid white`,
                              }}
                            >
                              {(candidate.firstName || "W").charAt(0)}
                            </Avatar>
                          )}
                        </Box>
                        <CardContent sx={{ pt: 2, pb: 7 }}>
                          <Typography variant="h5" component="div" align="center" gutterBottom>
                            {candidate.firstName || "ללא שם"} {candidate.lastName || ""}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <CalendarMonth fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2">גיל: {candidate.age || "לא צוין"}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <LocationOn fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2">עיר: {candidate.city || "לא צוין"}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <Height fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2">גובה: {candidate.height || "לא צוין"} ס"מ</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                            <School fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2" noWrap>
                              {candidate.role === "Male" ? "ישיבה:" : "סמינר:"}{" "}
                              {candidate.role === "Male"
                                ? (candidate as MaleType).bigYeshiva || "לא צוין"
                                : (candidate as Women).seminar || "לא צוין"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Work fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                            <Typography variant="body2" noWrap>
                              עיסוק:{" "}
                              {candidate.role === "Male"
                                ? candidate.occupation || "לא צוין"
                                : (candidate as Women).currentOccupation || "לא צוין"}
                            </Typography>
                          </Box>
                        </CardContent>
                        {/* שכבת מידע נוסף בהאובר */}
                        <CardOverlay className="card-overlay">
                          <Typography variant="body2">חוג: {candidate.class || "לא צוין"}</Typography>
                          <Typography variant="body2">רקע: {candidate.backGround || "לא צוין"}</Typography>
                          <Typography variant="body2">מראה כללי: {candidate.generalAppearance || "לא צוין"}</Typography>
                        </CardOverlay>
                      </StyledCard>
                    </Grid>
                  )
                })}
              </Grid>
            )}
          </>
        )}

        {/* תפריט פעולות */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => handleOpenDetails(menuCandidate!)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>צפה בפרטים</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => shareCandidate(menuCandidate!)}>
            <ListItemIcon>
              <Share fontSize="small" />
            </ListItemIcon>
            <ListItemText>שתף</ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => updateCandidateStatus(menuCandidate!.id, true)}>
            <ListItemIcon>
              <CheckCircle fontSize="small" sx={{ color: "success.main" }} />
            </ListItemIcon>
            <ListItemText>סמן כפנוי</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => updateCandidateStatus(menuCandidate!.id, false)}>
            <ListItemIcon>
              <Cancel fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>סמן כלא פנוי</ListItemText>
          </MenuItem>
        </Menu>

        {/* דיאלוג פרטים מלאים עם הקומפוננטה החדשה */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDetails}
          maxWidth="lg"
          fullWidth
          fullScreen={isMobile}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: isMobile ? 0 : 4,
              maxHeight: "95vh",
            },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleCloseDetails}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
            >
              <Close />
            </IconButton>
            {selectedCandidate && <UserProfile candidateData={selectedCandidate} onClose={handleCloseDetails} />}
          </Box>
        </Dialog>

        {/* מגירת הערות */}
        <NotesDrawer anchor="right" open={notesDrawerOpen} onClose={() => setNotesDrawerOpen(false)}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              הערות שדכנית
            </Typography>
            <IconButton onClick={() => setNotesDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="הוסף הערה חדשה"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={addNote}
              disabled={!newNoteText.trim() || !selectedCandidate}
              fullWidth
            >
              הוסף הערה
            </Button>
          </Box>
          <Box>
            {selectedCandidate ? (
              candidateNotes.length > 0 ? (
                candidateNotes.map((note) => (
                  <NoteItem key={note.id} elevation={1}>
                    {editingNote && editingNote.id === note.id ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Save />}
                            onClick={updateNote}
                            disabled={!editingNote.content.trim()}
                          >
                            שמור
                          </Button>
                          <Button size="small" color="inherit" onClick={() => setEditingNote(null)}>
                            בטל
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body1">{note.content}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(note.createdAt).toLocaleDateString("he-IL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                        <NoteActions className="note-actions">
                          <IconButton size="small" color="primary" onClick={() => setEditingNote(note)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => deleteNote(note.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </NoteActions>
                      </>
                    )}
                  </NoteItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  אין הערות על מועמד זה
                </Typography>
              )
            ) : notes.length > 0 ? (
              notes.map((note) => {
                const noteCandidate = candidates.find((c) => c.id === note.userId)
                return (
                  <NoteItem key={note.id} elevation={1}>
                    {editingNote && editingNote.id === note.id ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={editingNote.content}
                          onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Save />}
                            onClick={updateNote}
                            disabled={!editingNote.content.trim()}
                          >
                            שמור
                          </Button>
                          <Button size="small" color="inherit" onClick={() => setEditingNote(null)}>
                            בטל
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        {noteCandidate && (
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                            {noteCandidate.firstName} {noteCandidate.lastName}
                          </Typography>
                        )}
                        <Typography variant="body1">{note.content}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(note.createdAt).toLocaleDateString("he-IL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                        <NoteActions className="note-actions">
                          <IconButton size="small" color="primary" onClick={() => setEditingNote(note)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => deleteNote(note.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </NoteActions>
                      </>
                    )}
                  </NoteItem>
                )
              })
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                אין הערות
              </Typography>
            )}
          </Box>
        </NotesDrawer>
        <Outlet />
      </Box>
    </ThemeProvider>
  )
}

export default CandidatesPage
