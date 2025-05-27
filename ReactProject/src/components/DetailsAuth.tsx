"use client"

import type React from "react"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  Paper,
  Tabs,
  Tab,
  styled,
  useTheme,
  alpha,
} from "@mui/material"
import {
  Person,
  School,
  Home,
  Favorite,
  Phone,
  LocationOn,
  Cake,
  Height,
  Visibility,
  FamilyRestroom,
  ContactPhone,
  Print,
  Share,
  ArrowBack,
  CheckCircle,
  Cancel,
  HealthAndSafety,
  Work,
  Face,
  Interests,
} from "@mui/icons-material"

// מודלים
interface Contact {
  id: number
  name: string
  contactType: string
  phone: string
  maleId?: number
  womenId?: number
}

interface FamilyDetails {
  id: number
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
  parentsStatus: string
  healthStatus: string
  familyRabbi: string
  familyAbout: string
  maleId?: number
  womenId?: number
}

interface CommonUserFields {
  id: number
  firstName: string
  lastName: string
  tz: string
  burnDate: string
  address: string
  age: number
  city: string
  country: string
  class: string
  anOutsider: boolean
  backGround: string
  openness: string
  healthCondition: boolean
  status: string
  height: number
  generalAppearance: string
  facePaint: string
  appearance: string
  club: string
  ageFrom: number
  ageTo: number
  importantTraitsInMe: string
  importantTraitsIAmLookingFor: string
}

interface Male extends CommonUserFields {
  driversLicense: boolean
  smoker: boolean
  beard: string
  hot: string // כובע
  suit: string
  smallYeshiva: string
  bigYeshiva: string
  yeshivaType: string
  kibbutz: string
  occupation: string
  expectationsFromPartner: string
  preferredSeminarStyle: string
  preferredProfessionalPath: string
  headCovering: string
  preferredHeadCovering: string
}

interface Women extends CommonUserFields {
  headCovering: string
  highSchool: string
  seminar: string
  seminarType: string
  studyPath: string
  additionalEducationalInstitution: string
  currentOccupation: string
  interestedInBoy: string
  drivingLicense: string
  smoker: boolean
  preferredBeard: string
  preferredHat: string
  preferredSuit: string
  preferredYeshiva: string
  preferredOccupation: string
  preferredSittingStyle: string
  importantTraitsIMLookingFor: string
  beard: string
  hat: string
  suit: string
  occupation: string
}

// קומפוננטות מעוצבות
const SectionCard = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  overflow: "hidden",
  marginBottom: 24,
  border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  padding: "16px 24px",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: 12,
}))

const SectionContent = styled(Box)(({ theme }) => ({
  padding: 24,
  backgroundColor: "white",
}))

const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
  "&:last-child": {
    borderBottom: "none",
  },
}))

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  gap: 8,
}))

const InfoValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
}))

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.light, 0.8)} 100%)`,
  padding: "40px 24px 24px",
  color: "white",
  borderRadius: "16px 16px 0 0",
  position: "relative",
}))

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}))

const StatusChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 600,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
}))

const TabPanel = (props: { children?: React.ReactNode; value: number; index: number }) => {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const CandidateDetails = () => {
  const { role, id } = useParams()
  const [women, setWomen] = useState<Women | null>(null)
  const [male, setMale] = useState<Male | null>(null)
  const [familyDetails, setFamilyDetails] = useState<FamilyDetails | null>(null)
  const [contactDetails, setContactDetails] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const theme = useTheme()

  // צבעים מותאמים לפרויקט
  const colors = {
    primary: "#1976d2", // כחול
    secondary: "#4fc3f7", // תכלת
    accent: "#ffeb3b", // צהוב
    light: "#f5f5f5", // לבן-אפור בהיר
    success: "#4caf50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196f3",
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true)
      try {
        // קריאה לקבלת פרטי המועמד
        const userResponse = await axios.get(`https://localhost:7012/api/${role}/${id}`)

        if (role === "Male") {
          setMale(userResponse.data)
        }
        if (role === "Women") {
          setWomen(userResponse.data)
        }

        // קריאה לקבלת פרטי משפחה
        const familyResponse = await axios.get<FamilyDetails[]>(`https://localhost:7012/api/FamilyDetails`)
        const familyData = familyResponse.data.filter((item) => {
          return item.maleId === Number(id) || item.womenId === Number(id)
        })

        if (familyData.length > 0) {
          setFamilyDetails(familyData[0])
        }

        // קריאה לקבלת פרטי התקשרות
        const contactResponse = await axios.get(`https://localhost:7012/api/Contact`)
        const contacts = contactResponse.data.filter((item: any) => {
          return item.maleId === Number(id) || item.womenId === Number(id)
        })
        setContactDetails(contacts)
      } catch (error) {
        console.error("Error fetching user details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [role, id])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "רווק/ה":
        return colors.success
      case "גרוש/ה":
        return colors.info
      case "אלמן/ה":
        return colors.warning
      default:
        return colors.primary
    }
  }

  const getAgeRangeText = (from: number, to: number) => {
    return `${from} - ${to}`
  }

  const getBooleanIcon = (value: boolean | undefined) => {
    if (value === undefined) return null
    return value ? (
      <CheckCircle sx={{ color: colors.success, fontSize: 20 }} />
    ) : (
      <Cancel sx={{ color: colors.error, fontSize: 20 }} />
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} sx={{ color: colors.primary }} />
      </Box>
    )
  }

  const candidate = male || women
  if (!candidate) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="h5" color="error">
          לא נמצאו פרטים עבור המועמד/ת
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        p: { xs: 2, md: 4 },
        direction: "rtl",
        backgroundColor: alpha(colors.light, 0.5),
        minHeight: "100vh",
      }}
    >
      {/* כפתור חזרה */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          color="primary"
          onClick={() => window.history.back()}
          sx={{
            borderRadius: 20,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          חזרה לרשימה
        </Button>
      </Box>

      {/* כותרת ראשית ופרטים בסיסיים */}
      <SectionCard elevation={3}>
        <ProfileHeader>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {candidate.firstName} {candidate.lastName}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <StatusChip
                  label={candidate.status}
                  sx={{ backgroundColor: getStatusColor(candidate.status), color: "white" }}
                />
                <Chip
                  icon={<Cake sx={{ color: colors.primary }} />}
                  label={`גיל ${candidate.age}`}
                  sx={{ backgroundColor: "white", color: colors.primary }}
                />
                <Chip
                  icon={<LocationOn sx={{ color: colors.primary }} />}
                  label={candidate.city}
                  sx={{ backgroundColor: "white", color: colors.primary }}
                />
              </Box>
            </Box>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                backgroundColor: colors.secondary,
              }}
            >
              {candidate.firstName.charAt(0)}
              {candidate.lastName.charAt(0)}
            </Avatar>
          </Box>

          {/* כפתורי פעולה */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <ActionButton
              variant="contained"
              startIcon={<Print />}
              sx={{ backgroundColor: "white", color: colors.primary }}
            >
              הדפסת פרופיל
            </ActionButton>
            <ActionButton
              variant="contained"
              startIcon={<Share />}
              sx={{ backgroundColor: "white", color: colors.primary }}
            >
              שיתוף פרופיל
            </ActionButton>
            <ActionButton
              variant="contained"
              startIcon={<ContactPhone />}
              sx={{ backgroundColor: colors.accent, color: "rgba(0,0,0,0.7)" }}
            >
              יצירת קשר
            </ActionButton>
          </Box>
        </ProfileHeader>

        {/* טאבים לניווט בין הקטגוריות */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", backgroundColor: "white" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                fontSize: "1rem",
                py: 2,
              },
            }}
          >
            <Tab label="פרטים אישיים" icon={<Person />} iconPosition="start" />
            <Tab label="פרטי משפחה" icon={<FamilyRestroom />} iconPosition="start" />
            <Tab label="פרטי התקשרות" icon={<ContactPhone />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* תוכן הטאבים */}
        <Box sx={{ backgroundColor: "white", p: 0 }}>
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* פרטים אישיים בסיסיים */}
              <Grid item xs={12} md={6}>
                <SectionCard>
                  <SectionHeader>
                    <Person />
                    <Typography variant="h6">פרטים אישיים בסיסיים</Typography>
                  </SectionHeader>
                  <SectionContent>
                    <InfoRow>
                      <InfoLabel>
                        <Person fontSize="small" /> שם מלא
                      </InfoLabel>
                      <InfoValue>
                        {candidate.firstName} {candidate.lastName}
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>תעודת זהות</InfoLabel>
                      <InfoValue>{candidate.tz}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <Cake fontSize="small" /> תאריך לידה
                      </InfoLabel>
                      <InfoValue>{candidate.burnDate}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <Home fontSize="small" /> כתובת
                      </InfoLabel>
                      <InfoValue>{candidate.address}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <LocationOn fontSize="small" /> עיר
                      </InfoLabel>
                      <InfoValue>{candidate.city}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>מדינה</InfoLabel>
                      <InfoValue>{candidate.country}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>חוצניק</InfoLabel>
                      <InfoValue>{getBooleanIcon(candidate.anOutsider)}</InfoValue>
                    </InfoRow>
                  </SectionContent>
                </SectionCard>
              </Grid>

              {/* רקע ומידע בסיסי */}
              <Grid item xs={12} md={6}>
                <SectionCard>
                  <SectionHeader>
                    <School />
                    <Typography variant="h6">רקע ומידע בסיסי</Typography>
                  </SectionHeader>
                  <SectionContent>
                    <InfoRow>
                      <InfoLabel>עדה</InfoLabel>
                      <InfoValue>{candidate.class}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>רקע</InfoLabel>
                      <InfoValue>{candidate.backGround}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>פתיחות</InfoLabel>
                      <InfoValue>{candidate.openness}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <HealthAndSafety fontSize="small" /> מצב בריאותי
                      </InfoLabel>
                      <InfoValue>{getBooleanIcon(candidate.healthCondition)}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>סטטוס</InfoLabel>
                      <InfoValue>
                        <Chip
                          label={candidate.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(candidate.status),
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      </InfoValue>
                    </InfoRow>
                  </SectionContent>
                </SectionCard>
              </Grid>

              {/* מראה חיצוני */}
              <Grid item xs={12} md={6}>
                <SectionCard>
                  <SectionHeader>
                    <Visibility />
                    <Typography variant="h6">מראה חיצוני</Typography>
                  </SectionHeader>
                  <SectionContent>
                    <InfoRow>
                      <InfoLabel>
                        <Height fontSize="small" /> גובה
                      </InfoLabel>
                      <InfoValue>{candidate.height} ס"מ</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>מראה כללי</InfoLabel>
                      <InfoValue>{candidate.generalAppearance}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <Face fontSize="small" /> צבע פנים
                      </InfoLabel>
                      <InfoValue>{candidate.facePaint}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>מראה</InfoLabel>
                      <InfoValue>{candidate.appearance}</InfoValue>
                    </InfoRow>
                  </SectionContent>
                </SectionCard>
              </Grid>

              {/* ציפיות ודרישות */}
              <Grid item xs={12} md={6}>
                <SectionCard>
                  <SectionHeader>
                    <Favorite />
                    <Typography variant="h6">ציפיות ודרישות</Typography>
                  </SectionHeader>
                  <SectionContent>
                    <InfoRow>
                      <InfoLabel>טווח גילאים מבוקש</InfoLabel>
                      <InfoValue>{getAgeRangeText(candidate.ageFrom, candidate.ageTo)}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <Interests fontSize="small" /> תכונות חשובות בי
                      </InfoLabel>
                      <InfoValue>{candidate.importantTraitsInMe}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>
                        <Interests fontSize="small" /> תכונות שאני מחפש/ת
                      </InfoLabel>
                      <InfoValue>
                        {male ? male.importantTraitsIAmLookingFor : women?.importantTraitsIMLookingFor}
                      </InfoValue>
                    </InfoRow>
                    <InfoRow>
                      <InfoLabel>חוג</InfoLabel>
                      <InfoValue>{candidate.club}</InfoValue>
                    </InfoRow>
                  </SectionContent>
                </SectionCard>
              </Grid>

              {/* פרטים ייחודיים לפי מגדר */}
              {male && (
                <>
                  <Grid item xs={12} md={6}>
                    <SectionCard>
                      <SectionHeader>
                        <School />
                        <Typography variant="h6">רקע ישיבתי</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <InfoRow>
                          <InfoLabel>ישיבה קטנה</InfoLabel>
                          <InfoValue>{male.smallYeshiva}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>ישיבה גדולה</InfoLabel>
                          <InfoValue>{male.bigYeshiva}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>סוג ישיבה</InfoLabel>
                          <InfoValue>{male.yeshivaType}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>קיבוץ</InfoLabel>
                          <InfoValue>{male.kibbutz}</InfoValue>
                        </InfoRow>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SectionCard>
                      <SectionHeader>
                        <Person />
                        <Typography variant="h6">מאפיינים אישיים</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <InfoRow>
                          <InfoLabel>רישיון נהיגה</InfoLabel>
                          <InfoValue>{getBooleanIcon(male.driversLicense)}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>מעשן</InfoLabel>
                          <InfoValue>{getBooleanIcon(male.smoker)}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>זקן</InfoLabel>
                          <InfoValue>{male.beard}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>כובע</InfoLabel>
                          <InfoValue>{male.hot}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>חליפה</InfoLabel>
                          <InfoValue>{male.suit}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>כיסוי ראש</InfoLabel>
                          <InfoValue>{male.headCovering}</InfoValue>
                        </InfoRow>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                  <Grid item xs={12}>
                    <SectionCard>
                      <SectionHeader>
                        <Favorite />
                        <Typography variant="h6">ציפיות מבת הזוג</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <InfoRow>
                              <InfoLabel>ציפיות מבת הזוג</InfoLabel>
                              <InfoValue>{male.expectationsFromPartner}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                              <InfoLabel>סגנון סמינר מועדף</InfoLabel>
                              <InfoValue>{male.preferredSeminarStyle}</InfoValue>
                            </InfoRow>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <InfoRow>
                              <InfoLabel>מסלול מקצועי מועדף</InfoLabel>
                              <InfoValue>{male.preferredProfessionalPath}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                              <InfoLabel>כיסוי ראש מועדף</InfoLabel>
                              <InfoValue>{male.preferredHeadCovering}</InfoValue>
                            </InfoRow>
                          </Grid>
                        </Grid>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                </>
              )}

              {women && (
                <>
                  <Grid item xs={12} md={6}>
                    <SectionCard>
                      <SectionHeader>
                        <School />
                        <Typography variant="h6">רקע השכלתי</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <InfoRow>
                          <InfoLabel>תיכון</InfoLabel>
                          <InfoValue>{women.highSchool}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>סמינר</InfoLabel>
                          <InfoValue>{women.seminar}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>סוג סמינר</InfoLabel>
                          <InfoValue>{women.seminarType}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>מסלול לימודים</InfoLabel>
                          <InfoValue>{women.studyPath}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>מוסד חינוכי נוסף</InfoLabel>
                          <InfoValue>{women.additionalEducationalInstitution}</InfoValue>
                        </InfoRow>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SectionCard>
                      <SectionHeader>
                        <Person />
                        <Typography variant="h6">מאפיינים אישיים</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <InfoRow>
                          <InfoLabel>כיסוי ראש</InfoLabel>
                          <InfoValue>{women.headCovering}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>רישיון נהיגה</InfoLabel>
                          <InfoValue>{women.drivingLicense}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>מעשנת</InfoLabel>
                          <InfoValue>{getBooleanIcon(women.smoker)}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>
                            <Work fontSize="small" /> עיסוק נוכחי
                          </InfoLabel>
                          <InfoValue>{women.currentOccupation}</InfoValue>
                        </InfoRow>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                  <Grid item xs={12}>
                    <SectionCard>
                      <SectionHeader>
                        <Favorite />
                        <Typography variant="h6">ציפיות מבן הזוג</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <InfoRow>
                              <InfoLabel>סוג בחור מועדף</InfoLabel>
                              <InfoValue>{women.interestedInBoy}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                              <InfoLabel>העדפה לזקן</InfoLabel>
                              <InfoValue>{women.preferredBeard}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                              <InfoLabel>העדפה לכובע</InfoLabel>
                              <InfoValue>{women.preferredHat}</InfoValue>
                            </InfoRow>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <InfoRow>
                              <InfoLabel>העדפה לחליפה</InfoLabel>
                              <InfoValue>{women.preferredSuit}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                              <InfoLabel>העדפת סוג ישיבה</InfoLabel>
                              <InfoValue>{women.preferredYeshiva}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                              <InfoLabel>עיסוק מועדף לבן הזוג</InfoLabel>
                              <InfoValue>{women.preferredOccupation}</InfoValue>
                            </InfoRow>
                          </Grid>
                        </Grid>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                </>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {familyDetails ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SectionCard>
                    <SectionHeader>
                      <Person />
                      <Typography variant="h6">פרטי האב</Typography>
                    </SectionHeader>
                    <SectionContent>
                      <InfoRow>
                        <InfoLabel>שם האב</InfoLabel>
                        <InfoValue>{familyDetails.fatherName}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>מוצא האב</InfoLabel>
                        <InfoValue>{familyDetails.fatherOrigin}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>ישיבת האב</InfoLabel>
                        <InfoValue>{familyDetails.fatherYeshiva}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>השתייכות האב</InfoLabel>
                        <InfoValue>{familyDetails.fatherAffiliation}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>עיסוק האב</InfoLabel>
                        <InfoValue>{familyDetails.fatherOccupation}</InfoValue>
                      </InfoRow>
                    </SectionContent>
                  </SectionCard>
                </Grid>

                <Grid item xs={12} md={6}>
                  <SectionCard>
                    <SectionHeader>
                      <Person />
                      <Typography variant="h6">פרטי האם</Typography>
                    </SectionHeader>
                    <SectionContent>
                      <InfoRow>
                        <InfoLabel>שם האם</InfoLabel>
                        <InfoValue>{familyDetails.motherName}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>מוצא האם</InfoLabel>
                        <InfoValue>{familyDetails.motherOrigin}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>בוגרת סמינר</InfoLabel>
                        <InfoValue>{familyDetails.motherGraduateSeminar}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>שם קודם</InfoLabel>
                        <InfoValue>{familyDetails.motherPreviousName}</InfoValue>
                      </InfoRow>
                      <InfoRow>
                        <InfoLabel>עיסוק האם</InfoLabel>
                        <InfoValue>{familyDetails.motherOccupation}</InfoValue>
                      </InfoRow>
                    </SectionContent>
                  </SectionCard>
                </Grid>

                <Grid item xs={12}>
                  <SectionCard>
                    <SectionHeader>
                      <FamilyRestroom />
                      <Typography variant="h6">פרטי משפחה נוספים</Typography>
                    </SectionHeader>
                    <SectionContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <InfoRow>
                            <InfoLabel>מצב הורים</InfoLabel>
                            <InfoValue>{familyDetails.parentsStatus}</InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>מצב בריאותי</InfoLabel>
                            <InfoValue>{familyDetails.healthStatus}</InfoValue>
                          </InfoRow>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InfoRow>
                            <InfoLabel>רב משפחתי</InfoLabel>
                            <InfoValue>{familyDetails.familyRabbi}</InfoValue>
                          </InfoRow>
                          <InfoRow>
                            <InfoLabel>מידע נוסף על המשפחה</InfoLabel>
                            <InfoValue>{familyDetails.familyAbout}</InfoValue>
                          </InfoRow>
                        </Grid>
                      </Grid>
                    </SectionContent>
                  </SectionCard>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  לא נמצאו פרטי משפחה
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2, borderRadius: 20 }}>
                  הוספת פרטי משפחה
                </Button>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {contactDetails.length > 0 ? (
              <Grid container spacing={3}>
                {contactDetails.map((contact, index) => (
                  <Grid item xs={12} md={6} key={contact.id || index}>
                    <SectionCard>
                      <SectionHeader>
                        <ContactPhone />
                        <Typography variant="h6">איש קשר {index + 1}</Typography>
                      </SectionHeader>
                      <SectionContent>
                        <InfoRow>
                          <InfoLabel>
                            <Person fontSize="small" /> שם איש קשר
                          </InfoLabel>
                          <InfoValue>{contact.name}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>סוג הקשר</InfoLabel>
                          <InfoValue>{contact.contactType}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>
                            <Phone fontSize="small" /> טלפון
                          </InfoLabel>
                          <InfoValue>
                            <Button
                              variant="text"
                              startIcon={<Phone />}
                              href={`tel:${contact.phone}`}
                              sx={{ color: colors.primary }}
                            >
                              {contact.phone}
                            </Button>
                          </InfoValue>
                        </InfoRow>
                      </SectionContent>
                    </SectionCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  לא נמצאו פרטי התקשרות
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2, borderRadius: 20 }}>
                  הוספת פרטי התקשרות
                </Button>
              </Box>
            )}
          </TabPanel>
        </Box>
      </SectionCard>
    </Box>
  )
}

export default CandidateDetails
