"use client"
import { useState, useEffect, useContext } from "react"
import { styled, keyframes } from "@mui/material/styles"
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { userContext } from "./UserContext"

// אייקונים
import PersonIcon from "@mui/icons-material/Person"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CakeIcon from "@mui/icons-material/Cake"
import HeightIcon from "@mui/icons-material/Height"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import SchoolIcon from "@mui/icons-material/School"
import WorkIcon from "@mui/icons-material/Work"
import FavoriteIcon from "@mui/icons-material/Favorite"
import InfoIcon from "@mui/icons-material/Info"
import EditIcon from "@mui/icons-material/Edit"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

// אנימציות מותאמות אישית
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 115, 51, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(184, 115, 51, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 115, 51, 0);
  }
`

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(184, 115, 51, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(184, 115, 51, 0.6);
  }
`

// 🔧 תיקון כתובת ה-API
const API_BASE_URL = "https://matchmakingsprojectserver.onrender.com/api"

// סטיילינג מותאם אישית
const ProfileContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f8f9fa 0%, #fff8f0 50%, #f0f8ff 100%)",
  padding: theme.spacing(4, 2),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(184, 115, 51, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(44, 24, 16, 0.05) 0%, transparent 50%)
    `,
    zIndex: 0,
  },
}))

const ProfileCard = styled(Paper)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  borderRadius: theme.spacing(4),
  background: "linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #fff8f0 100%)",
  boxShadow: "0 20px 60px rgba(184, 115, 51, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(184, 115, 51, 0.1)",
  overflow: "hidden",
  marginBottom: theme.spacing(3),
}))

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #2c1810 0%, #b87333 50%, #d4af37 100%)",
  padding: theme.spacing(6, 4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: `
      radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%),
      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)
    `,
    animation: `${float} 6s ease-in-out infinite`,
  },
}))

const ProfileAvatar = styled(Avatar)(({}) => ({
  width: 180,
  height: 180,
  border: "4px solid rgba(255, 255, 255, 0.9)",
  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.3)",
  position: "relative",
  zIndex: 2,
  animation: `${glow} 3s ease-in-out infinite`,
  "& .MuiAvatar-img": {
    objectFit: "cover",
  },
}))

const InfoCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
  border: "1px solid rgba(184, 115, 51, 0.1)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(3),
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 40px rgba(184, 115, 51, 0.2)",
    border: "1px solid rgba(184, 115, 51, 0.3)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #b87333, #d4af37, #b87333)",
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "800",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  background: "linear-gradient(135deg, #2c1810 0%, #b87333 50%, #d4af37 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1.8rem",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateX(8px)",
  },
  "& svg": {
    color: "#b87333",
    filter: "drop-shadow(0 2px 4px rgba(184, 115, 51, 0.3))",
    fontSize: "2rem",
  },
}))

const StyledChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(135deg, #b87333, #d4af37)",
  color: "white",
  fontWeight: "600",
  margin: theme.spacing(0.5),
  boxShadow: "0 4px 8px rgba(184, 115, 51, 0.3)",
  fontSize: "1rem",
  height: "36px",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(184, 115, 51, 0.4)",
  },
}))

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  borderRadius: theme.spacing(2),
  background: "linear-gradient(135deg, #fff8f0 0%, #f0f8ff 100%)",
  border: "1px solid rgba(184, 115, 51, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateX(8px)",
    boxShadow: "0 8px 16px rgba(184, 115, 51, 0.2)",
  },
}))

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  background: "rgba(184, 115, 51, 0.05)",
  marginBottom: theme.spacing(2),
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(184, 115, 51, 0.1)",
    transform: "translateX(4px)",
  },
}))

interface UserData {
  id: number
  firstName: string
  lastName: string
  age: number
  city: string
  country: string
  address: string
  height: number
  phone: string
  email: string
  fatherPhone: string
  motherPhone: string
  class: string
  backGround: string
  openness: string
  status: string
  pairingType: string
  tz: string
  burnDate: string
  anOutsider: boolean
  healthCondition: boolean
  statusVacant: boolean
  smoker: boolean
  driversLicense?: boolean
  drivingLicense?: string
  generalAppearance: string
  facePaint: string
  appearance: string
  headCovering: string
  suit: string
  beard: string
  hot?: string
  photoUrl?: string
  moreInformation?: string
  importantTraitsInMe?: string
  importantTraitsIAmLookingFor?: string
  importantTraitsIMLookingFor?: string
  // שדות ייחודיים לבחורים
  smallYeshiva?: string
  bigYeshiva?: string
  kibbutz?: string
  occupation?: string
  expectationsFromPartner?: string
  club?: string
  ageFrom?: number
  ageTo?: number
  preferredSeminarStyle?: string
  preferredProfessionalPath?: string
  // שדות ייחודיים לבחורות
  highSchool?: string
  seminar?: string
  studyPath?: string
  additionalEducationalInstitution?: string
  currentOccupation?: string
  preferredSittingStyle?: string
  interestedInBoy?: string
  hat?: string
  role?: string
}

interface FamilyData {
  fatherName: string
  fatherOrigin: string
  fatherYeshiva: string
  fatherAffiliation: string
  fatherOccupation: string
  motherName: string
  motherOrigin: string
  motherGraduateSeminar: string
  motherPreviousName: string
  motherOccupation: string
  parentsStatus: boolean
  healthStatus: boolean
  familyRabbi: string
  familyAbout: string
}

interface ContactData {
  id: number
  name: string
  contactType?: string
  phone: string
}

interface UserProfileProps {
  candidateData?: any
  onClose?: () => void
}

const NA = "לא צוין"

function displayValue(val: any): string {
  if (val === null || val === undefined || val === "") return NA
  if (typeof val === "boolean") return val ? "כן" : "לא"
  return String(val)
}

const UserProfile = ({ candidateData, onClose }: UserProfileProps) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [familyData, setFamilyData] = useState<FamilyData | null>(null)
  const [contactsData, setContactsData] = useState<ContactData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const ctx = useContext(userContext) as any
  const user = ctx?.user
  const token = ctx?.token

  // State לניהול הרחבת כרטיסים
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    family: false,
    contacts: false,
    traits: false,
    education: false,
    preferences: false,
  })

  // טעינת נתוני המשתמש
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        setError("")

        const apiFetch = async (url: string, tkn: string) => {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${tkn}`, "Content-Type": "application/json" },
          })
          if (!res.ok) {
            const err: any = new Error(res.statusText)
            err.response = { status: res.status, statusText: res.statusText }
            throw err
          }
          return res.json()
        }

        if (candidateData) {
          setUserData(candidateData)
          if (token) {
            try {
              const data = await apiFetch(`${API_BASE_URL}/FamilyDetails`, token)
              const found = data.find(
                (d: any) =>
                  (candidateData.role === "Male" && d.maleId === candidateData.id) ||
                  (candidateData.role === "Women" && d.womenId === candidateData.id),
              )
              if (found) setFamilyData(found)
            } catch {}
            try {
              const data = await apiFetch(`${API_BASE_URL}/Contact`, token)
              setContactsData(
                data.filter(
                  (c: any) =>
                    (candidateData.role === "Male" && c.maleId === candidateData.id) ||
                    (candidateData.role === "Women" && c.womenId === candidateData.id),
                ),
              )
            } catch {}
          }
          return
        }

        if (!user) {
          setError("לא נמצא משתמש בקונטקסט")
          return
        }
        if (!token) {
          setError("לא נמצא טוקן אימות")
          return
        }
        if (!user.id) {
          setError("לא נמצא מזהה משתמש")
          return
        }
        if (!user.role) {
          setError("לא נמצא תפקיד משתמש")
          return
        }

        const { id, role } = user
        const apiUrl = role === "Male" ? `${API_BASE_URL}/Male/${id}` : `${API_BASE_URL}/Women/${id}`

        const uData = await apiFetch(apiUrl, token)
        setUserData(uData)

        try {
          const fAll = await apiFetch(`${API_BASE_URL}/FamilyDetails`, token)
          const fFound = fAll.find(
            (d: any) => (role === "Male" && d.maleId === id) || (role === "Women" && d.womenId === id),
          )
          if (fFound) setFamilyData(fFound)
        } catch {}

        try {
          const cAll = await apiFetch(`${API_BASE_URL}/Contact`, token)
          setContactsData(
            cAll.filter(
              (c: any) => (role === "Male" && c.maleId === id) || (role === "Women" && c.womenId === id),
            ),
          )
        } catch {}
      } catch (error: any) {
        if (error.response?.status === 401) {
          setError("אין הרשאה לצפות בפרופיל")
        } else if (error.response?.status === 404) {
          setError("הפרופיל לא נמצא")
        } else if (error.response?.status === 500) {
          setError("שגיאת שרת")
        } else if (error.message?.includes("fetch")) {
          setError("לא ניתן להתחבר לשרת")
        } else {
          setError("שגיאה בטעינת הפרופיל")
        }
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      loadUserProfile()
    }, 100)

    return () => clearTimeout(timer)
  }, [user, token, candidateData])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (loading) {
    return (
      <ProfileContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress
            size={60}
            sx={{
              color: "#b87333",
              animation: `${pulse} 2s infinite`,
            }}
          />
          <Typography variant="h5" sx={{ mt: 3, color: "#2c1810", fontWeight: "600" }}>
            🔄 טוען פרופיל...
          </Typography>
        </Box>
      </ProfileContainer>
    )
  }

  if (error || !userData) {
    return (
      <ProfileContainer>
        <Alert
          severity="error"
          sx={{
            mt: 4,
            borderRadius: 3,
            fontSize: "1.1rem",
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            ❌ שגיאה בטעינת הפרופיל
          </Typography>
          <Typography variant="body1">{error || "לא נמצאו נתוני משתמש"}</Typography>
        </Alert>
      </ProfileContainer>
    )
  }

  const isMale = userData.role === "Male" || !userData.role
  const u = userData as any

  return (
    <ProfileContainer maxWidth="lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* כותרת הפרופיל */}
        <ProfileCard elevation={0}>
          <ProfileHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4, position: "relative", zIndex: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <ProfileAvatar
                src={u.photoUrl || "/placeholder.svg?height=180&width=180"}
                alt={`${u.firstName} ${u.lastName}`}
              >
                <PersonIcon sx={{ fontSize: 100, color: "#b87333" }} />
              </ProfileAvatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    color: "white",
                    fontWeight: "900",
                    mb: 2,
                    textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  {u.firstName} {u.lastName}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                  <StyledChip icon={<CakeIcon />} label={`גיל ${displayValue(u.age)}`} />
                  <StyledChip icon={<LocationOnIcon />} label={`${displayValue(u.city)}, ${displayValue(u.country)}`} />
                  <StyledChip icon={<HeightIcon />} label={`${displayValue(u.height)} ס"מ`} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: "500",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  {displayValue(u.status)} • {displayValue(u.backGround)} • {displayValue(u.openness)}
                </Typography>
              </Box>
              {onClose && (
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    width: 60,
                    height: 60,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: 30 }} />
                </IconButton>
              )}
            </Box>
          </ProfileHeader>
        </ProfileCard>

        {/* פרטים אישיים */}
        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle onClick={() => toggleSection("personal")}>
              <PersonIcon />
              פרטים אישיים
              {expandedSections.personal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </SectionTitle>
            <Collapse in={expandedSections.personal}>
              <AnimatePresence>
                {expandedSections.personal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <EmailIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              אימייל
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.email)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <PhoneIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              טלפון
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.phone)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              תעודת זהות
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.tz)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <CakeIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              תאריך שריפה
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.burnDate)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12}>
                        <DetailItem>
                          <LocationOnIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              כתובת
                            </Typography>
                            <Typography variant="h6">
                              {displayValue(u.address)}, {displayValue(u.city)}, {displayValue(u.country)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                          עדה וזרם
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <Chip label={displayValue(u.class)} size="medium" variant="outlined" />
                          <Chip label={displayValue(u.backGround)} size="medium" variant="outlined" />
                          <Chip label={displayValue(u.openness)} size="medium" variant="outlined" />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <HeightIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              גובה (ס"מ)
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.height)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              מראה כללי
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.generalAppearance)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              מראה
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.appearance)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              איפור פנים
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.facePaint)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              כיסוי ראש
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.headCovering)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              חליפה
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.suit)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              זקן
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.beard)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      {isMale && u.hot && (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <FavoriteIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                חם
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {displayValue(u.hot)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                            בריאות תקינה
                          </Typography>
                          <Chip
                            label={u.healthCondition ? "כן" : "לא"}
                            color={u.healthCondition ? "success" : "error"}
                            variant="outlined"
                          />
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                            פנוי לשידוך
                          </Typography>
                          <Chip
                            label={u.statusVacant ? "כן" : "לא"}
                            color={u.statusVacant ? "success" : "error"}
                            variant="outlined"
                          />
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                            מחוץ לעיר
                          </Typography>
                          <Chip
                            label={u.anOutsider ? "כן" : "לא"}
                            color={u.anOutsider ? "success" : "error"}
                            variant="outlined"
                          />
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                            מעשן
                          </Typography>
                          <Chip
                            label={u.smoker ? "כן" : "לא"}
                            color={u.smoker ? "error" : "success"}
                            variant="outlined"
                          />
                        </DetailItem>
                      </Grid>
                      {(isMale && u.driversLicense) || (!isMale && u.drivingLicense) ? (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                              רישיון נהיגה
                            </Typography>
                            <Chip
                              label={
                                (isMale ? u.driversLicense : u.drivingLicense) === true ||
                                (isMale ? u.driversLicense : u.drivingLicense) === "true"
                                  ? "כן"
                                  : "לא"
                              }
                              color={
                                (isMale ? u.driversLicense : u.drivingLicense) === true ||
                                (isMale ? u.driversLicense : u.drivingLicense) === "true"
                                  ? "success"
                                  : "error"
                              }
                              variant="outlined"
                            />
                          </DetailItem>
                        </Grid>
                      ) : null}

                      {u.moreInformation && (
                        <Grid item xs={12}>
                          <Divider sx={{ my: 3 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            מידע נוסף
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontStyle: "italic",
                              p: 3,
                              backgroundColor: "rgba(184, 115, 51, 0.05)",
                              borderRadius: 2,
                              borderLeft: "4px solid #b87333",
                            }}
                          >
                            {u.moreInformation}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </motion.div>
                )}
              </AnimatePresence>
            </Collapse>
          </CardContent>
        </InfoCard>

        {/* השכלה וקריירה */}
        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle onClick={() => toggleSection("education")}>
              <SchoolIcon />
              השכלה ותעסוקה
              {expandedSections.education ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </SectionTitle>
            <Collapse in={expandedSections.education}>
              <AnimatePresence>
                {expandedSections.education && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      {isMale ? (
                        <>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  ישיבה קטנה
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.smallYeshiva)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  ישיבה גדולה
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.bigYeshiva)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  קיבוץ / מקום שהות
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.kibbutz)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  עיסוק
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.occupation)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  סגנון ישיבה מועדף
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.preferredSeminarStyle)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  מסלול מקצועי מועדף
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.preferredProfessionalPath)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  תיכון
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.highSchool)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  סמינר
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.seminar)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  מסלול לימוד
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.studyPath)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  מוסד חינוכי נוסף
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.additionalEducationalInstitution)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  עיסוק נוכחי
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.currentOccupation)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  עיסוק
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.occupation)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <DetailItem>
                              <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  סגנון ישיבה מועדף
                                </Typography>
                                <Typography variant="h6" fontWeight="600">
                                  {displayValue(u.preferredSittingStyle)}
                                </Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                          {u.hat && (
                            <Grid item xs={12} md={6}>
                              <DetailItem>
                                <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                                <Box>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    כיסוי ראש לבחור
                                  </Typography>
                                  <Typography variant="h6" fontWeight="600">
                                    {displayValue(u.hat)}
                                  </Typography>
                                </Box>
                              </DetailItem>
                            </Grid>
                          )}
                        </>
                      )}
                    </Grid>
                  </motion.div>
                )}
              </AnimatePresence>
            </Collapse>
          </CardContent>
        </InfoCard>

        {/* העדפות שידוך */}
        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle onClick={() => toggleSection("preferences")}>
              <FavoriteIcon />
              העדפות שידוך
              {expandedSections.preferences ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </SectionTitle>
            <Collapse in={expandedSections.preferences}>
              <AnimatePresence>
                {expandedSections.preferences && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <CakeIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              גיל מינימלי
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.ageFrom)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <CakeIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              גיל מקסימלי
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.ageTo)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              מועדון / חוג
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(u.club)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              {isMale ? "ציפיות מבן/בת זוג" : "מעוניינת בבחור"}
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {displayValue(isMale ? u.expectationsFromPartner : u.interestedInBoy)}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          תכונות חשובות בי
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: "italic",
                            p: 3,
                            backgroundColor: "rgba(184, 115, 51, 0.05)",
                            borderRadius: 2,
                            borderLeft: "4px solid #b87333",
                          }}
                        >
                          {displayValue(u.importantTraitsInMe)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          תכונות שאני מחפש/ת
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: "italic",
                            p: 3,
                            backgroundColor: "rgba(212, 175, 55, 0.05)",
                            borderRadius: 2,
                            borderLeft: "4px solid #d4af37",
                          }}
                        >
                          {displayValue(u.importantTraitsIAmLookingFor || u.importantTraitsIMLookingFor)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
              </AnimatePresence>
            </Collapse>
          </CardContent>
        </InfoCard>

        {/* פרטי משפחה */}
        {familyData && (
          <InfoCard>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle onClick={() => toggleSection("family")}>
                <FamilyRestroomIcon />
                פרטי משפחה
                {expandedSections.family ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </SectionTitle>
              <Collapse in={expandedSections.family}>
                <AnimatePresence>
                  {expandedSections.family && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <PersonIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="h6" color="text.secondary">
                                אב
                              </Typography>
                              <Typography variant="h5" fontWeight="600">
                                {displayValue(familyData.fatherName)}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {displayValue(familyData.fatherOrigin)} • {displayValue(familyData.fatherOccupation)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <PersonIcon sx={{ color: "#d4af37", fontSize: 28 }} />
                            <Box>
                              <Typography variant="h6" color="text.secondary">
                                אם
                              </Typography>
                              <Typography variant="h5" fontWeight="600">
                                {displayValue(familyData.motherName)}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {displayValue(familyData.motherOrigin)} • {displayValue(familyData.motherOccupation)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                ישיבת האב
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {displayValue(familyData.fatherYeshiva)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                השתייכות האב
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {displayValue(familyData.fatherAffiliation)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                סמינר האם
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {displayValue(familyData.motherGraduateSeminar)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                שם קודם של האם
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {displayValue(familyData.motherPreviousName)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                רב המשפחה
                              </Typography>
                              <Typography variant="h6" fontWeight="600">
                                {displayValue(familyData.familyRabbi)}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                              הורים נשואים
                            </Typography>
                            <Chip
                              label={familyData.parentsStatus ? "כן" : "לא"}
                              color={familyData.parentsStatus ? "success" : "error"}
                              variant="outlined"
                            />
                          </DetailItem>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                              מצב בריאות תקין
                            </Typography>
                            <Chip
                              label={familyData.healthStatus ? "כן" : "לא"}
                              color={familyData.healthStatus ? "success" : "error"}
                              variant="outlined"
                            />
                          </DetailItem>
                        </Grid>
                        {familyData.familyAbout && (
                          <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              על המשפחה
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontStyle: "italic",
                                p: 3,
                                backgroundColor: "rgba(184, 115, 51, 0.05)",
                                borderRadius: 2,
                                borderLeft: "4px solid #b87333",
                              }}
                            >
                              {familyData.familyAbout}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Collapse>
            </CardContent>
          </InfoCard>
        )}

        {/* אנשי קשר */}
        {contactsData.length > 0 && (
          <InfoCard>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle onClick={() => toggleSection("contacts")}>
                <ContactPhoneIcon />
                אנשי קשר לבירורים
                {expandedSections.contacts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </SectionTitle>
              <Collapse in={expandedSections.contacts}>
                <AnimatePresence>
                  {expandedSections.contacts && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Grid container spacing={3}>
                        {contactsData.map((contact) => (
                          <Grid item xs={12} md={6} key={contact.id}>
                            <ContactCard elevation={2}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: "#b87333",
                                    width: 60,
                                    height: 60,
                                  }}
                                >
                                  <ContactPhoneIcon sx={{ fontSize: 30 }} />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" fontWeight="600" gutterBottom>
                                    {displayValue(contact.name)}
                                  </Typography>
                                  {contact.contactType && (
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                      {displayValue(contact.contactType)}
                                    </Typography>
                                  )}
                                  <Typography variant="h6" fontWeight="600" color="#b87333">
                                    {displayValue(contact.phone)}
                                  </Typography>
                                </Box>
                              </Box>
                            </ContactCard>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Collapse>
            </CardContent>
          </InfoCard>
        )}

        {/* פרטי קשר נוספים */}
        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle>
              <PhoneIcon />
              פרטי קשר נוספים
            </SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <PhoneIcon sx={{ color: "#b87333", fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      טלפון אב
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {displayValue(u.fatherPhone)}
                    </Typography>
                  </Box>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DetailItem>
                  <PhoneIcon sx={{ color: "#d4af37", fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      טלפון אם
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {displayValue(u.motherPhone)}
                    </Typography>
                  </Box>
                </DetailItem>
              </Grid>
            </Grid>
          </CardContent>
        </InfoCard>
      </motion.div>
    </ProfileContainer>
  )
}

export default UserProfile
