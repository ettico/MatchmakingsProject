"use client"

import { Container, Typography,  Paper, Grid } from "@mui/material"
import { motion } from "framer-motion"
// import { useNavigate } from "react-router-dom"

// צבעים חדשים
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

const About = () => {
//   const navigate = useNavigate()

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        py: 12,
        px: { xs: 2, md: 4 },
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <Typography
          variant="h2"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 6,
            background: `linear-gradient(45deg, ${colors.primary}, ${colors.background})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          אודות בשורה טובה
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 6,
            backgroundColor: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: `1px solid ${colors.primary}40`,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: colors.primary, fontWeight: "bold" }}>
            המשימה שלנו
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: colors.text }}>
            "בשורה טובה" הוקמה מתוך אמונה עמוקה בחשיבות של בניית בתים יהודיים על יסודות איתנים של אהבה, כבוד ואמונה. אנו
            מחויבים לעזור לכל יהודי ויהודייה למצוא את זיווגם האמיתי, תוך שמירה על ערכי המסורת והצניעות.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: colors.text }}>
            אנו מאמינים כי שידוך מוצלח מתחיל בהבנה עמוקה של הצרכים, השאיפות והערכים של כל אדם. לכן, אנו משקיעים זמן רב
            בהכרת המועמדים שלנו ובהתאמה מדויקת ביניהם.
          </Typography>
        </Paper>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.primary}40`,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: colors.primary, fontWeight: "bold" }}>
                  הגישה שלנו
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: colors.text }}>
                  אנו מאמינים בגישה אישית ומותאמת לכל מועמד ומועמדת. צוות השדכניות המנוסה שלנו עובד בשיטה ייחודית המשלבת
                  בין הבנה עמוקה של עולם השידוכים החרדי לבין כלים טכנולוגיים מתקדמים.
                </Typography>
                <Typography variant="body1" sx={{ color: colors.text }}>
                  כל מועמד עובר תהליך היכרות מעמיק, הכולל שיחות אישיות, שאלונים מפורטים ובירורים יסודיים. מידע זה מוזן
                  למערכת החכמה שלנו, המסייעת לנו למצוא את ההתאמות הטובות ביותר.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: `1px solid ${colors.primary}40`,
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: colors.primary, fontWeight: "bold" }}>
                  הערכים שלנו
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: colors.text }}>
                  <strong>צניעות:</strong> אנו מקפידים על כללי הצניעות בכל שלבי תהליך השידוך.
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: colors.text }}>
                  <strong>אמינות:</strong> אנו מחויבים לאמת ולשקיפות מלאה בכל המידע שאנו מספקים.
                </Typography>
                <Typography variant="body1" paragraph sx={{ color: colors.text }}>
                  <strong>רגישות:</strong> אנו מבינים את הרגישות הרבה הכרוכה בתהליך השידוך ופועלים בהתאם.
                </Typography>
                <Typography variant="body1" sx={{ color: colors.text }}>
                  <strong>מקצועיות:</strong> צוות השדכניות שלנו עובר הכשרה מקיפה ומתעדכן באופן שוטף.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 6,
              backgroundColor: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: `1px solid ${colors.primary}40`,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: colors.primary, fontWeight: "bold" }}>
              הצוות שלנו
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: colors.text }}>
              צוות "בשורה טובה" מורכב משדכניות מנוסות בעלות רקע מגוון בקהילות השונות. כל שדכנית מביאה עמה ניסיון עשיר
              והיכרות מעמיקה עם הקהילה אותה היא מייצגת.
            </Typography>
            <Typography variant="body1" sx={{ color: colors.text }}>
              אנו מאמינים כי השילוב בין ניסיון אישי, הבנה קהילתית עמוקה וכלים טכנולוגיים מתקדמים מאפשר לנו להציע את
              שירות השידוכים הטוב ביותר.
            </Typography>
          </Paper>
        </motion.div>

        {/* <Box sx={{ textAlign: "center", mt: 8 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("about/how-it-works")}
              sx={{
                borderRadius: "30px",
                padding: "12px 36px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                backgroundColor: colors.primary,
                color: colors.darkText,
                boxShadow: `0 8px 16px ${colors.primary}40`,
                "&:hover": {
                  backgroundColor: colors.accent,
                  boxShadow: `0 12px 24px ${colors.primary}60`,
                },
              }}
            >
              איך זה עובד?
            </Button>
          </motion.div>
        </Box> */}
      </motion.div>
    </Container>
  )
}

export default About
