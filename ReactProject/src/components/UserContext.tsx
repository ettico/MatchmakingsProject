"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

interface User {
  id: number
  firstName: string
  lastName: string
  role: string
  token: string
  // שדות נוספים לפי הצורך
}

interface UserContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const userContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
})

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // בדיקה אם יש נתוני משתמש בלוקל סטורג'
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // הגדרת הטוקן בכותרות של הבקשה
        if (parsedUser.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`
        }
      } catch (err) {
        console.error("שגיאה בפענוח נתוני משתמש מהלוקל סטורג':", err)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post("https://localhost:7012/api/Auth/login", {
        UserName: username,
        Password: password,
      })

      const userData = response.data

      // שמירת נתוני המשתמש בלוקל סטורג'
      localStorage.setItem("user", JSON.stringify(userData))

      // הגדרת הטוקן בכותרות של הבקשה
      if (userData.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
      }

      setUser(userData)
    } catch (err) {
      console.error("שגיאה בהתחברות:", err)
      setError("שם משתמש או סיסמה שגויים")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return <userContext.Provider value={{ user, loading, error, login, logout }}>{children}</userContext.Provider>
}
