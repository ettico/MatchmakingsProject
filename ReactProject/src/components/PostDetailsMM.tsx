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
// import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
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
  const [submitLoading, setSubmitLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  
  // שימוש ב-useContext במקום localStorage
  const { user, token } = useContext(userContext)

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
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

  const ApiUrl = process.env.REACT_APP_API_URL || "https://matchmakingsprojectserver.onrender.com/api"

  // מעקב אחר שינויים בטופס
  const formData = watch()

  // פונקציה לטיפול בשגיאות
  const handleApiError = (error:any, context:any) => {
    console.error(`שגיאה ב${context}:`, error)
    
    if (error.code === 'ERR_NETWORK') {
      setError('בעיית רשת. אנא בדוק את החיבור לאינטרנט ונסה שנית.')
    } else if (error.response?.status === 500) {
      setError('שגיאת שרת פנימית. אנא נסה מאוחר יותר.')
    } else if (error.response?.status === 404) {
      if (context === 'טעינת נתוני שדכנית') {
        console.log('לא נמצאו נתוני שדכנית - משתמש חדש')
        setInitialDataLoaded(true)
      } else {
        setError('הנתונים לא נמצאו.')
      }
    } else if (error.response?.status === 401) {
      setError('אין הרשאה. אנא התחבר מחדש.')
    } else if (error.response?.status === 400) {
      setError('נתונים לא תקינים. אנא בדוק את הפרטים.')
    } else {
      setError(`שגיאה ב${context}. אנא נסה שוב.`)
    }
  }

  // טעינת נתוני המשתמש הבסיסיים מה-context
  const loadInitialUserData = () => {
    if (!user) {
      console.error("לא נמצא משתמש בcontext")
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
      return
    }

    console.log("טוען נתוני משתמש מהcontext:", user)

    // מילוי הפרטים הבסיסיים מה-context
    const fullName = `${user.firstName} ${user.lastName}`.trim()
    if (fullName && fullName !== " ") {
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
      return
    }

    setLoading(true)
    setError("")
    
    try {
      console.log("מנסה לטעון נתוני שדכנית עם ID:", user.id)

      const response = await axios({
        method: "get",
        url: `${ApiUrl}/MatchMaker/${user.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      })

      console.log("נתוני שדכנית שהתקבלו מהשרת:", response.data)

      if (response.data) {
        const serverData = response.data
        
        // מילוי הטופס עם הנתונים שהתקבלו מהשרת
        Object.keys(serverData).forEach((key:any) => {
          if (serverData[key] !== null && serverData[key] !== undefined && serverData[key] !== "") {
            try {
              console.log(`מגדיר שדה ${key} לערך:`, serverData[key])
              setValue(key, serverData[key])
            } catch (setValueError) {
              console.error(`שגיאה בהגדרת שדה ${key}:`, setValueError)
            }
          }
        })

        setInitialDataLoaded(true)
        console.log("טעינת נתונים הושלמה בהצלחה")
      }
    } catch (apiError:any) {
      handleApiError(apiError, 'טעינת נתוני שדכנית')
      
      // גם אם יש שגיאה, אפשר למשתמש למלא טופס חדש
      if (apiError.response?.status === 404) {
        setInitialDataLoaded(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // שליחת הטופס - מתוקן ומשופר
  const onSubmit = async (data:any) => {
    console.log("=== התחלת שליחת נתוני שדכנית ===")
    console.log("נתוני הטופס שהתקבלו:", data)

    if (!user?.id || !token) {
      console.error("חסרים פרטי משתמש או טוקן לשליחת נתונים")
      setError("לא נמצאו נתוני משתמש. אנא התחבר מחדש.")
      return
    }

    setSubmitLoading(true)
    setError("null")
    setSuccess(false)

    try {
      // הכנת הנתונים לשליחה
      const dataToSend = {
        id: user.id,
        matchmakerName: data.matchmakerName?.trim() || "",
        idNumber: data.idNumber?.trim() || "",
        birthDate: data.birthDate || "",
        email: data.email?.trim() || "",
        gender: data.gender || "female",
        city: data.city?.trim() || "",
        address: data.address?.trim() || "",
        mobilePhone: data.mobilePhone?.trim() || "",
        landlinePhone: data.landlinePhone?.trim() || "",
        phoneType: data.phoneType?.trim() || "",
        personalClub: data.personalClub?.trim() || "",
        community: data.community?.trim() || "",
        occupation: data.occupation?.trim() || "",
        previousWorkplaces: data.previousWorkplaces?.trim() || "",
        isSeminarGraduate: Boolean(data.isSeminarGraduate),
        hasChildrenInShidduchim: Boolean(data.hasChildrenInShidduchim),
        experienceInShidduchim: data.experienceInShidduchim?.trim() || "",
        lifeSkills: data.lifeSkills?.trim() || "",
        yearsInShidduchim: Number(data.yearsInShidduchim) || 0,
        isInternalMatchmaker: Boolean(data.isInternalMatchmaker),
        printingNotes: data.printingNotes?.trim() || "",
        // שדות נוספים
        Role: user.role || "MatchMaker",
        FirstName: user.firstName || "",
        LastName: user.lastName || "",
        Username: user.username || data.email?.trim() || "",
      }

      console.log("=== נתונים לשליחה ===")
      console.log("URL:", `${ApiUrl}/MatchMaker/${user.id}`)
      console.log("Data:", dataToSend)
      console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.substring(0, 20)}...`,
      })

      const response = await axios({
        method: "put",
        url: `${ApiUrl}/MatchMaker/${user.id}`,
        data: dataToSend,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 20000,
      })

      console.log("=== תגובת השרת ===")
      console.log("Status:", response.status)
      console.log("Data:", response.data)

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        console.log("✅ נתונים נשמרו בהצלחה!")
        setSuccess(true)

        // הסתרת הודעת ההצלחה אחרי 5 שניות
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }

    } catch (apiError:any) {
      console.error("=== שגיאה בשליחת נתונים ===")
      console.error("Error:", apiError)
      console.error("Response:", apiError.response?.data)
      console.error("Status:", apiError.response?.status)

      let errorMessage = "שגיאה בעדכון נתונים. אנא נסה שנית."

      if (apiError.code === 'ERR_NETWORK') {
        errorMessage = 'בעיית רשת. אנא בדוק את החיבור לאינטרנט ונסה שנית.'
      } else if (apiError.response?.status === 500) {
        errorMessage = 'שגיאת שרת פנימית. אנא נסה מאוחר יותר.'
      } else if (apiError.response?.status === 400) {
        errorMessage = 'נתונים לא תקינים. אנא בדוק את הפרטים.'
      } else if (apiError.response?.status === 401) {
        errorMessage = 'אין הרשאה. אנא התחבר מחדש.'
      } else if (apiError.response?.status === 403) {
        errorMessage = 'אין הרשאה לביצוע פעולה זו.'
      } else if (apiError.response?.data?.errors) {
        const errorMessages = []
        for (const field in apiError.response.data.errors) {
          errorMessages.push(`${field}: ${apiError.response.data.errors[field].join(", ")}`)
        }
        errorMessage = `שגיאות ולידציה: ${errorMessages.join("; ")}`
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message
      } else if (apiError.message) {
        errorMessage = `שגיאה: ${apiError.message}`
      }

      console.error("הודעת שגיאה סופית:", errorMessage)
      setError(errorMessage)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCloseError = () => {
    setError("null")
  }

  const handleCloseSuccess = () => {
    setSuccess(false)
  }

  // useEffect לטעינת נתונים כשהמשתמש או הטוקן משתנים
  useEffect(() => {
    if (user && token) {
      loadInitialUserData()
    }
  }, [user, token])

  // Debug - מעקב אחר שינויים בטופס
  useEffect(() => {
    console.log("=== מצב הטופס עודכן ===")
    console.log("isDirty:", isDirty)
    console.log("isValid:", isValid)
    console.log("errors:", errors)
    console.log("formData:", formData)
  }, [isDirty, isValid, errors, formData])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          פרטי שדכנית
        </Typography>

        {/* הצגת מצב טעינה ראשונית */}
        {loading && !initialDataLoaded && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>טוען נתונים...</Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* פרטים אישיים */}
          <StyledPaper>
            <SectionTitle variant="h6">
              פרטים אישיים
              <PersonIcon />
            </SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="matchmakerName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="שם מלא"
                      error={!!errors.matchmakerName}
                      helperText={errors.matchmakerName?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Controller
                  name="idNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="מספר זהות"
                      error={!!errors.idNumber}
                      helperText={errors.idNumber?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="תאריך לידה"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.birthDate}
                      helperText={errors.birthDate?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="כתובת דוא\ל"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.gender}>
                      <InputLabel>מגדר</InputLabel>
                      <Select {...field} label="מגדר" disabled={loading || submitLoading}>
                        <MenuItem value="female">נקבה</MenuItem>
                        <MenuItem value="male">זכר</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* כתובת ופרטי התקשרות */}
          <StyledPaper>
            <SectionTitle variant="h6">
              כתובת ופרטי התקשרות
              <LocationOnIcon />
            </SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="עיר"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="כתובת"
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="mobilePhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="טלפון נייד"
                      error={!!errors.mobilePhone}
                      helperText={errors.mobilePhone?.message}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="landlinePhone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="טלפון קווי (אופציונלי)"
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* פרטים מקצועיים */}
          <StyledPaper>
            <SectionTitle variant="h6">
              פרטים מקצועיים
              <WorkIcon />
            </SectionTitle>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="occupation"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="מקצוע"
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="yearsInShidduchim"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="שנות ניסיון בשידוכים"
                      type="number"
                      inputProps={{ min: 0 }}
                      disabled={loading || submitLoading}
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
                      fullWidth
                      label="ניסיון בשידוכים"
                      multiline
                      rows={3}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="isSeminarGraduate"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          disabled={loading || submitLoading}
                        />
                      }
                      label="בוגרת סמינר"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="hasChildrenInShidduchim"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          disabled={loading || submitLoading}
                        />
                      }
                      label="יש ילדים בגיל שידוכים"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* הערות */}
          <StyledPaper>
            <SectionTitle variant="h6">
              הערות נוספות
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
                      fullWidth
                      label="הערות להדפסה"
                      multiline
                      rows={4}
                      disabled={loading || submitLoading}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </StyledPaper>

          {/* כפתור שמירה */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <AnimatedButton
              whileHover={{ scale: submitLoading ? 1 : 1.05 }}
              whileTap={{ scale: submitLoading ? 1 : 0.95 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || submitLoading || !isValid}
                startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #b87333 30%, #d4af37 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #a0651f 30%, #b8941f 90%)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  }
                }}
              >
                {submitLoading ? 'שומר נתונים...' : 'שמור פרטים'}
              </Button>
            </AnimatedButton>
          </Box>

          {/* הצגת מצב הטופס לדיבוג */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" display="block">
                Debug: Valid: {isValid ? '✅' : '❌'} | Dirty: {isDirty ? '✅' : '❌'} | Errors: {Object.keys(errors).length}
              </Typography>
              {Object.keys(errors).length > 0 && (
                <Typography variant="caption" color="error" display="block">
                  שגיאות: {Object.keys(errors).join(', ')}
                </Typography>
              )}
            </Box>
          )}
        </form>

        {/* הודעות */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={8000} 
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar 
          open={success} 
          autoHideDuration={5000} 
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
            ✅ הפרטים נשמרו בהצלחה!
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  )
}

export default MatchMakerForm