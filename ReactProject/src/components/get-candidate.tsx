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
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Divider,
  Fade,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  Tabs,
  Tab,
  TextField,
  Slider,
  Autocomplete,
  Button,
  Collapse,
  Drawer,
  Avatar,
  ThemeProvider,
  createTheme,
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
  Visibility,
  CheckCircle,
  Search,
  FilterAltOutlined,
  ClearAll,
  Edit,
  Delete,
  Save,
  Notes as NotesIcon,
  PersonOutline,
  Cake,
  HomeOutlined,
  SchoolOutlined,
  WorkOutlined,
  FavoriteOutlined,
  SettingsOutlined,
  HealthAndSafetyOutlined,
  FamilyRestroomOutlined,
  Email,
  Phone,
  Info,
  ContactPhone,
  Male,
  Female,
} from "@mui/icons-material"
import { userContext } from "./UserContext"
import type { Candidate, Male as MaleType, Women, Note, FamilyDetails, Contact } from "../Models"
import { Outlet, useNavigate } from "react-router-dom"

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

const StatusChip = styled(Chip)(({ theme, status }: { theme: any; status: boolean }) => ({
  position: "absolute",
  top: 10,
  left: 10,
  backgroundColor: status ? theme.palette.success.main : theme.palette.error.main,
  color: "white",
  zIndex: 1,
}))

const DetailDialog = styled(Dialog)(({}) => ({
  "& .MuiDialog-paper": {
    width: "100%",
    maxWidth: 1000,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "row",
    margin: 0,
    borderRadius: 16,
    overflow: "hidden",
  },
}))

const DetailSidebar = styled(Box)(({ theme }) => ({
  width: 300,
  backgroundColor: alpha(theme.palette.primary.light, 0.1),
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}))

const DetailContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: "auto",
}))

const InfoSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    backgroundColor: theme.palette.primary.main,
  },
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

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  backgroundColor: theme.palette.primary.light,
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
}))

