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
    Checkbox
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// הגדרת הסכמות
const commonSchema = yup.object().shape({
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
    healthCondition: yup.boolean().required('שדה חובה'),
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

const maleSchema = commonSchema.concat(yup.object().shape({
    driversLicense: yup.boolean().required('שדה חובה'),
    smoker: yup.boolean().required('שדה חובה'),
    beard: yup.string(),
    hot: yup.string(),
    suit: yup.string(),
    smallYeshiva: yup.string(),
    bigYeshiva: yup.string(),
    kibbutz: yup.string(),
    occupation: yup.string(),
    expectationsFromPartner: yup.string(),
    preferredSeminarStyle: yup.string(),
    preferredProfessionalPath: yup.string(),
    headCovering: yup.string(),
}));

const femaleSchema = commonSchema.concat(yup.object().shape({
    headCovering: yup.string(),
    highSchool: yup.string(),
    seminar: yup.string(),
    studyPath: yup.string(),
    additionalEducationalInstitution: yup.string(),
    currentOccupation: yup.string(),
    interestedInBoy: yup.string(),
    drivingLicense: yup.string(),
    smoker: yup.boolean().required('שדה חובה'),
    beard: yup.string(),
    hat: yup.string(),
    suit: yup.string(),
}));

const Form = () => {
    const [gender, setGender] = useState('male');
    const schema = gender === 'male' ? maleSchema : femaleSchema;

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        const apiUrl = gender === 'male' ? 'https://localhost:7012/api/Male' : 'https://localhost:7012/api/Women';

        try {
            const response = await axios.post(apiUrl, data);
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
            <Typography variant="h4" align="center">מילוי פרטים</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* שדות משותפים */}
                <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="שם פרטי"
                            fullWidth
                            error={!!errors.firstName}
                            helperText={errors.firstName ? errors.firstName.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="שם משפחה"
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName ? errors.lastName.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="country"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="מדינה"
                            fullWidth
                            error={!!errors.country}
                            helperText={errors.country ? errors.country.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="עיר"
                            fullWidth
                            error={!!errors.city}
                            helperText={errors.city ? errors.city.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="address"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="כתובת"
                            fullWidth
                            error={!!errors.address}
                            helperText={errors.address ? errors.address.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="tz"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="תעודת זהות"
                            fullWidth
                            error={!!errors.tz}
                            helperText={errors.tz ? errors.tz.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="class"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="עדה"
                            fullWidth
                            error={!!errors.class}
                            helperText={errors.class ? errors.class.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="anOutsider"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    checked={field.value} // ניהול מצב ה-checkbox
                                    onChange={(e) => field.onChange(e.target.checked)} // עדכון הערך
                                />
                            }
                            label="חוצניק" // תווית ליד ה-checkbox
                            error={!!errors.anOutsider}
                        />
                    )}

                />
                <Controller
                    name="backGround"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="רקע"
                            fullWidth
                            error={!!errors.backGround}
                            helperText={errors.backGround ? errors.backGround.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="openness"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="פתיחות"
                            fullWidth
                            error={!!errors.openness}
                            helperText={errors.openness ? errors.openness.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="age"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="גיל"
                            type="number"
                            fullWidth
                            error={!!errors.age}
                            helperText={errors.age ? errors.age.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="healthCondition"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    checked={field.value} // ניהול מצב ה-checkbox
                                    onChange={(e) => field.onChange(e.target.checked)} // עדכון הערך
                                />
                            }
                            label="מצב בריאותי" // תווית ליד ה-checkbox
                            error={!!errors.healthCondition}
                        />
                    )}
                />
                <Controller
                    name="status"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="סטטוס"
                            fullWidth
                            error={!!errors.status}
                            helperText={errors.status ? errors.status.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="statusVacant"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    {...field}
                                    checked={field.value} // ניהול מצב ה-checkbox
                                    onChange={(e) => field.onChange(e.target.checked)} // עדכון הערך
                                />
                            }
                            label="סטטוס פנוי" // תווית ליד ה-checkbox
                            error={!!errors.statusVacant}
                        />
                    )}
                />
                <Controller
                    name="pairingType"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="סוג חיבור"
                            fullWidth
                            error={!!errors.pairingType}
                            helperText={errors.pairingType ? errors.pairingType.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="height"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="גובה"
                            type="number"
                            fullWidth
                            error={!!errors.height}
                            helperText={errors.height ? errors.height.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="טלפון"
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone ? errors.phone.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="אימייל"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email ? errors.email.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="fatherPhone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="טלפון אב"
                            fullWidth
                            error={!!errors.fatherPhone}
                            helperText={errors.fatherPhone ? errors.fatherPhone.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="motherPhone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="טלפון אם"
                            fullWidth
                            error={!!errors.motherPhone}
                            helperText={errors.motherPhone ? errors.motherPhone.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="moreInformation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="מידע נוסף"
                            fullWidth
                            multiline
                            rows={4}
                            error={!!errors.moreInformation}
                            helperText={errors.moreInformation ? errors.moreInformation.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="ageFrom"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="מגיל"
                            type="number"
                            fullWidth
                            error={!!errors.ageFrom}
                            helperText={errors.ageFrom ? errors.ageFrom.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="ageTo"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="עד גיל"
                            type="number"
                            fullWidth
                            error={!!errors.ageTo}
                            helperText={errors.ageTo ? errors.ageTo.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="importantTraitsInMe"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="תכונות חשובות בי"
                            fullWidth
                            error={!!errors.importantTraitsInMe}
                            helperText={errors.importantTraitsInMe ? errors.importantTraitsInMe.message : ''}
                            margin="normal"
                        />
                    )}
                />
                <Controller
                    name="importantTraitsIAmLookingFor"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="תכונות חשובות שאני מחפש"
                            fullWidth
                            error={!!errors.importantTraitsIAmLookingFor}
                            helperText={errors.importantTraitsIAmLookingFor ? errors.importantTraitsIAmLookingFor.message : ''}
                            margin="normal"
                        />
                    )}
                />

                {/* בחירת מין */}
                <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <Typography variant="h6">בחר מין</Typography>
                    <RadioGroup row value={gender} onChange={(e) => setGender(e.target.value)}>
                        <FormControlLabel value="male" control={<Radio />} label="בחור" />
                        <FormControlLabel value="female" control={<Radio />} label="בחורה" />
                    </RadioGroup>
                </FormControl>

                {/* שדות ייחודיים */}
                {gender === 'male' && (
                    <>
                        <Controller
                            name="driversLicense"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={field.value} // ניהול מצב ה-checkbox
                                            onChange={(e) => field.onChange(e.target.checked)} // עדכון הערך
                                        />
                                    }
                                    label="רישיון נהיגה" // תווית ליד ה-checkbox
                                />
                            )}
                        />

                        <Controller
                            name="smoker"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            {...field}
                                            checked={field.value} // ניהול מצב ה-checkbox
                                            onChange={(e) => field.onChange(e.target.checked)} // עדכון הערך
                                        />
                                    }
                                    label="מעשן" // תווית ליד ה-checkbox
                                />
                            )}
                        />
                        <Controller
                            name="beard"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="זקן"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="hot"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="חם"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="suit"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="חליפה"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="smallYeshiva"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ישיבה קטנה"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="bigYeshiva"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ישיבה גדולה"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="kibbutz"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="קיבוץ"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="occupation"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="עיסוק"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="expectationsFromPartner"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ציפיות מהשותף"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="preferredSeminarStyle"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="סגנון סמינר מועדף"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="preferredProfessionalPath"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="נתיב מקצועי מועדף"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="headCovering"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="כיסוי ראש"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                    </>
                )}

                {gender === 'female' && (
                    <>
                        <Controller
                            name="highSchool"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="תיכון"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="seminar"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="סמינר"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="studyPath"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="נתיב לימודים"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="additionalEducationalInstitution"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="מוסד חינוכי נוסף"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="currentOccupation"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="עיסוק נוכחי"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="interestedInBoy"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="מעוניינת בבחור"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="drivingLicense"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="רישיון נהיגה"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="smoker"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="מעשנת"
                                    type="checkbox"
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="beard"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="זקן"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="hot"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="כובע"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Controller
                            name="suit"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="חליפה"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                    </>
                )}

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>שלח</Button>
            </form>
        </Box>
    );
};

export default Form;
