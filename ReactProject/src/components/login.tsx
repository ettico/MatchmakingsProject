"use client"

import { useState, useContext, useEffect } from "react"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Link, useNavigate, useParams } from "react-router-dom"
import { userContext } from "./UserContext"
import { motion } from "framer-motion"
import { Visibility, VisibilityOff, Email, Lock, WineBar, Login as LoginIcon, PersonAdd } from "@mui/icons-material"

const schema = yup.object().shape({
  UserName: yup.string().required("שם משתמש הוא שדה חובה"),
  Password: yup.string().required("סיסמה היא שדה חובה"),
})

// צבעים חדשים
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

const Login = () => {
  const { userType } = useParams() // יקבל את הערך מה-URL
  const { login, error: contextError,user } = useContext(userContext)
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // בדיקה אם המשתמש כבר מחובר
  useEffect(() => {
    const checkUserAuth = () => {
      const storedAuth = localStorage.getItem("auth")
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth)
          if (authData.user && authData.token) {
            console.log("משתמש כבר מחובר:", authData.user)

            // ניתוב לפי תפקיד
            const role = authData.user.role
            if (role === "Male" || role === "Women") {
              navigate("/candidate-auth")
            } else if (role === "MatchMaker") {
              navigate("/matchmaker-auth")
            }
          }
        } catch (err) {
          console.error("שגיאה בפענוח נתוני משתמש מהלוקל סטורג':", err)
        }
      }
    }

    checkUserAuth()
  }, [navigate])

  const onSubmit = async (data: { UserName: string; Password: string }) => {
    try {
      setError("")
      setIsLoggingIn(true)

      console.log("מתחיל תהליך התחברות...")
      await login(data.UserName, data.Password)

      // סימון שההתחברות הצליחה
      setLoginSuccess(true)

      // קריאה מיידית ל-localStorage לאחר התחברות
      // const authData = localStorage.getItem("auth")
      // if (!authData) {
      //   throw new Error("לא נמצאו נתוני התחברות")
      // }

      // const parsedAuth = JSON.parse(authData)
      // console.log("נתוני התחברות:", parsedAuth)

      // if (!parsedAuth.user || !parsedAuth.user.role) {
      //   throw new Error("לא נמצא תפקיד משתמש")
      // }

      const role = user?.role
      console.log("תפקיד המשתמש:", role)

      // ניתוב לפי תפקיד
      if (role === "Male" || role === "Women") {
        console.log("מנווט למועמד...")
        navigate("/candidate-auth")
      } else if (role === "MatchMaker") {
        console.log("מנווט לשדכנית...")
        navigate("/matchmaker-auth")
      } else {
        throw new Error(`תפקיד לא מזוהה: ${role}`)
      }
    } catch (err: any) {
      console.error("שגיאה בהתחברות:", err)
      setLoginSuccess(false)

      if (err?.response?.status === 401) {
        setError("שם משתמש או סיסמה שגויים.")
      } else if (err?.response?.status === 404) {
        setError("המשתמש לא נמצא במערכת. אנא הירשם תחילה.")
      } else if (err?.message) {
        setError(err.message)
      } else {
        setError("ההתחברות נכשלה. אנא נסה שוב או הירשם אם אין לך חשבון.")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: 4,
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

      <Box sx={{ maxWidth: 500, width: "100%", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "rgba(30, 30, 30, 0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: `0 8px 32px rgba(184, 115, 51, 0.3)`,
              border: `1px solid ${colors.primary}40`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: colors.primary,
                  boxShadow: `0 0 20px ${colors.primary}70`,
                }}
              >
                <WineBar sx={{ fontSize: 40, color: colors.darkText }} />
              </Avatar>
            </Box>

            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{
                fontWeight: "bold",
                mb: 1,
                color: colors.primary,
              }}
            >
              התחברות
            </Typography>

            <Typography
              variant="body1"
              align="center"
              sx={{
                mb: 4,
                color: colors.text + "90",
              }}
            >
              {userType === "auth" ? "התחברות למערכת כמועמד/ת" : "התחברות למערכת כשדכן/ית"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register("UserName")}
                label="שם משתמש"
                required
                fullWidth
                margin="normal"
                error={!!errors.UserName}
                helperText={errors.UserName ? errors.UserName.message : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: colors.primary }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    color: colors.text,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${colors.primary}50`,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary,
                    },
                  },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: colors.text + "90",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary,
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336",
                  },
                  mb: 3,
                }}
              />

              <TextField
                {...register("Password")}
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                margin="normal"
                label="סיסמה"
                error={!!errors.Password}
                helperText={errors.Password ? errors.Password.message : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: colors.primary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                        sx={{ color: colors.primary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    color: colors.text,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: `${colors.primary}50`,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.primary,
                    },
                  },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: colors.text + "90",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary,
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f44336",
                  },
                  mb: 4,
                }}
              />

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoggingIn}
                  startIcon={!isLoggingIn && <LoginIcon />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: "30px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    boxShadow: `0 8px 16px ${colors.primary}40`,
                    background: `linear-gradient(45deg, ${colors.primaryDark} 30%, ${colors.primary} 90%)`,
                    color: colors.darkText,
                    "&:hover": {
                      boxShadow: `0 12px 20px ${colors.primary}60`,
                      background: `linear-gradient(45deg, ${colors.primaryDark} 20%, ${colors.primary} 100%)`,
                    },
                  }}
                >
                  {isLoggingIn ? <CircularProgress size={24} color="inherit" /> : "התחבר"}
                </Button>
              </motion.div>
            </form>

            {loginSuccess && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert
                  severity="success"
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(46, 125, 50, 0.1)",
                    color: "#4caf50",
                    border: "1px solid rgba(46, 125, 50, 0.2)",
                    "& .MuiAlert-icon": {
                      color: "#4caf50",
                    },
                  }}
                >
                  התחברת בהצלחה! מעביר אותך...
                </Alert>
              </motion.div>
            )}

            {(error || contextError) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(211,47,47,0.1)",
                    color: "#f44336",
                    border: "1px solid rgba(211,47,47,0.2)",
                    "& .MuiAlert-icon": {
                      color: "#f44336",
                    },
                  }}
                >
                  {error || contextError}
                </Alert>
                <Box mt={2} textAlign="center">
                  {userType === "auth" && (
                    <Link
                      to="/candidate-auth/signup/candidate"
                      style={{
                        color: colors.primary,
                        textDecoration: "none",
                        fontWeight: "bold",
                        transition: "all 0.3s",
                      }}
                    >
                      להרשמה לחצו כאן
                    </Link>
                  )}
                  {userType === "MatchMaker" && (
                    <Link
                      to="/matchmaker-auth/signup/matchmaker"
                      style={{
                        color: colors.primary,
                        textDecoration: "none",
                        fontWeight: "bold",
                        transition: "all 0.3s",
                      }}
                    >
                      להרשמה לחצו כאן
                    </Link>
                  )}
                </Box>
              </motion.div>
            )}

            {!error && !contextError && !loginSuccess && (
              <>
                <Divider sx={{ my: 3, borderColor: colors.primary + "30" }}>
                  <Typography variant="body2" sx={{ color: colors.text + "70", px: 1 }}>
                    או
                  </Typography>
                </Divider>

                <Box mt={1} textAlign="center">
                  {userType === "auth" ? (
                    <Link
                      to="/candidate-auth/signup/candidate"
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        sx={{
                          borderColor: colors.primary,
                          color: colors.primary,
                          borderRadius: 30,
                          py: 1.2,
                          "&:hover": {
                            borderColor: colors.primaryLight,
                            backgroundColor: `${colors.primary}10`,
                          },
                        }}
                      >
                        הרשמה כמועמד/ת
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      to="/matchmaker-auth/signup/matchmaker"
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        sx={{
                          borderColor: colors.primary,
                          color: colors.primary,
                          borderRadius: 30,
                          py: 1.2,
                          "&:hover": {
                            borderColor: colors.primaryLight,
                            backgroundColor: `${colors.primary}10`,
                          },
                        }}
                      >
                        הרשמה כשדכן/ית
                      </Button>
                    </Link>
                  )}
                </Box>

                <Box mt={3} textAlign="center">
                  <Link
                    to="/"
                    style={{
                      color: colors.text + "80",
                      textDecoration: "none",
                      transition: "all 0.3s",
                    }}
                  >
                    חזרה לדף הבית
                  </Link>
                </Box>
              </>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Container>
  )
}

export default Login
