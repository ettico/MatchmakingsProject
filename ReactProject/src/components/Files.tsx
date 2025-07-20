"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Box, Button, LinearProgress, Typography, Chip, Card, CardMedia } from "@mui/material"
import { CheckCircle, InsertDriveFile, Image as ImageIcon } from "@mui/icons-material"

interface FileUploaderProps {
  onUploadSuccess: (data: { fileUrl: string; fileName: string }) => void
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{ fileUrl: string; fileName: string } | null>(null)

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
    }
  }

  const ApiUrl = process.env.REACT_APP_API_URL

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      const response = await axios.get(`${ApiUrl}/files/presigned-url`, {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
      })

      const presignedUrl = response.data.url
      const fileUrl = presignedUrl.split("?")[0]

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
          Authorization: undefined, // לא נשלח ב-S3
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })

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

      alert("הקובץ הועלה בהצלחה!")
    } catch (error: any) {
      console.error("שגיאה בהעלאה:", error)
      alert("אירעה שגיאה בהעלאת הקובץ")
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
      {/* כפתור בחירת קובץ - מוצג רק אם לא הועלה קובץ */}
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
          בחר קובץ
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      )}

      {/* הצגת קובץ נבחר */}
      {file && !uploadedFile && (
        <Box mt={2}>
          <Typography variant="body2">קובץ נבחר: {file.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            גודל: {(file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
            sx={{
              mt: 1,
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
            label={`הועלה בהצלחה: ${uploadedFile.fileName}`}
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
          {isImageFile(uploadedFile.fileName) && (
            <Card sx={{ maxWidth: 300, mb: 2, boxShadow: 3 }}>
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
                  // אם יש שגיאה בטעינת התמונה, הצג הודעה
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
            </Card>
          )}

          {/* הצגת אייקון לקבצים שאינם תמונות */}
          {!isImageFile(uploadedFile.fileName) && (
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
