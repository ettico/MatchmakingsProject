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
  Alert,
  AlertTitle,
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
  FamilyRestroomOutlined,
  Email,
  Phone,
  ContactPhone,
  Male,
  Female,
  Login,
  Refresh,
  VerifiedUser,
  PendingActions,
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

const ProfileCompletionChip = styled(Chip)(({ theme, completed }: { theme: any; completed: boolean }) => ({
  position: "absolute",
  top: 10,
  right: 10,
  backgroundColor: completed ? theme.palette.primary.main : theme.palette.warning.main,
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
  const { user, token, logout } = useContext(userContext)
  const [error, setError] = useState<string | null>(null)
  const [familyDetails, setFamilyDetails] = useState<FamilyDetails | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [, setOpen] = useState(false)
  const [, setModalType] = useState("")
  const navigate = useNavigate()
  const [genderTab, setGenderTab] = useState<"all" | "male" | "female">("all")

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
    profileCompletion: "all",
  })

  // פונקציה מתוקנת לבדיקת השלמת פרופיל - מתירנית יותר
  const isProfileComplete = (candidate: Candidate): boolean => {
    try {
      if (!candidate) return false

      // שדות בסיסיים חובה - בדיקה שהם קיימים ולא ריקים
      const hasBasicInfo = !!(
        candidate.firstName?.trim() &&
        candidate.lastName?.trim() &&
        candidate.age &&
        candidate.city?.trim() &&
        candidate.height &&
        candidate.email?.trim() &&
        candidate.phone?.trim()
      )

      // אם אין מידע בסיסי, הפרופיל לא מלא
      if (!hasBasicInfo) {
        return false
      }

      // שדות נוספים שמעידים על פרופיל מפורט
      const hasDetailedInfo = !!(
        candidate.class?.trim() ||
        candidate.backGround?.trim() ||
        candidate.generalAppearance?.trim() ||
        candidate.importantTraitsInMe?.trim()
      )

      // שדות ספציפיים לפי מגדר
      let hasRoleSpecificInfo = false
      if (candidate.role === "Male") {
        const maleCandidate = candidate as MaleType
        hasRoleSpecificInfo = !!(
          maleCandidate.bigYeshiva?.trim() ||
          maleCandidate.smallYeshiva?.trim() ||
          maleCandidate.occupation?.trim() ||
          maleCandidate.kibbutz?.trim()
        )
      } else if (candidate.role === "Women") {
        const femaleCandidate = candidate as Women
        hasRoleSpecificInfo = !!(
          femaleCandidate.seminar?.trim() ||
          femaleCandidate.highSchool?.trim() ||
          femaleCandidate.currentOccupation?.trim() ||
          femaleCandidate.studyPath?.trim()
        )
      }

      // שדות ציפיות
      const hasExpectations = !!(candidate.ageFrom || candidate.ageTo || candidate.club?.trim())

      // פרופיל נחשב מלא אם יש מידע בסיסי ולפחות אחד מהקטגוריות האחרות
      const isComplete = hasBasicInfo && (hasDetailedInfo || hasRoleSpecificInfo || hasExpectations)

      return isComplete
    } catch (error) {
      console.error("שגיאה בבדיקת השלמת פרופיל:", error, candidate)
      return false
    }
  }

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

      // איחוד הנתונים - מציג את כל המועמדים
      const allCandidates = [...males, ...females]

      // מיון המועמדים - מועמדים עם פרופיל מלא קודם, אחר כך לפי ID
      const sortedCandidates = allCandidates.sort((a, b) => {
        const aComplete = isProfileComplete(a)
        const bComplete = isProfileComplete(b)

        // מועמדים עם פרופיל מלא קודם
        if (aComplete && !bComplete) return -1
        if (!aComplete && bComplete) return 1

        // אם שניהם באותו סטטוס השלמה, מיין לפי ID (החדשים קודם)
        return b.id - a.id
      })

      setCandidates(sortedCandidates)
      console.log("סה״כ מועמדים:", sortedCandidates.length)

      const completeProfiles = sortedCandidates.filter(isProfileComplete)
      const incompleteProfiles = sortedCandidates.filter((c) => !isProfileComplete(c))

      console.log("מועמדים עם פרופיל מלא:", completeProfiles.length)
      console.log("מועמדים עם פרופיל חלקי:", incompleteProfiles.length)

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

  // פונקציה לטעינת פרטי משפחה
  const fetchFamilyDetails = async (candidateId: number, role: string) => {
    if (!token) return
    try {
      const headers = getAuthHeaders()
      const response = await axios.get<FamilyDetails[]>(`${ApiUrl}/FamilyDetails`, {
        headers,
        timeout: 10000,
      })
      const details = response.data.find(
        (detail) =>
          (role === "Male" && detail.maleId === candidateId) || (role === "Women" && detail.womenId === candidateId),
      )
      setFamilyDetails(details || null)
    } catch (error) {
      console.error("שגיאה בטעינת פרטי משפחה:", error)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handle401Error()
      }
      setFamilyDetails(null)
    }
  }

  // פונקציה לטעינת פרטי התקשרות
  const fetchContacts = async (candidateId: number, role: string) => {
    if (!token) return
    try {
      const headers = getAuthHeaders()
      const response = await axios.get<Contact[]>(`${ApiUrl}/Contact`, {
        headers,
        timeout: 10000,
      })
      const candidateContacts = response.data.filter(
        (contact) =>
          (role === "Male" && contact.maleId === candidateId) || (role === "Women" && contact.womenId === candidateId),
      )
      setContacts(candidateContacts)
    } catch (error) {
      console.error("שגיאה בטעינת פרטי התקשרות:", error)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handle401Error()
      }
      setContacts([])
    }
  }

  useEffect(() => {
    if (token) {
      fetchCandidates()
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

  // פתיחת דיאלוג פרטים
  const handleOpenDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setOpenDialog(true)
    fetchFamilyDetails(candidate.id, candidate.role)
    fetchContacts(candidate.id, candidate.role)
  }

  // סגירת דיאלוג
  const handleCloseDetails = () => {
    setOpenDialog(false)
    setFamilyDetails(null)
    setContacts([])
  }

  // החלף את הפונקציה updateCandidateStatus בקוד הבא:

  // עדכון סטטוס מועמד - פשוט ויעיל
  const updateCandidateStatus = async (id: number, role: string, isAvailable: boolean) => {
    if (!selectedCandidate || !token) return

    try {
      const endpoint = role === "Male" ? "Male" : "Women"
      const headers = getAuthHeaders()

      console.log(`🔄 מעדכן סטטוס מועמד ${id} (${role}) ל-${isAvailable}`)

      // יצירת אובייקט עדכון בסיסי עם כל השדות הנדרשים
      const updateData = {
        ...selectedCandidate,
        statusVacant: isAvailable,
      }

      // הסרת שדות שאינם נדרשים או עלולים לגרום לבעיות
      delete updateData.photoUrl
      delete updateData.tzFormUrl
      delete updateData.photoName
      delete updateData.tzFormName

      console.log("📤 נתונים לשליחה:", JSON.stringify(updateData, null, 2))

      const response = await axios.put(`${ApiUrl}/${endpoint}/${id}`, updateData, {
        headers,
        timeout: 15000,
      })

      console.log("✅ תגובת השרת:", response.status, response.data)

      // עדכון ברשימה המקומית
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id && candidate.role === role ? { ...candidate, statusVacant: isAvailable } : candidate,
        ),
      )

      // עדכון המועמד הנבחר
      if (selectedCandidate.id === id && selectedCandidate.role === role) {
        setSelectedCandidate({ ...selectedCandidate, statusVacant: isAvailable })
      }

      console.log("🎉 סטטוס עודכן בהצלחה!")
      setError(null)
    } catch (error) {
      console.error("❌ שגיאה בעדכון סטטוס:", error)

      if (axios.isAxiosError(error)) {
        console.error("📋 פרטי השגיאה המלאים:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        })

        if (error.response?.status === 401) {
          handle401Error()
        } else if (error.response?.status === 400) {
          const errorData = error.response.data
          let errorMessage = "שגיאה בעדכון הנתונים. "

          if (errorData?.errors) {
            const errorMessages = []
            for (const field in errorData.errors) {
              errorMessages.push(`${field}: ${errorData.errors[field].join(", ")}`)
            }
            errorMessage += `פרטי השגיאות: ${errorMessages.join("; ")}`
          } else if (errorData?.message) {
            errorMessage += errorData.message
          } else {
            errorMessage += "נתונים לא תקינים."
          }

          setError(errorMessage)
        } else if (error.response?.status === 404) {
          setError("המועמד לא נמצא במערכת.")
        } else if (error.response?.status === 500) {
          setError("שגיאת שרת פנימית. נא לנסות שוב מאוחר יותר.")
        } else {
          setError(`שגיאה בעדכון סטטוס: ${error.response?.status} - ${error.response?.statusText}`)
        }
      } else {
        setError("שגיאה לא צפויה בעדכון הסטטוס.")
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
      profileCompletion: "all",
    })
    setSearchQuery("")
    setGenderTab("all")
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

  // Handle gender tab change
  const handleGenderTabChange = (_event: React.SyntheticEvent, newValue: "all" | "male" | "female") => {
    setGenderTab(newValue)
  }

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

  // סינון מועמדים - מתוקן לעבוד עם כל המועמדים
  const filteredCandidates = candidates.filter((candidate) => {
    try {
      if (!candidate || typeof candidate.id === "undefined") {
        console.log("מועמד לא תקין:", candidate)
        return false
      }

      // Filter by gender tab
      if (genderTab === "male" && candidate.role !== "Male") return false
      if (genderTab === "female" && candidate.role !== "Women") return false

      // סינון לפי השלמת פרופיל
      if (filters.profileCompletion !== "all") {
        const profileComplete = isProfileComplete(candidate)
        if (filters.profileCompletion === "complete" && !profileComplete) return false
        if (filters.profileCompletion === "incomplete" && profileComplete) return false
      }

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

  // Count candidates by gender and profile completion
  const maleCount = candidates.filter((c) => c.role === "Male").length
  const femaleCount = candidates.filter((c) => c.role === "Women").length
  const completeProfilesCount = filteredCandidates.filter(isProfileComplete).length
  const incompleteProfilesCount = filteredCandidates.length - completeProfilesCount

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
          <Typography variant="body2" align="center" sx={{ mt: 1, opacity: 0.9 }}>
            פרופילים מלאים: {candidates.filter(isProfileComplete).length} • פרופילים חלקיים:{" "}
            {candidates.length - candidates.filter(isProfileComplete).length}
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
                      filters.profileCompletion === "all" &&
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
                    <FormControl fullWidth size="small">
                      <InputLabel id="profile-completion-filter-label">השלמת פרופיל</InputLabel>
                      <Select
                        labelId="profile-completion-filter-label"
                        value={filters.profileCompletion}
                        label="השלמת פרופיל"
                        onChange={(e) => handleFilterChange("profileCompletion", e.target.value)}
                      >
                        <MenuItem value="all">הכל</MenuItem>
                        <MenuItem value="complete">פרופיל מלא</MenuItem>
                        <MenuItem value="incomplete">פרופיל חלקי</MenuItem>
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
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Chip
                  icon={<VerifiedUser />}
                  label={`פרופילים מלאים: ${completeProfilesCount}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<PendingActions />}
                  label={`פרופילים חלקיים: ${incompleteProfilesCount}`}
                  color="warning"
                  variant="outlined"
                />
              </Box>
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
                  const profileComplete = isProfileComplete(candidate)
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
                        {/* תג השלמת פרופיל */}
                        <ProfileCompletionChip
                          completed={profileComplete}
                          label={profileComplete ? "פרופיל מלא" : "פרופיל חלקי"}
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
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold", color: profileComplete ? "#4caf50" : "#ff9800" }}
                          >
                            {profileComplete ? "✓ פרופיל מלא" : "⚠ פרופיל חלקי"}
                          </Typography>
                        </CardOverlay>
                      </StyledCard>
                    </Grid>
                  )
                })}
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
                      {(selectedCandidate.firstName || "M").charAt(0)}
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
                      {(selectedCandidate.firstName || "W").charAt(0)}
                    </Avatar>
                  )}
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                    <Chip
                      label={selectedCandidate.statusVacant ? "פנוי/ה להצעות" : "לא פנוי/ה כרגע"}
                      color={selectedCandidate.statusVacant ? "success" : "error"}
                    />
                    <Chip
                      icon={isProfileComplete(selectedCandidate) ? <VerifiedUser /> : <PendingActions />}
                      label={isProfileComplete(selectedCandidate) ? "פרופיל מלא" : "פרופיל חלקי"}
                      color={isProfileComplete(selectedCandidate) ? "primary" : "warning"}
                    />
                  </Box>
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
                  {/* תוכן הטאבים למובייל */}
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
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <PersonOutline sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל: {selectedCandidate.age || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <LocationOn sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              עיר: {selectedCandidate.city || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Height sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גובה: {selectedCandidate.height || "לא צוין"} ס"מ
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Email sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              אימייל: {selectedCandidate.email || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Phone sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              טלפון: {selectedCandidate.phone || "לא צוין"}
                            </Typography>
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
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                ישיבה קטנה: {(selectedCandidate as MaleType).smallYeshiva || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                ישיבה גדולה: {(selectedCandidate as MaleType).bigYeshiva || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <WorkOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                עיסוק: {(selectedCandidate as MaleType).occupation || "לא צוין"}
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
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                תיכון: {(selectedCandidate as Women).highSchool || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                סמינר: {(selectedCandidate as Women).seminar || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <WorkOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                עיסוק כיום: {(selectedCandidate as Women).currentOccupation || "לא צוין"}
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
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Cake sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל מינימלי: {selectedCandidate.ageFrom || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Cake sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל מקסימלי: {selectedCandidate.ageTo || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <FamilyRestroomOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              חוג: {selectedCandidate.club || "לא צוין"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </InfoSection>
                    </Box>
                  )}
                  {tabValue === 3 && (
                    <Box>
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
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                                פרטי אב
                              </Typography>
                              <Typography variant="body1">שם: {familyDetails.fatherName}</Typography>
                              <Typography variant="body1">מוצא: {familyDetails.fatherOrigin}</Typography>
                              <Typography variant="body1">עיסוק: {familyDetails.fatherOccupation}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                                פרטי אם
                              </Typography>
                              <Typography variant="body1">שם: {familyDetails.motherName}</Typography>
                              <Typography variant="body1">מוצא: {familyDetails.motherOrigin}</Typography>
                              <Typography variant="body1">עיסוק: {familyDetails.motherOccupation}</Typography>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography variant="body1" color="text.secondary" align="center">
                            אין פרטי משפחה זמינים
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
                      {(selectedCandidate.firstName || "M").charAt(0)}
                    </ProfileAvatar>
                  ) : (
                    <ProfileAvatar sx={{ bgcolor: theme.palette.primary.light }}>
                      {(selectedCandidate.firstName || "W").charAt(0)}
                    </ProfileAvatar>
                  )}
                  <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
                    <Chip
                      icon={selectedCandidate.statusVacant ? <CheckCircle /> : <Visibility />}
                      label={selectedCandidate.statusVacant ? "פנוי/ה להצעות" : "לא פנוי/ה כרגע"}
                      color={selectedCandidate.statusVacant ? "success" : "error"}
                    />
                    <Chip
                      icon={isProfileComplete(selectedCandidate) ? <VerifiedUser /> : <PendingActions />}
                      label={isProfileComplete(selectedCandidate) ? "פרופיל מלא" : "פרופיל חלקי"}
                      color={isProfileComplete(selectedCandidate) ? "primary" : "warning"}
                    />
                  </Box>
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
                  {/* תוכן הטאבים */}
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
                              גיל: {selectedCandidate.age || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <LocationOn sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              עיר: {selectedCandidate.city || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Height sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גובה: {selectedCandidate.height || "לא צוין"} ס"מ
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <HomeOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              מדינה: {selectedCandidate.country || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <HomeOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              כתובת: {selectedCandidate.address || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <FamilyRestroomOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              חוג: {selectedCandidate.class || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FamilyRestroomOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              רקע: {selectedCandidate.backGround || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Email sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              אימייל: {selectedCandidate.email || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Phone sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              טלפון: {selectedCandidate.phone || "לא צוין"}
                            </Typography>
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
                                ישיבה קטנה: {(selectedCandidate as MaleType).smallYeshiva || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                ישיבה גדולה: {(selectedCandidate as MaleType).bigYeshiva || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                קיבוץ: {(selectedCandidate as MaleType).kibbutz || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <WorkOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                עיסוק: {(selectedCandidate as MaleType).occupation || "לא צוין"}
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
                                תיכון: {(selectedCandidate as Women).highSchool || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                סמינר: {(selectedCandidate as Women).seminar || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <SchoolOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                מסלול לימודי: {(selectedCandidate as Women).studyPath || "לא צוין"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                <WorkOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                                עיסוק כיום: {(selectedCandidate as Women).currentOccupation || "לא צוין"}
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
                              גיל מינימלי: {selectedCandidate.ageFrom || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <Cake sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              גיל מקסימלי: {selectedCandidate.ageTo || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                              <FamilyRestroomOutlined sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
                              חוג: {selectedCandidate.club || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FavoriteOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              תכונות חשובות בי: {selectedCandidate.importantTraitsInMe || "לא צוין"}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" sx={{ display: "flex", alignItems: "flex-start" }}>
                              <FavoriteOutlined
                                sx={{ mr: 1, mt: 0.5, fontSize: 20, color: theme.palette.primary.main }}
                              />
                              תכונות חשובות שאני מחפש:{" "}
                              {selectedCandidate.role === "Male"
                                ? (selectedCandidate as MaleType).importantTraitsIAmLookingFor || "לא צוין"
                                : (selectedCandidate as Women).importantTraitsIMLookingFor || "לא צוין"}
                            </Typography>
                          </Grid>
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
          <Box sx={{ mb: 3 }}>
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
              fullWidth
            >
              הוסף הערה
            </Button>
          </Box>
          {/* הצגת הערות */}
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
