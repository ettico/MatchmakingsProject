// About.jsx (משמש לראוטר אם פונים ל /about)
import { Container } from "@mui/material";
import AboutCard from "./aboutCard";

const About = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <AboutCard />
    </Container>
  );
};

export default About;
