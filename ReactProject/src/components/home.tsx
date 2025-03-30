import { Container, Button, Box, Typography, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../css/home.css';
import NumberCounter from "./numberCounter";

const Home = () => {
    const navigate = useNavigate();
    const [paused, setPaused] = useState(false);



    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#00152b", // צבע רקע כחול כהה
                // padding: "0",
            }}
        >
            {/* Header */}
            <AppBar position="fixed" sx={{ backgroundColor: "#00152b", width: "100%", boxShadow: "none", borderBottom: "1.5px solid white" }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                        color="inherit"
                        onClick={() => navigate("/candidate-auth")}
                        sx={{
                            '&:hover': { backgroundColor: '#FFFFFF', color: '#000000' }, // מעבר עכבר
                            transition: "background-color 0.3s, color 0.3s",
                        }}
                    >
                        כניסה כמועמד
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/matchmaker-auth")}
                        sx={{
                            '&:hover': { backgroundColor: '#FFFFFF', color: '#000000' }, // מעבר עכבר
                            transition: "background-color 0.3s, color 0.3s",
                        }}
                    >
                        כניסה כשדכנית
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => navigate("/allMales")}
                        sx={{
                            '&:hover': { backgroundColor: '#FFFFFF', color: '#000000' }, // מעבר עכבר
                            transition: "background-color 0.3s, color 0.3s",
                        }}
                    >
                        לכל המועמדים
                    </Button>
                </Toolbar>
            </AppBar>

            {/* טקסט מחפשים שידוך */}
            <Box sx={{ mt: 10, textAlign: "center" }}>
                <Typography variant="h5" sx={{ color: "#FFFFFF" }}>
                    ?מחפשים שידוך
                </Typography>
                <Typography variant="h4" sx={{ color: "#00BFFF", fontWeight: "bold", marginBottom: "20px" }}> {/* צבע תכלת מודגש */}
                    אנחנו כאן <br />
                    !!! כדי לעזור לכם למצוא
                </Typography>
            </Box>
            <div className="happy">
                <div className="giff">
                </div>
            </div>
            {/* כיתוב "מאושרים שלנו" */}
            <br />
            <Typography variant="h4" sx={{ color: "#FFFFFF", mb: 2 }}>
                ~המאושרים שלנו~
            </Typography>

            <div
                className="marquee-container"
                onMouseEnter={() => setPaused(true)} // עצירת האנימציה
                onMouseLeave={() => setPaused(false)} // חידוש האנימציה
            >
                <div className={`marquee-content ${paused ? 'paused' : ''}`}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <div key={index} className="marquee-item">
                            {/* מועמד {index + 1} */}
                        </div>
                    ))}
                </div>
            </div>
            <div className="icons">
                <div id="icon1"></div>
                <div id="icon2"></div>
                <div id="icon3"></div>
            </div>
            <div className="counters-container">
                <NumberCounter targetNumber={1528} />
                <NumberCounter targetNumber={1365} />
                <NumberCounter targetNumber={1867} />
            </div>
            <div className="text">
                <div className="fff">נרשמו עד כה </div>
                <div className="fff">הצעות שרצות כרגע </div>
                <div className="fff">זוגות שנפגשו </div>
            </div>
        </Container>
    );
};

export default Home;
