import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollProgress />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <BackToTop />
      </AuthProvider>
    </ThemeProvider>
  )
}
