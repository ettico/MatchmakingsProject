"use client"

import {
  Container,
  Button,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Modal,
  Paper,
  Backdrop,
  Fade,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Divider,
  Tooltip,
  // useMediaQuery,
  // useTheme,
} from "@mui/material"
import { useContext, useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { userContext } from "./UserContext"
import {  motion } from "framer-motion"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import EditNoteIcon from "@mui/icons-material/EditNote"
import HomeIcon from "@mui/icons-material/Home"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PersonIcon from "@mui/icons-material/Person"
import WineBarIcon from "@mui/icons-material/WineBar"
import { Logout } from "@mui/icons-material"

// צבעים חדשים
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

const CandidateAuth = () => {
  // const theme = useTheme()
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const { user,logout } = useContext(userContext)
  const [open, setOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [userName, setUserName] = useState("")
  const [showSuccessStories, setShowSuccessStories] = useState(false)

  useEffect(() => {
    if (user?.firstName) {
      setUserName(user.firstName)
    }
  }, [user])

  const handleNavigate = (path: string, type: string) => {
    navigate(path)
    setModalType(type)
    setOpen(true)
  }
 const handleLogout = () => {
    logout(); // קריאה לפונקציית ה-logout
  };

  const isPostDetails = modalType === "post-details"

  // מידע על זוגות מוצלחים
  const successStories = [
    {
      malePartner: "יוסף כהן",
      femalePartner: "שרה לוי",
      matchmaker: "רבקה גולדברג",
      date: "15/03/2023",
      story: "הכירו דרך שדכנית המערכת והתארסו לאחר 5 פגישות בלבד!",
    },
    {
      malePartner: "משה ברקוביץ",
      femalePartner: "חנה פרידמן",
      matchmaker: "לאה רוזנברג",
      date: "22/06/2023",
      story: "לאחר חיפוש ארוך, מצאו את השידוך המושלם דרך המערכת שלנו.",
    },
    {
      malePartner: "דוד גרינברג",
      femalePartner: "מרים אדלר",
      matchmaker: "יעקב שטרן",
      date: "10/09/2023",
      story: "שני בוגרי ישיבות מובילות שמצאו את האחד את השנייה בעזרת המערכת.",
    },
  ]

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        padding: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Animation */}
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
        {Array.from({ length: 30 }).map((_, index) => (
          <Box
            key={index}
            component={motion.div}
            sx={{
              position: "absolute",
              width: Math.random() * 15 + 5,
              height: Math.random() * 15 + 5,
              borderRadius: "50%",
              backgroundColor: `rgba(184, 115, 51, ${Math.random() * 0.2 + 0.05})`,
              filter: "blur(1px)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </Box>

      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(17, 17, 17, 0.9)",
          borderBottom: `2px solid ${colors.primary}`,
          backdropFilter: "blur(10px)",
          paddingY: 1,
          zIndex: 10,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <WineBarIcon sx={{ color: colors.primary, mr: 1, fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                color: colors.primary,
                fontWeight: "bold",
                display: { xs: "none", sm: "block" },
              }}
            >
              בשורה טובה
            </Typography>
               <Tooltip title="ליציאה מהאתר" arrow>
      <Button onClick={() => handleLogout()} startIcon={<Logout />} sx={{ color: colors.primary }}>
        {/* אפשר להוסיף טקסט נוסף כאן אם רוצים */}
      </Button>
    </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {user?.role !== "Women" && user?.role !== "Male" && (
              <>
                <StyledButton onClick={() => handleNavigate("login/candidate", "login")} startIcon={<LoginIcon />}>
                  כניסה
                </StyledButton>
                <StyledButton
                  onClick={() => handleNavigate("signup/candidate", "signup")}
                  startIcon={<PersonAddIcon />}
                >
                  הרשמה
                </StyledButton>
              </>
            )}
            {(user?.role == "Male" || user?.role == "Women") && (
              <>
                <StyledButton
                  onClick={() => handleNavigate("Post-Details-Auth", "post-details")}
                  startIcon={<EditNoteIcon />}
                >
                  המשך למילוי פרטים
                </StyledButton>
                <StyledButton
                  onClick={() => handleNavigate("CandidateProfile","CandidateProfile")}
                  startIcon={<PersonIcon />}
                  // sx={{ display: { xs: "none", md: "flex" } }}
                >
                  הפרופיל שלי
                </StyledButton>
              </>
            )}
            <StyledButton onClick={() => navigate("/")} startIcon={<HomeIcon />}>
              דף הבית
            </StyledButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* טקסט מרכזי מעוצב */}
      <Box
        sx={{
          mt: 15,
          textAlign: "center",
          color: colors.text,
          position: "relative",
          zIndex: 1,
          px: 2,
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: colors.primary,
              textShadow: `0 0 10px ${colors.primary}40`,
            }}
          >
            {userName ? `שלום לך ${userName}` : "שלום לך"}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              animation: "fadeIn 3s ease-in-out",
              fontStyle: "italic",
              color: colors.primaryLight,
              textShadow: `0 0 10px ${colors.primaryLight}40`,
              mb: 4,
            }}
          >
            כולנו רוצים כבר לבשר לך בשורה טובה! <br />
            מבטיחים לעשות כמיטב יכולתנו
          </Typography>
        </motion.div>

        {/* Featured Candidates */}
        {!user?.role && (
          <Box sx={{ mt: 6, mb: 8 }}>
            <Typography
              variant="h5"
              sx={{
                color: colors.primary,
                mb: 4,
                fontWeight: "bold",
                position: "relative",
                display: "inline-block",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "3px",
                  backgroundColor: colors.primary,
                },
              }}
            >
              מועמדים מובחרים
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
              }}
            >
              <FeaturedCandidate name="וולף ליטאי" age={20} yeshiva="פוניבז'" gender="female" />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  width: { xs: "40px", md: "60px" },
                  height: { xs: "40px", md: "60px" },
                  backgroundColor: "rgba(184, 115, 51, 0.2)",
                  borderRadius: "50%",
                  my: { xs: -2, md: 0 },
                }}
              >
                <FavoriteIcon sx={{ color: colors.primary, fontSize: { xs: 24, md: 30 } }} />
              </Box>

              <FeaturedCandidate name="פוניבז' ליטאי" age={20} yeshiva="פוניבז'" gender="male" />
            </Box>
          </Box>
        )}

        {/* Success Stories */}
        <Box sx={{ mt: 6, mb: 8 }}>
          <Typography
            variant="h5"
            sx={{
              color: colors.primary,
              mb: 4,
              fontWeight: "bold",
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "3px",
                backgroundColor: colors.primary,
              },
            }}
            onClick={() => setShowSuccessStories(!showSuccessStories)}
          >
            סיפורי הצלחה
          </Typography>

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: showSuccessStories ? 1 : 0,
              height: showSuccessStories ? "auto" : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                justifyContent: "center",
                mt: 4,
                overflow: "hidden",
              }}
            >
              {successStories.map((story, index) => (
                <Card
                  key={index}
                  sx={{
                    maxWidth: 300,
                    backgroundColor: "rgba(30, 30, 30, 0.7)",
                    border: `1px solid ${colors.primary}30`,
                    color: colors.text,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 10px 20px rgba(184, 115, 51, 0.3)`,
                      border: `1px solid ${colors.primary}`,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                      <FavoriteIcon sx={{ color: colors.primary, fontSize: 40 }} />
                    </Box>
                    <Typography variant="h6" sx={{ textAlign: "center", color: colors.primary, mb: 2 }}>
                      {story.malePartner} & {story.femalePartner}
                    </Typography>
                    <Divider sx={{ backgroundColor: colors.primary, opacity: 0.3, my: 2 }} />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>שדכן/ית:</strong> {story.matchmaker}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>תאריך:</strong> {story.date}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {story.story}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </motion.div>
        </Box>
<Box display="flex" justifyContent="center" mt={3}>
  <Button
    variant="contained"
    onClick={() => handleNavigate("match","match")}
    sx={{
      backgroundColor: colors.primary,
      color: "#fff",
      px: 4,
      py: 1.5,
      borderRadius: 3,
      fontWeight: "bold",
      boxShadow: `0 0 10px ${colors.primaryLight}`,
      "&:hover": {
        backgroundColor: colors.primaryDark,
      },
    }}
  >
    🤖 התאם מועמדים בשבילי עם AI
  </Button>
</Box>

        {/* How It Works */}
        <Box sx={{ mt: 6, mb: 8 }}>
          <Typography
            variant="h5"
            sx={{
              color: colors.primary,
              mb: 4,
              fontWeight: "bold",
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80px",
                height: "3px",
                backgroundColor: colors.primary,
              },
            }}
          >
            איך זה עובד?
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              justifyContent: "center",
              mt: 4,
            }}
          >
            <ProcessStep number={1} title="הרשמה" description="הירשמו למערכת ומלאו את הפרטים האישיים שלכם" />
            <ProcessStep number={2} title="שדכנות" description="השדכנים שלנו יעברו על הפרופיל שלכם ויציעו התאמות" />
            <ProcessStep number={3} title="פגישה" description="אם שני הצדדים מסכימים, תתואם פגישה ראשונה" />
            <ProcessStep number={4} title="בשורה טובה" description="בעזרת השם, נשמע בקרוב בשורות טובות!" />
          </Box>
        </Box>
      </Box>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => !isPostDetails && setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 400,
          sx: { backgroundColor: "rgba(0,0,0,0.7)" },
        }}
      >
        <Fade in={open}>
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isPostDetails ? "80%" : 400,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 4,
              borderRadius: 3,
              backgroundColor: "#1a1a1a",
              color: colors.text,
              boxShadow: `0 0 30px ${colors.primary}40`,
              border: `1px solid ${colors.primary}40`,
            }}
          >
            {isPostDetails && (
              <Box sx={{ textAlign: "left", mb: 2 }}>
                <IconButton onClick={() => setOpen(false)} sx={{ color: colors.primary }}>
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Box>
            )}
            <Outlet />
          </Paper>
        </Fade>
      </Modal>
    </Container>
  )
}

// כפתור מעוצב יותר, עם צבעים חמים
const StyledButton = ({ children, ...props }: any) => (
  <Button
    {...props}
    variant="contained"
    sx={{
      color: colors.darkText,
      backgroundColor: colors.primary,
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: colors.primaryLight,
        transform: "scale(1.05)",
      },
      transition: "all 0.3s ease-in-out",
      borderRadius: "20px",
      paddingX: 2,
      paddingY: 1,
      boxShadow: `0 2px 5px ${colors.primary}40`,
    }}
  >
    {children}
  </Button>
)

// Featured Candidate Component
const FeaturedCandidate = ({
  name,
  age,
  yeshiva,
  gender,
}: { name: string; age: number; yeshiva: string; gender: string }) => (
  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
    <Paper
      sx={{
        width: 220,
        height: 300,
        backgroundColor: "rgba(30, 30, 30, 0.7)",
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${colors.primary}30`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 10px 20px rgba(184, 115, 51, 0.3)`,
          border: `1px solid ${colors.primary}`,
        },
      }}
    >
      <Box
        sx={{
          height: 180,
          backgroundColor: gender === "male" ? "rgba(0, 50, 100, 0.2)" : "rgba(150, 50, 100, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            backgroundColor: gender === "male" ? colors.primaryDark : colors.primary,
            fontSize: "2.5rem",
          }}
        >
          {name.charAt(0)}
        </Avatar>
      </Box>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: colors.primary, fontWeight: "bold" }}>
          {name}
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text, mt: 1 }}>
          גיל: {age}
        </Typography>
        <Typography variant="body1" sx={{ color: colors.text }}>
          {gender === "male" ? "ישיבה:" : "סמינר:"} {yeshiva}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{
            mt: 2,
            color: colors.primary,
            borderColor: colors.primary,
            borderRadius: 5,
            "&:hover": {
              backgroundColor: `${colors.primary}20`,
              borderColor: colors.primaryLight,
            },
          }}
        >
       מעוניינים בפרטיש
        </Button>
      </Box>
    </Paper>
  </motion.div>
)

// Process Step Component
const ProcessStep = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <Box
    sx={{
      textAlign: "center",
      maxWidth: 200,
    }}
  >
    <Box
      sx={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: colors.primary,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        mb: 2,
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: colors.darkText,
        boxShadow: `0 5px 15px ${colors.primary}50`,
      }}
    >
      {number}
    </Box>
    <Typography variant="h6" sx={{ color: colors.primary, mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: colors.text }}>
      {description}
    </Typography>
  </Box>
)

export default CandidateAuth
