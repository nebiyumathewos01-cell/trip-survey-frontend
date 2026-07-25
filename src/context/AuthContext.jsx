import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'))

  useEffect(() => {
    const saved = localStorage.getItem('adminUser')
    if (saved && token) {
      try { setAdmin(JSON.parse(saved)) } catch { logout() }
    }
  }, [])

  const login = (tokenValue, adminData) => {
    localStorage.setItem('adminToken', tokenValue)
    localStorage.setItem('adminUser', JSON.stringify(adminData))
    setToken(tokenValue)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
