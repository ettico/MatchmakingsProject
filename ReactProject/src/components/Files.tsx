import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, LinearProgress, Typography } from '@mui/material';

interface FileUploaderProps {
  onUploadSuccess: (data: { fileUrl: string; fileName: string }) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setProgress(0);
    }
  };
  const ApiUrl=process.env.REACT_APP_API_URL

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      const response = await axios.get(`${ApiUrl}/files/presigned-url`, {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
      });

      const presignedUrl = response.data.url;
      const fileUrl = presignedUrl.split('?')[0];

      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
          'Authorization': undefined, // לא נשלח ב-S3
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });

      // מעביר גם את הקישור וגם את שם הקובץ
      onUploadSuccess({
        fileUrl,
        fileName: file.name,
      });

      alert('הקובץ הועלה בהצלחה!');
    } catch (error: any) {
      console.error('שגיאה בהעלאה:', error);
      alert('אירעה שגיאה בהעלאת הקובץ');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Button 
        variant="outlined" 
        component="label"
        sx={{ 
          color: '#B87333',
          borderColor: '#B87333',
          '&:hover': {
            backgroundColor: '#B87333',
            color: '#ffffff',
            borderColor: '#B87333',
          }
        }}
      >
        בחר קובץ
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      {file && (
        <Box mt={2}>
          <Typography variant="body2">קובץ נבחר: {file.name}</Typography>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
            sx={{ 
              mt: 1,
              backgroundColor: '#000000',
              color: '#B87333',
              '&:hover': {
                backgroundColor: '#333333',
                color: '#FFD8A9',
              }
            }}
          >
            העלה קובץ
          </Button>
        </Box>
      )}

      {uploading && (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption">{progress}%</Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUploader;
