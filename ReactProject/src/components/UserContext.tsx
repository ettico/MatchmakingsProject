"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
// import { jwtDecode } from "jwt-decode";

interface User {
  id: number
  firstName: string
  lastName: string
  role: string
  token: string
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

// const decodeAndVerifyToken = (token: string) => {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );

//     const payload = JSON.parse(jsonPayload);
//     console.log("פענוח הטוקן:", payload);

//     // בדיקת תוקף הטוקן
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (payload.exp && payload.exp < currentTime) {
//       console.error("הטוקן פג תוקף:", new Date(payload.exp * 1000));
//       return null;
//     }

//     // שליפת מזהה המשתמש מהclaim המותאם אישית
//     const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
//     const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
//     const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

//     return {
//       userId,
//       role,
//       name,
//     };
//   } catch (error) {
//     console.error("שגיאה בפענוח הטוקן:", error);
//     return null;
//   }
// };
// const getUserDataFromToken = (token: string) => {
//   try {
//     const decoded: any = jwtDecode(token)
//     return decoded.id
//   } catch (error) {
//     console.error("שגיאה בפענוח ה-Token", error)
//     return null
//   }
// }
 const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

    const ApiUrl=process.env.REACT_APP_API_URL

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

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

  // const fetchUserData = async (userId: number, role: string) => {
  //   try {
  //     let apiUrl:string|undefined
  //     if(role === "Male"){
  //      apiUrl=`https://localhost:7012/api/Male/${userId}`
  //     }
  //     else if(role === "Women"){
  //       apiUrl=`https://localhost:7012/api/Women/${userId}`
  //     }
  //     else if(role === "MatchMaker"){
  //       apiUrl=`https://localhost:7012/api/MatchMaker/${userId}`
  //     }
      
  //     const response = await axios.get(apiUrl??"");
      
  //     console.log(response.data);
      
  //     return response.data;
  //   } catch (err) {
  //     console.error("שגיאה בטעינת נתוני המשתמש:", err);
  //     setError("שגיאה בטעינת נתוני המשתמש");
  //     return null;
  //   }
  // };

  const login = async (username: string, password: string) => {
    // debugger;
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${ApiUrl}/Auth/login`, {
        UserName: username,
        Password: password,
      })

      const userData = response.data
      setUser({
  ...userData.user,
  token: userData.token,
})
      // שמירת נתוני המשתמש בלוקל סטורג'
      localStorage.setItem("user", JSON.stringify(userData))

      // הגדרת הטוקן בכותרות של הבקשה
      if (userData.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
  
        // פענוח ובדיקת הטוקן
        // const decodedToken = decodeAndVerifyToken(userData.token);
        // if (decodedToken) {
        //   const { userId, role } = decodedToken;
          // // טוען את פרטי המשתמש מהדאטה בייס
          // const fullUserData = await fetchUserData(userId, role);
          // if (fullUserData) {
          //   setUser(fullUserData);
          // }
          // console.log("פרטים אישיים",fullUserData);
      // }
        
      }

    } catch (err) {
      console.error("שגיאה בהתחברות:", err)
      setError("שם משתמש או סיסמה שגויים")
    } finally {
      setLoading(false)
    }
  }
console.log(user);

  const logout = () => {
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return <userContext.Provider value={{ user, loading, error, login, logout }}>{children}</userContext.Provider>
}
export default UserProvider