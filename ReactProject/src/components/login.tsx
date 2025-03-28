import { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from './userContext';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    UserName: yup.string().required('UserName is required'),
    Password: yup.string().required('Password is required'),
});

const Login = () => {
    // const  {setMyUser }= useContext(UserContext);
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const onSend = async (data: { UserName: any; }) => {
        try {
            const res = await axios.post("https://localhost:7012/api/Auth/login", data);
            console.log("Login successful");
            // setMyUser(res.data);
            navigate('/home');
        } catch (error: any) {
            console.error("Error:", error);
            setErrorMsg('Login failed, please register if you do not have an account.');
        }
    };

    return (
        <Container
        sx={{backgroundColor:'rgba(255, 255, 255, 0.639)'}}>
       
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit(onSend)}>
                <TextField
                    {...register('UserName')}
                    label="UserName"
                    required
                    fullWidth
                    margin="normal"
                    error={!!errors.UserName}
                    helperText={errors.UserName ? errors.UserName.message : ''}
                />
                <TextField
                    {...register('Password')}
                    type="password"
                    required
                    fullWidth
                    margin="normal"
                    label="Password"
                    error={!!errors.Password}
                    helperText={errors.Password ? errors.Password.message : ''}
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
            {errorMsg && (
                <div>
                    <Typography color="error">{errorMsg}</Typography>
                    <Link to="/signin">לרישום לחצו כאן</Link>
                </div>
            )}
            {!errorMsg&&<Link to="/signin">אין לכם חשבון אצלינו? הכנסו עכשיו</Link>}
        </Container>
    );
};

export default Login;
