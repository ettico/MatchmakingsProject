"use client"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
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
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { motion } from "framer-motion"
import { userContext } from "./UserContext"

// אייקונים
import PersonIcon from "@mui/icons-material/Person"
import WorkIcon from "@mui/icons-material/Work"
import SaveIcon from "@mui/icons-material/Save"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import NoteIcon from "@mui/icons-material/Note"

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
  yearsInShidduchim: yup.number().min(0).integer(),
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
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isNewMatchmaker, setIsNewMatchmaker] = useState(true) // ברירת מחדל - משתמש חדש
  const [existingData, setExistingData] = useState<any>(null)

  // שימוש ב-useContext
  const { user, token } = useContext(userContext)

  const {
    handleSubmit,
    control,
    // setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      matchmakerName: "",
      idNumber: "",
      birthDate: "",
      email: "",
      gender: "female",
      city: "",
      address: "",
      mobilePhone: "",
      landlinePhone: "",
      phoneType: "",
      personalClub: "",
      community: "",
      occupation: "",
      previousWorkplaces: "",
      isSeminarGraduate: false,
      hasChildrenInShidduchim: false,
      experienceInShidduchim: "",
      lifeSkills: "",
      yearsInShidduchim: 0,
      isInternalMatchmaker: false,
      printingNotes: "",
    },
  })

  // API URL
  const ApiUrl = "https://matchmakingsprojectserver.onrender.com/api"

  // פונקציה לקבלת headers עם אימות
  const getAuthHeaders = () => {
    if (!token) {
      throw new Error("אין טוקן אימות")
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  }

  // פונקציה לטעינת נתוני השדכנית מהשרת - מתוקנת לחלוטין
  const fetchMatchmakerData = async () => {
    if (!user?.id || !token) {
      console.log("חסרים פרטי משתמש או טוקן - מתחיל כמשתמש חדש")
      loadBasicUserData()
      setInitialLoading(false)
      return
    }

    console.log("מנסה לטעון נתוני שדכנית עם ID:", user.id)
    console.log("טוקן:", token.substring(0, 20) + "...")

    try {
      const headers = getAuthHeaders()
      console.log("Headers:", headers)

      // ניסיון ראשון - טעינה מ-MatchMaker endpoint
      console.log("מנסה לטעון מ-MatchMaker endpoint...")
      const response = await axios.get(`${ApiUrl}/MatchMaker/${user.id}`, {
        headers,
        timeout: 15000,
      })

      console.log("✅ נתוני שדכנית נטענו בהצלחה:", response.data)

      if (response.data) {
        setIsNewMatchmaker(false)
        setExistingData(response.data)
        await populateFormWithData(response.data)
        console.log("✅ טופס מולא בנתונים קיימים")
      } else {
        console.log("⚠️ לא התקבלו נתונים מהשרת")
        loadBasicUserData()
      }
    } catch (error: any) {
      console.log("❌ שגיאה בטעינת נתוני שדכנית:", error)

      if (axios.isAxiosError(error)) {
        console.log("סטטוס שגיאה:", error.response?.status)
        console.log("הודעת שגיאה:", error.response?.data)

        if (error.response?.status === 404) {
          console.log("✅ שדכנית לא נמצאה - זה משתמש חדש")
          setIsNewMatchmaker(true)
          loadBasicUserData()
        } else if (error.response?.status === 401) {
          console.log("❌ שגיאת הרשאה")
          setError("אין הרשאה לגשת לנתונים. אנא התחבר מחדש.")
          loadBasicUserData()
        } else {
          console.log("❌ שגיאה אחרת:", error.response?.status)
          setError(`שגיאה בטעינת נתונים: ${error.response?.status}`)
          loadBasicUserData()
        }
      } else {
        console.log("❌ שגיאה כללית:", error.message)
        setError("שגיאה בחיבור לשרת")
        loadBasicUserData()
      }
    } finally {
      setInitialLoading(false)
    }
  }

  // פונקציה למילוי הטופס עם נתונים קיימים
  const populateFormWithData = async (serverData: any) => {
    console.log("ממלא טופס עם נתונים:", serverData)

    // המרת תאריך לפורמט נכון
    let formattedBirthDate = ""
    if (serverData.birthDate) {
      try {
        const date = new Date(serverData.birthDate)
        if (!isNaN(date.getTime())) {
          formattedBirthDate = date.toISOString().split("T")[0]
        }
      } catch (dateError) {
        console.warn("שגיאה בהמרת תאריך:", dateError)
      }
    }

    // הכנת נתונים לטופס
    const formData = {
      matchmakerName:
        serverData.matchmakerName ||
        serverData.MatchmakerName ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      idNumber: serverData.idNumber || serverData.IdNumber || "",
      birthDate: formattedBirthDate,
      email: serverData.email || serverData.Email || user?.username || "",
      gender: serverData.gender || serverData.Gender || "female",
      city: serverData.city || serverData.City || "",
      address: serverData.address || serverData.Address || "",
      mobilePhone: serverData.mobilePhone || serverData.MobilePhone || "",
      landlinePhone: serverData.landlinePhone || serverData.LandlinePhone || "",
      phoneType: serverData.phoneType || serverData.PhoneType || "",
      personalClub: serverData.personalClub || serverData.PersonalClub || "",
      community: serverData.community || serverData.Community || "",
      occupation: serverData.occupation || serverData.Occupation || "",
      previousWorkplaces: serverData.previousWorkplaces || serverData.PreviousWorkplaces || "",
      isSeminarGraduate: Boolean(serverData.isSeminarGraduate || serverData.IsSeminarGraduate),
      hasChildrenInShidduchim: Boolean(serverData.hasChildrenInShidduchim || serverData.HasChildrenInShidduchim),
      experienceInShidduchim: serverData.experienceInShidduchim || serverData.ExperienceInShidduchim || "",
      lifeSkills: serverData.lifeSkills || serverData.LifeSkills || "",
      yearsInShidduchim: Number(serverData.yearsInShidduchim || serverData.YearsInShidduchim) || 0,
      isInternalMatchmaker: Boolean(serverData.isInternalMatchmaker || serverData.IsInternalMatchmaker),
      printingNotes: serverData.printingNotes || serverData.PrintingNotes || "",
    }

    console.log("נתוני טופס מוכנים:", formData)
    reset(formData)
  }

  // פונקציה לטעינת נתונים בסיסיים מה-context
  const loadBasicUserData = () => {
    console.log("טוען נתונים בסיסיים מה-context:", user)

    if (!user) {
      console.log("אין נתוני משתמש ב-context")
      return
    }

    const basicData = {
      matchmakerName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.username || "",
      gender: "female",
      idNumber: "",
      birthDate: "",
      city: "",
      address: "",
      mobilePhone: "",
      landlinePhone: "",
      phoneType: "",
      personalClub: "",
      community: "",
      occupation: "",
      previousWorkplaces: "",
      isSeminarGraduate: false,
      hasChildrenInShidduchim: false,
      experienceInShidduchim: "",
      lifeSkills: "",
      yearsInShidduchim: 0,
      isInternalMatchmaker: false,
      printingNotes: "",
    }

    console.log("נתונים בסיסיים:", basicData)
    reset(basicData)
  }

  // שליחת הטופס - מתוקנת
  const onSubmit = async (data: any) => {
    console.log("🚀 מתחיל שליחת נתוני שדכנית", data)

    if (!user?.id || !token) {
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const headers = getAuthHeaders()

      // הכנת הנתונים לשליחה
      const dataToSend = {
        id: user.id,
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
        isSeminarGraduate: Boolean(data.isSeminarGraduate),
        hasChildrenInShidduchim: Boolean(data.hasChildrenInShidduchim),
        experienceInShidduchim: data.experienceInShidduchim || "",
        lifeSkills: data.lifeSkills || "",
        yearsInShidduchim: Number(data.yearsInShidduchim) || 0,
        isInternalMatchmaker: Boolean(data.isInternalMatchmaker),
        printingNotes: data.printingNotes || "",
        // שדות נוספים נדרשים
        Role: user.role || "MatchMaker",
        FirstName: user.firstName || "",
        LastName: user.lastName || "",
        Username: user.username || data.email || "",
        Password: existingData?.password  || "defaultPassword123", // סיסמא זמנית
      }

      console.log("📤 שולח נתוני שדכנית:", dataToSend)

      let response
      if (isNewMatchmaker) {
        console.log("🆕 יוצר שדכנית חדשה")
        response = await axios.post(`${ApiUrl}/MatchMaker`, dataToSend, {
          headers,
          timeout: 20000,
        })
      } else {
        console.log("🔄 מעדכן שדכנית קיימת")
        response = await axios.put(`${ApiUrl}/MatchMaker/${user.id}`, dataToSend, {
          headers,
          timeout: 20000,
        })
      }

      console.log("✅ נתונים נשמרו בהצלחה:", response.data)
      setSuccess(true)
      setIsNewMatchmaker(false)
      setExistingData(response.data)

      // הסתרת הודעת ההצלחה אחרי 3 שניות ומעבר לעמוד השדכניות
      setTimeout(() => {
        setSuccess(false)
        navigate("/matchmakers")
      }, 3000)
    } catch (apiError: any) {
      console.error("❌ שגיאת API בשליחת נתוני שדכנית:", apiError)

      let errorMessage = "שגיאה בעדכון נתונים. אנא נסה שנית."

      if (axios.isAxiosError(apiError)) {
        console.log("פרטי שגיאה:", {
          status: apiError.response?.status,
          data: apiError.response?.data,
          message: apiError.message,
        })

        if (apiError.response?.data?.errors) {
          const errorMessages = []
          for (const field in apiError.response.data.errors) {
            errorMessages.push(`${field}: ${apiError.response.data.errors[field].join(", ")}`)
          }
          errorMessage = `שגיאות ולידציה: ${errorMessages.join("; ")}`
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message
        } else if (apiError.response?.status === 401) {
          errorMessage = "אין הרשאה לבצע פעולה זו. אנא התחבר מחדש."
        } else if (apiError.response?.status === 400) {
          errorMessage = "נתונים לא תקינים. אנא בדוק את הפרטים ונסה שוב."
        } else if (apiError.response?.status === 500) {
          errorMessage = "שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר."
        } else if (apiError.code === "ECONNABORTED") {
          errorMessage = "תם הזמן הקצוב לחיבור. אנא נסה שוב."
        } else if (apiError.code === "ERR_NETWORK") {
          errorMessage = "שגיאת רשת. אנא בדוק את החיבור לאינטרנט."
        }
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

  // useEffect לטעינת נתונים כשהמשתמש או הטוקן משתנים
  useEffect(() => {
    console.log("🔄 useEffect - user:", user?.id, "token:", !!token)

    if (user && token) {
      fetchMatchmakerData()
    } else {
      console.log("⚠️ אין משתמש או טוקן - טוען נתונים בסיסיים")
      loadBasicUserData()
      setInitialLoading(false)
    }
  }, [user, token])

  // אם אין משתמש או טוקן, הצג הודעה
  if (!user || !token) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">אנא התחבר למערכת כדי לגשת לטופס השדכנית</Alert>
      </Container>
    )
  }

  // אם עדיין טוען נתונים ראשוניים
  if (initialLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress size={60} sx={{ color: "#b87333" }} />
          <Typography variant="h6" color="text.secondary">
            טוען נתוני שדכנית...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: "center", mb: 4, color: "#333" }}>
          {isNewMatchmaker ? "טופס רישום שדכנית חדשה" : "עדכון פרטי שדכנית"}
        </Typography>

        {/* הודעת מצב */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Alert severity={isNewMatchmaker ? "info" : "success"} sx={{ display: "inline-flex" }}>
            {isNewMatchmaker
              ? "🆕 זהו פרופיל חדש - אנא מלא את כל הפרטים הנדרשים"
              : "✅ נטענו פרטים קיימים - ניתן לעדכן לפי הצורך"}
          </Alert>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* פרטים אישיים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטים אישיים
              <PersonIcon />
            </SectionTitle>
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
                      variant="outlined"
                      error={!!errors.matchmakerName}
                      helperText={errors.matchmakerName?.message}
                      sx={{ mb: 2 }}
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
                      label="מספר תעודת זהות"
                      fullWidth
                      variant="outlined"
                      error={!!errors.idNumber}
                      helperText={errors.idNumber?.message}
                      sx={{ mb: 2 }}
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
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
                      sx={{ mb: 2 }}
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
                      label="כתובת אימייל"
                      type="email"
                      fullWidth
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel>מגדר</InputLabel>
                      <Select {...field} label="מגדר" error={!!errors.gender}>
                        <MenuItem value="male">זכר</MenuItem>
                        <MenuItem value="female">נקבה</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטי מגורים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטי מגורים
              <LocationOnIcon />
            </SectionTitle>
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
                      variant="outlined"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      sx={{ mb: 2 }}
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
                      label="כתובת מלאה"
                      fullWidth
                      variant="outlined"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטי קשר */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטי קשר
              <PersonIcon />
            </SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="mobilePhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="טלפון נייד"
                      fullWidth
                      variant="outlined"
                      error={!!errors.mobilePhone}
                      helperText={errors.mobilePhone?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="landlinePhone"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="טלפון קווי" fullWidth variant="outlined" sx={{ mb: 2 }} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="phoneType"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="סוג טלפון" fullWidth variant="outlined" sx={{ mb: 2 }} />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטים נוספים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטים נוספים
              <FamilyRestroomIcon />
            </SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="personalClub"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="מועדון אישי" fullWidth variant="outlined" sx={{ mb: 2 }} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="community"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="קהילה" fullWidth variant="outlined" sx={{ mb: 2 }} />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="isSeminarGraduate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="בוגרת סמינר" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="hasChildrenInShidduchim"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="יש ילדים בשידוכים"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="isInternalMatchmaker"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="שדכנית פנימית" />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטי עבודה */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטי עבודה
              <WorkIcon />
            </SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="מקצוע" fullWidth variant="outlined" sx={{ mb: 2 }} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="previousWorkplaces"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="מקומות עבודה קודמים" fullWidth variant="outlined" sx={{ mb: 2 }} />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* ניסיון בשידוכים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              ניסיון בשידוכים
              <FamilyRestroomIcon />
            </SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="yearsInShidduchim"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="שנים בשידוכים"
                      type="number"
                      fullWidth
                      variant="outlined"
                      inputProps={{ min: 0 }}
                      sx={{ mb: 2 }}
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
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="lifeSkills"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="כישורי חיים"
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* הערות */}
          <StyledPaper>
            <SectionTitle variant="h5">
              הערות
              <NoteIcon />
            </SectionTitle>
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
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* כפתור שמירה */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  background: "linear-gradient(45deg, #b87333 30%, #d4af37 90%)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    background: "linear-gradient(45deg, #a0651f 30%, #b8941f 90%)",
                  },
                }}
              >
                {loading ? "שומר..." : isNewMatchmaker ? "צור פרופיל שדכנית" : "עדכן פרטים"}
              </Button>
            </AnimatedButton>
          </Box>
        </form>

        {/* הודעת הצלחה */}
        <Snackbar open={success} autoHideDuration={3000} onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: "100%" }}>
            {isNewMatchmaker
              ? "פרופיל השדכנית נוצר בהצלחה! מעביר לעמוד השדכניות..."
              : "הפרטים נשמרו בהצלחה! מעביר לעמוד השדכניות..."}
          </Alert>
        </Snackbar>

        {/* הודעת שגיאה */}
        <Snackbar open={!!error} autoHideDuration={8000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  )
}

export default MatchMakerForm