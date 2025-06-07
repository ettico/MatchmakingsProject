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
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Container,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  Fade,
  Slide,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { motion } from "framer-motion"
import { userContext } from "./UserContext"

// אייקונים
import PersonIcon from "@mui/icons-material/Person"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import ContactPhoneIcon from "@mui/icons-material/ContactPhone"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import SaveIcon from "@mui/icons-material/Save"
import SchoolIcon from "@mui/icons-material/School"
import HomeIcon from "@mui/icons-material/Home"
import InfoIcon from "@mui/icons-material/Info"
import SecurityIcon from "@mui/icons-material/Security"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import FileUploader from "./Files"

// אנימציות מותאמות אישית
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 115, 51, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(184, 115, 51, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(184, 115, 51, 0);
  }
`

// אפשרויות בחירה
const OPTIONS = {
  class: ["אשכנזי", "ספרדי", "תימני", "מעורב", "אחר"],
  background: ["חרדי", "דתי לאומי", "חוזר בתשובה", "מסורתי", "אחר"],
  openness: ["שמרני", "מודרני", "פתוח", "חסידי", "ליטאי", "ספרדי", "אחר"],
  status: ["רווק/ה", "גרוש/ה", "אלמן/ה"],
  pairingType: ["שידוך רגיל", "פגישה ישירה", "שידוך מהיר", "לא משנה"],
  headCoveringFemale: ["מטפחת", "פאה", "כובע על הפאה", "לא משנה"],
  headCoveringMale: ["כיפה סרוגה", "כיפה שחורה", "כיפה לבנה", "כיפה גדולה", "כיפה קטנה"],
  hat: ["מגבעת", "כובע חסידי", "ללא כובע", "אחר"],
  beard: ["זקן מלא", "זקן חלקי", "מגולח", "לא משנה"],
  suit: ["ארוכה", "קצרה", "לא משנה"],
  yeshivaType: ["ליטאית", "חסידית", "ספרדית", "הסדר", "תורנית לאומית", "אחר"],
  seminarType: ["בית יעקב", "סמינר חסידי", "אולפנה", "מדרשה", "אחר"],
  studyPath: ["הוראה", "הנדסאות", "עיצוב", "תרפיה", "מחשבים", "אחר"],
  drivingLicense: ["יש", "אין", "בתהליך למידה"],
  preferredOccupation: ["אברך", "עובד", "משלב לימודים ועבודה", "לא משנה"],
  healthCondition: ["בריא", "מצב בריאותי מיוחד"],
  origin: ["אשכנזי", "ספרדי", "תימני", "מעורב", "אחר"],
  fatherAffiliation: ["חסידי", "ליטאי", "ספרדי", "דתי לאומי", "אחר"],
  occupation: ["אברך", "עובד", "פנסיונר", "עצמאי", "שכיר", "אחר"],
  parentsStatus: ["נשואים", "גרושים", "אלמן", "אלמנה", "שניהם נפטרו"],
  familyHealthStatus: ["תקין", "יש בעיות בריאותיות במשפחה"],
  contactType: ["רב", "מורה", "קרוב משפחה", "חבר", "שדכן", "אחר"],
  appearance: ["יפה מאוד", "יפה", "ממוצע", "לא משנה"],
  generalAppearance: ["מטופח מאוד", "מטופח", "ממוצע", "לא משנה"],
  hot: ["חם מאוד", "חם", "ממוצע", "לא משנה"],
  facePaint: ["תמיד", "לפעמים", "לא", "לא משנה"],
  preferredSeminarStyle: ["חרדי קיצוני", "חרדי", "דתי לאומי", "מעורב", "לא משנה"],
  expectationsFromPartner: ["תומך כלכלית", "שותף בחיים", "אב טוב", "בעל תורה", "לא משנה"],
  preferredProfessionalPath: ["אברך", "עובד", "משלב לימודים ועבודה", "עצמאי", "לא משנה"],
}

// סטיילינג מותאם אישית
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(3),
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #fff8f0 100%)",
  boxShadow: "0 20px 40px rgba(184, 115, 51, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(184, 115, 51, 0.1)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  width: "100%",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 32px 64px rgba(184, 115, 51, 0.15), 0 16px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(184, 115, 51, 0.2)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(184, 115, 51, 0.05), transparent)",
    animation: `${shimmer} 3s infinite`,
  },
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "800",
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #2c1810 0%, #b87333 50%, #d4af37 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1.5rem",
  letterSpacing: "0.5px",
  "& svg": {
    marginLeft: theme.spacing(2),
    color: "#b87333",
    filter: "drop-shadow(0 2px 4px rgba(184, 115, 51, 0.3))",
    animation: `${pulse} 2s infinite`,
  },
}))

const AnimatedButton = styled(motion.div)(({ theme }) => ({
  display: "inline-block",
  marginTop: theme.spacing(2),
}))

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  position: "relative",
  background: "linear-gradient(135deg, #fff8f0 0%, #f0f8ff 50%, #f5f5dc 100%)",
  border: "2px solid transparent",
  backgroundClip: "padding-box",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(184, 115, 51, 0.2)",
    border: "2px solid rgba(184, 115, 51, 0.3)",
  },
}))

const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  background: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
  color: "white",
  width: 40,
  height: 40,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #ee5a52, #ff6b6b)",
    transform: "rotate(90deg) scale(1.1)",
    boxShadow: "0 8px 16px rgba(255, 107, 107, 0.4)",
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(2),
    background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 16px rgba(184, 115, 51, 0.15)",
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 24px rgba(184, 115, 51, 0.2)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#b87333",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#2c1810",
    fontWeight: "600",
  },
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(184, 115, 51, 0.15)",
  },
  "&.Mui-focused": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 24px rgba(184, 115, 51, 0.2)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b87333",
      borderWidth: "2px",
    },
  },
}))

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontWeight: "700",
  fontSize: "1.1rem",
  textTransform: "none",
  background: "linear-gradient(135deg, #2c1810 0%, #b87333 50%, #d4af37 100%)",
  color: "white",
  border: "none",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 16px 32px rgba(184, 115, 51, 0.4)",
    background: "linear-gradient(135deg, #d4af37 0%, #b87333 50%, #2c1810 100%)",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}))

// סכמות ולידציה
const personalInfoSchema = yup.object().shape({
  firstName: yup.string().required("שדה חובה"),
  lastName: yup.string().required("שדה חובה"),
  country: yup.string().required("שדה חובה"),
  city: yup.string().required("שדה חובה"),
  address: yup.string().required("שדה חובה"),
  tz: yup.string().required("שדה חובה"),
  class: yup.string().required("שדה חובה"),
  anOutsider: yup.boolean(),
  backGround: yup.string().required("שדה חובה"),
  openness: yup.string().required("שדה חובה"),
  age: yup.number().required("שדה חובה").positive().integer(),
  healthCondition: yup.boolean(),
  status: yup.string().required("שדה חובה"),
  statusVacant: yup.boolean(),
  pairingType: yup.string().required("שדה חובה"),
  height: yup.number().required("שדה חובה").positive(),
  phone: yup.string().required("שדה חובה"),
  email: yup.string().email("אימייל לא תקין").required("שדה חובה"),
  fatherPhone: yup.string().required("שדה חובה"),
  motherPhone: yup.string().required("שדה חובה"),
  moreInformation: yup.string(),
  club: yup.string(),
  ageFrom: yup.number().required("שדה חובה").positive().integer(),
  ageTo: yup.number().required("שדה חובה").positive().integer(),
  importantTraitsInMe: yup.string(),
  importantTraitsIAmLookingFor: yup.string(),
  photoUrl: yup.string(),
  photoName: yup.string(),
  TZFormUrl: yup.string(),
  TZFormName: yup.string(),
  Password: yup.string(),
  hot: yup.string(),
  facePaint: yup.string(),
  appearance: yup.string(),
  generalAppearance: yup.string(),
  preferredSeminarStyle: yup.string(),
  expectationsFromPartner: yup.string(),
  preferredProfessionalPath: yup.string(),
})

const familyDetailsSchema = yup.object().shape({
  fatherName: yup.string().required("שדה חובה"),
  fatherOrigin: yup.string().required("שדה חובה"),
  fatherYeshiva: yup.string(),
  fatherAffiliation: yup.string().required("שדה חובה"),
  fatherOccupation: yup.string().required("שדה חובה"),
  motherName: yup.string().required("שדה חובה"),
  motherOrigin: yup.string().required("שדה חובה"),
  motherGraduateSeminar: yup.string(),
  motherPreviousName: yup.string(),
  motherOccupation: yup.string().required("שדה חובה"),
  parentsStatus: yup.string().required("שדה חובה"),
  healthStatus: yup.string().required("שדה חובה"),
  familyRabbi: yup.string(),
  familyAbout: yup.string(),
})

const contactSchema = yup.object().shape({
  contacts: yup.array().of(
    yup.object().shape({
      name: yup.string().required("שם איש קשר הוא שדה חובה"),
      contactType: yup.string().required("סוג הקשר הוא שדה חובה"),
      phone: yup.string().required("מספר טלפון הוא שדה חובה"),
    }),
  ),
})

const UserRegistrationForm = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{
    open: boolean
    message: string
    severity: "success" | "error" | "info" | "warning"
  }>({
    open: false,
    message: "",
    severity: "info",
  })
  const [gender, setGender] = useState<string>("")

  // שימוש ב-userContext
  const { user, token } = useContext(userContext)

  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  const [existingFamilyId, setExistingFamilyId] = useState<number | null>(null)
  const [existingContactIds, setExistingContactIds] = useState<number[]>([])

  // 🔧 שמירת הסיסמה הקודמת מהשרת
  const [originalPassword, setOriginalPassword] = useState<string>("")

  const ApiUrl = process.env.REACT_APP_API_URL || "https://matchmakingsprojectserver.onrender.com/api"

  // טפסים נפרדים לכל שלב
  const personalForm = useForm({
    resolver: yupResolver(personalInfoSchema),
    mode: "onBlur",
    defaultValues: {
      anOutsider: false,
      statusVacant: true,
      healthCondition: true,
      country: "ישראל",
      class: "אשכנזי",
      backGround: "חרדי",
      openness: "שמרני",
      status: "רווק/ה",
      pairingType: "שידוך רגיל",
      hot: "לא משנה",
      facePaint: "לא",
      appearance: "ממוצע",
      generalAppearance: "מטופח",
      preferredSeminarStyle: "חרדי",
      expectationsFromPartner: "לא משנה",
      preferredProfessionalPath: "לא משנה",
    },
  })

  const familyForm = useForm({
    resolver: yupResolver(familyDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      fatherOrigin: "אשכנזי",
      motherOrigin: "אשכנזי",
      fatherAffiliation: "ליטאי",
      fatherOccupation: "אברך",
      motherOccupation: "עקרת בית",
      parentsStatus: "נשואים",
      healthStatus: "תקין",
    },
  })

  const contactForm = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      contacts: [{ name: "", contactType: "רב", phone: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: contactForm.control,
    name: "contacts",
  })

  // טעינת נתוני המשתמש בעת טעינת הקומפוננטה
  useEffect(() => {
    if (user && user.id && token) {
      loadUserData()
    } else {
      setNotification({
        open: true,
        message: "לא נמצאו נתוני משתמש. אנא התחבר מחדש.",
        severity: "error",
      })
    }
  }, [user, token])

  const loadUserData = async () => {
    if (!user || !user.id || !token) {
      console.error("חסרים פרטי משתמש")
      return
    }

    setLoading(true)
    try {
      console.log("טוען נתוני משתמש עם ID:", user.id)
      console.log("מגדר משתמש:", user.role)

      // הגדרת מגדר מהקונטקסט
      setGender(user.role || "Male")

      // מילוי פרטים בסיסיים מהקונטקסט
      if (user.firstName) {
        personalForm.setValue("firstName", user.firstName)
      }
      if (user.lastName) {
        personalForm.setValue("lastName", user.lastName)
      }
      if (user.username) {
        personalForm.setValue("email", user.username)
      }

      // טעינת נתוני המשתמש מהשרת
      await fetchUserData(user.id, token, user.role || "Male")
    } catch (error) {
      console.error("שגיאה בטעינת נתוני משתמש:", error)
      setNotification({
        open: true,
        message: "שגיאה בטעינת נתונים. אנא נסה שוב.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // פונקציה לטעינת נתוני המשתמש מהשרת
  const fetchUserData = async (id: number, userToken: string, userGender: string) => {
    try {
      // טעינת פרטים אישיים
      const userApiUrl = userGender === "Male" ? `${ApiUrl}/Male/${id}` : `${ApiUrl}/Women/${id}`

      try {
        const response = await axios.get(userApiUrl, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        })

        if (response.data) {
          const serverData = response.data
          console.log("נתוני משתמש מהשרת:", serverData)

          // 🔧 שמירת הסיסמה הקודמת מהשרת
          if (serverData.password) {
            setOriginalPassword(serverData.password)
            console.log("🔐 נשמרה סיסמה קודמת מהשרת")
          }

          // מיפוי מפורט של כל השדות מהשרת לטופס
          const fieldMapping = {
            // שדות בסיסיים
            firstName: serverData.firstName || serverData.FirstName,
            lastName: serverData.lastName || serverData.LastName,
            country: serverData.country,
            city: serverData.city,
            address: serverData.address,
            tz: serverData.tz,
            class: serverData.class,
            anOutsider: serverData.anOutsider,
            backGround: serverData.backGround,
            openness: serverData.openness,
            age: serverData.age,
            healthCondition: serverData.healthCondition,
            status: serverData.status,
            statusVacant: serverData.statusVacant,
            pairingType: serverData.pairingType,
            height: serverData.height,
            phone: serverData.phone,
            email: serverData.email || serverData.Username,
            fatherPhone: serverData.fatherPhone,
            motherPhone: serverData.motherPhone,
            moreInformation: serverData.moreInformation,
            club: serverData.club,
            ageFrom: serverData.ageFrom,
            ageTo: serverData.ageTo,
            importantTraitsInMe: serverData.importantTraitsInMe,
            importantTraitsIAmLookingFor: serverData.importantTraitsIAmLookingFor,
            photoUrl: serverData.photoUrl,
            photoName: serverData.photoName,
            TZFormUrl: serverData.TZFormUrl || serverData.tzFormUrl,
            TZFormName: serverData.TZFormName || serverData.tzFormName,
            hot: serverData.hot,
            facePaint: serverData.facePaint,
            appearance: serverData.appearance,
            generalAppearance: serverData.generalAppearance,
            preferredSeminarStyle: serverData.preferredSeminarStyle,
            expectationsFromPartner: serverData.expectationsFromPartner,
            preferredProfessionalPath: serverData.preferredProfessionalPath,

            // שדות ייחודיים לבחור
            ...(userGender === "Male" && {
              driversLicense: serverData.driversLicense,
              smoker: serverData.smoker,
              beard: serverData.beard,
              hat: serverData.hat,
              suit: serverData.suit,
              headCovering: serverData.headCovering,
              smallYeshiva: serverData.smallYeshiva,
              bigYeshiva: serverData.bigYeshiva,
              yeshivaType: serverData.yeshivaType,
              kibbutz: serverData.kibbutz,
              occupation: serverData.occupation || serverData.currentOccupation,
              preferredOccupation: serverData.preferredOccupation,
            }),

            // שדות ייחודיים לבחורה
            ...(userGender === "Women" && {
              drivingLicense: serverData.drivingLicense,
              smoker: serverData.smoker,
              headCovering: serverData.headCovering,
              highSchool: serverData.highSchool,
              seminar: serverData.seminar,
              seminarType: serverData.seminarType,
              studyPath: serverData.studyPath,
              currentOccupation: serverData.currentOccupation || serverData.occupation,
            }),
          }

          // מילוי השדות בטופס
          Object.entries(fieldMapping).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              try {
                personalForm.setValue(key as any, value)
                console.log(`✅ עודכן שדה ${key}:`, value)
              } catch (setValueError) {
                console.error(`❌ שגיאה בהגדרת שדה ${key}:`, setValueError)
              }
            }
          })

          setInitialDataLoaded(true)
        }
      } catch (apiError: any) {
        if (apiError.response?.status === 404) {
          console.log("לא נמצאו נתוני משתמש - משתמש חדש")
          setInitialDataLoaded(true)
        } else {
          throw apiError
        }
      }

      // טעינת פרטי משפחה עם מיפוי מתוקן
      try {
        const familyResponse = await axios.get(`${ApiUrl}/FamilyDetails`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (familyResponse.data && Array.isArray(familyResponse.data)) {
          const familyDetails = familyResponse.data.find(
            (detail) =>
              (userGender === "Male" && detail.maleId === id) || (userGender === "Women" && detail.womenId === id),
          )

          if (familyDetails) {
            console.log("נתוני משפחה מהשרת:", familyDetails)
            setExistingFamilyId(familyDetails.id)

            // מיפוי מפורט של שדות המשפחה
            const familyFieldMapping = {
              fatherName: familyDetails.fatherName,
              fatherOrigin: familyDetails.fatherOrigin,
              fatherYeshiva: familyDetails.fatherYeshiva,
              fatherAffiliation: familyDetails.fatherAffiliation,
              fatherOccupation: familyDetails.fatherOccupation,
              motherName: familyDetails.motherName,
              motherOrigin: familyDetails.motherOrigin,
              motherGraduateSeminar: familyDetails.motherGraduateSeminar,
              motherPreviousName: familyDetails.motherPreviousName,
              motherOccupation: familyDetails.motherOccupation,
              parentsStatus:
                familyDetails.parentsStatus === true
                  ? "נשואים"
                  : familyDetails.parentsStatus === false
                    ? "גרושים"
                    : familyDetails.parentsStatus || "נשואים",
              healthStatus:
                familyDetails.healthStatus === true
                  ? "תקין"
                  : familyDetails.healthStatus === false
                    ? "יש בעיות בריאותיות במשפחה"
                    : familyDetails.healthStatus || "תקין",
              familyRabbi: familyDetails.familyRabbi,
              familyAbout: familyDetails.familyAbout,
            }

            // מילוי שדות המשפחה
            Object.entries(familyFieldMapping).forEach(([key, value]) => {
              if (value !== null && value !== undefined && value !== "") {
                try {
                  familyForm.setValue(key as any, value)
                  console.log(`✅ עודכן שדה משפחה ${key}:`, value)
                } catch (setValueError) {
                  console.error(`❌ שגיאה בהגדרת שדה משפחה ${key}:`, setValueError)
                }
              }
            })
          }
        }
      } catch (error) {
        console.log("אין פרטי משפחה קיימים:", error)
      }

      // טעינת אנשי קשר
      try {
        const contactsResponse = await axios.get(`${ApiUrl}/Contact`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (contactsResponse.data && Array.isArray(contactsResponse.data)) {
          const userContacts = contactsResponse.data.filter(
            (contact) =>
              (userGender === "Male" && contact.maleId === id) || (userGender === "Women" && contact.womenId === id),
          )

          if (userContacts.length > 0) {
            console.log("אנשי קשר מהשרת:", userContacts)
            setExistingContactIds(userContacts.map((contact) => contact.id))

            contactForm.setValue(
              "contacts",
              userContacts.map((contact) => ({
                name: contact.name || "",
                contactType: contact.contactType || "רב",
                phone: contact.phone || "",
              })),
            )
          }
        }
      } catch (error) {
        console.log("אין אנשי קשר קיימים:", error)
      }
    } catch (error: any) {
      console.error("שגיאה כללית בטעינת נתוני המשתמש:", error)
      throw error
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const handleGenderChange = (newGender: "Male" | "Women") => {
    setGender(newGender)
    console.log("שינוי מגדר ל:", newGender)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const onSubmitPersonalInfo = async (data: any) => {
    if (!user || !user.id || !token) {
      setNotification({
        open: true,
        message: "לא נמצאו נתוני משתמש. אנא התחבר מחדש.",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      const userApiUrl = gender === "Male" ? `${ApiUrl}/Male/${user.id}` : `${ApiUrl}/Women/${user.id}`

      // 🔧 שימוש בסיסמה הקודמת מהשרת - אם אין, לא שולחים סיסמה בכלל
      const shouldIncludePassword = originalPassword && originalPassword.trim() !== ""
      console.log("🔐 האם לכלול סיסמה:", shouldIncludePassword, "סיסמה קיימת:", !!originalPassword)

      // הכנת הנתונים לשליחה
      const baseData = {
        id: user.id,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        country: data.country || "ישראל",
        city: data.city || "",
        address: data.address || "",
        tz: data.tz || "",
        class: data.class || "אשכנזי",
        anOutsider: data.anOutsider || false,
        backGround: data.backGround || "חרדי",
        openness: data.openness || "שמרני",
        age: data.age || 0,
        healthCondition: data.healthCondition || true,
        status: data.status || "רווק/ה",
        statusVacant: data.statusVacant || true,
        pairingType: data.pairingType || "שידוך רגיל",
        height: data.height || 0,
        phone: data.phone || "",
        email: data.email || "",
        fatherPhone: data.fatherPhone || "",
        motherPhone: data.motherPhone || "",
        moreInformation: data.moreInformation || "",
        club: data.club || "",
        ageFrom: data.ageFrom || 0,
        ageTo: data.ageTo || 0,
        importantTraitsInMe: data.importantTraitsInMe || "",
        importantTraitsIAmLookingFor: data.importantTraitsIAmLookingFor || "",
        role: gender === "Male" ? "Male" : "Women",
        FirstName: data.firstName || "",
        LastName: data.lastName || "",
        Username: data.email || user.username || "",
        photoUrl: data.photoUrl || "",
        photoName: data.photoName || "",
        TZFormUrl: data.TZFormUrl || "",
        TZFormName: data.TZFormName || "",
        hot: data.hot || "לא משנה",
        facePaint: data.facePaint || "לא",
        appearance: data.appearance || "ממוצע",
        generalAppearance: data.generalAppearance || "מטופח",
        preferredSeminarStyle: data.preferredSeminarStyle || "חרדי",
        expectationsFromPartner: data.expectationsFromPartner || "לא משנה",
        preferredProfessionalPath: data.preferredProfessionalPath || "לא משנה",

        // 🔧 כלול סיסמה רק אם יש סיסמה קודמת
        ...(shouldIncludePassword && { Password: originalPassword }),
      }

      // שדות ייחודיים לפי מגדר
      const dataToSend = {
        ...baseData,
        ...(gender === "Male" && {
          driversLicense: data.driversLicense || false,
          smoker: data.smoker || false,
          beard: data.beard || "זקן מלא",
          hat: data.hat || "ללא כובע",
          suit: data.suit || "ארוכה",
          headCovering: data.headCovering || "כיפה סרוגה",
          smallYeshiva: data.smallYeshiva || "",
          bigYeshiva: data.bigYeshiva || "",
          yeshivaType: data.yeshivaType || "ליטאית",
          kibbutz: data.kibbutz || "",
          occupation: data.occupation || "אברך",
          preferredOccupation: data.preferredOccupation || "אברך",
          studyPath: "",
          currentOccupation: data.occupation || "אברך",
          religiousLevel: "חרדי",
          learningStyle: "ליטאי",
          futureGoals: "להמשיך ללמוד",
        }),
        ...(gender === "Women" && {
          drivingLicense: data.drivingLicense || "אין",
          smoker: data.smoker || false,
          headCovering: data.headCovering || "מטפחת",
          highSchool: data.highSchool || "",
          seminar: data.seminar || "",
          seminarType: data.seminarType || "בית יעקב",
          studyPath: data.studyPath || "הוראה",
          currentOccupation: data.currentOccupation || "עקרת בית",
          preferredOccupation: "עקרת בית",
          occupation: data.currentOccupation || "עקרת בית",
          religiousLevel: "חרדית",
          careerGoals: "אמא ועקרת בית",
          educationLevel: "סמינר",
        }),
      }

      console.log("שולח נתוני משתמש:", {
        ...dataToSend,
        Password: shouldIncludePassword ? "***" : "לא נשלח",
      })

      const response = await axios.put(userApiUrl, dataToSend, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("תשובה מהשרת:", response.data)

      setNotification({
        open: true,
        message: "הפרטים האישיים נשמרו בהצלחה!",
        severity: "success",
      })

      // מעבר לשלב הבא
      setActiveStep(1)
    } catch (error: any) {
      console.error("שגיאה בעדכון נתונים:", error)

      let errorMessage = "שגיאה בעדכון נתונים. אנא נסה שנית."
      if (error.response?.data?.errors) {
        const validationErrors = []
        for (const field in error.response.data.errors) {
          validationErrors.push(`${field}: ${error.response.data.errors[field].join(", ")}`)
        }
        errorMessage = validationErrors.join("; ")
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmitFamilyInfo = async (data: any) => {
    if (!user || !user.id || !token) {
      setNotification({
        open: true,
        message: "לא נמצאו נתוני משתמש. אנא התחבר מחדש.",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      const familyData = {
        id: existingFamilyId || 0,
        fatherName: data.fatherName || "",
        fatherOrigin: data.fatherOrigin || "אשכנזי",
        fatherYeshiva: data.fatherYeshiva || "",
        fatherAffiliation: data.fatherAffiliation || "ליטאי",
        fatherOccupation: data.fatherOccupation || "אברך",
        motherName: data.motherName || "",
        motherOrigin: data.motherOrigin || "אשכנזי",
        motherGraduateSeminar: data.motherGraduateSeminar || "",
        motherPreviousName: data.motherPreviousName || "",
        motherOccupation: data.motherOccupation || "עקרת בית",
        parentsStatus: data.parentsStatus === "נשואים",
        healthStatus: data.healthStatus === "תקין",
        familyRabbi: data.familyRabbi || "",
        familyAbout: data.familyAbout || "",
        f: true,
        maleId: gender === "Male" ? Number(user.id) : null,
        womenId: gender === "Women" ? Number(user.id) : null,
      }

      console.log("שולח נתוני משפחה:", familyData)

      const method = existingFamilyId ? "put" : "post"
      const url = existingFamilyId ? `${ApiUrl}/FamilyDetails/${existingFamilyId}` : `${ApiUrl}/FamilyDetails`

      const response = await axios({
        method,
        url,
        data: familyData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!existingFamilyId && response.data?.id) {
        setExistingFamilyId(response.data.id)
      }

      setNotification({
        open: true,
        message: "פרטי המשפחה נשמרו בהצלחה!",
        severity: "success",
      })

      // מעבר לשלב הבא
      setActiveStep(2)
    } catch (error: any) {
      console.error("שגיאה בשמירת פרטי משפחה:", error)

      let errorMessage = "שגיאה בשמירת פרטי משפחה. אנא נסה שנית."
      if (error.response?.data?.errors) {
        const validationErrors = []
        for (const field in error.response.data.errors) {
          validationErrors.push(`${field}: ${error.response.data.errors[field].join(", ")}`)
        }
        errorMessage = validationErrors.join("; ")
      }

      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmitContactInfo = async (data: any) => {
    if (!user || !user.id || !token) {
      setNotification({
        open: true,
        message: "לא נמצאו נתוני משתמש. אנא התחבר מחדש.",
        severity: "error",
      })
      return
    }

    setLoading(true)
    try {
      // מחיקת אנשי קשר קיימים
      if (existingContactIds.length > 0) {
        for (const contactId of existingContactIds) {
          try {
            await axios.delete(`${ApiUrl}/Contact/${contactId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          } catch (deleteError) {
            console.error(`שגיאה במחיקת איש קשר ${contactId}:`, deleteError)
          }
        }
      }

      // הוספת אנשי קשר חדשים
      const contactsToSave = data.contacts.map((contact: any) => ({
        name: contact.name || "",
        contactType: contact.contactType || "רב",
        phone: contact.phone || "",
        maleId: gender === "Male" ? Number(user.id) : null,
        womenId: gender === "Women" ? Number(user.id) : null,
        matchMakerId: null,
      }))

      const newContactIds = []
      for (const contact of contactsToSave) {
        const response = await axios.post(`${ApiUrl}/Contact`, contact, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data?.id) {
          newContactIds.push(response.data.id)
        }
      }

      setExistingContactIds(newContactIds)

      setNotification({
        open: true,
        message: "אנשי הקשר נשמרו בהצלחה! תהליך הרישום הושלם.",
        severity: "success",
      })

      // מעבר לדף candidate-auth
      setTimeout(() => {
        window.location.href = "/candidate-auth"
      }, 2000)
    } catch (error: any) {
      console.error("שגיאה בשמירת אנשי קשר:", error)

      let errorMessage = "שגיאה בשמירת אנשי קשר. אנא נסה שנית."
      if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat()
        errorMessage = validationErrors.join(", ")
      }

      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { label: "פרטים אישיים", icon: <PersonIcon /> },
    { label: "פרטי משפחה", icon: <FamilyRestroomIcon /> },
    { label: "אנשי קשר", icon: <ContactPhoneIcon /> },
  ]

  // רנדור שדה טקסט
  const renderTextField = (name: string, label: string, form: any, type = "text", multiline = false, rows = 1) => (
    <Grid item xs={12} sm={6} md={4}>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <StyledTextField
            {...field}
            label={label}
            fullWidth
            type={type}
            multiline={multiline}
            rows={rows}
            error={!!form.formState.errors[name]}
            helperText={form.formState.errors[name]?.message}
            variant="outlined"
          />
        )}
      />
    </Grid>
  )

  // רנדור תיבת בחירה
  const renderSelect = (name: string, label: string, options: string[], form: any) => (
    <Grid item xs={12} sm={6} md={4}>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <FormControl fullWidth error={!!form.formState.errors[name]}>
            <InputLabel id={`${name}-label`} sx={{ fontWeight: "600" }}>
              {label}
            </InputLabel>
            <StyledSelect
              {...field}
              labelId={`${name}-label`}
              label={label}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    borderRadius: 2,
                    boxShadow: "0 16px 32px rgba(184, 115, 51, 0.2)",
                    "& .MuiMenuItem-root": {
                      transition: "all 0.2s",
                      borderRadius: 1,
                      margin: "4px 8px",
                      "&:hover": {
                        backgroundColor: "rgba(184, 115, 51, 0.1)",
                        transform: "translateX(4px)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(184, 115, 51, 0.2)",
                        fontWeight: "600",
                        "&:hover": {
                          backgroundColor: "rgba(184, 115, 51, 0.3)",
                        },
                      },
                    },
                  },
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </StyledSelect>
            {form.formState.errors[name] && (
              <Typography variant="caption" color="error" sx={{ mt: 1, fontWeight: "500" }}>
                {form.formState.errors[name].message}
              </Typography>
            )}
          </FormControl>
        )}
      />
    </Grid>
  )

  // רנדור תיבת סימון
  const renderCheckbox = (name: string, label: string, form: any) => (
    <Grid item xs={12} sm={6} md={4}>
      <Controller
        name={name}
        control={form.control}
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
                    transform: "scale(1.2)",
                    transition: "transform 0.2s",
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 28,
                  },
                }}
              />
            }
            label={<Typography sx={{ fontWeight: "600", color: "#2c1810" }}>{label}</Typography>}
          />
        )}
      />
    </Grid>
  )

  // אם אין משתמש מחובר
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ direction: "rtl", py: 4 }}>
        <StyledPaper elevation={3}>
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" color="error" gutterBottom>
              🚫 אין גישה
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              אנא התחבר למערכת כדי לגשת לטופס הרישום
            </Typography>
            <Button
              variant="contained"
              onClick={() => (window.location.href = "/login")}
              sx={{
                background: "linear-gradient(135deg, #2c1810 0%, #b87333 50%, #d4af37 100%)",
                color: "white",
                px: 4,
                py: 2,
                borderRadius: 4,
              }}
            >
              חזרה להתחברות
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ direction: "rtl", py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <StyledPaper elevation={3}>
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "900",
                textAlign: "center",
                mb: 6,
                background: "linear-gradient(135deg, #2c1810 0%, #b87333 50%, #d4af37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: "1px",
                textShadow: "0 4px 8px rgba(184, 115, 51, 0.3)",
              }}
            >
              ✨ השלמת פרטי רישום ✨
            </Typography>

            {/* הצגת פרטי המשתמש המחובר */}
            <Box
              sx={{
                mb: 4,
                p: 3,
                background: "linear-gradient(135deg, #fff8f0, #f0f8ff)",
                borderRadius: 3,
                border: "2px solid rgba(184, 115, 51, 0.2)",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "#2c1810", fontWeight: "700", mb: 1 }}>
                👋 שלום {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" sx={{ color: "#b87333", fontWeight: "600" }}>
                📧 {user.username} | 🎭 {user.role === "Male" ? "בחור" : "בחורה"}
              </Typography>
            </Box>

            {/* סטפר */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                mb: 6,
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "#b87333",
                  transform: "scale(1.1)",
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "#b87333",
                  transform: "scale(1.2)",
                  animation: `${pulse} 2s infinite`,
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "#2c1810",
                  fontWeight: "800",
                  fontSize: "1.1rem",
                },
                "& .MuiStepConnector-line": {
                  borderColor: "rgba(184, 115, 51, 0.3)",
                  borderWidth: "2px",
                },
                "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                  borderColor: "#b87333",
                  borderWidth: "3px",
                  background: "linear-gradient(90deg, #b87333, #d4af37)",
                },
                "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                  borderColor: "#b87333",
                  borderWidth: "3px",
                  background: "linear-gradient(90deg, #b87333, #d4af37)",
                },
              }}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconProps={{
                      icon: step.icon,
                    }}
                    sx={{
                      "& .MuiStepIcon-root": {
                        fontSize: "2rem",
                        filter: "drop-shadow(0 4px 8px rgba(184, 115, 51, 0.3))",
                      },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {loading && !initialDataLoaded ? (
              <Fade in={loading}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 8,
                    flexDirection: "column",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #fff8f0, #f0f8ff)",
                    borderRadius: 4,
                    border: "2px solid rgba(184, 115, 51, 0.1)",
                  }}
                >
                  <CircularProgress
                    sx={{
                      color: "#b87333",
                      "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                      },
                    }}
                    size={60}
                    thickness={4}
                  />
                  <Typography variant="h5" sx={{ mt: 3, color: "#2c1810", fontWeight: "600" }}>
                    🔄 טוען נתונים...
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: "#b87333", textAlign: "center" }}>
                    אנא המתן בזמן שאנו טוענים את הפרטים שלך
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <>
                {/* שלב 1: פרטים אישיים */}
                {activeStep === 0 && (
                  <Slide direction="right" in={activeStep === 0} mountOnEnter unmountOnExit>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <form onSubmit={personalForm.handleSubmit(onSubmitPersonalInfo)}>
                        {/* בחירת מגדר */}
                        <StyledPaper sx={{ p: 3, mb: 4, background: "linear-gradient(135deg, #fff8f0, #f0f8ff)" }}>
                          <FormControl component="fieldset" sx={{ width: "100%" }}>
                            <SectionTitle variant="h5" gutterBottom>
                              <PersonIcon /> בחירת מגדר
                            </SectionTitle>
                            <RadioGroup
                              row
                              value={gender}
                              onChange={(e) => handleGenderChange(e.target.value as "Male" | "Women")}
                              sx={{ justifyContent: "center", gap: 4 }}
                            >
                              <FormControlLabel
                                value="Male"
                                control={
                                  <Radio
                                    sx={{
                                      color: "#b87333",
                                      "&.Mui-checked": {
                                        color: "#b87333",
                                        transform: "scale(1.2)",
                                      },
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 32,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    sx={{
                                      fontSize: "1.3rem",
                                      fontWeight: gender === "Male" ? "800" : "600",
                                      color: gender === "Male" ? "#2c1810" : "#666",
                                      transition: "all 0.3s",
                                    }}
                                  >
                                    👨 בחור
                                  </Typography>
                                }
                              />
                              <FormControlLabel
                                value="Women"
                                control={
                                  <Radio
                                    sx={{
                                      color: "#b87333",
                                      "&.Mui-checked": {
                                        color: "#b87333",
                                        transform: "scale(1.2)",
                                      },
                                      "& .MuiSvgIcon-root": {
                                        fontSize: 32,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography
                                    sx={{
                                      fontSize: "1.3rem",
                                      fontWeight: gender === "Women" ? "800" : "600",
                                      color: gender === "Women" ? "#2c1810" : "#666",
                                      transition: "all 0.3s",
                                    }}
                                  >
                                    👩 בחורה
                                  </Typography>
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </StyledPaper>

                        {/* פרטים אישיים בסיסיים */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <PersonIcon /> פרטים אישיים בסיסיים
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3} alignItems="flex-end">
                            {renderTextField("firstName", "שם פרטי", personalForm)}
                            {renderTextField("lastName", "שם משפחה", personalForm)}
                            {renderTextField("age", "גיל", personalForm, "number")}

                            {/* שדה תעודת זהות + העלאת קובץ */}
                            <Grid item xs={12} md={6}>
                              {renderTextField("tz", "תעודת זהות", personalForm)}
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Box
                                sx={{
                                  p: 2,
                                  border: "2px dashed rgba(184, 115, 51, 0.3)",
                                  borderRadius: 2,
                                  background: "linear-gradient(135deg, #fff8f0, #f0f8ff)",
                                  transition: "all 0.3s",
                                  "&:hover": {
                                    borderColor: "#b87333",
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                  color="#2c1810"
                                  mb={1}
                                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                >
                                  <SecurityIcon sx={{ color: "#b87333" }} />
                                  העלאת תעודת זהות + ספח
                                </Typography>
                                <FileUploader
                                  onUploadSuccess={({ url, name }: any) => {
                                    personalForm.setValue("TZFormUrl", url)
                                    personalForm.setValue("TZFormName", name)
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </StyledPaper>

                        {/* העלאת תמונה */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <PhotoCameraIcon /> העלאת תמונת מועמד
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />

                          <Box
                            sx={{
                              p: 3,
                              border: "2px dashed rgba(184, 115, 51, 0.3)",
                              borderRadius: 3,
                              background: "linear-gradient(135deg, #fff8f0, #f0f8ff)",
                              textAlign: "center",
                              transition: "all 0.3s",
                              "&:hover": {
                                borderColor: "#b87333",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 16px rgba(184, 115, 51, 0.2)",
                              },
                            }}
                          >
                            <FileUploader
                              onUploadSuccess={({ url, name }: any) => {
                                personalForm.setValue("photoUrl", url)
                                personalForm.setValue("photoName", name)
                              }}
                            />

                            {/* תצוגה מקדימה לתמונה */}
                            {personalForm.watch("photoUrl") && (
                              <Box mt={3}>
                                <img
                                  src={personalForm.watch("photoUrl") || "/placeholder.svg"}
                                  alt="תמונה שהועלתה"
                                  style={{
                                    maxWidth: "200px",
                                    height: "200px",
                                    borderRadius: 16,
                                    objectFit: "cover",
                                    border: "3px solid #b87333",
                                    boxShadow: "0 8px 16px rgba(184, 115, 51, 0.3)",
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        </StyledPaper>

                        {/* פרטי מגורים */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <HomeIcon /> פרטי מגורים
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderTextField("country", "מדינה", personalForm)}
                            {renderTextField("city", "עיר", personalForm)}
                            {renderTextField("address", "כתובת", personalForm)}
                            {renderCheckbox("anOutsider", "חוצניק", personalForm)}
                          </Grid>
                        </StyledPaper>

                        {/* רקע ומידע בסיסי */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <InfoIcon /> רקע ומידע בסיסי
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderSelect("class", "עדה", OPTIONS.class, personalForm)}
                            {renderSelect("backGround", "רקע", OPTIONS.background, personalForm)}
                            {renderSelect("openness", "פתיחות", OPTIONS.openness, personalForm)}
                            {renderTextField("height", "גובה (ס״מ)", personalForm, "number")}
                          </Grid>
                        </StyledPaper>

                        {/* סטטוס */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <InfoIcon /> סטטוס
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderSelect("status", "סטטוס", OPTIONS.status, personalForm)}
                            {renderCheckbox("statusVacant", "סטטוס פנוי", personalForm)}
                            {renderSelect("pairingType", "סוג חיבור", OPTIONS.pairingType, personalForm)}
                            {renderCheckbox("healthCondition", "בריא", personalForm)}
                          </Grid>
                        </StyledPaper>

                        {/* פרטי קשר */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <ContactPhoneIcon /> פרטי קשר
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderTextField("phone", "טלפון", personalForm)}
                            {renderTextField("email", "אימייל", personalForm)}
                            {renderTextField("fatherPhone", "טלפון אב", personalForm)}
                            {renderTextField("motherPhone", "טלפון אם", personalForm)}
                          </Grid>
                        </StyledPaper>

                        {/* העדפות */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <InfoIcon /> העדפות והרחבה
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderTextField("ageFrom", "מגיל", personalForm, "number")}
                            {renderTextField("ageTo", "עד גיל", personalForm, "number")}
                            {renderTextField("importantTraitsInMe", "תכונות חשובות בי", personalForm, "text", true, 3)}
                            {renderTextField(
                              "importantTraitsIAmLookingFor",
                              "תכונות חשובות שאני מחפש/ת",
                              personalForm,
                              "text",
                              true,
                              3,
                            )}
                            {renderTextField("moreInformation", "מידע נוסף", personalForm, "text", true, 3)}
                            {renderTextField("club", "חוג/קבוצה", personalForm)}
                            {renderSelect(
                              "expectationsFromPartner",
                              "ציפיות מהשותף/ה",
                              OPTIONS.expectationsFromPartner,
                              personalForm,
                            )}
                            {renderSelect(
                              "preferredProfessionalPath",
                              "נתיב מקצועי מועדף",
                              OPTIONS.preferredProfessionalPath,
                              personalForm,
                            )}
                          </Grid>
                        </StyledPaper>

                        {/* שדות ייחודיים לפי מגדר */}
                        {gender === "Male" && (
                          <>
                            <StyledPaper sx={{ p: 3, mb: 4 }}>
                              <SectionTitle variant="h6" gutterBottom>
                                <PersonIcon /> מידע אישי על הבחור
                              </SectionTitle>
                              <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                              <Grid container spacing={3}>
                                {renderCheckbox("driversLicense", "רישיון נהיגה", personalForm)}
                                {renderCheckbox("smoker", "מעשן", personalForm)}
                                {renderSelect("beard", "זקן", OPTIONS.beard, personalForm)}
                                {renderSelect("hat", "כובע", OPTIONS.hat, personalForm)}
                                {renderSelect("suit", "חליפה", OPTIONS.suit, personalForm)}
                                {renderSelect("headCovering", "כיסוי ראש", OPTIONS.headCoveringMale, personalForm)}
                                {renderSelect("hot", "מידת חמימות", OPTIONS.hot, personalForm)}
                                {renderSelect("appearance", "מראה חיצוני", OPTIONS.appearance, personalForm)}
                                {renderSelect(
                                  "generalAppearance",
                                  "מראה כללי",
                                  OPTIONS.generalAppearance,
                                  personalForm,
                                )}
                              </Grid>
                            </StyledPaper>

                            <StyledPaper sx={{ p: 3, mb: 4 }}>
                              <SectionTitle variant="h6" gutterBottom>
                                <SchoolIcon /> רקע לימודי של הבחור
                              </SectionTitle>
                              <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                              <Grid container spacing={3}>
                                {renderTextField("smallYeshiva", "ישיבה קטנה", personalForm)}
                                {renderTextField("bigYeshiva", "ישיבה גדולה", personalForm)}
                                {renderTextField("kibbutz", "קיבוץ", personalForm)}
                                {renderSelect("yeshivaType", "סוג ישיבה", OPTIONS.yeshivaType, personalForm)}
                                {renderTextField("occupation", "עיסוק נוכחי", personalForm)}
                              </Grid>
                            </StyledPaper>
                          </>
                        )}

                        {gender === "Women" && (
                          <>
                            <StyledPaper sx={{ p: 3, mb: 4 }}>
                              <SectionTitle variant="h6" gutterBottom>
                                <PersonIcon /> מידע אישי על הבחורה
                              </SectionTitle>
                              <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                              <Grid container spacing={3}>
                                {renderSelect("drivingLicense", "רישיון נהיגה", OPTIONS.drivingLicense, personalForm)}
                                {renderCheckbox("smoker", "מעשנת", personalForm)}
                                {renderSelect("headCovering", "כיסוי ראש", OPTIONS.headCoveringFemale, personalForm)}
                                {renderSelect("hot", "מידת חמימות", OPTIONS.hot, personalForm)}
                                {renderSelect("facePaint", "איפור", OPTIONS.facePaint, personalForm)}
                                {renderSelect("appearance", "מראה חיצוני", OPTIONS.appearance, personalForm)}
                                {renderSelect(
                                  "generalAppearance",
                                  "מראה כללי",
                                  OPTIONS.generalAppearance,
                                  personalForm,
                                )}
                                {renderSelect(
                                  "preferredSeminarStyle",
                                  "סגנון סמינר מועדף",
                                  OPTIONS.preferredSeminarStyle,
                                  personalForm,
                                )}
                              </Grid>
                            </StyledPaper>

                            <StyledPaper sx={{ p: 3, mb: 4 }}>
                              <SectionTitle variant="h6" gutterBottom>
                                <SchoolIcon /> רקע לימודי של הבחורה
                              </SectionTitle>
                              <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                              <Grid container spacing={3}>
                                {renderTextField("highSchool", "תיכון", personalForm)}
                                {renderTextField("seminar", "שם הסמינר", personalForm)}
                                {renderSelect("seminarType", "סוג סמינר", OPTIONS.seminarType, personalForm)}
                                {renderSelect("studyPath", "נתיב לימודים", OPTIONS.studyPath, personalForm)}
                                {renderTextField("currentOccupation", "עיסוק נוכחי", personalForm)}
                              </Grid>
                            </StyledPaper>
                          </>
                        )}

                        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                          <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <GradientButton
                              type="submit"
                              size="large"
                              endIcon={<NavigateNextIcon />}
                              disabled={loading}
                              sx={{ px: 6, py: 2 }}
                            >
                              {loading ? <CircularProgress size={24} color="inherit" /> : "🚀 המשך לפרטי משפחה"}
                            </GradientButton>
                          </AnimatedButton>
                        </Box>
                      </form>
                    </motion.div>
                  </Slide>
                )}

                {/* שלב 2: פרטי משפחה */}
                {activeStep === 1 && (
                  <Slide direction="left" in={activeStep === 1} mountOnEnter unmountOnExit>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <form onSubmit={familyForm.handleSubmit(onSubmitFamilyInfo)}>
                        {/* פרטי אב */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <FamilyRestroomIcon /> פרטי אב
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderTextField("fatherName", "שם האב", familyForm)}
                            {renderSelect("fatherOrigin", "מוצא האב", OPTIONS.origin, familyForm)}
                            {renderTextField("fatherYeshiva", "ישיבת האב", familyForm)}
                            {renderSelect("fatherAffiliation", "שיוך האב", OPTIONS.fatherAffiliation, familyForm)}
                            {renderSelect("fatherOccupation", "עיסוק האב", OPTIONS.occupation, familyForm)}
                          </Grid>
                        </StyledPaper>

                        {/* פרטי אם */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <FamilyRestroomIcon /> פרטי אם
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderTextField("motherName", "שם האם", familyForm)}
                            {renderSelect("motherOrigin", "מוצא האם", OPTIONS.origin, familyForm)}
                            {renderTextField("motherGraduateSeminar", "סמינר בו למדה האם", familyForm)}
                            {renderTextField("motherPreviousName", "שם משפחה קודם של האם", familyForm)}
                            {renderSelect("motherOccupation", "עיסוק האם", OPTIONS.occupation, familyForm)}
                          </Grid>
                        </StyledPaper>

                        {/* פרטי משפחה נוספים */}
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <FamilyRestroomIcon /> פרטי משפחה נוספים
                          </SectionTitle>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />
                          <Grid container spacing={3}>
                            {renderSelect("parentsStatus", "סטטוס הורים", OPTIONS.parentsStatus, familyForm)}
                            {renderSelect("healthStatus", "מצב בריאותי במשפחה", OPTIONS.familyHealthStatus, familyForm)}
                            {renderTextField("familyRabbi", "רב המשפחה", familyForm)}
                            <Grid item xs={12}>
                              {renderTextField("familyAbout", "על המשפחה", familyForm, "text", true, 4)}
                            </Grid>
                          </Grid>
                        </StyledPaper>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
                          <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outlined"
                              size="large"
                              startIcon={<NavigateBeforeIcon />}
                              onClick={handleBack}
                              sx={{
                                px: 4,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: "700",
                                fontSize: "1.1rem",
                                borderColor: "#b87333",
                                color: "#2c1810",
                                borderWidth: "2px",
                                "&:hover": {
                                  borderColor: "#2c1810",
                                  backgroundColor: "rgba(184,115,51,0.1)",
                                  borderWidth: "2px",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              ⬅️ חזרה לפרטים אישיים
                            </Button>
                          </AnimatedButton>

                          <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <GradientButton
                              type="submit"
                              size="large"
                              endIcon={<NavigateNextIcon />}
                              disabled={loading}
                              sx={{ px: 6, py: 2 }}
                            >
                              {loading ? <CircularProgress size={24} color="inherit" /> : "👥 המשך לאנשי קשר"}
                            </GradientButton>
                          </AnimatedButton>
                        </Box>
                      </form>
                    </motion.div>
                  </Slide>
                )}

                {/* שלב 3: אנשי קשר */}
                {activeStep === 2 && (
                  <Slide direction="up" in={activeStep === 2} mountOnEnter unmountOnExit>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <form onSubmit={contactForm.handleSubmit(onSubmitContactInfo)}>
                        <StyledPaper sx={{ p: 3, mb: 4 }}>
                          <SectionTitle variant="h6" gutterBottom>
                            <ContactPhoneIcon /> אנשי קשר לבירורים
                          </SectionTitle>
                          <Typography
                            variant="body1"
                            sx={{
                              mb: 3,
                              color: "#2c1810",
                              fontWeight: "500",
                              textAlign: "center",
                              p: 2,
                              background: "linear-gradient(135deg, #fff8f0, #f0f8ff)",
                              borderRadius: 2,
                              border: "1px solid rgba(184, 115, 51, 0.2)",
                            }}
                          >
                            📞 אנא הוסף אנשי קשר שניתן לפנות אליהם לבירורים אודותיך
                          </Typography>
                          <Divider sx={{ mb: 3, backgroundColor: "rgba(184,115,51,0.3)", height: 2 }} />

                          {fields.map((field, index) => (
                            <ContactCard key={field.id} elevation={3} sx={{ p: 3, mb: 4 }}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight="bold"
                                color="#2c1810"
                                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                              >
                                <ContactPhoneIcon sx={{ color: "#b87333" }} />
                                איש קשר {index + 1}
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                  <Controller
                                    name={`contacts.${index}.name`}
                                    control={contactForm.control}
                                    render={({ field }) => (
                                      <StyledTextField
                                        {...field}
                                        label="שם איש הקשר"
                                        fullWidth
                                        error={!!contactForm.formState.errors.contacts?.[index]?.name}
                                        helperText={contactForm.formState.errors.contacts?.[index]?.name?.message}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Controller
                                    name={`contacts.${index}.contactType`}
                                    control={contactForm.control}
                                    render={({ field }) => (
                                      <FormControl
                                        fullWidth
                                        error={!!contactForm.formState.errors.contacts?.[index]?.contactType}
                                      >
                                        <InputLabel id={`contact-type-label-${index}`} sx={{ fontWeight: "600" }}>
                                          סוג הקשר
                                        </InputLabel>
                                        <StyledSelect
                                          {...field}
                                          labelId={`contact-type-label-${index}`}
                                          label="סוג הקשר"
                                          MenuProps={{
                                            PaperProps: {
                                              sx: {
                                                maxHeight: 300,
                                                borderRadius: 2,
                                                boxShadow: "0 16px 32px rgba(184, 115, 51, 0.2)",
                                                "& .MuiMenuItem-root": {
                                                  transition: "all 0.2s",
                                                  borderRadius: 1,
                                                  margin: "4px 8px",
                                                  "&:hover": {
                                                    backgroundColor: "rgba(184, 115, 51, 0.1)",
                                                    transform: "translateX(4px)",
                                                  },
                                                  "&.Mui-selected": {
                                                    backgroundColor: "rgba(184, 115, 51, 0.2)",
                                                    fontWeight: "600",
                                                    "&:hover": {
                                                      backgroundColor: "rgba(184, 115, 51, 0.3)",
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          }}
                                        >
                                          {OPTIONS.contactType.map((option) => (
                                            <MenuItem key={option} value={option}>
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </StyledSelect>
                                        {contactForm.formState.errors.contacts?.[index]?.contactType && (
                                          <Typography variant="caption" color="error" sx={{ mt: 1, fontWeight: "500" }}>
                                            {contactForm.formState.errors.contacts?.[index]?.contactType?.message}
                                          </Typography>
                                        )}
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Controller
                                    name={`contacts.${index}.phone`}
                                    control={contactForm.control}
                                    render={({ field }) => (
                                      <StyledTextField
                                        {...field}
                                        label="טלפון"
                                        fullWidth
                                        error={!!contactForm.formState.errors.contacts?.[index]?.phone}
                                        helperText={contactForm.formState.errors.contacts?.[index]?.phone?.message}
                                      />
                                    )}
                                  />
                                </Grid>
                              </Grid>
                              {index > 0 && (
                                <DeleteButton onClick={() => remove(index)}>
                                  <DeleteIcon />
                                </DeleteButton>
                              )}
                            </ContactCard>
                          ))}

                          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => append({ name: "", contactType: "רב", phone: "" })}
                              sx={{
                                borderRadius: 4,
                                px: 4,
                                py: 2,
                                fontWeight: "700",
                                fontSize: "1.1rem",
                                transition: "all 0.3s",
                                borderColor: "#b87333",
                                color: "#2c1810",
                                borderWidth: "2px",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0 8px 16px rgba(184,115,51,0.3)",
                                  borderColor: "#2c1810",
                                  backgroundColor: "rgba(184,115,51,0.1)",
                                  borderWidth: "2px",
                                },
                              }}
                            >
                              ➕ הוסף איש קשר נוסף
                            </Button>
                          </Box>
                        </StyledPaper>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
                          <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outlined"
                              size="large"
                              startIcon={<NavigateBeforeIcon />}
                              onClick={handleBack}
                              sx={{
                                px: 4,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: "700",
                                fontSize: "1.1rem",
                                borderColor: "#b87333",
                                color: "#2c1810",
                                borderWidth: "2px",
                                "&:hover": {
                                  borderColor: "#2c1810",
                                  backgroundColor: "rgba(184,115,51,0.1)",
                                  borderWidth: "2px",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              ⬅️ חזרה לפרטי משפחה
                            </Button>
                          </AnimatedButton>

                          <AnimatedButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <GradientButton
                              type="submit"
                              size="large"
                              startIcon={<SaveIcon />}
                              disabled={loading}
                              sx={{ px: 6, py: 2 }}
                            >
                              {loading ? <CircularProgress size={24} color="inherit" /> : "🎉 סיים רישום"}
                            </GradientButton>
                          </AnimatedButton>
                        </Box>
                      </form>
                    </motion.div>
                  </Slide>
                )}
              </>
            )}
          </Box>
        </StyledPaper>
      </motion.div>

      {/* הודעות הצלחה/שגיאה */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            width: "100%",
            borderRadius: "16px",
            boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
            border: "2px solid",
            borderColor:
              notification.severity === "success"
                ? "#b87333"
                : notification.severity === "error"
                  ? "#ff6b6b"
                  : "#2196f3",
            "& .MuiAlert-icon": {
              color: notification.severity === "success" ? "#b87333" : undefined,
              fontSize: "2rem",
            },
            "& .MuiAlert-message": {
              fontSize: "1.1rem",
              fontWeight: "600",
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {notification.message}
          </Typography>
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default UserRegistrationForm