const GenderTab = styled(Tab)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1rem",
  padding: "12px 24px",
  transition: "all 0.3s ease",
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: "8px 8px 0 0",
  },
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
  const [tabValue, setTabValue] = useState(0)
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNoteText, setNewNoteText] = useState("")
  const { user ,token} = useContext(userContext)
  const [error, setError] = useState<string | null>(null)
  const [familyDetails, setFamilyDetails] = useState<FamilyDetails | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [, setOpen] = useState(false)
  const [, setModalType] = useState("")
  const navigate = useNavigate()
  const [genderTab, setGenderTab] = useState<"all" | "male" | "female">("all")

  // Fix: Use environment variable correctly with fallback
  const ApiUrl = process.env.REACT_APP_API_URL || "https://matchmakingsprojectserver.onrender.com/api"

  const handleNavigate = (path: string, type: string) => {
    navigate(path)
    setModalType(type)
    setOpen(true)
  }

  // פילטרים
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

  // פונקציה לטעינת נתונים
  const fetchCandidates = async () => {
    setLoading(true)
    setError(null)
    try {
      // טעינת גברים
      const malesResponse = await axios.get<MaleType[]>(`${ApiUrl}/Male`, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      const males = malesResponse.data.map((male) => ({
        ...male,
        role: "Male" as const,
      }))

      // טעינת נשים
      const femalesResponse = await axios.get<Women[]>(`${ApiUrl}/Women`,  {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      const females = femalesResponse.data.map((female) => ({
        ...female,
        role: "Women" as const,
      }))
      console.log("גברים:", malesResponse.data)
      console.log("נשים:", femalesResponse.data)

      // איחוד הנתונים
      setCandidates([...males, ...females])

      // הוספת לוג לבדיקה
      console.log("נטענו:", males.length, "גברים,", females.length, "נשים")
      console.log("סה״כ מועמדים:", males.length + females.length)

      if (males.length === 0 && females.length === 0) {
        setError("לא נמצאו מועמדים במערכת. ייתכן שיש בעיה בחיבור לשרת.")
      }
    } catch (error) {
      console.error("שגיאה בטעינת נתונים:", error)
      // Fix: Better error handling with specific messages for different error types
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("לא ניתן למצוא את נתוני המועמדים. נא לבדוק את כתובת ה-API.")
      } else {
        setError("שגיאה בטעינת נתונים מהשרת. אנא נסה שוב מאוחר יותר.")
      }
    } finally {
      setLoading(false)
    }
  }

  // פונקציה לטעינת פרטי משפחה
  const fetchFamilyDetails = async (candidateId: number, role: string) => {
    try {
      const response = await axios.get<FamilyDetails[]>(`${ApiUrl}/FamilyDetails` ,{headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)

      // סינון לפי מזהה המועמד
      const details = response.data.find(
        (detail) =>
          (role === "Male" && detail.maleId === candidateId) || (role === "Women" && detail.womenId === candidateId),
      )

      setFamilyDetails(details || null)
    } catch (error) {
      console.error("שגיאה בטעינת פרטי משפחה:", error)
      setFamilyDetails(null)
    }
  }

  // פונקציה לטעינת פרטי התקשרות
  const fetchContacts = async (candidateId: number, role: string) => {
    try {
      const response = await axios.get<Contact[]>(`${ApiUrl}/Contact`, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)

      // סינון לפי מזהה המועמד
      const candidateContacts = response.data.filter(
        (contact) =>
          (role === "Male" && contact.maleId === candidateId) || (role === "Women" && contact.womenId === candidateId),
      )

      setContacts(candidateContacts)
    } catch (error) {
      console.error("שגיאה בטעינת פרטי התקשרות:", error)
      setContacts([])
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [])

  useEffect(() => {
    if (notesDrawerOpen && user?.id) {
      fetchNotes()
    }
  }, [notesDrawerOpen, user?.id])

  // פתיחת דיאלוג פרטים
  const handleOpenDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setOpenDialog(true)

    // טעינת פרטי משפחה ופרטי התקשרות
    fetchFamilyDetails(candidate.id, candidate.role)
    fetchContacts(candidate.id, candidate.role)
  }

  // סגירת דיאלוג
  const handleCloseDetails = () => {
    setOpenDialog(false)
    setFamilyDetails(null)
    setContacts([])
  }

  // עדכון סטטוס מועמד
  const updateCandidateStatus = async (id: number, role: string, isAvailable: boolean) => {
    if (!selectedCandidate) return

    try {
      const endpoint = role === "Male" ? "Male" : "Women"

      // שלב 1: קבלת הנתונים הקיימים של המועמד
      const response = await axios.get(`${ApiUrl}/${endpoint}/${id}`, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      const data = response.data

      // שלב 2: יצירת גוף מעודכן כולל כל השדות הנדרשים לפי Swagger
      const updatedCandidate = {
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        username: data.username ?? "",
        password: data.password ?? "", // חובה לפי Swagger
        role: data.role ?? role,
        country: data.country ?? "",
        city: data.city ?? "",
        address: data.address ?? "",
        tz: data.tz ?? "",
        class: data.class ?? "",
        anOutsider: data.anOutsider ?? false,
        backGround: data.backGround ?? "",
        openness: data.openness ?? "",
        burnDate: data.burnDate ?? new Date().toISOString(),
        age: data.age ?? 0,
        healthCondition: data.healthCondition ?? false,
        status: data.status ?? "",
        statusVacant: isAvailable,
        pairingType: data.pairingType ?? "",
        height: data.height ?? 0,
        generalAppearance: data.generalAppearance ?? "",
        facePaint: data.facePaint ?? "",
        appearance: data.appearance ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        fatherPhone: data.fatherPhone ?? "",
        motherPhone: data.motherPhone ?? "",
        moreInformation: data.moreInformation ?? "",
        driversLicense: data.driversLicense ?? false,
        smoker: data.smoker ?? false,
        beard: data.beard ?? "",
        hot: data.hot ?? "",
        suit: data.suit ?? "",
        smallYeshiva: data.smallYeshiva ?? "",
        bigYeshiva: data.bigYeshiva ?? "",
        kibbutz: data.kibbutz ?? "",
        occupation: data.occupation ?? "",
        expectationsFromPartner: data.expectationsFromPartner ?? "",
        club: data.club ?? "",
        ageFrom: data.ageFrom ?? 0,
        ageTo: data.ageTo ?? 0,
        importantTraitsInMe: data.importantTraitsInMe ?? "",
        importantTraitsIAmLookingFor: data.importantTraitsIAmLookingFor ?? "",
        preferredSeminarStyle: data.preferredSeminarStyle ?? "",
        preferredProfessionalPath: data.preferredProfessionalPath ?? "",
        headCovering: data.headCovering ?? "",
      }

      console.log("נשלח לשרת:", updatedCandidate)

      // שלב 3: שליחת הבקשה לעדכון
      await axios.put(`${ApiUrl}/${endpoint}/${id}`, updatedCandidate, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)

      // שלב 4: עדכון ברשימה המקומית
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id && candidate.role === role ? { ...candidate, statusVacant: isAvailable } : candidate,
        ),
      )

      // שלב 5: עדכון המועמד הנבחר אם זה הוא
      if (selectedCandidate.id === id && selectedCandidate.role === role) {
        setSelectedCandidate({ ...selectedCandidate, statusVacant: isAvailable })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("שגיאה בעדכון סטטוס:", error.response?.data || error.message)
      } else {
        console.error("שגיאה בעדכון סטטוס:", error)
      }
    }
  }

  // החלפת לשוניות בדיאלוג פרטים
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
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

  // הוספת הערות מהשרת
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/Note`, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      setNotes(response.data)
    } catch (error) {
      console.error("שגיאה בהבאת הערות:", error)
    }
  }

  // הוספת הערה חדשה
  const addNote = async () => {
    if (!user?.id || !newNoteText.trim() || !selectedCandidate) return

    try {
      const newNote: Partial<Note> = {
        matchMakerId: user.id,
        userId: selectedCandidate.id,
        content: newNoteText,
        createdAt: new Date().toISOString(),
      }

      const response = await axios.post(`${ApiUrl}/Note`, newNote, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      setNotes((prev) => [...prev, response.data])
      setNewNoteText("")
    } catch (error) {
      console.error("שגיאה בהוספת הערה:", error)
    }
  }

  // עדכון הערה
  const updateNote = async () => {
    if (!editingNote) return

    try {
      await axios.put(`${ApiUrl}/Note/${editingNote.id}`, {
        ...editingNote,
        content: editingNote.content,
      }, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      setNotes((prev) => prev.map((note) => (note.id === editingNote.id ? editingNote : note)))
      setEditingNote(null)
    } catch (error) {
      console.error("שגיאה בעדכון הערה:", error)
    }
  }

  // מחיקת הערה
  const deleteNote = async (noteId: number) => {
    try {
      await axios.delete(`${ApiUrl}/Note/${noteId}`, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }},)
      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("שגיאה במחיקת הערה:", error)
    }
  }

  // Handle gender tab change
  const handleGenderTabChange = (_event: React.SyntheticEvent, newValue: "all" | "male" | "female") => {
    setGenderTab(newValue)
  }

  // סינון מועמדים
  const filteredCandidates = candidates.filter((candidate) => {
    // בדיקה שיש לנו את כל השדות הנדרשים
    if (!candidate || typeof candidate.id === "undefined") {
      console.log("מועמד לא תקין:", candidate)
      return false
    }

    // Filter by gender tab
    if (genderTab === "male" && candidate.role !== "Male") return false
    if (genderTab === "female" && candidate.role !== "Women") return false

    // חיפוש טקסטואלי
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const firstName = candidate.firstName?.toLowerCase() || ""
      const lastName = candidate.lastName?.toLowerCase() || ""
      const city = candidate.city?.toLowerCase() || ""
      const candidateClass = candidate.class?.toLowerCase() || ""

      // תיקון שגיאת null.toLowerCase() - בדיקה שהשדות קיימים לפני השימוש בהם
      const occupation = (
        candidate.occupation ||
        (candidate.role === "Women" && (candidate as Women).currentOccupation) ||
        ""
      ).toLowerCase()

      const background = candidate.backGround?.toLowerCase() || ""

      const matchesSearch =
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        city.includes(searchLower) ||
        candidateClass.includes(searchLower) ||
        occupation.includes(searchLower) ||
        background.includes(searchLower)

      if (!matchesSearch) return false
    }

    // סינון לפי סטטוס
    if (filters.statusFilter !== "all") {
      const isAvailable = filters.statusFilter === "available"
      if (candidate.statusVacant !== isAvailable) return false
    }

    // סינון לפי מגדר
    if (filters.genderFilter !== "all") {
      if (candidate.role !== filters.genderFilter) return false
    }

    // סינון לפי גיל - רק אם יש ערך תקין
    if (candidate.age && (candidate.age < filters.ageRange[0] || candidate.age > filters.ageRange[1])) return false

    // סינון לפי גובה - רק אם יש ערך תקין
    if (candidate.height && (candidate.height < filters.heightRange[0] || candidate.height > filters.heightRange[1]))
      return false

    // סינון לפי עיר - רק אם בחרו ערים
    if (filters.cities.length > 0 && candidate.city && !filters.cities.includes(candidate.city)) return false

    // סינון לפי חוג - רק אם בחרו חוגים
    if (filters.classes.length > 0 && candidate.class && !filters.classes.includes(candidate.class)) return false

    // סינון לפי עיסוק - רק אם בחרו עיסוקים
    if (filters.occupations.length > 0) {
      const occupation =
        candidate.occupation || (candidate.role === "Women" ? (candidate as Women).currentOccupation : "")

      if (!occupation || !filters.occupations.includes(occupation)) return false
    }

    // סינון לפי רקע - רק אם בחרו רקעים
    if (filters.backgrounds.length > 0 && candidate.backGround && !filters.backgrounds.includes(candidate.backGround))
      return false

    return true
  })

  // רשימות ערכים לפילטרים
  const uniqueCities = [...new Set(candidates.map((c) => c.city).filter(Boolean))]
  const uniqueClasses = [...new Set(candidates.map((c) => c.class).filter(Boolean))]
  const uniqueOccupations = [
    ...new Set(
      candidates
        .map((c) => {
          // בדיקה שהשדות קיימים לפני השימוש בהם
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

        {/* חיפוש ופילטרים */}
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
                placeholder="חיפוש לפי שם, עיר, חוג..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
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

        {/* Gender Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={genderTab}
            onChange={handleGenderTabChange}
            aria-label="gender tabs"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            }}
          >
            <GenderTab
              value="all"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person />
                  <span>כל המועמדים ({candidates.length})</span>
                </Box>
              }
            />
            <GenderTab
              value="male"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Male />
                  <span>גברים ({maleCount})</span>
                </Box>
              }
            />
            <GenderTab
              value="female"
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Female />
                  <span>נשים ({femaleCount})</span>
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* רשימת מועמדים */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#fff4f4", borderRadius: 2 }}>
            <Typography color="error">{error}</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                setError(null)
                fetchCandidates()
              }}
            >
              נסה שוב
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
                {filteredCandidates.map((candidate) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${candidate.role}-${candidate.id}`}>
                    <StyledCard onClick={() => handleOpenDetails(candidate)}>
                      {/* תג סטטוס */}
                      <StatusChip
                        status={candidate.statusVacant}
                        label={candidate.statusVacant ? "פנוי/ה להצעות" : "לא פנוי/ה כרגע"}
                        size="small"
                        theme={undefined}
                      />

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
                        {candidate.photoName ? (
                          <img
                            src={candidate.photoUrl || "/placeholder.svg"}
                            alt={`${candidate.firstName}'s profile`}
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: `3px solid ${candidate.role === "Male" ? theme.palette.primary.main : theme.palette.primary.light}`,
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
                            {candidate.firstName?.charAt(0) || "M"}
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
                            {candidate.firstName?.charAt(0) || "W"}
                          </Avatar>
                        )}
                      </Box>

                      <CardContent sx={{ pt: 2, pb: 7 }}>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                          {candidate.firstName} {candidate.lastName}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <CalendarMonth fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2">גיל: {candidate.age}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <LocationOn fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2">עיר: {candidate.city}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Height fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2">גובה: {candidate.height} ס"מ</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <School fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2" noWrap>
                            {candidate.role === "Male" ? "ישיבה:" : "סמינר:"}{" "}
                            {candidate.role === "Male"
                              ? (candidate as MaleType).bigYeshiva
                              : (candidate as Women).seminar}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Work fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2" noWrap>
                            עיסוק:{" "}
                            {candidate.role === "Male" ? candidate.occupation : (candidate as Women).currentOccupation}
                          </Typography>
                        </Box>
                      </CardContent>

                      {/* שכבת מידע נוסף בהאובר */}
                      <CardOverlay className="card-overlay">
                        <Typography variant="body2">חוג: {candidate.class}</Typography>
                        <Typography variant="body2">רקע: {candidate.backGround}</Typography>
                        <Typography variant="body2">מראה כללי: {candidate.generalAppearance}</Typography>
                      </CardOverlay>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* דיאלוג פרטים מלאים */}
        {selectedCandidate && (
          <DetailDialog
            open={openDialog}
            onClose={handleCloseDetails}
            fullScreen={isMobile}
            TransitionComponent={Fade}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            {isMobile ? (
              // תצוגה למובייל
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <DialogTitle
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {user?.id && (
                      <IconButton color="primary" onClick={() => setNotesDrawerOpen(true)} aria-label="notes">
                        <NotesIcon />
                      </IconButton>
                    )}
                    <IconButton edge="end" onClick={handleCloseDetails} aria-label="close">
                      <Close />
                    </IconButton>
                  </Box>
                </DialogTitle>

                <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  {/* תמונת פרופיל */}
                  {selectedCandidate.role === "Male" ? (
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: theme.palette.primary.main,
                        fontSize: "2.5rem",
                      }}
                    >
                      {selectedCandidate.firstName?.charAt(0) || "M"}
                    </Avatar>
                  ) : (
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: theme.palette.primary.light,
                        fontSize: "2.5rem",
                      }}
                    >
                      {selectedCandidate.firstName?.charAt(0) || "W"}
                    </Avatar>
                  )}

                  <Chip
                    label={selectedCandidate.statusVacant ? "פנוי/ה להצעות" : "לא פנוי/ה כרגע"}
                    color={selectedCandidate.statusVacant ? "success" : "error"}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ width: "100%" }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      <Tab label="פרטים אישיים" />
                      <Tab label="השכלה ועיסוק" />
                      <Tab label="ציפיות ודרישות" />
                      <Tab label="משפחה וקשר" />
                    </Tabs>
                  </Box>
                </Box>

                <DialogContent dividers sx={{ flex: 1, p: 2 }}>
                  {tabValue === 0 && (
                    <Box>
                      <InfoSection>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                          פרטים אישיים
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <PersonOutline sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל: {selectedCandidate.age}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <LocationOn sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              עיר: {selectedCandidate.city}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Height sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גובה: {selectedCandidate.height} ס"מ
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <HomeOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              מדינה: {selectedCandidate.country}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <HomeOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              כתובת: {selectedCandidate.address}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <FamilyRestroomOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              חוג: {selectedCandidate.class}
                            </Typography>
                          </Grid>
                          {selectedCandidate.anOutsider !== undefined && (
                            <Grid item xs={12}>
                              <Typography variant="body1">
                                חיצוני: {selectedCandidate.anOutsider ? "כן" : "לא"}
                              </Typography>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FamilyRestroomOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              רקע: {selectedCandidate.backGround}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FamilyRestroomOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              פתיחות: {selectedCandidate.openness}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Email sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              אימייל: {selectedCandidate.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Phone sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              טלפון: {selectedCandidate.phone}
                            </Typography>
                          </Grid>
                        </Grid>
                      </InfoSection>

                      <InfoSection>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                          פרטים נוספים
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <HealthAndSafetyOutlined
                                sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              מצב בריאותי: {selectedCandidate.healthCondition ? "כן" : "לא"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <SettingsOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              סטטוס: {selectedCandidate.status}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <SettingsOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              כיסוי ראש: {selectedCandidate.headCovering}
                            </Typography>
                          </Grid>
                          {selectedCandidate.role === "Male" && (
                            <>
                              {(selectedCandidate as MaleType).driversLicense && (
                                <Grid item xs={6}>
                                  <Typography variant="body1">רשיון נהיגה: כן</Typography>
                                </Grid>
                              )}
                              {(selectedCandidate as MaleType).smoker && (
                                <Grid item xs={6}>
                                  <Typography variant="body1">מעשן: כן</Typography>
                                </Grid>
                              )}
                              <Grid item xs={6}>
                                <Typography variant="body1">זקן: {(selectedCandidate as MaleType).beard}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body1">כובע: {(selectedCandidate as MaleType).hot}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body1">חליפה: {(selectedCandidate as MaleType).suit}</Typography>
                              </Grid>
                            </>
                          )}
                          {selectedCandidate.role === "Women" && (
                            <>
                              {(selectedCandidate as Women).drivingLicense && (
                                <Grid item xs={6}>
                                  <Typography variant="body1">
                                    רשיון נהיגה: {(selectedCandidate as Women).drivingLicense}
                                  </Typography>
                                </Grid>
                              )}
                              {(selectedCandidate as Women).smoker && (
                                <Grid item xs={6}>
                                  <Typography variant="body1">מעשנת: כן</Typography>
                                </Grid>
                              )}
                            </>
                          )}
                        </Grid>
                      </InfoSection>

                      <InfoSection>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                          מראה חיצוני
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body1">גובה: {selectedCandidate.height} ס"מ</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">מראה כללי: {selectedCandidate.generalAppearance}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">צ��ע פנים: {selectedCandidate.facePaint}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1">מראה: {selectedCandidate.appearance}</Typography>
                          </Grid>
                        </Grid>
                      </InfoSection>
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box>
                      {selectedCandidate.role === "Male" ? (
                        <InfoSection>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                          >
                            רקע ישיבתי
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                ישיבה קטנה: {(selectedCandidate as MaleType).smallYeshiva}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                ישיבה גדולה: {(selectedCandidate as MaleType).bigYeshiva}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                קיבוץ: {(selectedCandidate as MaleType).kibbutz}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <WorkOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                עיסוק: {(selectedCandidate as MaleType).occupation}
                              </Typography>
                            </Grid>
                          </Grid>
                        </InfoSection>
                      ) : (
                        <InfoSection>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                          >
                            רקע השכלתי
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                תיכון: {(selectedCandidate as Women).highSchool}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                סמינר: {(selectedCandidate as Women).seminar}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                מסלול לימודי: {(selectedCandidate as Women).studyPath}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                                <SchoolOutlined
                                  sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                                />
                                מוסד לימודי נוסף: {(selectedCandidate as Women).additionalEducationalInstitution}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <WorkOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                עיסוק כיום: {(selectedCandidate as Women).currentOccupation}
                              </Typography>
                            </Grid>
                          </Grid>
                        </InfoSection>
                      )}
                    </Box>
                  )}

                  {tabValue === 2 && (
                    <Box>
                      <InfoSection>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                          ציפיות {selectedCandidate.role === "Male" ? "מבת" : "מבן"} הזוג
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Cake sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל מינימלי: {selectedCandidate.ageFrom}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Cake sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל מקסימלי: {selectedCandidate.ageTo}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <FamilyRestroomOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              חוג: {selectedCandidate.club}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FavoriteOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              תכונות חשובות בי: {selectedCandidate.importantTraitsInMe}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FavoriteOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              תכונות חשובות שאני מחפש:{" "}
                              {selectedCandidate.role === "Male"
                                ? (selectedCandidate as MaleType).importantTraitsIAmLookingFor
                                : (selectedCandidate as Women).importantTraitsIMLookingFor}
                            </Typography>
                          </Grid>
                          {selectedCandidate.role === "Male" && (
                            <>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                                  <SchoolOutlined
                                    sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                                  />
                                  סגנון סמינר מועדף: {(selectedCandidate as MaleType).preferredSeminarStyle}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                                  <WorkOutlined
                                    sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                                  />
                                  מסלול מקצועי מועדף: {(selectedCandidate as MaleType).preferredProfessionalPath}
                                </Typography>
                              </Grid>
                              {(selectedCandidate as MaleType).expectationsFromPartner && (
                                <Grid item xs={12}>
                                  <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                                    <FavoriteOutlined
                                      sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                                    />
                                    ציפיות מהשותף: {(selectedCandidate as MaleType).expectationsFromPartner}
                                  </Typography>
                                </Grid>
                              )}
                            </>
                          )}
                          {selectedCandidate.role === "Women" && (
                            <>
                              <Grid item xs={12}>
                                <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                                  <SchoolOutlined
                                    sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                                  />
                                  סגנון הישיבות המועדף: {(selectedCandidate as Women).preferredSittingStyle}
                                </Typography>
                              </Grid>
                              {(selectedCandidate as Women).interestedInBoy && (
                                <Grid item xs={12}>
                                  <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                                    <Info sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }} />
                                    מעוניינת בבחור: {(selectedCandidate as Women).interestedInBoy}
                                  </Typography>
                                </Grid>
                              )}
                              <Grid item xs={12}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{ fontWeight: "bold", color: theme.palette.primary.main, mt: 2 }}
                                >
                                  מעוניינת שהבחור יהיה:
                                </Typography>
                                <Grid container spacing={2}>
                                  {(selectedCandidate as Women).drivingLicense && (
                                    <Grid item xs={6} md={4}>
                                      <Typography variant="body1">
                                        בעל רישיון נהיגה: {(selectedCandidate as Women).drivingLicense}
                                      </Typography>
                                    </Grid>
                                  )}
                                  {(selectedCandidate as Women).smoker && (
                                    <Grid item xs={6} md={4}>
                                      <Typography variant="body1">לא מעשן</Typography>
                                    </Grid>
                                  )}
                                  <Grid item xs={6} md={4}>
                                    <Typography variant="body1">זקן: {(selectedCandidate as Women).beard}</Typography>
                                  </Grid>
                                  <Grid item xs={6} md={4}>
                                    <Typography variant="body1">כובע: {(selectedCandidate as Women).hat}</Typography>
                                  </Grid>
                                  <Grid item xs={6} md={4}>
                                    <Typography variant="body1">חליפה: {(selectedCandidate as Women).suit}</Typography>
                                  </Grid>
                                  <Grid item xs={6} md={4}>
                                    <Typography variant="body1">
                                      עיסוק: {(selectedCandidate as Women).occupation}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </InfoSection>
                    </Box>
                  )}

                  {tabValue === 3 && (
                    <Box>
                      {/* פרטי משפחה */}
                      <InfoSection>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                          פרטי משפחה
                        </Typography>
                        {familyDetails ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                                פרטי אב
                              </Typography>
                              <Typography variant="body1">שם: {familyDetails.fatherName}</Typography>
                              <Typography variant="body1">מוצא: {familyDetails.fatherOrigin}</Typography>
                              <Typography variant="body1">ישיבה: {familyDetails.fatherYeshiva}</Typography>
                              <Typography variant="body1">שיוך: {familyDetails.fatherAffiliation}</Typography>
                              <Typography variant="body1">עיסוק: {familyDetails.fatherOccupation}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                                פרטי אם
                              </Typography>
                              <Typography variant="body1">שם: {familyDetails.motherName}</Typography>
                              <Typography variant="body1">מוצא: {familyDetails.motherOrigin}</Typography>
                              <Typography variant="body1">סמינר: {familyDetails.motherGraduateSeminar}</Typography>
                              <Typography variant="body1">שם קודם: {familyDetails.motherPreviousName}</Typography>
                              <Typography variant="body1">עיסוק: {familyDetails.motherOccupation}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="body1">
                                סטטוס הורים: {familyDetails.parentsStatus ? "נשואים" : "אחר"}
                              </Typography>
                              <Typography variant="body1">
                                מצב בריאותי: {familyDetails.healthStatus ? "תקין" : "לא תקין"}
                              </Typography>
                              <Typography variant="body1">רב המשפחה: {familyDetails.familyRabbi}</Typography>
                              <Typography variant="body1" sx={{ mt: 1 }}>
                                אודות המשפחה: {familyDetails.familyAbout}
                              </Typography>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography variant="body1" color="text.secondary" align="center">
                            אין פרטי משפחה זמינים
                          </Typography>
                        )}
                      </InfoSection>

                      {/* פרטי התקשרות */}
                      <InfoSection>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
                        >
                          אנשי קשר לבירורים
                        </Typography>
                        {contacts && contacts.length > 0 ? (
                          <Grid container spacing={2}>
                            {contacts.map((contact, index) => (
                              <Grid item xs={12} md={6} key={contact.id || index}>
                                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <ContactPhone sx={{ mr: 1, color: theme.palette.primary.main }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                      {contact.name}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                    <Phone sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                                    {contact.phone}
                                  </Typography>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Typography variant="body1" color="text.secondary" align="center">
                            אין אנשי קשר זמינים
                          </Typography>
                        )}
                      </InfoSection>
                    </Box>
                  )}
                </DialogContent>

                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="contained"
                    color={selectedCandidate.statusVacant ? "error" : "success"}
                    onClick={() =>
                      updateCandidateStatus(
                        selectedCandidate.id,
                        selectedCandidate.role,
                        !selectedCandidate.statusVacant,
                      )
                    }
                  >
                    {selectedCandidate.statusVacant ? "סמן כלא פנוי/ה" : "סמן כפנוי/ה להצעות"}
                  </Button>
                  <Button variant="outlined" onClick={handleCloseDetails}>
                    סגור
                  </Button>
                </Box>
              </Box>
            ) : (
              // תצוגה לדסקטופ
              <>
                <DetailSidebar>
                  <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleCloseDetails}>
                    <Close />
                  </IconButton>

                  {/* תמונת פרופיל */}
                  {selectedCandidate.role === "Male" ? (
                    <ProfileAvatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {selectedCandidate.firstName?.charAt(0) || "M"}
                    </ProfileAvatar>
                  ) : (
                    <ProfileAvatar sx={{ bgcolor: theme.palette.primary.light }}>
                      {selectedCandidate.firstName?.charAt(0) || "W"}
                    </ProfileAvatar>
                  )}

                  <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </Typography>

                  <Chip
                    icon={selectedCandidate.statusVacant ? <CheckCircle /> : <Visibility />}
                    label={selectedCandidate.statusVacant ? "פנוי/ה להצעות" : "לא פנוי/ה כרגע"}
                    color={selectedCandidate.statusVacant ? "success" : "error"}
                    sx={{ mb: 2 }}
                  />

                  <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                    {/* טקסט מעל הכפתור */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: "13px",
                        mb: 0.2,
                      }}
                    >
                      רוצה לקבל את המועמדים שמתאימים עם AI?
                    </Typography>

                    {/* כפתור קטן ומעוצב */}
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        handleNavigate(`match/${selectedCandidate?.role}/${selectedCandidate?.id}`, "match")
                      }}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: "#fff",
                        px: 3,
                        py: 1,
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        textTransform: "none",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      🔍 התחל חיפוש
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    color={selectedCandidate.statusVacant ? "error" : "success"}
                    fullWidth
                    onClick={() =>
                      updateCandidateStatus(
                        selectedCandidate.id,
                        selectedCandidate.role,
                        !selectedCandidate.statusVacant,
                      )
                    }
                    sx={{ mb: 2 }}
                  >
                    {selectedCandidate.statusVacant ? "סמן כלא פנוי/ה" : "סמן כפנוי/ה להצעות"}
                  </Button>

                  {user?.id && (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<NotesIcon />}
                      onClick={() => setNotesDrawerOpen(true)}
                      sx={{ mb: 2 }}
                    >
                      הערות שדכנית
                    </Button>
                  )}

                  <Divider sx={{ width: "100%", my: 2 }} />

                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarMonth sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography>גיל: {selectedCandidate.age}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOn sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography>עיר: {selectedCandidate.city}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Height sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography>גובה: {selectedCandidate.height} ס"מ</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography>חוג: {selectedCandidate.class}</Typography>
                    </Box>
                  </Box>
                </DetailSidebar>

                <DetailContent>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ mb: 3 }}
                  >
                    <Tab label="פרטים אישיים" />
                    <Tab label="השכלה ועיסוק" />
                    <Tab label="ציפיות ודרישות" />
                    <Tab label="משפחה וקשר" />
                  </Tabs>

                  {/* Rest of the desktop dialog content - same as mobile but with better layout */}
                  {/* ... (continuing with the same content structure as mobile) ... */}
                </DetailContent>
              </>
            )}
          </DetailDialog>
        )}

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

          <Box>
            {/* שדה טקסט להוספת הערה חדשה */}
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="הוסף הערה חדשה"
              sx={{ mb: 1 }}
            />

            {/* כפתור להוספת הערה */}
            <Button
              variant="contained"
              color="primary"
              onClick={addNote}
              disabled={!newNoteText.trim() || !selectedCandidate}
            >
              הוסף הערה
            </Button>
          </Box>

          {/* הצגת הערות */}
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
        </NotesDrawer>
        <Outlet />
      </Box>
    </ThemeProvider>
  )
}

export default CandidatesPage
