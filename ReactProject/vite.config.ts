import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // מגדיר גבול גבוה יותר לאזהרות כדי שה-Build לא יכשל על גודל קבצים
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // מפצל את הקוד לחלקים קטנים יותר כדי להקל על השרת
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
