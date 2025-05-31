"use client"

import { useState, useEffect } from "react"
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Box,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Container,
  FormControl,
  InputLabel,
  Select,
  // useTheme,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { motion } from "framer-motion"
// import { userContext } from "./UserContext"

// אייקונים
import PersonIcon from "@mui/icons-material/Person"
import WorkIcon from "@mui/icons-material/Work"
import SaveIcon from "@mui/icons-material/Save"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import NoteIcon from "@mui/icons-material/Note"
// import { Password } from "@mui/icons-material"

// הגדרת סכמת ולידציה באמצעות Yup
const schema = yup.object().shape({
  matchmakerName: yup.string().required("שם הוא שדה חובה"),
  idNumber: yup.string().required("מספר זהות הוא שדה חובה"),
  birthDate: yup.string().required("תאריך לידה הוא שדה חובה"),
  email: yup.string().email("כתובת אימייל לא תקינה").required("אימייל הוא שדה חובה"),
  gender: yup.string().required("מגדר הוא שדה חובה"),
  city: yup.string().required("עיר היא שדה חובה"),
  address: yup.string().required("כתובת היא שדה חובה"),
  mobilePhone: yup.string().required("טלפון נייד הוא שדה חובה"),
  landlinePhone: yup.string(),
  phoneType: yup.string(),
  personalClub: yup.string(),
  community: yup.string(),
  occupation: yup.string(),
  previousWorkplaces: yup.string(),
  isSeminarGraduate: yup.boolean(),
  hasChildrenInShidduchim: yup.boolean(),
  experienceInShidduchim: yup.string(),
  lifeSkills: yup.string(),
  yearsInShidduchim: yup.number().positive().integer(),
  isInternalMatchmaker: yup.boolean(),
  printingNotes: yup.string(),
})

// סטיילינג מותאם אישית
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
  "&:hover": {
    boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
    transform: "translateY(-4px)",
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  color: "#000000",
  "& svg": {
    marginLeft: theme.spacing(1),
    color: "#b87333",
  },
}))

const AnimatedButton = styled(motion.div)(({ theme }) => ({
  display: "inline-block",
  marginTop: theme.spacing(2),
}))

