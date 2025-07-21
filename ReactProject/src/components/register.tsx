"use client"
import { useState, useEffect, useContext } from "react"
import { useForm } from "react-hook-form"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  FormHelperText,
  Avatar,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { userContext } from "./UserContext"
import { motion } from "framer-motion"
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Male,
  Female,
  WineBar,
  HowToReg,
  ArrowBack,
} from "@mui/icons-material"

// צבעים חדשים
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

type FormValues = {
  firstName: string
  lastName: string
  username: string
  password: string
  role: string
}

export default function SignIn() {
  const { login } = useContext(userContext)
  const { userType } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<FormValues>({
    mode: "onChange",
  })
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeStep] = useState(0)

  const ApiUrl = process.env.REACT_APP_API_URL || "https://matchmakingsprojectserver.onrender.com/api"

  const steps = ["פרטים אישיים", "אימות", "סיום"]

  useEffect(() => {
    if (userType === "matchmaker") {
      setValue("role", "MatchMaker") // הגדרת role אוטומטית
    }
  }, [userType, setValue])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      console.log("שולח נתוני הרשמה:", data)

      // שלב 1: הרשמה
      const registerResponse = await axios.post(`${ApiUrl}/Auth/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 שניות timeout
      })

      console.log("תגובת הרשמה:", registerResponse.data)

      // שלב 2: התחברות אוטומטית
      console.log("מנסה התחברות אוטומטית...")

      try {
        await login(data.username, data.password)
        console.log("התחברות אוטומטית הצליחה")

        setSuccessMessage("הרשמה והתחברות הושלמו בהצלחה! ✅")

        // הפניה לדף המתאים לאחר 1.5 שניות
        setTimeout(() => {
          if (data.role === "MatchMaker") {
            navigate("/matchmaker-auth/post-details-matchmaker")
          } else {
            navigate("/candidate-auth/post-details-auth")
          }
        }, 1500)
      } catch (loginError) {
        console.error("שגיאה בהתחברות אוטומטית:", loginError)
        setSuccessMessage("ההרשמה הושלמה בהצלחה! ✅")

        // אם ההתחברות האוטומטית נכשלה, הפנה לדף התחברות
        setTimeout(() => {
          if (data.role === "MatchMaker") {
            navigate("/matchmaker-auth/login/matchmaker")
          } else {
            navigate("/candidate-auth/login/candidate")
          }
        }, 2000)
      }
    } catch (err: any) {
      console.error("שגיאה בהרשמה:", err)

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const errorMessage = err.response?.data?.message || err.response?.data || "נתונים לא תקינים"
          setError(`שגיאה בהרשמה: ${errorMessage}`)
        } else if (err.response?.status === 409) {
          setError("משתמש עם כתובת מייל זו כבר קיים במערכת")
        } else if (err.response?.status === 500) {
          setError("שגיאת שרת. אנא נסו שוב מאוחר יותר")
        } else if (err.code === "ECONNABORTED") {
          setError("תם הזמן הקצוב לחיבור. אנא נסו שוב")
        } else {
          setError(`שגיאה בהרשמה: ${err.response?.status || err.code}`)
        }
      } else {
        setError("שגיאה לא צפויה. אנא נסו שוב או פנו לתמיכה")
      }
    } finally {
      setLoading(false)
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
      <Box>
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
              הרשמה {userType === "matchmaker" ? "כשדכן/ית" : "כמועמד/ת"}
            </Typography>

            <Typography
              variant="body1"
              align="center"
              sx={{
                mb: 4,
                color: colors.text + "90",
              }}
            >
              מלא/י את הפרטים הבאים כדי להירשם למערכת
            </Typography>

            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 4,
                "& .MuiStepLabel-root .Mui-completed": {
                  color: colors.primary,
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: colors.primary,
                },
                "& .MuiStepLabel-label": {
                  color: colors.text + "80",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: colors.primary,
                },
                "& .MuiStepConnector-line": {
                  borderColor: colors.primary + "40",
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register("firstName", { required: "שם פרטי הוא שדה חובה" })}
                label="שם פרטי"
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ""}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: colors.primary }} />
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
                  mb: 2,
                }}
              />

              <TextField
                {...register("lastName", { required: "שם משפחה הוא שדה חובה" })}
                label="שם משפחה"
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ""}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: colors.primary }} />
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
                  mb: 2,
                }}
              />

              <TextField
                {...register("username", {
                  required: "מייל הוא שדה חובה",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "כתובת מייל לא תקינה",
                  },
                })}
                label="מייל"
                type="email"
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ""}
                fullWidth
                margin="normal"
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
                  mb: 2,
                }}
              />

              <TextField
                {...register("password", {
                  required: "סיסמה היא שדה חובה",
                  minLength: {
                    value: 6,
                    message: "סיסמה חייבת להכיל לפחות 6 תווים",
                  },
                })}
                label="סיסמא"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                fullWidth
                margin="normal"
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
                  mb: 3,
                }}
              />

              {userType !== "matchmaker" && (
                <FormControl fullWidth margin="normal" error={!!errors.role} sx={{ mb: 3 }}>
                  <InputLabel id="role-label" sx={{ color: colors.text + "90" }}>
                    תפקיד
                  </InputLabel>
                  <Select
                    {...register("role", { required: "תפקיד הוא שדה חובה" })}
                    labelId="role-label"
                    label="תפקיד"
                    defaultValue="Male"
                    sx={{
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
                      "& .MuiSvgIcon-root": {
                        color: colors.primary,
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: "#222222",
                          color: colors.text,
                          "& .MuiMenuItem-root:hover": {
                            bgcolor: `${colors.primary}20`,
                          },
                          "& .MuiMenuItem-root.Mui-selected": {
                            bgcolor: `${colors.primary}30`,
                            "&:hover": {
                              bgcolor: `${colors.primary}40`,
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="Male" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Male sx={{ color: colors.primary }} /> זכר
                    </MenuItem>
                    <MenuItem value="Women" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Female sx={{ color: colors.primary }} /> נקבה
                    </MenuItem>
                  </Select>
                  {errors.role && <FormHelperText sx={{ color: "#f44336" }}>{errors.role.message}</FormHelperText>}
                </FormControl>
              )}

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !isValid}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <HowToReg />}
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
                    "&.Mui-disabled": {
                      background: `linear-gradient(45deg, ${colors.primaryDark}80 30%, ${colors.primary}80 90%)`,
                      color: colors.darkText + "80",
                    },
                  }}
                >
                  {loading ? "מעבד..." : "הרשמה"}
                </Button>
              </motion.div>
            </form>

            {error && (
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
                  {error}
                </Alert>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "rgba(76,175,80,0.1)",
                    color: "#4caf50",
                    borderRadius: "10px",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    border: "1px solid rgba(76,175,80,0.2)",
                  }}
                >
                  {successMessage}
                </Box>
              </motion.div>
            )}

            <Divider sx={{ my: 3, borderColor: colors.primary + "30" }}>
              <Typography variant="body2" sx={{ color: colors.text + "70", px: 1 }}>
                או
              </Typography>
            </Divider>

            <Box mt={1} textAlign="center">
              {userType === "matchmaker" ? (
                <Link
                  to="/matchmaker-auth/login/matchmaker"
                  style={{
                    color: colors.primary,
                    textDecoration: "none",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                >
                  יש לכם כבר חשבון אצלנו? לחצו למעבר לחשבון שלכם
                </Link>
              ) : (
                <Link
                  to="/candidate-auth/login/candidate"
                  style={{
                    color: colors.primary,
                    textDecoration: "none",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                >
                  יש לכם כבר חשבון אצלנו? לחצו למעבר לחשבון שלכם
                </Link>
              )}
            </Box>

            <Box mt={3} textAlign="center">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/")}
                sx={{
                  color: colors.text + "80",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: colors.primary,
                  },
                }}
              >
                חזרה לדף הבית
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  )
}
