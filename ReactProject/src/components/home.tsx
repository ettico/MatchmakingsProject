"use client"

import {
  Container,
  Button,
  Box,
  Typography,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Grid,
  Link,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PeopleIcon from "@mui/icons-material/People"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import CelebrationIcon from "@mui/icons-material/Celebration"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import AssignmentIcon from "@mui/icons-material/Assignment"
import SearchIcon from "@mui/icons-material/Search"
import FavoriteIcon from "@mui/icons-material/Favorite"
import NumberCounter from "./numberCounter"

// צבעים - שחור ונחושת
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

// נתוני זוגות מאושרים
const happyCouples = [
  {
    id: 1,
    maleFirstName: "יוסף",
    maleLastName: "כהן",
    femaleFirstName: "שרה",
    femaleLastName: "לוי",
    maleYeshiva: "פוניבז'",
    femaleSeminar: "וולף",
    maleType: "ליטאי",
    femaleType: "ליטאי",
    engagementDate: 'י"ב באלול תשפ"ג',
  },
  {
    id: 2,
    maleFirstName: "משה",
    maleLastName: "גולדברג",
    femaleFirstName: "רבקה",
    femaleLastName: "פרידמן",
    maleYeshiva: "חברון",
    femaleSeminar: "החדש",
    maleType: "ליטאי",
    femaleType: "ליטאי",
    engagementDate: "כ' בתמוז תשפ\"ג",
  },
  {
    id: 3,
    maleFirstName: "דוד",
    maleLastName: "ברקוביץ",
    femaleFirstName: "לאה",
    femaleLastName: "רוזנברג",
    maleYeshiva: "אור ישראל",
    femaleSeminar: "הישן",
    maleType: "ליטאי",
    femaleType: "ליטאי",
    engagementDate: "ג' בשבט תשפ\"ג",
  },
  {
    id: 4,
    maleFirstName: "אברהם",
    maleLastName: "שטיינמן",
    femaleFirstName: "חנה",
    femaleLastName: "הורביץ",
    maleYeshiva: "מיר",
    femaleSeminar: "בית יעקב",
    maleType: "ליטאי",
    femaleType: "ליטאי",
    engagementDate: 'ט"ו באב תשפ"ג',
  },
  {
    id: 5,
    maleFirstName: "יעקב",
    maleLastName: "פרידמן",
    femaleFirstName: "רחל",
    femaleLastName: "גרינברג",
    maleYeshiva: "סלבודקה",
    femaleSeminar: "בנות ירושלים",
    maleType: "ליטאי",
    femaleType: "ליטאי",
    engagementDate: 'ר"ח ניסן תשפ"ג',
  },
]

// מודעות אירוסין
const engagementAnnouncements = [
  {
    id: 1,
    maleFirstName: "נחמיה",
    maleLastName: "וינברג",
    femaleFirstName: "שירה",
    femaleLastName: "וינברג",
    maleYeshiva: "בית יעקב סמינר הרב כ...",
    femaleSeminar: "תורת זאב - סולוביצ'יק",
    engagementDate: 'כ"ה באדר תשפ"ג',
  },
  {
    id: 2,
    maleFirstName: "אליהו",
    maleLastName: "שפירא",
    femaleFirstName: "מיכל",
    femaleLastName: "ברגמן",
    maleYeshiva: "מיר ירושלים",
    femaleSeminar: "בית יעקב ירושלים",
    engagementDate: "ב' בניסן תשפ\"ג",
  },
  {
    id: 3,
    maleFirstName: "מנחם",
    maleLastName: "כהנא",
    femaleFirstName: "אסתר",
    femaleLastName: "פרידלנדר",
    maleYeshiva: "חברון גבעת מרדכי",
    femaleSeminar: "אור החיים",
    engagementDate: 'ט"ו בשבט תשפ"ג',
  },
  {
    id: 4,
    maleFirstName: "יהודה",
    maleLastName: "לוינשטיין",
    femaleFirstName: "חיה",
    femaleLastName: "רוטנברג",
    maleYeshiva: "פוניבז'",
    femaleSeminar: "סמינר הרב וולף",
    engagementDate: 'ר"ח אלול תשפ"ג',
  },
  {
    id: 5,
    maleFirstName: "שמואל",
    maleLastName: "הורביץ",
    femaleFirstName: "דבורה",
    femaleLastName: "פרנקל",
    maleYeshiva: "תפארת ירושלים",
    femaleSeminar: "בית יעקב גור",
    engagementDate: 'כ"ג בתמוז תשפ"ג',
  },
]

// שלבי התהליך
const steps = [
  {
    label: "הרשמה",
    description: `תהליך ההרשמה פשוט וידידותי. תתבקשו למלא פרטים אישיים בסיסיים ולהגדיר את העדפותיכם. אנו מקפידים על פרטיות מלאה וכל המידע נשמר בצורה מאובטחת.`,
    icon: <PersonAddIcon />,
  },
  {
    label: "מילוי שאלון מקיף",
    description: `לאחר ההרשמה, תתבקשו למלא שאלון מקיף שיעזור לנו להכיר אתכם טוב יותר. השאלון כולל שאלות על אורח חיים, השקפת עולם, תחביבים, שאיפות ועוד. ככל שתספקו מידע מפורט יותר, כך נוכל להתאים לכם שידוכים מדויקים יותר.`,
    icon: <AssignmentIcon />,
  },
  {
    label: "חיפוש התאמות",
    description: `צוות השדכניות המנוסה שלנו, בשילוב עם המערכת החכמה, יחפשו עבורכם את ההתאמות הטובות ביותר. אנו לוקחים בחשבון מגוון רחב של פרמטרים כדי להבטיח התאמה אופטימלית.`,
    icon: <SearchIcon />,
  },
  {
    label: "הצעת שידוך",
    description: `כאשר נמצאת התאמה פוטנציאלית, שדכנית אישית תיצור עמכם קשר ותציג בפניכם את ההצעה. תקבלו מידע מקיף על המועמד/ת ותוכלו להחליט אם ברצונכם להמשיך.`,
    icon: <FavoriteIcon />,
  },
  {
    label: "ליווי לאורך כל הדרך",
    description: `אנו מלווים אתכם לאורך כל תהליך השידוך - מהפגישה הראשונה ועד לאירוסין. השדכנית האישית שלכם תהיה זמינה לכל שאלה, התלבטות או צורך שיעלה במהלך התהליך.`,
    icon: <CelebrationIcon />,
  },
]

const Home = () => {
  const navigate = useNavigate()
  const [paused, setPaused] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [currentCoupleIndex, setCurrentCoupleIndex] = useState(0)
  const [, setCurrentAnnouncementIndex] = useState(0)
  const announcementRef = useRef(null)
  const [pauseAnnouncements, setPauseAnnouncements] = useState(false)

  // בדיקה אם לשמור כפתור חזרה למעלה
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // החלפת זוגות אוטומטית
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCoupleIndex((prevIndex) => (prevIndex + 1) % happyCouples.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // החלפת מודעות אירוסין אוטומטית
  useEffect(() => {
    if (pauseAnnouncements) return

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) => (prevIndex + 1) % engagementAnnouncements.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [pauseAnnouncements])

  // חזרה לראש העמוד
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: colors.background,
        padding: "0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Animation - עיגולים קטנים */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 50 }).map((_, index) => (
          <Box
            key={index}
            component={motion.div}
            sx={{
              position: "absolute",
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              borderRadius: "50%",
              backgroundColor: `rgba(184, 115, 51, ${Math.random() * 0.15 + 0.05})`,
              filter: "blur(1px)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </Box>

      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(17, 17, 17, 0.9)",
          width: "100%",
          boxShadow: "none",
          borderBottom: `1.5px solid ${colors.primary}`,
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <Toolbar>
          {/* לוגו בצד שמאל */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              {/* לוגו של כוסיות יין */}
              <Box sx={{ position: "relative", width: 50, height: 50, mr: 1 }}>
                <Box
                  sx={{
                    position: "absolute",
                    width: 20,
                    height: 30,
                    borderRadius: "50% 50% 5px 5px",
                    backgroundColor: colors.primary,
                    border: `1px solid ${colors.primaryLight}`,
                    transform: "rotate(-20deg)",
                    left: 5,
                    top: 10,
                    boxShadow: `0 0 10px ${colors.primary}80`,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    width: 20,
                    height: 30,
                    borderRadius: "50% 50% 5px 5px",
                    backgroundColor: colors.primary,
                    border: `1px solid ${colors.primaryLight}`,
                    transform: "rotate(20deg)",
                    right: 5,
                    top: 10,
                    boxShadow: `0 0 10px ${colors.primary}80`,
                  }}
                />
                <Box
                  component={motion.div}
                  sx={{
                    position: "absolute",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: colors.primaryLight,
                    top: 15,
                    left: 22,
                  }}
                  animate={{ y: [0, 10], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontWeight: "bold",
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.primaryLight})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                בשורה טובה
              </Typography>
            </motion.div>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/about")}
              sx={{
                mx: 1,
                borderRadius: "20px",
                padding: "6px 12px",
                color: colors.text,
                transition: "all 0.3s",
                fontSize: "0.9rem",
                "&:hover": {
                  backgroundColor: "rgba(184, 115, 51, 0.2)",
                  color: colors.primary,
                },
              }}
            >
              אודות
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/candidate-auth")}
              sx={{
                mx: 1,
                borderRadius: "20px",
                padding: "6px 12px",
                border: `1px solid ${colors.primary}`,
                color: colors.text,
                transition: "all 0.3s",
                fontSize: "0.9rem",
                "&:hover": {
                  backgroundColor: "rgba(184, 115, 51, 0.2)",
                  borderColor: colors.primaryLight,
                  color: colors.primaryLight,
                },
              }}
            >
              כניסה כמועמד
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/matchmaker-auth")}
              sx={{
                mx: 1,
                borderRadius: "20px",
                padding: "6px 12px",
                border: `1px solid ${colors.primary}`,
                color: colors.text,
                transition: "all 0.3s",
                fontSize: "0.9rem",
                "&:hover": {
                  backgroundColor: "rgba(184, 115, 51, 0.2)",
                  borderColor: colors.primaryLight,
                  color: colors.primaryLight,
                },
              }}
            >
              כניסה כשדכנית
            </Button>
          </motion.div>
        </Toolbar>
      </AppBar>

      {/* טקסט מחפשים שידוך */}
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            variant="h5"
            sx={{
              color: colors.text,
              textShadow: `0 0 10px ${colors.primary}80`,
              mb: 2,
            }}
          >
            ?מחפשים שידוך
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.primary,
              fontWeight: "bold",
              marginBottom: "20px",
              textShadow: `0 0 15px ${colors.primary}80`,
            }}
          >
            אנחנו כאן כדי לבשר לכם <br />
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              style={{
                display: "inline-block",
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.primaryLight})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "2.5rem",
                fontWeight: "bold",
                margin: "10px 0",
              }}
              className="bsoraTova"
            >
              "בשורה טובה"
            </motion.div>
          </Typography>
        </motion.div>
      </Box>

      {/* תצוגת זוגות מתחלפת - 2 מועמדים זה לצד זה */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          my: 4,
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCoupleIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {/* כרטיס מועמדת */}
            <Paper
              elevation={3}
              sx={{
                width: isMobile ? "90%" : "40%",
                maxWidth: "350px",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 10px 20px ${colors.primary}40`,
                },
              }}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "#d0d8ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 16px",
                    border: "4px solid #f0f3ff",
                  }}
                >
                  {/* אייקון אישה סכמטי */}
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      position: "relative",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#6b7db3",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                      },
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        width: "20px",
                        height: "30px",
                        backgroundColor: "#6b7db3",
                        borderRadius: "10px 10px 0 0",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}></Typography>
                  <Box
                    sx={{
                      width: "4px",
                      height: "20px",
                      backgroundColor: "#ffd700",
                      mx: 1,
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="h6" sx={{ color: "#333" }}>
                    20
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                  {happyCouples[currentCoupleIndex].femaleSeminar} {happyCouples[currentCoupleIndex].femaleType}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    backgroundColor: colors.primary,
                    color: colors.darkText,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: colors.primaryLight,
                    },
                    width: "80%",
                    py: 1,
                  }}
                >
                  מעוניינים בפגישה
                </Button>
              </Box>
            </Paper>

            {/* אייקון אישור באמצע */}
            <Box
              sx={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <CheckCircleIcon sx={{ color: "#fff", fontSize: "30px" }} />
            </Box>

            {/* כרטיס מועמד */}
            <Paper
              elevation={3}
              sx={{
                width: isMobile ? "90%" : "40%",
                maxWidth: "350px",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#f8f9fa",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 10px 20px ${colors.primary}40`,
                },
              }}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "#d0d8ff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 16px",
                    border: "4px solid #f0f3ff",
                  }}
                >
                  {/* אייקון גבר סכמטי */}
                  <Box
                    sx={{
                      width: "50px",
                      height: "50px",
                      position: "relative",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#6b7db3",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                      },
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#6b7db3",
                        borderRadius: "10px 10px 0 0",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}></Typography>
                  <Box
                    sx={{
                      width: "4px",
                      height: "20px",
                      backgroundColor: "#ffd700",
                      mx: 1,
                      borderRadius: "2px",
                    }}
                  />
                  <Typography variant="h6" sx={{ color: "#333" }}>
                    20
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: "#666", mb: 2 }}>
                  {happyCouples[currentCoupleIndex].maleYeshiva} {happyCouples[currentCoupleIndex].maleType}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "30px",
                    backgroundColor: colors.primary,
                    color: colors.darkText,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: colors.primaryLight,
                    },
                    width: "80%",
                    py: 1,
                  }}
                >
                  מעוניינים בפגישה
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </AnimatePresence>

        {/* נקודות ניווט */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            position: "absolute",
            bottom: -30,
            left: 0,
            right: 0,
          }}
        >
          {happyCouples.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: currentCoupleIndex === index ? colors.primary : "rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => setCurrentCoupleIndex(index)}
            />
          ))}
        </Box>
      </Box>

      {/* כיתוב "המאושרים שלנו" */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.text,
            mb: 2,
            mt: 6,
            position: "relative",
            zIndex: 1,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100px",
              height: "3px",
              background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            },
          }}
        >
          ~המאושרים שלנו~
        </Typography>
      </motion.div>

      {/* מודעות אירוסין מתחלפות */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          position: "relative",
          overflow: "hidden",
          my: 5,
          py: 3,
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          border: `1px solid ${colors.primary}30`,
          backdropFilter: "blur(5px)",
        }}
        onMouseEnter={() => setPauseAnnouncements(true)}
        onMouseLeave={() => setPauseAnnouncements(false)}
      >
        <Typography
          variant="h5"
          sx={{
            color: colors.primary,
            mb: 2,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100px",
              height: "3px",
              background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            },
          }}
        >
          שמחות ובשורות טובות
        </Typography>
        <Box
          sx={{
            display: "flex",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
          }}
          ref={announcementRef}
        >
          {engagementAnnouncements.map((announcement) => (
            <motion.div
              key={announcement.id}
              style={{
                display: "inline-block",
                width: "300px",
                // mx: 2,
                // my: 1,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                border: `1px solid ${colors.primary}30`,
                padding: "16px",
                textAlign: "center",
                flexShrink: 0,
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              animate={{ translateX: paused ? 0 : `-${(engagementAnnouncements.length * 300) / 2}px` }}
              transition={{
                loop: Number.POSITIVE_INFINITY,
                duration: 20,
                ease: "linear",
              }}
            >
              <Typography variant="h6" sx={{ color: colors.primary }}>
                {announcement.femaleFirstName} {announcement.femaleLastName}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text, opacity: 0.8, fontSize: "0.8rem" }}>
                {announcement.femaleSeminar}
              </Typography>
              <Typography variant="h6" sx={{ color: colors.primary, mt: 2 }}>
                {announcement.maleFirstName} {announcement.maleLastName}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text, opacity: 0.8, fontSize: "0.8rem" }}>
                {announcement.maleYeshiva}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 2, color: colors.primaryLight, fontWeight: "bold", fontSize: "0.9rem" }}
              >
                מאורסים
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text, opacity: 0.8, fontSize: "0.8rem" }}>
                {announcement.engagementDate}
              </Typography>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Icons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: "30px", md: "80px" },
          mb: 3,
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              color: colors.primary,
              fontSize: "40px",
              backgroundColor: "rgba(184, 115, 51, 0.1)",
              borderRadius: "50%",
              width: "70px",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 15px ${colors.primary}40`,
            }}
          >
            <PeopleIcon sx={{ fontSize: "inherit" }} />
          </Box>
          <NumberCounter targetNumber={1528} />
          <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>נרשמו עד כה</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              color: colors.primary,
              fontSize: "40px",
              backgroundColor: "rgba(184, 115, 51, 0.1)",
              borderRadius: "50%",
              width: "70px",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 15px ${colors.primary}40`,
            }}
          >
            <VolunteerActivismIcon sx={{ fontSize: "inherit" }} />
          </Box>
          <NumberCounter targetNumber={1365} />
          <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>הצעות שרצות כרגע</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              color: colors.primary,
              fontSize: "40px",
              backgroundColor: "rgba(184, 115, 51, 0.1)",
              borderRadius: "50%",
              width: "70px",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: `0 0 15px ${colors.primary}40`,
            }}
          >
            <CelebrationIcon sx={{ fontSize: "inherit" }} />
          </Box>
          <NumberCounter targetNumber={1867} />
          <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>זוגות שנפגשו</Typography>
        </Box>
      </Box>

      {/* שלבי התהליך */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          mt: 8,
          mb: 6,
          px: 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            variant="h4"
            sx={{
              color: colors.text,
              mb: 4,
              textAlign: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "3px",
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
              },
            }}
          >
            איך זה עובד?
          </Typography>
        </motion.div>

        <Stepper
          orientation="vertical"
          sx={{
            "& .MuiStepConnector-line": { borderColor: colors.primary },
            "& .MuiStepLabel-label": { color: colors.text },
          }}
        >
          {steps.map((step, index) => (
            <Step
              key={step.label}
              active={true}
              sx={{
                "& .MuiStepLabel-iconContainer": {
                  bgcolor: colors.primary,
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.darkText,
                },
                "& .MuiStepLabel-label": {
                  color: colors.text,
                  fontWeight: "bold",
                },
              }}
            >
              <StepLabel icon={step.icon}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Typography variant="h6" sx={{ color: colors.primary }}>
                    {step.label}
                  </Typography>
                </motion.div>
              </StepLabel>
              <StepContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      my: 2,
                      backgroundColor: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(5px)",
                      borderRadius: "12px",
                      border: `1px solid ${colors.primary}40`,
                      color: colors.text,
                    }}
                  >
                    <Typography>{step.description}</Typography>
                  </Paper>
                </motion.div>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/candidate-auth/signup/candidate")}
              sx={{
                borderRadius: "30px",
                padding: "12px 36px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                backgroundColor: colors.primary,
                color: colors.darkText,
                boxShadow: `0 8px 16px ${colors.primary}40`,
                "&:hover": {
                  backgroundColor: colors.primaryLight,
                  boxShadow: `0 12px 24px ${colors.primary}60`,
                },
              }}
            >
              הרשמה עכשיו
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Footer - קטן יותר ומעוצב יותר */}
      <Box
        component="footer"
        sx={{
          width: "100%",
          py: 4,
          px: 2,
          mt: "auto",
          backgroundColor: "rgba(17, 17, 17, 0.95)",
          borderTop: `1px solid ${colors.primary}`,
          color: colors.text,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold", mb: 1 }}>
                  בשורה טובה
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, fontSize: "0.9rem" }}>
                  מערכת שידוכים מתקדמת המחברת בין לבבות
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <IconButton color={colors.primary}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton color={colors.primary}>
                    <InstagramIcon />
                  </IconButton>
                  <IconButton color={colors.primary}>
                    <WhatsAppIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold", mb: 1 }}>
                  קישורים מהירים
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                    justifyContent: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <Link
                    component="button"
                    onClick={() => navigate("/")}
                    sx={{ color: colors.text, "&:hover": { color: colors.primary } }}
                  >
                    דף הבית
                  </Link>
                  <Link
                    component="button"
                    onClick={() => navigate("/about")}
                    sx={{ color: colors.text, "&:hover": { color: colors.primary } }}
                  >
                    אודות
                  </Link>
                  <Link
                    component="button"
                    onClick={() => navigate("/how-it-works")}
                    sx={{ color: colors.text, "&:hover": { color: colors.primary } }}
                  >
                    איך זה עובד
                  </Link>
                  <Link
                    component="button"
                    onClick={() => navigate("/contact")}
                    sx={{ color: colors.text, "&:hover": { color: colors.primary } }}
                  >
                    צור קשר
                  </Link>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold", mb: 1 }}>
                  צור קשר
                </Typography>
                <Box sx={{ fontSize: "0.9rem" }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <LocationOnIcon sx={{ fontSize: "1rem", mr: 0.5, color: colors.primary }} />
                    רחוב הרב קוק 12, ירושלים
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <PhoneIcon sx={{ fontSize: "1rem", mr: 0.5, color: colors.primary }} />
                    03-1234567
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <EmailIcon sx={{ fontSize: "1rem", mr: 0.5, color: colors.primary }} />
                    info@bsoratova.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ pt: 2, borderTop: `1px solid ${colors.primary}40`, mt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.7, fontSize: "0.8rem" }}>
              © {new Date().getFullYear()} בשורה טובה - כל הזכויות שמורות
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* כפתור חזרה למעלה */}
      {showScrollTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 100,
          }}
        >
          <Button
            variant="contained"
            onClick={scrollToTop}
            sx={{
              minWidth: "auto",
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: colors.primary,
              color: colors.darkText,
              boxShadow: `0 4px 10px ${colors.primary}80`,
              "&:hover": {
                backgroundColor: colors.primaryLight,
                boxShadow: `0 6px 15px ${colors.primary}80`,
              },
            }}
          >
            <KeyboardArrowUpIcon />
          </Button>
        </motion.div>
      )}
    </Container>
  )
}

export default Home

// Placeholder components for the imports that weren't defined
const IconButton = ({ children, color }: any) => (
  <Button
    sx={{
      minWidth: "auto",
      width: 36,
      height: 36,
      borderRadius: "50%",
      color: color,
      padding: 0,
      "&:hover": {
        backgroundColor: `${color}20`,
      },
    }}
  >
    {children}
  </Button>
)
