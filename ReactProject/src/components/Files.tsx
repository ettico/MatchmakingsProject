"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Box, Button, LinearProgress, Typography, Chip, Card, CardMedia } from "@mui/material"
import { CheckCircle, InsertDriveFile, Image as ImageIcon } from "@mui/icons-material"

interface FileUploaderProps {
  onUploadSuccess: (data: { fileUrl: string; fileName: string }) => void
  acceptedFileTypes?: string
  showPreview?: boolean
  label?: string
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif",
  showPreview = true,
  label = "בחר קובץ",
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)

  // API URL מתוקן
  const API_BASE_URL = "https://matchmakingsprojectserver.onrender.com/api"

  // יצירת axios instance נפרד כדי למנוע התנגשויות
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  })

  // פונקציה לבדיקה אם הקובץ הוא תמונה
  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf("."))
    return imageExtensions.includes(extension)
  }

  // פונקציה לקבלת אייקון לפי סוג קובץ
  const getFileIcon = (fileName: string) => {
    if (isImageFile(fileName)) {
      return <ImageIcon sx={{ color: "#B87333" }} />
    }
    return <InsertDriveFile sx={{ color: "#B87333" }} />
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setProgress(0)
      setUploadedFile(null) // איפוס קובץ קודם
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

      // שמירת פרטי הקובץ שהועלה
      const uploadedFileData = {
        fileUrl,
        fileName: file.name,
      }

      setUploadedFile(uploadedFileData)

      // מעביר גם את הקישור וגם את שם הקובץ
      onUploadSuccess(uploadedFileData)

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

  const handleNewUpload = () => {
    setUploadedFile(null)
    setFile(null)
    setProgress(0)
  }

  return (
    <Box>
      {/* כפתור בחירת קובץ */}
      {!uploadedFile && (
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
          {label}
          <input type="file" hidden onChange={handleFileChange} accept={acceptedFileTypes} />
        </Button>
      )}

      {/* הצגת קובץ נבחר */}
      {file && !uploadedFile && (
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

      {/* progress bar */}
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

      {/* הצגת קובץ שהועלה */}
      {uploadedFile && (
        <Box mt={2}>
          {/* Chip עם סימן וי */}
          <Chip
            icon={<CheckCircle />}
            label={`הועלה: ${uploadedFile.fileName}`}
            color="success"
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiChip-icon": {
                color: "#4caf50",
              },
              "& .MuiChip-label": {
                fontWeight: "bold",
              },
            }}
          />

          {/* הצגת תמונה אם זה קובץ תמונה */}
          {showPreview && isImageFile(uploadedFile.fileName) && (
            <Card sx={{ maxWidth: 300, mb: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={uploadedFile.fileUrl}
                alt={uploadedFile.fileName}
                sx={{
                  objectFit: "contain",
                  backgroundColor: "#f5f5f5",
                }}
                onError={(e) => {
                  console.error("שגיאה בטעינת תמונה:", e)
                  // אם יש שגיאה בטעינת התמונה, הצג placeholder
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=300&text=שגיאה בטעינת תמונה"
                }}
              />
            </Card>
          )}

          {/* הצגת אייקון לקבצים שאינם תמונות */}
          {showPreview && !isImageFile(uploadedFile.fileName) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                mb: 2,
                maxWidth: 300,
              }}
            >
              {getFileIcon(uploadedFile.fileName)}
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {uploadedFile.fileName}
              </Typography>
            </Box>
          )}

          {/* כפתור להעלאת קובץ חדש */}
          <Button
            variant="outlined"
            onClick={handleNewUpload}
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
            העלה קובץ אחר
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default FileUploader
