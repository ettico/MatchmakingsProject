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
  // Divider,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { motion } from "framer-motion"
import { userContext } from "./UserContext"

import PersonIcon from "@mui/icons-material/Person"
// import FamilyRestroomIcon from "@mui/material-icons/FamilyRestroom"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CakeIcon from "@mui/icons-material/Cake"
import HeightIcon from "@mui/icons-material/Height"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import SchoolIcon from "@mui/icons-material/School"
import WorkIcon from "@mui/icons-material/Work"
// import FavoriteIcon from "@mui/icons-material/Favorite"
import InfoIcon from "@mui/icons-material/Info"
import EditIcon from "@mui/icons-material/Edit"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(184, 115, 51, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(184, 115, 51, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(184, 115, 51, 0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(184, 115, 51, 0.3); }
  50% { box-shadow: 0 0 40px rgba(184, 115, 51, 0.6); }
`

const API_BASE_URL = "https://matchmakingsprojectserver.onrender.com/api"

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
  "& .MuiAvatar-img": { objectFit: "cover" },
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
  "&:hover": { transform: "translateX(8px)" },
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

interface UserProfileProps {
  candidateData?: any
  onClose?: () => void
}

const NA = "לא צוין"

function formatValue(val: any): string {
  if (val === null || val === undefined || val === "" || val === "null" || val === "undefined") return NA
  if (typeof val === "boolean") return val ? "כן" : "לא"
  if (typeof val === "string" && val.toLowerCase() === "true") return "כן"
  if (typeof val === "string" && val.toLowerCase() === "false") return "לא"
  return String(val).trim() || NA
}

const UserProfile = ({ candidateData, onClose }: UserProfileProps) => {
  const [familyData, setFamilyData] = useState<any>(null)
  const [contactsData, setContactsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const ctx = useContext(userContext) as any
  const token = ctx?.token

  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    family: false,
    contacts: false,
    traits: false,
    education: false,
    preferences: false,
  })

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        setError("")

        if (!candidateData) {
          setError("לא נמצאו נתוני מועמד")
          return
        }

        if (token && candidateData.id) {
          try {
            const familyRes = await fetch(`${API_BASE_URL}/FamilyDetails`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (familyRes.ok) {
              const allFamily = await familyRes.json()
              const matched = allFamily.find(
                (f: any) =>
                  (candidateData.role === "Male" && f.maleId === candidateData.id) ||
                  (candidateData.role === "Women" && f.womenId === candidateData.id),
              )
              if (matched) setFamilyData(matched)
            }
          } catch (e) {
            console.log("משפחה לא טוענת")
          }

          try {
            const contactRes = await fetch(`${API_BASE_URL}/Contact`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (contactRes.ok) {
              const allContacts = await contactRes.json()
              setContactsData(
                allContacts.filter(
                  (c: any) =>
                    (candidateData.role === "Male" && c.maleId === candidateData.id) ||
                    (candidateData.role === "Women" && c.womenId === candidateData.id),
                ),
              )
            }
          } catch (e) {
            console.log("אנשי קשר לא טוענים")
          }
        }
      } catch (err: any) {
        console.error("שגיאה בטעינת פרופיל:", err)
        setError("שגיאה בטעינת הפרופיל")
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [token, candidateData])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
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
          <CircularProgress size={60} sx={{ color: "#b87333", animation: `${pulse} 2s infinite` }} />
          <Typography variant="h5" sx={{ mt: 3, color: "#2c1810", fontWeight: "600" }}>
            טוען פרופיל...
          </Typography>
        </Box>
      </ProfileContainer>
    )
  }

  if (error || !candidateData) {
    return (
      <ProfileContainer>
        <Alert severity="error" sx={{ mt: 4, borderRadius: 3, fontSize: "1.1rem" }}>
          <Typography variant="h6" gutterBottom>
            שגיאה בטעינת הפרופיל
          </Typography>
          <Typography variant="body1">{error || "לא נמצאו נתוני משתמש"}</Typography>
        </Alert>
      </ProfileContainer>
    )
  }

  const u = candidateData
  const isMale = u.role === "Male"

  return (
    <ProfileContainer maxWidth="lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <ProfileCard elevation={0}>
          <ProfileHeader>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                position: "relative",
                zIndex: 2,
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <ProfileAvatar src={u.photoUrl || "/placeholder.svg"} alt={`${u.firstName} ${u.lastName}`}>
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
                  <StyledChip icon={<CakeIcon />} label={`גיל ${u.age || NA}`} />
                  <StyledChip icon={<LocationOnIcon />} label={`${u.city || NA}, ${u.country || NA}`} />
                  <StyledChip icon={<HeightIcon />} label={`${u.height || NA} ס"מ`} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: "500",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  {u.status || NA} • {u.backGround || NA} • {u.openness || NA}
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
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)", transform: "scale(1.1)" },
                  }}
                >
                  <EditIcon sx={{ fontSize: 30 }} />
                </IconButton>
              )}
            </Box>
          </ProfileHeader>
        </ProfileCard>

        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle onClick={() => toggleSection("personal")}>
              <PersonIcon />
              פרטים אישיים {expandedSections.personal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </SectionTitle>
            <Collapse in={expandedSections.personal}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DetailItem>
                    <EmailIcon sx={{ color: "#b87333", fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        אימייל
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {u.email || NA}
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
                        {u.phone || NA}
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
                        {u.tz || NA}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailItem>
                    <CakeIcon sx={{ color: "#b87333", fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        תאריך לידה
                      </Typography>
                      <Typography variant="h6" fontWeight="600">
                        {u.burnDate || NA}
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
                        {u.address || NA}, {u.city || NA}, {u.country || NA}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    עדה וזרם
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip label={u.class || NA} size="medium" variant="outlined" />
                    <Chip label={u.backGround || NA} size="medium" variant="outlined" />
                    <Chip label={u.openness || NA} size="medium" variant="outlined" />
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
                        {u.height || NA}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailItem>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ flexBasis: "100%" }}>
                      פנוי לשידוך
                    </Typography>
                    <Chip
                      label={formatValue(u.statusVacant)}
                      color={u.statusVacant ? "success" : "error"}
                      variant="outlined"
                    />
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
                        {u.generalAppearance || NA}
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
                        {u.appearance || NA}
                      </Typography>
                    </Box>
                  </DetailItem>
                </Grid>
                {isMale && (
                  <>
                    <Grid item xs={12} md={6}>
                      <DetailItem>
                        <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            זקן
                          </Typography>
                          <Typography variant="h6" fontWeight="600">
                            {u.beard || NA}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DetailItem>
                        <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            כיפה
                          </Typography>
                          <Typography variant="h6" fontWeight="600">
                            {u.headCovering || NA}
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
                            {u.suit || NA}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                  </>
                )}
                {!isMale && (
                  <>
                    <Grid item xs={12} md={6}>
                      <DetailItem>
                        <InfoIcon sx={{ color: "#b87333", fontSize: 28 }} />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            כיסוי ראש
                          </Typography>
                          <Typography variant="h6" fontWeight="600">
                            {u.headCovering || NA}
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
                            {u.facePaint || NA}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                  </>
                )}
              </Grid>
            </Collapse>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardContent sx={{ p: 4 }}>
            <SectionTitle onClick={() => toggleSection("education")}>
              <SchoolIcon />
              השכלה ותעסוקה {expandedSections.education ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </SectionTitle>
            <Collapse in={expandedSections.education}>
              <Grid container spacing={3}>
                {isMale ? (
                  <>
                    {u.bigYeshiva && (
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              ישיבה גדולה
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {u.bigYeshiva}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                    )}
                    {u.smallYeshiva && (
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              ישיבה קטנה
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {u.smallYeshiva}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                    )}
                    {u.occupation && (
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              עיסוק
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {u.occupation}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    {u.seminar && (
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <SchoolIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              סמינר
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {u.seminar}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                    )}
                    {u.currentOccupation && (
                      <Grid item xs={12} md={6}>
                        <DetailItem>
                          <WorkIcon sx={{ color: "#b87333", fontSize: 28 }} />
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                              עיסוק נוכחי
                            </Typography>
                            <Typography variant="h6" fontWeight="600">
                              {u.currentOccupation}
                            </Typography>
                          </Box>
                        </DetailItem>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Collapse>
          </CardContent>
        </InfoCard>

        {familyData && (
          <InfoCard>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle onClick={() => toggleSection("family")}>
                {/* <FamilyRestroomIcon /> */}
                פרטי משפחה {expandedSections.family ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </SectionTitle>
              <Collapse in={expandedSections.family}>
                <Grid container spacing={3}>
                  {familyData.fatherName && (
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
                          <Typography variant="body2" color="text.secondary">
                            {familyData.fatherOrigin || ""} • {familyData.fatherOccupation || ""}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                  )}
                  {familyData.motherName && (
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
                          <Typography variant="body2" color="text.secondary">
                            {familyData.motherOrigin || ""} • {familyData.motherOccupation || ""}
                          </Typography>
                        </Box>
                      </DetailItem>
                    </Grid>
                  )}
                </Grid>
              </Collapse>
            </CardContent>
          </InfoCard>
        )}

        {contactsData.length > 0 && (
          <InfoCard>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle onClick={() => toggleSection("contacts")}>
                <ContactPhoneIcon />
                אנשי קשר לבירורים {expandedSections.contacts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </SectionTitle>
              <Collapse in={expandedSections.contacts}>
                <Grid container spacing={3}>
                  {contactsData.map((contact: any) => (
                    <Grid item xs={12} md={6} key={contact.id}>
                      <ContactCard elevation={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Avatar sx={{ bgcolor: "#b87333", width: 60, height: 60 }}>
                            <ContactPhoneIcon sx={{ fontSize: 30 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {contact.name || NA}
                            </Typography>
                            <Typography variant="h6" fontWeight="600" color="#b87333">
                              {contact.phone || NA}
                            </Typography>
                          </Box>
                        </Box>
                      </ContactCard>
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </CardContent>
          </InfoCard>
        )}
      </motion.div>
    </ProfileContainer>
  )
}

export default UserProfile
