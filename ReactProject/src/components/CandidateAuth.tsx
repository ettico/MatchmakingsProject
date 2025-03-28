import { Container, Button, Box, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const CandidateAuth = () => {
    const navigate = useNavigate();

    return (
        <Container sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>כניסה כמועמד</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate("login/candidate")}>
                    כניסה
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("signup/candidate")}>
                    הרשמה
                </Button>
            </Box>
            <Outlet></Outlet>
        </Container>
    );
};

export default CandidateAuth;
