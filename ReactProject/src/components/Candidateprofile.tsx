"use client"

import { useState, useEffect, useContext } from "react"
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
import { styled, keyframes } from "@mui/material/styles"
import axios from "axios"
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
  photoUrl?: string
  moreInformation?: string
  importantTraitsInMe?: string
  importantTraitsIAmLookingFor?: string
  // שדות ייחודיים לבחורים
  smallYeshiva?: string
  bigYeshiva?: string
  yeshivaType?: string
  kibbutz?: string
  occupation?: string
  beard?: string
  hat?: string
  headCovering?: string
  // שדות ייחודיים לבחורות
  highSchool?: string
  seminar?: string
  seminarType?: string
  studyPath?: string
  currentOccupation?: string
  drivingLicense?: string
  facePaint?: string
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
  contactType: string
  phone: string
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [familyData, setFamilyData] = useState<FamilyData | null>(null)
  const [contactsData, setContactsData] = useState<ContactData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const { user, token } = useContext(userContext)

  // State לניהול הרחבת כרטיסים
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    family: false,
    contacts: false,
    traits: false,
  })

  // טעינת נתוני המשתמש
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        setError("")

        console.log("🔍 מתחיל טעינת פרופיל משתמש...")
        console.log("👤 נתוני משתמש מהקונטקסט:", user)
        console.log("🔑 טוקן:", token ? "קיים" : "לא קיים")

        // 🔧 בדיקה משופרת של נתוני המשתמש
        if (!user) {
          console.error("❌ לא נמצא משתמש בקונטקסט")
          setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
          return
        }

        if (!token) {
          console.error("❌ לא נמצא טוקן")
          setError("לא נמצא טוקן אימות. אנא התחבר מחדש.")
          return
        }

        if (!user.id) {
          console.error("❌ לא נמצא ID משתמש")
          setError("לא נמצא מזהה משתמש")
          return
        }

        if (!user.role) {
          console.error("❌ לא נמצא תפקיד משתמש")
          setError("לא נמצא תפקיד משתמש")
          return
        }

        const { id, role } = user
        console.log(`📋 פרטי משתמש: ID=${id}, Role=${role}`)

        // 🔧 קביעת כתובת ה-API לפי המגדר
        const apiUrl = role === "Male" ? `${API_BASE_URL}/Male/${id}` : `${API_BASE_URL}/Women/${id}`

        console.log("🌐 כתובת API:", apiUrl)

        // 🔧 הגדרת headers משופרת
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }

        console.log("📡 שולח בקשה לטעינת נתוני משתמש...")

        // טעינת נתוני המשתמש
        const userResponse = await axios.get(apiUrl, { headers })

        console.log("✅ התקבלו נתוני משתמש:", userResponse.data)
        setUserData(userResponse.data)

        // טעינת נתוני משפחה
        try {
          console.log("📡 שולח בקשה לטעינת נתוני משפחה...")
          const familyResponse = await axios.get(`${API_BASE_URL}/FamilyDetails`, { headers })

          console.log("📋 כל נתוני המשפחות:", familyResponse.data)

          const familyDetails = familyResponse.data.find(
            (detail: any) => (role === "Male" && detail.maleId === id) || (role === "Women" && detail.womenId === id),
          )

          if (familyDetails) {
            console.log("✅ נמצאו נתוני משפחה:", familyDetails)
            setFamilyData(familyDetails)
          } else {
            console.log("ℹ️ לא נמצאו נתוני משפחה למשתמש זה")
          }
        } catch (familyError: any) {
          console.log("⚠️ שגיאה בטעינת נתוני משפחה:", familyError.message)
        }

        // טעינת אנשי קשר
        try {
          console.log("📡 שולח בקשה לטעינת אנשי קשר...")
          const contactsResponse = await axios.get(`${API_BASE_URL}/Contact`, { headers })

          console.log("📋 כל אנשי הקשר:", contactsResponse.data)

          const userContacts = contactsResponse.data.filter(
            (contact: any) =>
              (role === "Male" && contact.maleId === id) || (role === "Women" && contact.womenId === id),
          )

          console.log("✅ אנשי קשר של המשתמש:", userContacts)
          setContactsData(userContacts)
        } catch (contactError: any) {
          console.log("⚠️ שגיאה בטעינת אנשי קשר:", contactError.message)
        }

        console.log("🎉 טעינת הפרופיל הושלמה בהצלחה!")
      } catch (error: any) {
        console.error("❌ שגיאה בטעינת פרופיל:", error)

        // 🔧 הודעות שגיאה מפורטות יותר
        if (error.response) {
          const status = error.response.status
          const message = error.response.data?.message || error.response.statusText

          console.error(`📊 סטטוס שגיאה: ${status}`)
          console.error(`📝 הודעת שגיאה: ${message}`)

          if (status === 401) {
            setError("אין הרשאה לצפות בפרופיל. אנא התחבר מחדש.")
          } else if (status === 404) {
            setError("הפרופיל לא נמצא במערכת.")
          } else if (status === 500) {
            setError("שגיאה בשרת. אנא נסה שוב מאוחר יותר.")
          } else {
            setError(`שגיאה בטעינת הפרופיל: ${message}`)
          }
        } else if (error.request) {
          console.error("📡 לא התקבלה תגובה מהשרת")
          setError("לא ניתן להתחבר לשרת. בדוק את החיבור לאינטרנט.")
        } else {
          console.error("⚙️ שגיאה בהגדרת הבקשה:", error.message)
          setError("שגיאה טכנית בטעינת הפרופיל.")
        }
      } finally {
        setLoading(false)
      }
    }

    // 🔧 הוספת עיכוב קצר לוודא שהקונטקסט נטען
    const timer = setTimeout(() => {
      loadUserProfile()
    }, 100)

    return () => clearTimeout(timer)
  }, [user, token])

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
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
            💡 נסה לרענן את הדף או להתחבר מחדש
          </Typography>
        </Alert>
      </ProfileContainer>
    )
  }

  return (
    <ProfileContainer maxWidth="lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* כותרת הפרופיל */}
        <ProfileCard elevation={0}>
          <ProfileHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4, position: "relative", zIndex: 2 }}>
              <ProfileAvatar
                src={userData.photoUrl || "/placeholder.svg?height=180&width=180"}
                alt={`${userData.firstName} ${userData.lastName}`}
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
                  {userData.firstName} {userData.lastName}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                  <StyledChip icon={<CakeIcon />} label={`גיל ${userData.age}`} />
                  <StyledChip icon={<LocationOnIcon />} label={`${userData.city}, ${userData.country}`} />
                  <StyledChip icon={<HeightIcon />} label={`${userData.height} ס"מ`} />
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: "500",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  {userData.status} • {userData.backGround} • {userData.openness}
                </Typography>
              </Box>

              <IconButton
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
                              {userData.email}
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
                              {userData.phone}
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
                              {userData.address}, {userData.city}, {userData.country}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                          עדה וזרם
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          <Chip label={userData.class} size="medium" variant="outlined" />
                          <Chip label={userData.backGround} size="medium" variant="outlined" />
                          <Chip label={userData.openness} size="medium" variant="outlined" />
                        </Box>
                      </Grid>

                      {/* שדות ייחודיים לבחורים */}
                      {userData.smallYeshiva && (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                ישיבה קטנה
                              </Typography>
                              <Typography variant="h6">{userData.smallYeshiva}</Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                      )}

                      {userData.bigYeshiva && (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                ישיבה גדולה
                              </Typography>
                              <Typography variant="h6">{userData.bigYeshiva}</Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                      )}

                      {userData.kibbutz && (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                קיבוץ
                              </Typography>
                              <Typography variant="h6">{userData.kibbutz}</Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                      )}

                      {/* שדות ייחודיים לבחורות */}
                      {userData.highSchool && (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                תיכון
                              </Typography>
                              <Typography variant="h6">{userData.highSchool}</Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                      )}

                      {userData.seminar && (
                        <Grid item xs={12} md={6}>
                          <DetailItem>
                            <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                סמינר
                              </Typography>
                              <Typography variant="h6">{userData.seminar}</Typography>
                            </Box>
                          </DetailItem>
                        </Grid>
                      )}

                      {userData.moreInformation && (
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
                            {userData.moreInformation}
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

        {/* תכונות ועדיפויות */}
        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle onClick={() => toggleSection("traits")}>
              <FavoriteIcon />
              תכונות ועדיפויות
              {expandedSections.traits ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </SectionTitle>

            <Collapse in={expandedSections.traits}>
              <AnimatePresence>
                {expandedSections.traits && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {userData.importantTraitsInMe && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          תכונות חשובות בי
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            p: 3,
                            backgroundColor: "rgba(184, 115, 51, 0.05)",
                            borderRadius: 2,
                            borderLeft: "4px solid #b87333",
                            fontSize: "1.1rem",
                            lineHeight: 1.8,
                          }}
                        >
                          {userData.importantTraitsInMe}
                        </Typography>
                      </Box>
                    )}

                    {userData.importantTraitsIAmLookingFor && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          תכונות שאני מחפש/ת
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            p: 3,
                            backgroundColor: "rgba(212, 175, 55, 0.05)",
                            borderRadius: 2,
                            borderLeft: "4px solid #d4af37",
                            fontSize: "1.1rem",
                            lineHeight: 1.8,
                          }}
                        >
                          {userData.importantTraitsIAmLookingFor}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      העדפות שידוך
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Chip label={userData.pairingType} size="medium" color="primary" />
                      <Chip label={userData.status} size="medium" />
                    </Box>
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
                                {familyData.fatherName}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {familyData.fatherOrigin} • {familyData.fatherOccupation}
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
                                {familyData.motherName}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {familyData.motherOrigin} • {familyData.motherOccupation}
                              </Typography>
                            </Box>
                          </DetailItem>
                        </Grid>

                        {familyData.familyRabbi && (
                          <Grid item xs={12}>
                            <DetailItem>
                              <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                              <Box>
                                <Typography variant="h6" color="text.secondary">
                                  רב המשפחה
                                </Typography>
                                <Typography variant="h5">{familyData.familyRabbi}</Typography>
                              </Box>
                            </DetailItem>
                          </Grid>
                        )}

                        {familyData.familyAbout && (
                          <Grid item xs={12}>
                            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
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
                                fontSize: "1.1rem",
                                lineHeight: 1.8,
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
                                    {contact.name}
                                  </Typography>
                                  <Typography variant="body1" color="text.secondary" gutterBottom>
                                    {contact.contactType}
                                  </Typography>
                                  <Typography variant="h6" fontWeight="600" color="#b87333">
                                    {contact.phone}
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
              <InfoIcon />
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
                      {userData.fatherPhone}
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
                      {userData.motherPhone}
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
