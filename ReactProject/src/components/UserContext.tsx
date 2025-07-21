"use client"
import { createContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  role: string
  userType: string
}

interface AuthenticatedUser {
  user: User
  token: string
}

interface UserContextType {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const userContext = createContext<UserContextType>({
  user: null,
  token: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: () => {},
})

interface UserProviderProps {
  children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ApiUrl = process.env.REACT_APP_API_URL || "https://matchmakingsprojectserver.onrender.com/api"

  useEffect(() => {
    const storedData = localStorage.getItem("auth")
    if (storedData) {
      try {
        const parsedData: AuthenticatedUser = JSON.parse(storedData)
        if (parsedData.user && parsedData.token) {
          setUser(parsedData.user)
          setToken(parsedData.token)
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedData.token}`
          console.log("משתמש נטען מהלוקל סטורג':", parsedData.user)
        }
      } catch (err) {
        console.error("שגיאה בפענוח נתוני משתמש מהלוקל סטורג':", err)
        localStorage.removeItem("auth")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log("מנסה התחברות עם:", { username })

      const response = await axios.post(
        `${ApiUrl}/Auth/login`,
        {
          UserName: username,
          Password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      )

      console.log("תגובת התחברות:", response.data)

      const userData: AuthenticatedUser = response.data

      if (!userData.user || !userData.token) {
        throw new Error("נתוני התחברות לא תקינים")
      }

      console.log("משתמש:", userData.user)
      console.log("טוקן:", userData.token.substring(0, 20) + "...")

      setUser(userData.user)
      setToken(userData.token)
      localStorage.setItem("auth", JSON.stringify(userData))
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`

      console.log("התחברות הושלמה בהצלחה")
    } catch (err: any) {
      console.error("שגיאה בהתחברות:", err)

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("שם משתמש או סיסמה שגויים")
        } else if (err.response?.status === 404) {
          setError("משתמש לא נמצא במערכת")
        } else if (err.response?.status === 500) {
          setError("שגיאת שרת. אנא נסו שוב מאוחר יותר")
        } else if (err.code === "ECONNABORTED") {
          setError("תם הזמן הקצוב לחיבור. אנא נסו שוב")
        } else {
          setError(`שגיאה בהתחברות: ${err.response?.status || err.code}`)
        }
      } else {
        setError("שגיאה לא צפויה בהתחברות")
      }

      throw err // זורק את השגיאה כדי שהקומפוננטה תוכל לטפל בה
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log("מתנתק...")
    localStorage.removeItem("auth")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setToken(null)
    setError(null)
  }

  return <userContext.Provider value={{ user, token, loading, error, login, logout }}>{children}</userContext.Provider>
}

export default UserProvider
