import { Container, Button, Box, Typography, AppBar, Toolbar, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container
            maxWidth={false}
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                textAlign: "center",
                color: "white",
                backgroundColor: "#001f3f", // כחול כהה
                padding: "0",
            }}
        >
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: "#001f3f" }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }}>
                    </Box>
                    <Button color="inherit" onClick={() => navigate("/candidate-auth")}>כניסה כמועמד</Button>
                    <Button color="inherit" onClick={() => navigate("/matchmaker-auth")}>כניסה כשדכנית</Button>
                    <Button color="inherit" onClick={() => navigate("/allMales")}>לכל המועמדים</Button>
                </Toolbar>
            </AppBar>

            {/* טקסט מחפשים שידוך */}
            <Typography variant="h5" sx={{ color: "#FFD700", mt: 3 }}>
                מחפשים שידוך?
            </Typography>

            {/* טקסט מודגש */}
            <Typography variant="h4" sx={{ color: "#00BFFF", fontWeight: "bold", mt: 1 }}>
                אנחנו כאן כדי לעזור לכם למצוא!
            </Typography>

            {/* מודעות מאורסים */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            backgroundColor: "#FFD700", // צהוב
                            borderRadius: "10px",
                            padding: "20px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "#001f3f" }}>
                            מועמד 1
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#001f3f" }}>
                            פרטים על המועמד 1...
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            backgroundColor: "#FFD700", // צהוב
                            borderRadius: "10px",
                            padding: "20px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "#001f3f" }}>
                            מועמד 2
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#001f3f" }}>
                            פרטים על המועמד 2...
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Box
                        sx={{
                            backgroundColor: "#FFD700", // צהוב
                            borderRadius: "10px",
                            padding: "20px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "#001f3f" }}>
                            מועמד 3
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#001f3f" }}>
                            פרטים על המועמד 3...
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Home;
