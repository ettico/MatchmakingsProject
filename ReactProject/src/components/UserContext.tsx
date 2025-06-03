"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"

interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  role: string
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

  useEffect(() => {
    const storedData = localStorage.getItem("auth")
    if (storedData) {
      try {
        const parsedData: AuthenticatedUser = JSON.parse(storedData)
        setUser(parsedData.user)
        setToken(parsedData.token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (err) {
        console.error("שגיאה בפענוח נתוני משתמש מהלוקל סטורג':", err)
        localStorage.removeItem("auth")
      }
    }
    setLoading(false)
  }, [])
    const ApiUrl=process.env.REACT_APP_API_URL
  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${ApiUrl}/Auth/login`, {
        UserName: username,
        Password: password,
      })

      const userData: AuthenticatedUser = response.data

      setUser(userData.user)
      setToken(userData.token)
      localStorage.setItem("auth", JSON.stringify(userData))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } catch (err) {
      console.error("שגיאה בהתחברות:", err)
      setError("שם משתמש או סיסמה שגויים")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setToken(null)
  }

  return (
    <userContext.Provider value={{ user, token, loading, error, login, logout }}>
      {children}
    </userContext.Provider>
  )
}

export default UserProvider
