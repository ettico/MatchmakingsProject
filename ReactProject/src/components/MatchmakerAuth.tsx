import { Container, Button, Box, Typography } from "@mui/material";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userContext } from "./UserContext";

const MatchmakerAuth = () => {
    const navigate = useNavigate();
const {user}=useContext(userContext);
    return (
        <Container sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h4" gutterBottom>שלום לך {user?.firstName}</Typography>
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
                <Button variant="contained" color="secondary" onClick={() => navigate("post-details-matchmaker")}>
                    להמשך מילוי פרטייך
                </Button>
            </Box>
            <br />

            <Outlet/>
        </Container>
        
    );
};

export default MatchmakerAuth;
