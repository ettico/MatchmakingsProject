import React, { useState } from 'react';
import {
    Button,
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
    Checkbox,
    Grid,
    Tabs,
    Tab,
    Container,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// הגדרת אפשרויות בחירה
const OPTIONS = {
    class: ['אשכנזי', 'ספרדי', 'תימני', 'מעורב', 'אחר'],
    background: ['חרדי', 'דתי לאומי', 'חוזר בתשובה', 'מסורתי', 'אחר'],
    openness: ['שמרני', 'מודרני', 'פתוח', 'חסידי', 'ליטאי', 'ספרדי', 'אחר'],
    status: ['רווק/ה', 'גרוש/ה', 'אלמן/ה'],
    pairingType: ['שידוך רגיל', 'פגישה ישירה', 'שידוך מהיר', 'לא משנה'],
    headCoveringFemale: ['מטפחת', 'פאה', 'כובע על הפאה', 'לא משנה'],
    headCoveringMale: ['כיפה סרוגה', 'כיפה שחורה', 'כיפה לבנה', 'כיפה גדולה', 'כיפה קטנה'],
    hat: ['מגבעת', 'כובע חסידי', 'ללא כובע', 'אחר'],
    beard: ['זקן מלא', 'זקן חלקי', 'מגולח', 'לא משנה'],
    suit: ['ארוכה', ' קצרה', 'לא משנה'],
    yeshivaType: ['ליטאית', 'חסידית', 'ספרדית', 'הסדר', 'תורנית לאומית', 'אחר'],
    seminarType: ['בית יעקב', 'סמינר חסידי', 'אולפנה', 'מדרשה', 'אחר'],
    studyPath: ['הוראה', 'הנדסאות', 'עיצוב', 'תרפיה', 'מחשבים', 'אחר'],
    drivingLicense: ['יש', 'אין', 'בתהליך למידה'],
    preferredOccupation: ['אברך', 'עובד', 'משלב לימודים ועבודה', 'לא משנה'],
    healthCondition: ['בריא', 'מצב בריאותי מיוחד'],
    
    // אפשרויות לטופס פרטי משפחה
    origin: ['אשכנזי', 'ספרדי', 'תימני', 'מעורב', 'אחר'],
    fatherAffiliation: ['חסידי', 'ליטאי', 'ספרדי', 'דתי לאומי', 'אחר'],
    occupation: ['אברך', 'עובד', 'פנסיונר', 'עצמאי', 'שכיר', 'אחר'],
    parentsStatus: ['נשואים', 'גרושים', 'אלמן', 'אלמנה', 'שניהם נפטרו'],
    familyHealthStatus: ['תקין', 'יש בעיות בריאותיות במשפחה'],
    
    // אפשרויות לטופס פרטי התקשרות
    contactType: ['רב', 'מורה', 'קרוב משפחה', 'חבר', 'שדכן', 'אחר'],
};

// הגדרת הסכמות
// סכמה לפרטים אישיים
const personalInfoSchema = yup.object().shape({
    firstName: yup.string().required('שדה חובה'),
    lastName: yup.string().required('שדה חובה'),
    country: yup.string().required('שדה חובה'),
    city: yup.string().required('שדה חובה'),
    address: yup.string().required('שדה חובה'),
    tz: yup.string().required('שדה חובה'),
    class: yup.string().required('שדה חובה'),
    anOutsider: yup.boolean().required('שדה חובה'),
    backGround: yup.string().required('שדה חובה'),
    openness: yup.string().required('שדה חובה'),
    age: yup.number().required('שדה חובה').positive().integer(),
    healthCondition: yup.string().required('שדה חובה'),
    status: yup.string().required('שדה חובה'),
    statusVacant: yup.boolean().required('שדה חובה'),
    pairingType: yup.string().required('שדה חובה'),
    height: yup.number().required('שדה חובה').positive(),
    phone: yup.string().required('שדה חובה'),
    email: yup.string().email('אימייל לא תקין').required('שדה חובה'),
    fatherPhone: yup.string().required('שדה חובה'),
    motherPhone: yup.string().required('שדה חובה'),
    moreInformation: yup.string(),
    club: yup.string(),
    ageFrom: yup.number().required('שדה חובה').positive().integer(),
    ageTo: yup.number().required('שדה חובה').positive().integer(),
    importantTraitsInMe: yup.string(),
    importantTraitsIAmLookingFor: yup.string(),
});

// סכמה לפרטי משפחה
const familyDetailsSchema = yup.object().shape({
    fatherName: yup.string().required('שדה חובה'),
    fatherOrigin: yup.string().required('שדה חובה'),
    fatherYeshiva: yup.string(),
    fatherAffiliation: yup.string().required('שדה חובה'),
    fatherOccupation: yup.string().required('שדה חובה'),
    motherName: yup.string().required('שדה חובה'),
    motherOrigin: yup.string().required('שדה חובה'),
    motherGraduateSeminar: yup.string(),
    motherPreviousName: yup.string(),
    motherOccupation: yup.string().required('שדה חובה'),
    parentsStatus: yup.string().required('שדה חובה'),
    healthStatus: yup.string().required('שדה חובה'),
    familyRabbi: yup.string(),
    familyAbout: yup.string(),
});

// סכמה לפרטי התקשרות
const contactDetailsSchema = yup.object().shape({
    contact1Name: yup.string().required('שדה חובה'),
    contact1Type: yup.string().required('שדה חובה'),
    contact1Phone: yup.string().required('שדה חובה'),
    contact2Name: yup.string().required('שדה חובה'),
    contact2Type: yup.string().required('שדה חובה'),
    contact2Phone: yup.string().required('שדה חובה'),
    contact3Name: yup.string(),
    contact3Type: yup.string(),
    contact3Phone: yup.string(),
});

const commonSchema = personalInfoSchema;

const maleSchema = commonSchema.concat(yup.object().shape({
    driversLicense: yup.boolean(),
    smoker: yup.boolean(),
    beard: yup.string().required('שדה חובה'),
    hat: yup.string().required('שדה חובה'),
    suit: yup.string().required('שדה חובה'),
    smallYeshiva: yup.string(),
    bigYeshiva: yup.string(),
    yeshivaType: yup.string().required('שדה חובה'),
    kibbutz: yup.string(),
    occupation: yup.string().required('שדה חובה'),
    expectationsFromPartner: yup.string(),
    preferredSeminarStyle: yup.string(),
    preferredProfessionalPath: yup.string(),
    headCovering: yup.string().required('שדה חובה'),
    preferredHeadCovering: yup.string().required('שדה חובה'),
}));

const femaleSchema = commonSchema.concat(yup.object().shape({
    headCovering: yup.string().required('שדה חובה'),
    highSchool: yup.string(),
    seminar: yup.string(),
    seminarType: yup.string().required('שדה חובה'),
    studyPath: yup.string().required('שדה חובה'),
    additionalEducationalInstitution: yup.string(),
    currentOccupation: yup.string().required('שדה חובה'),
    interestedInBoy: yup.string(),
    drivingLicense: yup.string().required('שדה חובה'),
    smoker: yup.boolean().required('שדה חובה'),
    preferredBeard: yup.string().required('שדה חובה'),
    preferredHat: yup.string().required('שדה חובה'),
    preferredSuit: yup.string().required('שדה חובה'),
    preferredYeshiva: yup.string(),
    preferredOccupation: yup.string().required('שדה חובה'),
}));

const Form: React.FC = () => {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const schema = gender === 'male' ? maleSchema : femaleSchema;
    const [activeTab, setActiveTab] = useState<number>(0);

    // קביעת סכמה לפי הטאב הפעיל
    const getActiveSchema = () => {
        switch(activeTab) {
            case 0:
                return schema; // פרטים אישיים - לפי מגדר
            case 1:
                return familyDetailsSchema; // פרטי משפחה
            case 2:
                return contactDetailsSchema; // פרטי התקשרות
            default:
                return schema;
        }
    };

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(getActiveSchema()),
        defaultValues: {
            // Common defaults
            anOutsider: false,
            statusVacant: true,
            // Gender-specific defaults
            ...(gender === 'male' ? {
                driversLicense: false,
                smoker: false,
            } : {
                // smoker: false,
            })
        }
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const onSubmit = async (data: any) => {
        let apiUrl;
        
        switch(activeTab) {
            case 0: // פרטים אישיים
                apiUrl = gender === 'male' ? 'https://localhost:7012/api/Male' : 'https://localhost:7012/api/Women';
                break;
            case 1: // פרטי משפחה
                apiUrl = 'https://localhost:7012/api/FamilyDetails';
                // הוסף את ה-ID של המשתמש לפי המגדר
                data = {
                    ...data,
                    maleId: gender === 'male' ? 'CURRENT_USER_ID' : null,
                    womenId: gender === 'female' ? 'CURRENT_USER_ID' : null
                };
                break;
            case 2: // פרטי התקשרות
                apiUrl = 'https://localhost:7012/api/Contact';
                
                // עיבוד אנשי קשר כרשימה
                const contacts = [];
                
                // הוסף אנשי קשר כהפניות נפרדות
                if (data.contact1Name && data.contact1Phone) {
                    contacts.push({
                        name: data.contact1Name,
                        contactType: data.contact1Type,
                        phone: data.contact1Phone,
                        maleId: gender === 'male' ? 'CURRENT_USER_ID' : null,
                        womenId: gender === 'female' ? 'CURRENT_USER_ID' : null
                    });
                }
                
                if (data.contact2Name && data.contact2Phone) {
                    contacts.push({
                        name: data.contact2Name,
                        contactType: data.contact2Type,
                        phone: data.contact2Phone,
                        maleId: gender === 'male' ? 'CURRENT_USER_ID' : null,
                        womenId: gender === 'female' ? 'CURRENT_USER_ID' : null
                    });
                }
                
                if (data.contact3Name && data.contact3Phone) {
                    contacts.push({
                        name: data.contact3Name,
                        contactType: data.contact3Type,
                        phone: data.contact3Phone,
                        maleId: gender === 'male' ? 'CURRENT_USER_ID' : null,
                        womenId: gender === 'female' ? 'CURRENT_USER_ID' : null
                    });
                }
                
                // שלח כל איש קשר בנפרד
                try {
                    for (const contact of contacts) {
                        await axios.post(apiUrl, contact);
                    }
                    console.log('Success: contacts added');
                    alert('אנשי הקשר נשמרו בהצלחה!');
                    return;
                } catch (error) {
                    console.error('Error:', error);
                    alert('שגיאה בשמירת אנשי קשר. אנא נסה שנית.');
                    return;
                }
        }

        try {
            const response = await axios.post(apiUrl, data);
            console.log('Success:', response.data);
            
            const successMessages = {
                0: 'הפרטים האישיים נשלחו בהצלחה!',
                1: 'פרטי המשפחה נשמרו בהצלחה!',
                2: 'אנשי הקשר נשמרו בהצלחה!'
            };
            
            alert(successMessages[activeTab]);
        } catch (error) {
            console.error('Error:', error);
            alert('שגיאה בשליחת הטופס. אנא נסה שנית.');
        }
    };

    // משותף לקבוצות שדות
    const renderField = (name: string, label: string, type: string = "text", multiline: boolean = false, rows: number = 1) => (
        <Grid item xs={12} sm={6} md={3}>
            <Controller
                name={name}
                control={control}
                defaultValue={type === "number" ? 0 : type === "checkbox" ? false : ""}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={label}
                        fullWidth
                        type={type}
                        multiline={multiline}
                        rows={rows}
                        error={!!errors[name]}
                        helperText={errors[name] ? errors[name].message : ''}
                        margin="normal"
                        size="small"
                    />
                )}
            />
        </Grid>
    );

    const renderCheckbox = (name: string, label: string) => (
        <Grid item xs={12} sm={6} md={3}>
            <Controller
                name={name}
                control={control}
                defaultValue={false}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        }
                        label={label}
                    />
                )}
            />
        </Grid>
    );
    
    const renderSelect = (name: string, label: string, options: string[]) => (
        <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth margin="normal" size="small" error={!!errors[name]}>
                <InputLabel id={`${name}-label`}>{label}</InputLabel>
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <Select
                            {...field}
                            labelId={`${name}-label`}
                            label={label}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors[name] && (
                    <FormHelperText>{errors[name].message}</FormHelperText>
                )}
            </FormControl>
        </Grid>
    );

    return (
        <Container maxWidth="lg" sx={{ direction: 'rtl' }}>
            <Paper elevation={3} sx={{ p: 3, mt: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                    השלם את הפרטים האישיים שלך
                </Typography>

                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange} 
                    indicatorColor="primary" 
                    textColor="primary" 
                    centered 
                    sx={{ mb: 3 }}
                >
                    <Tab label="פרטים אישיים" />
                    <Tab label="פרטי משפחה" />
                    <Tab label="פרטי התקשרות" />
                </Tabs>

                <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
                    {activeTab === 0 && (
                        <>
                            {/* בחירת מין */}
                            <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <Typography variant="h6" gutterBottom>בחר מין</Typography>
                                    <RadioGroup 
                                        row 
                                        value={gender} 
                                        onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                                    >
                                        <FormControlLabel value="male" control={<Radio />} label="בחור" />
                                        <FormControlLabel value="female" control={<Radio />} label="בחורה" />
                                    </RadioGroup>
                                </FormControl>
                            </Paper>

                            {/* פרטים אישיים בסיסיים */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    פרטים אישיים בסיסיים
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("firstName", "שם פרטי")}
                                    {renderField("lastName", "שם משפחה")}
                                    {renderField("age", "גיל", "number")}
                                    {renderField("tz", "תעודת זהות")}
                                </Grid>
                            </Paper>

                            {/* פרטי מגורים */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    פרטי מגורים
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("country", "מדינה")}
                                    {renderField("city", "עיר")}
                                    {renderField("address", "כתובת")}
                                    {renderCheckbox("anOutsider", "חוצניק")}
                                </Grid>
                            </Paper>

                            {/* רקע ומידע בסיסי */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    רקע ומידע בסיסי
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderSelect("class", "עדה", OPTIONS.class)}
                                    {renderSelect("backGround", "רקע", OPTIONS.background)}
                                    {renderSelect("openness", "פתיחות", OPTIONS.openness)}
                                    {renderField("height", "גובה (ס״מ)", "number")}
                                </Grid>
                            </Paper>

                            {/* סטטוס */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    סטטוס
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderSelect("status", "סטטוס", OPTIONS.status)}
                                    {renderCheckbox("statusVacant", "סטטוס פנוי")}
                                    {renderSelect("pairingType", "סוג חיבור", OPTIONS.pairingType)}
                                    {renderSelect("healthCondition", "מצב בריאותי", OPTIONS.healthCondition)}
                                </Grid>
                            </Paper>

                            {/* פרטי קשר */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    פרטי קשר
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("phone", "טלפון")}
                                    {renderField("email", "אימייל")}
                                    {renderField("fatherPhone", "טלפון אב")}
                                    {renderField("motherPhone", "טלפון אם")}
                                </Grid>
                            </Paper>

                            {/* העדפות */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    העדפות והרחבה
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("ageFrom", "מגיל", "number")}
                                    {renderField("ageTo", "עד גיל", "number")}
                                    {renderField("importantTraitsInMe", "תכונות חשובות בי")}
                                    {renderField("importantTraitsIAmLookingFor", "תכונות חשובות שאני מחפש/ת")}
                                </Grid>
                            </Paper>

                            {/* מידע נוסף */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    מידע נוסף
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("moreInformation", "מידע נוסף", "text", true, 4)}
                                </Grid>
                            </Paper>

                            {/* שדות ייחודיים לפי מגדר */}
                            {gender === 'male' && (
                                <>
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                            מידע אישי על הבחור
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {renderCheckbox("driversLicense", "רישיון נהיגה")}
                                            {renderCheckbox("smoker", "מעשן")}
                                            {renderSelect("beard", "זקן", OPTIONS.beard)}
                                            {renderSelect("hat", "כובע", OPTIONS.hat)}
                                            {renderSelect("suit", "חליפה", OPTIONS.suit)}
                                            {renderSelect("headCovering", "כיסוי ראש", OPTIONS.headCoveringMale)}
                                        </Grid>
                                    </Paper>
                                    
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                            רקע לימודי של הבחור
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {renderField("smallYeshiva", "ישיבה קטנה")}
                                            {renderField("bigYeshiva", "ישיבה גדולה")}
                                            {renderSelect("yeshivaType", "סוג ישיבה", OPTIONS.yeshivaType)}
                                            {renderField("kibbutz", "קיבוץ")}
                                            {renderField("occupation", "עיסוק נוכחי")}
                                        </Grid>
                                    </Paper>
                                    
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                            העדפות לגבי בת הזוג
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {renderField("expectationsFromPartner", "ציפיות מבת הזוג")}
                                            {renderSelect("preferredSeminarStyle", "סגנון סמינר מועדף", OPTIONS.seminarType)}
                                            {renderSelect("preferredProfessionalPath", "נתיב מקצועי מועדף לבת הזוג", OPTIONS.studyPath)}
                                            {renderSelect("preferredHeadCovering", "העדפה לכיסוי ראש", OPTIONS.headCoveringFemale)}
                                        </Grid>
                                    </Paper>
                                </>
                            )}

                            {gender === 'female' && (
                                <>
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                            מידע אישי על הבחורה
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {renderSelect("drivingLicense", "רישיון נהיגה", OPTIONS.drivingLicense)}
                                            {renderCheckbox("smoker", "מעשנת")}
                                            {renderSelect("headCovering", "כיסוי ראש", OPTIONS.headCoveringFemale)}
                                            {renderField("currentOccupation", "עיסוק נוכחי")}
                                        </Grid>
                                    </Paper>
                                    
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                            רקע לימודי של הבחורה
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {renderField("highSchool", "תיכון")}
                                            {renderField("seminar", "שם הסמינר")}
                                            {renderSelect("seminarType", "סוג סמינר", OPTIONS.seminarType)}
                                            {renderSelect("studyPath", "נתיב לימודים", OPTIONS.studyPath)}
                                            {renderField("additionalEducationalInstitution", "מוסד חינוכי נוסף")}
                                        </Grid>
                                    </Paper>
                                    
                                    <Paper sx={{ p: 2, mb: 3 }}>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                            העדפות לגבי בן הזוג
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {renderField("interestedInBoy", "סוג בחור מועדף")}
                                            {renderSelect("preferredBeard", "העדפה לזקן", OPTIONS.beard)}
                                            {renderSelect("preferredHat", "העדפה לכובע", OPTIONS.hat)}
                                            {renderSelect("preferredSuit", "העדפה לחליפה", OPTIONS.suit)}
                                            {renderSelect("preferredYeshiva", "העדפת סוג ישיבה", OPTIONS.yeshivaType)}
                                            {renderSelect("preferredOccupation", "עיסוק מועדף לבן הזוג", OPTIONS.preferredOccupation)}
                                        </Grid>
                                    </Paper>
                                </>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    size="large"
                                >
                                    שלח טופס
                                </Button>
                            </Box>
                        </>
                    )}

                    {activeTab === 1 && (
                        <>
                            {/* פרטי אב */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    פרטי אב
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("fatherName", "שם האב")}
                                    {renderSelect("fatherOrigin", "מוצא האב", OPTIONS.origin)}
                                    {renderField("fatherYeshiva", "ישיבת האב")}
                                    {renderSelect("fatherAffiliation", "שיוך האב", OPTIONS.fatherAffiliation)}
                                    {renderSelect("fatherOccupation", "עיסוק האב", OPTIONS.occupation)}
                                </Grid>
                            </Paper>
                            
                            {/* פרטי אם */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    פרטי אם
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderField("motherName", "שם האם")}
                                    {renderSelect("motherOrigin", "מוצא האם", OPTIONS.origin)}
                                    {renderField("motherGraduateSeminar", "סמינר בו למדה האם")}
                                    {renderField("motherPreviousName", "שם משפחה קודם של האם")}
                                    {renderSelect("motherOccupation", "עיסוק האם", OPTIONS.occupation)}
                                </Grid>
                            </Paper>
                            
                            {/* פרטי משפחה נוספים */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    פרטי משפחה נוספים
                                </Typography>
                                <Grid container spacing={2}>
                                    {renderSelect("parentsStatus", "סטטוס הורים", OPTIONS.parentsStatus)}
                                    {renderSelect("healthStatus", "מצב בריאותי במשפחה", OPTIONS.familyHealthStatus)}
                                    {renderField("familyRabbi", "רב המשפחה")}
                                    {renderField("familyAbout", "על המשפחה", "text", true, 4)}
                                </Grid>
                            </Paper>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    size="large"
                                >
                                    שמור פרטי משפחה
                                </Button>
                            </Box>
                        </>
                    )}

                    {activeTab === 2 && (
                        <>
                            {/* הוספת אנשי קשר */}
                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    אנשי קשר לבירורים
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    אנא הוסף אנשי קשר שניתן לפנות אליהם לבירורים אודותיך
                                </Typography>
                                
                                {/* איש קשר 1 */}
                                <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
                                    <Typography variant="subtitle2" gutterBottom>איש קשר 1</Typography>
                                    <Grid container spacing={2}>
                                        {renderField("contact1Name", "שם איש הקשר")}
                                        {renderSelect("contact1Type", "סוג הקשר", OPTIONS.contactType)}
                                        {renderField("contact1Phone", "טלפון")}
                                    </Grid>
                                </Paper>
                                
                                {/* איש קשר 2 */}
                                <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
                                    <Typography variant="subtitle2" gutterBottom>איש קשר 2</Typography>
                                    <Grid container spacing={2}>
                                        {renderField("contact2Name", "שם איש הקשר")}
                                        {renderSelect("contact2Type", "סוג הקשר", OPTIONS.contactType)}
                                        {renderField("contact2Phone", "טלפון")}
                                    </Grid>
                                </Paper>
                                
                                {/* איש קשר 3 */}
                                <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
                                    <Typography variant="subtitle2" gutterBottom>איש קשר 3 (לא חובה)</Typography>
                                    <Grid container spacing={2}>
                                        {renderField("contact3Name", "שם איש הקשר")}
                                        {renderSelect("contact3Type", "סוג הקשר", OPTIONS.contactType)}
                                        {renderField("contact3Phone", "טלפון")}
                                    </Grid>
                                </Paper>
                            </Paper>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary" 
                                    size="large"
                                >
                                    שמור אנשי קשר
                                </Button>
                            </Box>
                        </>
                    )}
                </form>
            </Paper>
        </Container>
    );
};

export default Form;