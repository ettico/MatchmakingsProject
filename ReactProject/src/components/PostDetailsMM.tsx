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
  // Divider,
  CircularProgress,
  Snackbar,
  Alert,
  // IconButton,
  // Tooltip,
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
// import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import NoteIcon from "@mui/icons-material/Note"

// הגדרת סכמת ולידציה באמצעות Yup - עדכון עם שדות לא חובה
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
  const navigate = useNavigate() // נוספה ניווט
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setInitialDataLoaded] = useState(false)
  const [serverPassword, setServerPassword] = useState<string | null>(null) // לשמירת הסיסמא מהשרת
  
  // שימוש ב-useContext במקום localStorage
  const { user, token } = useContext(userContext)

  const {
    handleSubmit,
    control,
    setValue,
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

  const ApiUrl = process.env.REACT_APP_API_URL 

  // טעינת נתוני המשתמש הבסיסיים מה-context
  const loadInitialUserData = () => {
    if (!user) {
      console.error("לא נמצא משתמש בcontext")
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
      return
    }

    console.log("טוען נתוני משתמש מהcontext:", user)

    // מילוי הפרטים הבסיסיים מה-context
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim()
    if (fullName) {
      setValue("matchmakerName", fullName)
      console.log("הוגדר שדה matchmakerName:", fullName)
    }

    if (user.username) {
      setValue("email", user.username)
      console.log("הוגדר שדה email:", user.username)
    }

    // טעינת נתוני השדכנית מהשרת
    fetchMatchmakerData()
  }

  // פונקציה לטעינת נתוני השדכנית מהשרת
  const fetchMatchmakerData = async () => {
    if (!user?.id || !token) {
      console.error("חסרים פרטי משתמש או טוקן לטעינת נתונים")
      setError("חסרים פרטי משתמש או טוקן. אנא התחבר מחדש.")
      setInitialDataLoaded(true) // מאפשר לטופס לעבוד גם בלי נתונים מהשרת
      return
    }

    setLoading(true)
    try {
      console.log("מנסה לטעון נתוני שדכנית עם ID:", user.id)

      const response = await axios({
        method: "get",
        url: `${ApiUrl}/MatchMaker/${user.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      })

      console.log("נתוני שדכנית שהתקבלו מהשרת:", response.data)

      // מילוי הטופס עם הנתונים שהתקבלו מהשרת
      if (response.data) {
        const serverData = response.data

        // שמירת הסיסמא מהשרת
        if (serverData.password) {
          setServerPassword(serverData.password)
          console.log("נשמרה סיסמא מהשרת")
        }

        // איפוס הטופס עם הנתונים החדשים
        const formData = {
          matchmakerName: serverData.matchmakerName || "",
          idNumber: serverData.idNumber || "",
          birthDate: serverData.birthDate || "",
          email: serverData.email || user.username || "",
          gender: serverData.gender || "female",
          city: serverData.city || "",
          address: serverData.address || "",
          mobilePhone: serverData.mobilePhone || "",
          landlinePhone: serverData.landlinePhone || "",
          phoneType: serverData.phoneType || "",
          personalClub: serverData.personalClub || "",
          community: serverData.community || "",
          occupation: serverData.occupation || "",
          previousWorkplaces: serverData.previousWorkplaces || "",
          isSeminarGraduate: serverData.isSeminarGraduate || false,
          hasChildrenInShidduchim: serverData.hasChildrenInShidduchim || false,
          experienceInShidduchim: serverData.experienceInShidduchim || "",
          lifeSkills: serverData.lifeSkills || "",
          yearsInShidduchim: serverData.yearsInShidduchim || 0,
          isInternalMatchmaker: serverData.isInternalMatchmaker || false,
          printingNotes: serverData.printingNotes || "",
        }

        reset(formData)
        setInitialDataLoaded(true)
        console.log("טעינת נתונים הושלמה בהצלחה")
      }
    } catch (apiError: any) {
      console.error("שגיאת API בטעינת נתוני שדכנית:", apiError)

      // אם לא נמצאה שדכנית, זה בסדר - זה יכול להיות משתמש חדש
      if (apiError.response?.status === 404) {
        console.log("לא נמצאו נתוני שדכנית - ייתכן שזה משתמש חדש")
        setInitialDataLoaded(true)
      } else if (apiError.response?.status === 401) {
        setError("אין הרשאה לגשת לנתונים. אנא התחבר מחדש.")
        setInitialDataLoaded(true)
      } else {
        setError("שגיאה בטעינת נתונים. אנא נסה שוב.")
        setInitialDataLoaded(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // שליחת הטופס
  const onSubmit = async (data: any) => {
    console.log("מתחיל שליחת נתוני שדכנית", data)

    if (!user?.id || !token) {
      console.error("חסרים פרטי משתמש או טוקן לשליחת נתונים")
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
      return
    }

    setLoading(true)
    setError(null)

    try {
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
        isSeminarGraduate: data.isSeminarGraduate || false,
        hasChildrenInShidduchim: data.hasChildrenInShidduchim || false,
        experienceInShidduchim: data.experienceInShidduchim || "",
        lifeSkills: data.lifeSkills || "",
        yearsInShidduchim: Number(data.yearsInShidduchim) || 0,
        isInternalMatchmaker: data.isInternalMatchmaker || false,
        printingNotes: data.printingNotes || "",
        // שדות נוספים
        Role: user.role || "MatchMaker",
        FirstName: user.firstName || "",
        LastName: user.lastName || "",
        Username: user.username || data.email || "",
        Password: serverPassword || "", // שימוש בסיסמא מהשרת
      }

      console.log("שולח נתוני שדכנית:", dataToSend)

      const response = await axios({
        method: "put",
        url: `${ApiUrl}/MatchMaker/${user.id}`,
        data: dataToSend,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000,
      })

      console.log("נתונים נשמרו בהצלחה:", response.data)
      setSuccess(true)

      // הסתרת הודעת ההצלחה אחרי 2 שניות ומעבר לעמוד השדכניות
      setTimeout(() => {
        setSuccess(false)
        navigate("/matchmakers") // מעבר לעמוד השדכניות הכללי
      }, 2000)

    } catch (apiError: any) {
      console.error("שגיאת API בשליחת נתוני שדכנית:", apiError)

      let errorMessage = "שגיאה בעדכון נתונים. אנא נסה שנית."

      if (apiError.response?.data?.errors) {
        const errorMessages = []
        for (const field in apiError.response.data.errors) {
          errorMessages.push(`${field}: ${apiError.response.data.errors[field].join(", ")}`)
        }
        errorMessage = `שגיאות ולידציה: ${errorMessages.join("; ")}`
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message
      } else if (apiError.message) {
        errorMessage = apiError.message
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
    if (user && token) {
      loadInitialUserData()
    } else {
      setInitialDataLoaded(true) // מאפשר לטופס לעבוד גם בלי משתמש
    }
  }, [user, token])

  // אם אין משתמש או טוקן, הצג הודעה
  if (!user || !token) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          אנא התחבר למערכת כדי לגשת לטופס השדכנית
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: "center", mb: 4, color: "#333" }}>
          טופס פרטי שדכנית
        </Typography>

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
                    <TextField
                      {...field}
                      label="טלפון קווי"
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="phoneType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="סוג טלפון"
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
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
                    <TextField
                      {...field}
                      label="מועדון אישי"
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
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
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="isSeminarGraduate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="בוגרת סמינר"
                    />
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
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="שדכנית פנימית"
                    />
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
                    <TextField
                      {...field}
                      label="מקצוע"
                      fullWidth
                      variant="outlined"
                      sx={{ mb: 2 }}
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
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
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
            <AnimatedButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
                {loading ? "שומר..." : "שמור פרטים"}
              </Button>
            </AnimatedButton>
          </Box>
        </form>

        {/* הודעת הצלחה */}
        <Snackbar open={success} autoHideDuration={2000} onClose={handleCloseSuccess}>
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: "100%" }}>
            הפרטים נשמרו בהצלחה! מעביר לעמוד השדכניות...
          </Alert>
        </Snackbar>

        {/* הודעת שגיאה */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  )
}

export default MatchMakerForm