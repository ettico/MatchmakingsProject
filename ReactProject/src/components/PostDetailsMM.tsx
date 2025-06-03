"use client"

import { useState, useEffect, useContext } from "react"
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
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)

  // שימוש ב-useContext לקבלת נתוני המשתמש
  const { user, token } = useContext(userContext)

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

  const ApiUrl = process.env.REACT_APP_API_URL || "https://matchmakingsprojectserver.onrender.com/api"

  // פונקציה לטעינת נתוני השדכנית מהשרת
  const fetchMatchmakerData = async () => {
    if (!user?.id || !token) {
      console.error("חסרים פרטי משתמש או טוקן לטעינת נתונים")
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
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

        // מעבר על כל השדות ומילוי הטופס
        Object.keys(serverData).forEach((key) => {
          if (serverData[key] !== null && serverData[key] !== undefined) {
            try {
              console.log(`מגדיר שדה ${key} לערך:`, serverData[key])
              setValue(key as any, serverData[key])
            } catch (setValueError) {
              console.error(`שגיאה בהגדרת שדה ${key}:`, setValueError)
            }
          }
        })

        setInitialDataLoaded(true)
        console.log("טעינת נתונים הושלמה בהצלחה")
      }
    } catch (apiError: any) {
      console.error("שגיאת API בטעינת נתוני שדכנית:", apiError)

      // אם לא נמצאה שדכנית, זה בסדר - זה יכול להיות משתמש חדש
      if (apiError.response?.status === 404) {
        console.log("לא נמצאו נתוני שדכנית - ייתכן שזה משתמש חדש")
        // מילוי שדות בסיסיים מנתוני המשתמש מהקונטקסט
        if (user) {
          setValue("matchmakerName", `${user.firstName} ${user.lastName}`)
          setValue("email", user.username)
        }
        setInitialDataLoaded(true)
      } else if (apiError.response?.status === 401) {
        setError("אין הרשאה לגשת לנתונים. אנא התחבר מחדש.")
      } else {
        setError("שגיאה בטעינת נתונים. אנא נסה שוב.")
      }
    } finally {
      setLoading(false)
    }
  }

  // שליחת הטופס
  const onSubmit = async (data: any) => {
    console.log("מתחיל שליחת נתוני שדכנית")

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
        yearsInShidduchim: data.yearsInShidduchim || 0,
        isInternalMatchmaker: data.isInternalMatchmaker || false,
        printingNotes: data.printingNotes || "",
        Role: user.role || "MatchMaker",
        FirstName: user.firstName || "",
        LastName: user.lastName || "",
        Username: user.username || "",
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

      // הסתרת הודעת ההצלחה אחרי 5 שניות
      setTimeout(() => {
        setSuccess(false)
      }, 5000)

    } catch (apiError: any) {
      console.error("שגיאת API בשליחת נתוני שדכנית:", apiError)

      let errorMessage = "שגיאה בעדכון נתונים. אנא נסה שנית."

      if (apiError.response?.data?.errors) {
        // הצגת שגיאות ולידציה מפורטות
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

  // טעינת נתונים בעת טעינת הקומפוננטה
  useEffect(() => {
    if (user && token && !initialDataLoaded) {
      fetchMatchmakerData()
    } else if (user && !initialDataLoaded) {
      // אם יש משתמש אבל אין נתונים בשרת, מלא את השדות הבסיסיים
      setValue("matchmakerName", `${user.firstName} ${user.lastName}`)
      setValue("email", user.username)
      setInitialDataLoaded(true)
    }
  }, [user, token, initialDataLoaded])

  // אם אין משתמש מחובר, הצג הודעה
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            אנא התחבר למערכת כדי לגשת לטופס השדכנית
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#333",
            mb: 4,
          }}
        >
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
                      error={!!errors.matchmakerName}
                      helperText={errors.matchmakerName?.message}
                      variant="outlined"
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
                      variant="outlined"
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
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
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
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>מגדר</InputLabel>
                      <Select {...field} label="מגדר">
                        <MenuItem value="female">נקבה</MenuItem>
                        <MenuItem value="male">זכר</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטי קשר ומגורים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטי קשר ומגורים
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
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      variant="outlined"
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
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                      variant="outlined"
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
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטים מקצועיים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטים מקצועיים
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
                      label="עיסוק"
                      fullWidth
                      variant="outlined"
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
                      variant="outlined"
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
                      multiline
                      rows={3}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* שדות נוספים */}
          <StyledPaper>
            <SectionTitle variant="h5">
              פרטים נוספים
              <FamilyRestroomIcon />
            </SectionTitle>
            <Grid container spacing={3}>
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

          {/* הערות */}
          <StyledPaper>
            <SectionTitle variant="h5">
              הערות
              <NoteIcon />
            </SectionTitle>
            <Controller
              name="printingNotes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="הערות להדפסה"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
              )}
            />
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
                disabled={loading || !isValid}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1976D2 30%, #0097A7 90%)",
                  },
                }}
              >
                {loading ? "שומר..." : "שמור פרטים"}
              </Button>
            </AnimatedButton>
          </Box>
        </form>

        {/* הודעות */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={5000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: "100%" }}>
            הפרטים נשמרו בהצלחה!
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  )
}

export default MatchMakerForm