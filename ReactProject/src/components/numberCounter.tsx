"use client"

import { useState } from "react"
import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"

// צבעים - שחור ונחושת
const colors = {
  background: "#111111", // שחור
  primary: "#B87333", // נחושת
  primaryLight: "#D4A76A", // נחושת בהיר
  primaryDark: "#8B5A2B", // נחושת כהה
  text: "#FFFFFF", // לבן
  darkText: "#111111", // שחור
}

const NumberCounter = ({ targetNumber }:any) => {
  const [count, setCount] = useState(0)
  const [isCounting, setIsCounting] = useState(false)

  const handleMouseEnter = () => {
    if (isCounting) return

    setIsCounting(true)
    let currentCount = 100
    const interval = setInterval(() => {
      if (currentCount < targetNumber) {
        currentCount += 50
        setCount(currentCount)
      } else {
        clearInterval(interval)
        setCount(targetNumber)
        setIsCounting(false)
      }
    }, 50) // מהירות הספירה
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} onMouseEnter={handleMouseEnter} style={{ cursor: "pointer" }}>
      <Box
        className="counter"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderRadius: "16px",
          background: `linear-gradient(135deg, rgba(184,115,51,0.1) 0%, rgba(212,167,106,0.1) 100%)`,
          backdropFilter: "blur(5px)",
          border: `1px solid ${colors.primary}40`,
          boxShadow: `0 8px 32px rgba(184,115,51,0.2)`,
          width: "100px",
          height: "100px",
          transition: "all 0.3s ease",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: colors.primary,
            textShadow: `0 0 10px ${colors.primary}80`,
          }}
        >
          +{isCounting ? count : targetNumber}
        </Typography>
      </Box>
    </motion.div>
  )
}

export default NumberCounter
