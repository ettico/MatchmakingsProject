"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Box, Button, LinearProgress, Typography } from "@mui/material"

interface FileUploaderProps {
  onUploadSuccess: (data: { fileUrl: string; fileName: string }) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  // API URL מתוקן
  const API_BASE_URL = "https://matchmakingsprojectserver.onrender.com/api"

  // יצירת axios instance נפרד כדי למנוע התנגשויות
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setProgress(0)
      console.log("קובץ נבחר:", e.target.files[0].name, "גודל:", e.target.files[0].size)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      console.error("לא נבחר קובץ")
      return
    }

    console.log("מתחיל העלאת קובץ:", file.name)
    console.log("API URL:", API_BASE_URL)

    setUploading(true)
    setProgress(0)

    try {
      // שלב 1: קבלת presigned URL
      console.log("מבקש presigned URL...")
      const presignedResponse = await apiClient.get("/files/presigned-url", {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
      })

      console.log("תגובת presigned URL:", presignedResponse.data)
      const presignedUrl = presignedResponse.data.url

      if (!presignedUrl) {
        throw new Error("לא התקבל presigned URL מהשרת")
      }

      // חילוץ URL הקובץ הסופי (ללא query parameters)
      const fileUrl = presignedUrl.split("?")[0]
      console.log("URL קובץ סופי:", fileUrl)

      // שלב 2: העלאת הקובץ ל-S3
      console.log("מעלה קובץ ל-S3...")
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        // הסרת Authorization header עבור S3
        transformRequest: [
          (data, headers) => {
            delete headers.Authorization
            return data
          },
        ],
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percent)
            console.log(`התקדמות העלאה: ${percent}%`)
          }
        },
      })

      console.log("קובץ הועלה בהצלחה!")

      // מעביר גם את הקישור וגם את שם הקובץ
      onUploadSuccess({
        fileUrl,
        fileName: file.name,
      })

      alert("הקובץ הועלה בהצלחה!")

      // איפוס הטופס
      setFile(null)
      setProgress(0)
    } catch (error: any) {
      console.error("שגיאה בהעלאת קובץ:", error)

      let errorMessage = "אירעה שגיאה בהעלאת הקובץ"

      if (axios.isAxiosError(error)) {
        console.error("פרטי שגיאה:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
        })

        if (error.response?.status === 404) {
          errorMessage = "שירות העלאת קבצים לא נמצא. אנא פנה למנהל המערכת."
        } else if (error.response?.status === 401) {
          errorMessage = "אין הרשאה להעלות קבצים. אנא התחבר מחדש."
        } else if (error.response?.status === 413) {
          errorMessage = "הקובץ גדול מדי. אנא בחר קובץ קטן יותר."
        } else if (error.response?.status === 400) {
          errorMessage = "סוג קובץ לא נתמך או שם קובץ לא תקין."
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "תם הזמן הקצוב להעלאה. אנא נסה שוב."
        } else if (error.code === "ERR_NETWORK") {
          errorMessage = "שגיאת רשת. אנא בדוק את החיבור לאינטרנט."
        }
      }

      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box>
      <Button
        variant="outlined"
        component="label"
        sx={{
          color: "#B87333",
          borderColor: "#B87333",
          "&:hover": {
            backgroundColor: "#B87333",
            color: "#ffffff",
            borderColor: "#B87333",
          },
        }}
      >
        בחר קובץ
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" // הגבלת סוגי קבצים
        />
      </Button>

      {file && (
        <Box mt={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            קובץ נבחר: {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            גודל: {(file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
            sx={{
              backgroundColor: "#000000",
              color: "#B87333",
              "&:hover": {
                backgroundColor: "#333333",
                color: "#FFD8A9",
              },
              "&:disabled": {
                backgroundColor: "#cccccc",
                color: "#666666",
              },
            }}
          >
            {uploading ? "מעלה..." : "העלה קובץ"}
          </Button>
        </Box>
      )}

      {uploading && (
        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#B87333",
              },
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, display: "block", textAlign: "center" }}>
            {progress}% הושלם
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default FileUploader
