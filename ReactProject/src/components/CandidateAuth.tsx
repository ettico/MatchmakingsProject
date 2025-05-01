// CandidateAuth.tsx
import {
    Container,
    Button,
    Box,
    Typography,
    AppBar,
    Toolbar,
    Modal,
    Paper,
    Backdrop,
    Fade,
    IconButton,
  } from "@mui/material";
  import { useContext, useState } from "react";
  import { Outlet, useNavigate } from "react-router-dom";
  import { userContext } from "./UserContext";
  import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
  import LoginIcon from "@mui/icons-material/Login";
  import PersonAddIcon from "@mui/icons-material/PersonAdd";
  import EditNoteIcon from "@mui/icons-material/EditNote";
  import HomeIcon from "@mui/icons-material/Home";
  
  const CandidateAuth = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState("");
  
    const handleNavigate = (path: string, type: string) => {
      navigate(path);
      setModalType(type);
      setOpen(true);
    };
  
    const isPostDetails = modalType === "post-details";
  
    return (
      <Container
        maxWidth={false}
        sx={{
          minHeight: "100vh",
          backgroundColor: "#00152b",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#00152b",
            borderBottom: "2px solid #fff",
            paddingY: 1,
          }}
        >
          <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
            {!user && (
              <>
                <StyledButton
                  onClick={() => handleNavigate("login/candidate", "login")}
                  startIcon={<LoginIcon />}
                >
                  כניסה
                </StyledButton>
                <StyledButton
                  onClick={() => handleNavigate("signup/candidate", "signup")}
                  startIcon={<PersonAddIcon />}
                >
                  הרשמה
                </StyledButton>
              </>
            )}
            {!user && (
              <StyledButton
                onClick={() => handleNavigate("Post-Details-Auth", "post-details")}
                startIcon={<EditNoteIcon />}
              >
                המשך למילוי פרטים
              </StyledButton>
            )}
            <StyledButton onClick={() => navigate("/")} startIcon={<HomeIcon />}>
              דף הבית
            </StyledButton>
          </Toolbar>
        </AppBar>
  
        {/* טקסט מרכזי מעוצב */}
        <Box sx={{ mt: 15, textAlign: "center", color: "#fff" }}>
          { 
                // {/* {user.name} */}
                (
            <>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", mb: 1, color: "#00BFFF" }}
              >
                שלום לך 
                {/* {user.name} */}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  animation: "fadeIn 3s ease-in-out",
                  fontStyle: "italic",
                  color: "#FFEB3B",
                }}
              >
                כולנו רוצים כבר לבשר לך בשורה טובה! <br />
                מבטיחים לעשות כמיטב יכולתנו 💙
              </Typography>
            </>
          )}
        </Box>
  
        {/* MODAL */}
        <Modal
          open={open}
          onClose={() => !isPostDetails && setOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 400,
            sx: { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <Fade in={open}>
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isPostDetails ? "80%" : 400,
                maxHeight: "90vh",
                overflowY: "auto",
                padding: 4,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                boxShadow: "0 0 30px rgba(0,0,0,0.4)",
              }}
            >
              {isPostDetails && (
                <Box sx={{ textAlign: "left", mb: 2 }}>
                  <IconButton
                    onClick={() => setOpen(false)}
                    sx={{ color: "#00152b" }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Box>
              )}
              <Outlet />
            </Paper>
          </Fade>
        </Modal>
      </Container>
    );
  };
  
  // כפתור מעוצב יותר, עם צבעים חמים
  const StyledButton = ({ children, ...props }: any) => (
    <Button
      {...props}
      variant="contained"
      sx={{
        color: "#00152b",
        backgroundColor: "#FFEB3B",
        fontWeight: "bold",
        '&:hover': {
          backgroundColor: "#FFC107",
          color: "#000000",
          transform: "scale(1.05)",
        },
        transition: "all 0.3s ease-in-out",
        borderRadius: "20px",
        paddingX: 2,
        paddingY: 1,
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </Button>
  );
  
  export default CandidateAuth;
  