const MatchMakerForm = () => {
  // const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const { user } = useContext(userContext)
  const [userId, setUserId] = useState<number | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [, setInitialDataLoaded] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [userPassword, setUserPassword] = useState<string>("")
  const [, setUserName] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [, setUserRole] = useState<string>("MatchMaker")

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      gender: "female",
      isSeminarGraduate: false,
      hasChildrenInShidduchim: false,
      isInternalMatchmaker: false,
      yearsInShidduchim: 0,
    },
  })

    const ApiUrl=process.env.REACT_APP_API_URL
  // שינוי פונקציית decodeAndVerifyToken כדי לטפל בclaim המותאם אישית
  const decodeAndVerifyToken = (token: string) => {
    try {
      // פענוח בסיסי של הטוקן (ללא חתימה)
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )

      const payload = JSON.parse(jsonPayload)
      console.log("פענוח הטוקן:", payload)

      // בדיקת תוקף הטוקן
      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < currentTime) {
        console.error("הטוקן פג תוקף:", new Date(payload.exp * 1000))
        return null
      }

      // שליפת מזהה המשתמש מהclaim המותאם אישית
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]

      console.log("מזהה משתמש מהטוקן:", userId)
      console.log("תפקיד משתמש מהטוקן:", role)
      console.log("שם משתמש מהטוקן:", name)

      // הוספת המזהה והתפקיד לאובייקט שמוחזר
      return {
        ...payload,
        userId,
        role,
        name,
      }
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error)
      return null
    }
  }

  // שינוי בפונקציית loadUserData כדי להשתמש במזהה המשתמש מהטוקן
  const loadUserData = () => {
    try {
      console.log("מתחיל טעינת נתוני משתמש")

      // בדיקה ישירה אם יש נתוני משתמש בלוקל סטורג'
      const storedUserString = localStorage.getItem("user")
      console.log("נתוני משתמש מהלוקל סטורג' (גולמי):", storedUserString)

      if (!storedUserString) {
        console.error("לא נמצא מידע בלוקל סטורג'")
        setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
        return
      }

      // ניסיון לפרסר את הנתונים
      let userData
      try {
        userData = JSON.parse(storedUserString)
        console.log("נתוני משתמש לאחר פרסור:", userData)
      } catch (parseError) {
        console.error("שגיאה בפרסור נתוני משתמש:", parseError)
        setError("שגיאה בקריאת נתוני משתמש. אנא התחבר מחדש.")
        return
      }

      // פענוח הטוקן לקבלת מזהה המשתמש
      if (userData.token) {
        const decodedToken = decodeAndVerifyToken(userData.token)
        if (decodedToken && decodedToken.userId) {
          // שימוש במזהה מהטוקן אם הוא קיים
          const tokenUserId = Number(decodedToken.userId)
          console.log("מזהה משתמש מהטוקן:", tokenUserId)

          // שמירת שם המשתמש מהטוקן
          if (decodedToken.name) {
            setUserEmail(decodedToken.name)
            setUserName(decodedToken.name)
            console.log("שם משתמש מהטוקן:", decodedToken.name)
          }
          if(decodedToken.password){
            setUserPassword(decodedToken.password)
            console.log("סיסמא  מהטוקן:", decodedToken.password)
          }
          // שמירת התפקיד מהטוקן
          if (decodedToken.role) {
            setUserRole(decodedToken.role)
            console.log("תפקיד משתמש מהטוקן:", decodedToken.role)
          }

          // עדכון המזהה בנתוני המשתמש אם חסר
          if (!userData.id) {
            userData.id = tokenUserId
            console.log("עדכון מזהה משתמש מהטוקן:", tokenUserId)

            // עדכון הלוקל סטורג' עם המזהה החדש
            try {
              localStorage.setItem("user", JSON.stringify(userData))
              console.log("עדכון הלוקל סטורג' עם מזהה משתמש מהטוקן")
            } catch (storageError) {
              console.error("שגיאה בעדכון הלוקל סטורג':", storageError)
            }
          }
        }
      }

      // בדיקה שיש ID וטוקן
      if (!userData.id) {
        console.error("חסר מזהה משתמש בנתונים שנטענו")
        setError("חסר מזהה משתמש. אנא התחבר מחדש.")
        return
      }

      if (!userData.token) {
        console.error("חסר טוקן בנתונים שנטענו")
        setError("חסר טוקן הזדהות. אנא התחבר מחדש.")
        return
      }

      // שמירת נתוני המשתמש בסטייט
      setUserId(userData.id)
      setUserToken(userData.token)
      console.log("נשמר בסטייט - מזהה משתמש:", userData.id)
      console.log("נשמר בסטייט - טוקן:", userData.token.substring(0, 15) + "...")

      // מילוי הפרטים הבסיסיים מהלוקל סטורג'
      if (userData.matchmakerName) {
        setValue("matchmakerName", userData.matchmakerName)
        console.log("הוגדר שדה matchmakerName:", userData.matchmakerName)

        // ניסיון לחלץ שם פרטי ושם משפחה
        const nameParts = userData.matchmakerName.split(" ")
        if (nameParts.length >= 2) {
          setFirstName(nameParts[0])
          setLastName(nameParts.slice(1).join(" "))
        } else {
          setFirstName(userData.matchmakerName)
        }
      }

      if (userData.email) {
        setValue("email", userData.email)
        setUserEmail(userData.email)
        console.log("הוגדר שדה email:", userData.email)
      }
    
      if (userData.idNumber) {
        setValue("idNumber", userData.idNumber)
        console.log("הוגדר שדה idNumber:", userData.idNumber)
      }

      // טעינת נתוני השדכנית מהשרת
      console.log("מתחיל טעינת נתונים מהשרת")
      fetchMatchmakerData(userData.id, userData.token)
    } catch (err) {
      console.error("שגיאה כללית בטעינת נתוני משתמש:", err)
      setError("שגיאה בטעינת נתוני משתמש. אנא התחבר מחדש.")
    }
  }

  // פונקציה לטעינת נתוני השדכנית מהשרת
  const fetchMatchmakerData = async (id: number, token: string) => {
    if (!id || !token) {
      console.error("חסרים פרטי משתמש או טוקן לטעינת נתונים")
      return
    }

    setLoading(true)
    try {
      console.log("מנסה לטעון נתוני שדכנית עם ID:", id)
      console.log("משתמש בטוקן:", token.substring(0, 15) + "...")

      // בדיקה שהטוקן תקין לפני שליחת הבקשה
      if (!token.startsWith("ey")) {
        console.error("הטוקן אינו בפורמט JWT תקין")
        setError("טוקן הזדהות אינו תקין. אנא התחבר מחדש.")
        setLoading(false)
        return
      }

      try {
        const response = await axios({
          method: "get",
          url: `${ApiUrl}/MatchMaker/${id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 שניות טיים-אאוט
        })

        console.log("סטטוס תשובה מהשרת:", response.status)
        console.log("נתוני שדכנית שהתקבלו מהשרת:", response.data)

        // מילוי הטופס עם הנתונים שהתקבלו מהשרת
        if (response.data) {
          const serverData = response.data

          // מעבר על כל השדות ומילוי הטופס
          Object.keys(serverData).forEach((key) => {
            if (serverData[key] !== null && serverData[key] !== undefined) {
              try {
                console.log(`מגדיר שדה ${key} לערך:`, serverData[key])
                setValue(key as any, serverData[key])

                // שמירת שם פרטי ושם משפחה אם קיימים
                if (key === "matchmakerName") {
                  const nameParts = serverData[key].split(" ")
                  if (nameParts.length >= 2) {
                    setFirstName(nameParts[0])
                    setLastName(nameParts.slice(1).join(" "))
                  } else {
                    setFirstName(serverData[key])
                  }
                }

                // שמירת אימייל אם קיים
                if (key === "email") {
                  setUserEmail(serverData[key])
                  setUserName(serverData[key])
                }
              } catch (setValueError) {
                console.error(`שגיאה בהגדרת שדה ${key}:`, setValueError)
              }
            }
          })

          setInitialDataLoaded(true)
          console.log("טעינת נתונים הושלמה בהצלחה")
        }
      } catch (apiError: any) {
        console.error("שגיאת API בטעינת נתוני שדכנית:", apiError.message)
        console.error("סטטוס קוד:", apiError.response?.status)
        console.error("הודעת שגיאה:", apiError.response?.data)

        // אם לא נמצאה שדכנית, זה בסדר - זה יכול להיות משתמש חדש
        if (apiError.response?.status === 404) {
          console.log("לא נמצאו נתוני שדכנית - ייתכן שזה משתמש חדש")
          setInitialDataLoaded(true)
        } else if (apiError.response?.status === 401) {
          setError("אין הרשאה לגשת לנתונים. אנא התחבר מחדש.")
        } else {
          throw apiError // העבר את השגיאה הלאה לטיפול הכללי
        }
      }
    } catch (error: any) {
      console.error("שגיאה כללית בטעינת נתוני שדכנית:", error.message)
      setError("שגיאה בטעינת נתונים. אנא נסה שוב.")
    } finally {
      setLoading(false)
    }
  }

  // שליחת הטופס
  const onSubmit = async (data: any) => {
    console.log("מתחיל שליחת נתוני שדכנית")
    console.log("מזהה משתמש:", userId)
    console.log("טוקן:", userToken ? userToken.substring(0, 15) + "..." : "לא קיים")

    if (!userId || !userToken) {
      console.error("חסרים פרטי משתמש או טוקן לשליחת נתונים")
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // הכנת הנתונים לשליחה
      const dataToSend = {
        id: userId,
        matchmakerName: data.matchmakerName || "",
        idNumber: data.idNumber || "",
        birthDate: data.birthDate || "",
        email: data.email || "",
        gender: data.gender || "female",
        city: data.city || "",
        address: data.address || "",
        mobilePhone: data.mobilePhone || "",
        landlinePhone: data.landlinePhone || "",
        phoneType: data.phoneType || "",
        personalClub: data.personalClub || "",
        community: data.community || "",
        occupation: data.occupation || "",
        previousWorkplaces: data.previousWorkplaces || "",
        isSeminarGraduate: data.isSeminarGraduate || false,
        hasChildrenInShidduchim: data.hasChildrenInShidduchim || false,
        experienceInShidduchim: data.experienceInShidduchim || "",
        lifeSkills: data.lifeSkills || "",
        yearsInShidduchim: data.yearsInShidduchim || 0,
        isInternalMatchmaker: data.isInternalMatchmaker || false,
        printingNotes: data.printingNotes || "",
        // שדות נוספים שנדרשים לפי השגיאה
        Role: "MatchMaker",
        // UserRoles: [{ name: userRole || "MatchMaker" }],
        m: "MatchMaker", // הוספת שדה m שחסר לפי השגיאה
        FirstName: firstName || data.matchmakerName.split(" ")[0] || "",
        LastName:
          lastName ||
          (data.matchmakerName.split(" ").length > 1 ? data.matchmakerName.split(" ").slice(1).join(" ") : ""),
        Username: userEmail || data.email || "",
        Password:userPassword||data.password||""
      }

      console.log("שולח נתוני שדכנית:", dataToSend)
      console.log("כתובת API:", `${ApiUrl}/MatchMaker/${userId}`)

      try {
        const response = await axios({
          method: "put",
          url: `${ApiUrl}/MatchMaker/${userId}`,
          data: dataToSend,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          timeout: 15000, // 15 שניות טיים-אאוט
        })

        console.log("סטטוס תשובה מהשרת:", response.status)
        console.log("תשובה מהשרת:", response.data)

        // עדכון הלוקל סטורג' עם הנתונים החדשים
        try {
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            const updatedUserData = { ...userData, ...dataToSend }
            localStorage.setItem("user", JSON.stringify(updatedUserData))
            console.log("הלוקל סטורג' עודכן בהצלחה")
          }
        } catch (storageError) {
          console.error("שגיאה בעדכון הלוקל סטורג':", storageError)
        }

        setSuccess(true)
        console.log("נתונים נשמרו בהצלחה")

        // הסתרת הודעת ההצלחה אחרי 5 שניות
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } catch (apiError: any) {
        console.error("שגיאת API בשליחת נתוני שדכנית:", apiError.message)
        console.error("סטטוס קוד:", apiError.response?.status)
        console.error("הודעת שגיאה:", apiError.response?.data)

        // הצגת שגיאות ולידציה מפורטות
        if (apiError.response?.data?.errors) {
          console.log("שגיאות ולידציה:", apiError.response.data.errors)
          const errorMessages = []
          for (const field in apiError.response.data.errors) {
            errorMessages.push(`${field}: ${apiError.response.data.errors[field].join(", ")}`)
          }
          setError(`שגיאות ולידציה: ${errorMessages.join("; ")}`)
        } else {
          throw apiError // העבר את השגיאה הלאה לטיפול הכללי
        }
      }
    } catch (error: any) {
      console.error("שגיאה כללית בעדכון נתונים:", error)

      let errorMessage = "שגיאה בעדכון נתונים. אנא נסה שנית."

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.errors) {
        // אם יש שגיאות ולידציה
        const validationErrors = []
        for (const field in error.response.data.errors) {
          validationErrors.push(`${field}: ${error.response.data.errors[field].join(", ")}`)
        }
        errorMessage = validationErrors.join("; ")
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseError = () => {
    setError(null)
  }

  const handleCloseSuccess = () => {
    setSuccess(false)
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <Container maxWidth="lg" sx={{ direction: "rtl", py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StyledPaper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 4,
                color: "#000000",
                background: "linear-gradient(45deg, #000000, #b87333)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              השלמת פרטי שדכנית
            </Typography>

            {loading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", p: 5, flexDirection: "column", alignItems: "center" }}
              >
                <CircularProgress sx={{ color: "#b87333" }} />
                <Typography variant="h6" sx={{ mt: 2, color: "#000000" }}>
                  טוען נתונים...
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <StyledPaper sx={{ mb: 4 }}>
                    <SectionTitle variant="h6">
                      <PersonIcon /> פרטים אישיים
                    </SectionTitle>
                    <Divider sx={{ mb: 3, backgroundColor: "rgba(0,188,212,0.2)" }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="matchmakerName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="שם מלא"
                              fullWidth
                              error={!!errors.matchmakerName}
                              helperText={errors.matchmakerName?.message}
                              onChange={(e) => {
                                field.onChange(e)
                                // עדכון שם פרטי ושם משפחה
                                const nameParts = e.target.value.split(" ")
                                if (nameParts.length >= 2) {
                                  setFirstName(nameParts[0])
                                  setLastName(nameParts.slice(1).join(" "))
                                } else {
                                  setFirstName(e.target.value)
                                  setLastName("")
                                }
                              }}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="idNumber"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="מספר זהות"
                              fullWidth
                              error={!!errors.idNumber}
                              helperText={errors.idNumber?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="birthDate"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="תאריך לידה"
                              type="date"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.birthDate}
                              helperText={errors.birthDate?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="אימייל"
                              fullWidth
                              error={!!errors.email}
                              helperText={errors.email?.message}
                              onChange={(e) => {
                                field.onChange(e)
                                setUserEmail(e.target.value)
                                setUserName(e.target.value)
                              }}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.gender}>
                              <InputLabel id="gender-label">מגדר</InputLabel>
                              <Select
                                {...field}
                                labelId="gender-label"
                                label="מגדר"
                                sx={{
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: field.value ? "#b87333" : "rgba(0, 0, 0, 0.23)",
                                  },
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      maxHeight: 300,
                                      "& .MuiMenuItem-root": {
                                        transition: "all 0.2s",
                                        "&:hover": {
                                          backgroundColor: "rgba(0,188,212,0.1)",
                                        },
                                        "&.Mui-selected": {
                                          backgroundColor: "rgba(0,188,212,0.2)",
                                          "&:hover": {
                                            backgroundColor: "rgba(0,188,212,0.3)",
                                          },
                                        },
                                      },
                                    },
                                  },
                                }}
                              >
                                <MenuItem value="male">זכר</MenuItem>
                                <MenuItem value="female">נקבה</MenuItem>
                              </Select>
                              {errors.gender && (
                                <Typography variant="caption" color="error">
                                  {errors.gender.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </StyledPaper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <StyledPaper sx={{ mb: 4 }}>
                    <SectionTitle variant="h6">
                      <LocationOnIcon /> פרטי מגורים והתקשרות
                    </SectionTitle>
                    <Divider sx={{ mb: 3, backgroundColor: "rgba(0,188,212,0.2)" }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="city"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="עיר"
                              fullWidth
                              error={!!errors.city}
                              helperText={errors.city?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="address"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="כתובת"
                              fullWidth
                              error={!!errors.address}
                              helperText={errors.address?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Controller
                          name="mobilePhone"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="טלפון נייד"
                              fullWidth
                              error={!!errors.mobilePhone}
                              helperText={errors.mobilePhone?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Controller
                          name="landlinePhone"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="טלפון קווי"
                              fullWidth
                              error={!!errors.landlinePhone}
                              helperText={errors.landlinePhone?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Controller
                          name="phoneType"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="סוג טלפון"
                              fullWidth
                              error={!!errors.phoneType}
                              helperText={errors.phoneType?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </StyledPaper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <StyledPaper sx={{ mb: 4 }}>
                    <SectionTitle variant="h6">
                      <FamilyRestroomIcon /> פרטים קהילתיים
                    </SectionTitle>
                    <Divider sx={{ mb: 3, backgroundColor: "rgba(0,188,212,0.2)" }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="personalClub"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="חוג אישי"
                              fullWidth
                              error={!!errors.personalClub}
                              helperText={errors.personalClub?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="community"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="קהילה"
                              fullWidth
                              error={!!errors.community}
                              helperText={errors.community?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="isSeminarGraduate"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  sx={{
                                    color: "#b87333",
                                    "&.Mui-checked": {
                                      color: "#b87333",
                                      transform: "scale(1.1)",
                                      transition: "transform 0.2s",
                                    },
                                  }}
                                />
                              }
                              label="בוגר/ת סמינר"
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="hasChildrenInShidduchim"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  sx={{
                                    color: "#b87333",
                                    "&.Mui-checked": {
                                      color: "#b87333",
                                      transform: "scale(1.1)",
                                      transition: "transform 0.2s",
                                    },
                                  }}
                                />
                              }
                              label="יש ילדים בשידוכים"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </StyledPaper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <StyledPaper sx={{ mb: 4 }}>
                    <SectionTitle variant="h6">
                      <WorkIcon /> עיסוק וניסיון
                    </SectionTitle>
                    <Divider sx={{ mb: 3, backgroundColor: "rgba(0,188,212,0.2)" }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="occupation"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="עיסוק"
                              fullWidth
                              error={!!errors.occupation}
                              helperText={errors.occupation?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="previousWorkplaces"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="מקומות עבודה קודמים"
                              fullWidth
                              error={!!errors.previousWorkplaces}
                              helperText={errors.previousWorkplaces?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Controller
                          name="experienceInShidduchim"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="ניסיון בשידוכים"
                              fullWidth
                              multiline
                              rows={3}
                              error={!!errors.experienceInShidduchim}
                              helperText={errors.experienceInShidduchim?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="lifeSkills"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="כישורי חיים"
                              fullWidth
                              error={!!errors.lifeSkills}
                              helperText={errors.lifeSkills?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="yearsInShidduchim"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="שנות ניסיון בשידוכים"
                              type="number"
                              fullWidth
                              error={!!errors.yearsInShidduchim}
                              helperText={errors.yearsInShidduchim?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="isInternalMatchmaker"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  sx={{
                                    color: "#b87333",
                                    "&.Mui-checked": {
                                      color: "#b87333",
                                      transform: "scale(1.1)",
                                      transition: "transform 0.2s",
                                    },
                                  }}
                                />
                              }
                              label="שדכן/ית פנימי/ת"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </StyledPaper>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <StyledPaper sx={{ mb: 4 }}>
                    <SectionTitle variant="h6">
                      <NoteIcon /> הערות נוספות
                    </SectionTitle>
                    <Divider sx={{ mb: 3, backgroundColor: "rgba(0,188,212,0.2)" }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Controller
                          name="printingNotes"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="הערות להדפסה"
                              fullWidth
                              multiline
                              rows={4}
                              error={!!errors.printingNotes}
                              helperText={errors.printingNotes?.message}
                              InputProps={{
                                sx: {
                                  borderRadius: 2,
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    boxShadow: "0 0 0 1px rgba(0,188,212,0.5)",
                                  },
                                  "&.Mui-focused": {
                                    boxShadow: `0 0 0 2px #b87333`,
                                  },
                                },
                              }}
                              sx={{
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#000000",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#b87333",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </StyledPaper>
                </motion.div>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SaveIcon />}
                      disabled={loading || !isValid}
                      sx={{
                        padding: "12px 36px",
                        borderRadius: "30px",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        background: "linear-gradient(45deg, #000000 30%, #b87333 90%)",
                        color: "white",
                        "&:hover": {
                          boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
                          background: "linear-gradient(45deg, #000000 20%, #b87333 100%)",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "שמור שינויים"}
                    </Button>
                  </AnimatedButton>
                  <Tooltip title="כל השדות המסומנים כחובה חייבים להיות מלאים כדי לשמור">
                    <IconButton sx={{ ml: 1, color: "#b87333" }}>
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </form>
            )}
          </Box>
        </StyledPaper>
      </motion.div>

      {/* הודעות הצלחה/שגיאה */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,21,43,0.2)",
            borderRadius: "10px",
            "& .MuiAlert-icon": {
              color: "#b87333",
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            הנתונים נשמרו בהצלחה!
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,21,43,0.2)",
            borderRadius: "10px",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {error}
          </Typography>
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default MatchMakerForm
