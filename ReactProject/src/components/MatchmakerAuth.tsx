import { Container, Button, Box, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

const MatchmakerAuth = () => {
    const navigate = useNavigate();

    return (
        <Container sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>כניסה כשדכנית</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate("login/matchmaker")}>
                    כניסה
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("signup/matchmaker")}>
                    הרשמה
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate("allMales")}>
                    לצפיה במועמדים 
                </Button>
            </Box>
            <Outlet/>
        </Container>
    );
};

export default MatchmakerAuth;
