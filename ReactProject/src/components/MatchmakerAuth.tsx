"use client"
import type React from "react"
import {
  Container,
  Button,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  Card,
  CardContent,
  Avatar,
  Grid,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { userContext } from "./UserContext"
import { motion } from "framer-motion"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import EditNoteIcon from "@mui/icons-material/EditNote"
import HomeIcon from "@mui/icons-material/Home"
import PeopleIcon from "@mui/icons-material/People"
import NotesIcon from "@mui/icons-material/Notes"
import WineBarIcon from "@mui/icons-material/WineBar"
import VerifiedIcon from "@mui/icons-material/Verified"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import FavoriteIcon from "@mui/icons-material/Favorite"
import SettingsIcon from "@mui/icons-material/Settings"
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

const MatchmakerAuth = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(userContext)
  const [userName, setUserName] = useState("")
  const [stats, setStats] = useState({
    totalMatches: 0,
    successfulMatches: 0,
    pendingMatches: 0,
  })

  // בדיקה אם אנחנו בעמוד הבית או בעמוד אחר
  const isHomePage = location.pathname === "/" || location.pathname === ""

  useEffect(() => {
    if (user?.firstName) {
      setUserName(user.firstName)
    } else if (user?.firstName) {
      setUserName(user.firstName)
    }
    // Simulate loading stats
    if (user?.id) {
      setStats({
        totalMatches: Math.floor(Math.random() * 50) + 10,
        successfulMatches: Math.floor(Math.random() * 20) + 5,
        pendingMatches: Math.floor(Math.random() * 15) + 3,
      })
    }
  }, [user])

  // Top matchmakers data
  const topMatchmakers = [
    { name: "רבקה כהן", matches: 42, avatar: "R" },
    { name: "יעקב לוי", matches: 38, avatar: "י" },
    { name: "שרה גולדברג", matches: 35, avatar: "ש" },
  ]

  function handleLogout(): void {
    logout()
  }

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
            <br />
            <Tooltip title="ליציאה מהאתר" arrow>
              <Button onClick={() => handleLogout()} startIcon={<Logout />} sx={{ color: colors.primary }}>
                {/* אפשר להוסיף טקסט נוסף כאן אם רוצים */}
              </Button>
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {user?.role != "MatchMaker" && (
              <>
                <StyledButton onClick={() => navigate("login/matchmaker")} startIcon={<LoginIcon />}>
                  כניסה
                </StyledButton>
                <StyledButton onClick={() => navigate("signup/matchmaker")} startIcon={<PersonAddIcon />}>
                  הרשמה
                </StyledButton>
              </>
            )}
            {user?.role == "MatchMaker" && (
              <>
                <StyledButton onClick={() => navigate("allMales")} startIcon={<PeopleIcon />}>
                  מועמדים
                </StyledButton>
                <StyledButton onClick={() => navigate("post-details-matchmaker")} startIcon={<EditNoteIcon />}>
                  פרטי פרופיל
                </StyledButton>
                <StyledButton onClick={() => navigate("matchmaker-notes")} startIcon={<NotesIcon />}>
                  הערות שלי
                </StyledButton>
                {!isMobile && (
                  <StyledButton onClick={() => navigate("/dashboard")} startIcon={<SettingsIcon />}>
                    לוח בקרה
                  </StyledButton>
                )}
              </>
            )}
            <StyledButton onClick={() => navigate("/")} startIcon={<HomeIcon />}>
              דף הבית
            </StyledButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - מוצג רק בעמוד הבית */}
      {isHomePage && (
        <Box
          sx={{
            mt: 15,
            mb: 5,
            px: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                backgroundColor: "rgba(30, 30, 30, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: `1px solid ${colors.primary}40`,
                maxWidth: 1200,
                mx: "auto",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  color: colors.primary,
                  textShadow: `0 0 10px ${colors.primary}40`,
                  textAlign: "center",
                }}
              >
                {userName ? `שלום לך ${userName}` : "שלום לך"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colors.primaryLight,
                  mb: 4,
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                ברוכים הבאים למערכת השדכנים של "בשורה טובה"
              </Typography>
              {user?.role === "MatchMaker" ? (
                <Box>
                  {/* Matchmaker Dashboard */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="סה״כ שידוכים"
                        value={stats.totalMatches}
                        icon={<PeopleIcon sx={{ fontSize: 40, color: colors.primary }} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="שידוכים מוצלחים"
                        value={stats.successfulMatches}
                        icon={<VerifiedIcon sx={{ fontSize: 40, color: colors.primary }} />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="שידוכים בתהליך"
                        value={stats.pendingMatches}
                        icon={<FavoriteIcon sx={{ fontSize: 40, color: colors.primary }} />}
                      />
                    </Grid>
                  </Grid>
                  {/* Recent Activity */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 4,
                      backgroundColor: "rgba(40, 40, 40, 0.7)",
                      borderRadius: 3,
                      border: `1px solid ${colors.primary}30`,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: colors.primary, mb: 2 }}>
                      פעילות אחרונה
                    </Typography>
                    <Box>
                      {[1, 2, 3].map((item) => (
                        <Box
                          key={item}
                          sx={{ mb: 2, pb: 2, borderBottom: item < 3 ? `1px solid ${colors.primary}30` : "none" }}
                        >
                          <Typography variant="body1" sx={{ color: colors.text }}>
                            הצעת שידוך חדשה נשלחה למועמד #{Math.floor(Math.random() * 1000) + 100}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.primaryLight }}>
                            לפני {Math.floor(Math.random() * 24) + 1} שעות
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box>
                  {/* Content for non-logged in users */}
                  <Box sx={{ textAlign: "center", mb: 5 }}>
                    <Typography variant="h5" sx={{ color: colors.primary, mb: 3 }}>
                      הצטרפו למערכת השדכנים שלנו
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.text, mb: 4, maxWidth: 700, mx: "auto" }}>
                      כשדכנים במערכת "בשורה טובה", תוכלו לעזור לזוגות רבים למצוא את השידוך המושלם. המערכת שלנו מספקת
                      כלים מתקדמים לניהול מועמדים, התאמות, ומעקב אחר התקדמות השידוכים.
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                      <StyledButton
                        onClick={() => navigate("signup/matchmaker")}
                        startIcon={<PersonAddIcon />}
                        sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
                      >
                        הרשמה כשדכן/ית
                      </StyledButton>
                      <StyledButton
                        onClick={() => navigate("login/matchmaker")}
                        startIcon={<LoginIcon />}
                        sx={{ px: 4, py: 1.5, fontSize: "1.1rem" }}
                      >
                        כניסה למערכת
                      </StyledButton>
                    </Box>
                  </Box>
                  {/* Top Matchmakers */}
                  <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" sx={{ color: colors.primary, mb: 4, textAlign: "center" }}>
                      השדכנים המובילים שלנו
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                      {topMatchmakers.map((matchmaker, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                          <Card
                            sx={{
                              backgroundColor: "rgba(40, 40, 40, 0.7)",
                              color: colors.text,
                              border: `1px solid ${colors.primary}30`,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: `0 10px 20px rgba(184, 115, 51, 0.3)`,
                                border: `1px solid ${colors.primary}`,
                              },
                            }}
                          >
                            <CardContent sx={{ textAlign: "center" }}>
                              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    backgroundColor: colors.primary,
                                    fontSize: "2rem",
                                    mb: 2,
                                  }}
                                >
                                  {matchmaker.avatar}
                                </Avatar>
                              </Box>
                              <Typography variant="h6" sx={{ color: colors.primary }}>
                                {matchmaker.name}
                              </Typography>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
                                <EmojiEventsIcon sx={{ color: colors.primaryLight, mr: 1 }} />
                                <Typography variant="body1">{matchmaker.matches} שידוכים מוצלחים</Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}
            </Paper>
          </motion.div>
        </Box>
      )}

      {/* Outlet Container - מוצג בעמודים אחרים */}
      {!isHomePage && (
        <Box
          sx={{
            mt: 12, // מרווח מהheader
            minHeight: "calc(100vh - 96px)", // גובה מלא פחות הheader
            position: "relative",
            zIndex: 1,
            px: 2,
            py: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "rgba(30, 30, 30, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: `1px solid ${colors.primary}40`,
              minHeight: "calc(100vh - 150px)",
              p: 3,
            }}
          >
            <Outlet />
          </Paper>
        </Box>
      )}

      {/* Outlet עבור עמוד הבית - אם יש צורך */}
      {isHomePage && (
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Outlet />
        </Box>
      )}
    </Container>
  )
}

// כפתור מעוצב
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
      margin: 0.5,
    }}
  >
    {children}
  </Button>
)

// Stat Card Component
const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      backgroundColor: "rgba(40, 40, 40, 0.7)",
      borderRadius: 3,
      border: `1px solid ${colors.primary}30`,
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: `0 10px 20px rgba(184, 115, 51, 0.2)`,
        border: `1px solid ${colors.primary}70`,
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ color: colors.primary, ml: 2 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h3" sx={{ color: colors.text, fontWeight: "bold" }}>
      {value}
    </Typography>
  </Paper>
)

export default MatchmakerAuth
