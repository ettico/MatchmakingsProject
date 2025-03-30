import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { userContext } from './UserContext';

type FormValues = {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role: string;
};

export default function SignIn() {
    const  { setMyUser }= useContext(userContext);
     //const { user, setMyUser } = useContext(userContext);

    const { userType } = useParams(); // קבלת ה-role מה-params
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
console.log(userType);

        if (userType === 'matchmaker') {
            setValue("role", "MatchMaker"); // הגדרת role אוטומטית
        }
    }, [userType, setValue]);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const response = await axios.post('https://localhost:7012/api/Auth/register', data);
            console.log('Response:', response.data);

            setTimeout(() => {
                setLoading(false);
                setSuccessMessage("הנתונים נשמרו בהצלחה✔️");

                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            }, 3000);
        } catch (error) {
            console.error('Error during registration:', error);
            setLoading(false);
            if (error) {
                console.log('Response data:', error);
            }
        }
    };

    return (
        <Container sx={{ backgroundColor: 'rgba(255, 255, 255, 0.639)' }}>
            <Typography variant="h4" gutterBottom>Sign In</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField {...register("firstName", { required: "FirstName is required" })} label="שם פרטי" error={!!errors.firstName} helperText={errors.firstName ? errors.firstName.message : ''} fullWidth margin="normal" />
                <TextField {...register("lastName", { required: "LastName is required" })} label="שם משפחה" error={!!errors.lastName} helperText={errors.lastName ? errors.lastName.message : ''} fullWidth margin="normal" />
                <TextField {...register("username", { required: "Username is required" })} label="מייל" type="email" error={!!errors.username} helperText={errors.username ? errors.username.message : ''} fullWidth margin="normal" />
                <TextField {...register("password", { required: "Password is required" })} label="סיסמא" type="password" error={!!errors.password} helperText={errors.password ? errors.password.message : ''} fullWidth margin="normal" />
                
                {userType !== 'matchmaker' && ( // הצגת השדה רק אם לא שדכנית
                    <FormControl fullWidth margin="normal">
                        <InputLabel>תפקיד</InputLabel>
                        <Select {...register("role", { required: "Role is required" })} error={!!errors.role}>
                            <MenuItem value="Male">זכר</MenuItem>
                            <MenuItem value="Women">נקבה</MenuItem>
                        </Select>
                        {errors.role && <span>{errors.role.message}</span>}
                    </FormControl>
                )}

                <Button type="submit" variant="contained" color="primary">שמירה</Button>
            </form>
            <Link to="/login">יש לכם כבר חשבון אצלינו? לחצו למעבר לחשבון שלכם</Link>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            )}
            {successMessage && (
                <Box 
                    sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: '#4caf50', 
                        color: 'white', 
                        borderRadius: '4px',
                        fontSize: '1.5rem',
                        textAlign: 'center'
                    }}
                >
                    {successMessage}
                </Box>
            )}
        </Container>
    );
}
