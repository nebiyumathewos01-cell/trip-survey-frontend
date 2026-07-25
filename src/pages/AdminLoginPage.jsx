import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiLogIn } from 'react-icons/fi'
import { RiGraduationCapLine } from 'react-icons/ri'
import { FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'
import api from '../api/axios'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login }  = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/login', { username, password })
      login(res.data.token, res.data.admin)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060c18] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background:'radial-gradient(circle,#33a8f9,transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
          style={{ background:'radial-gradient(circle,#10b981,transparent 70%)' }} />
      </div>

      {/* Top controls */}
      <button onClick={toggle}
        className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                   text-white flex items-center justify-center transition-colors">
        {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
      <Link to="/"
        className="fixed top-4 left-4 flex items-center gap-2 text-white/60 hover:text-white/90
                   text-sm transition-colors font-body">
        <FiArrowLeft size={15} /> Back to Survey
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#0d1524] border border-gray-800/60 rounded-3xl shadow-2xl overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-brand-500 via-brand-400 to-amber-400" />

          <div className="p-8">
            {/* Logo mark */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600
                              flex items-center justify-center mx-auto mb-4 shadow-glow-brand">
                <RiGraduationCapLine size={28} className="text-white" />
              </div>
              <h1 className="font-display text-2xl text-white mb-1">Admin Portal</h1>
              <p className="text-gray-500 text-sm font-body">
                Wachemo University — CS Department
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-900/20 border border-red-800/50
                           text-red-400 text-sm rounded-xl px-4 py-3 mb-5 font-body"
              >
                <FiAlertCircle className="flex-shrink-0 mt-0.5" size={16} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 font-sans">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="input-field pl-9 bg-gray-800/60 border-gray-700 text-white
                               placeholder-gray-600 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5 font-sans">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-field pl-9 pr-10 bg-gray-800/60 border-gray-700 text-white
                               placeholder-gray-600 focus:ring-brand-500"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full
                           bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold
                           text-sm tracking-wide font-sans shadow-glow-brand
                           hover:from-brand-600 hover:to-brand-800 hover:scale-[1.02]
                           transition-all duration-300 active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <><FiLogIn size={17} /> Sign In</>
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 text-xs mt-6 font-body">
              Default credentials: admin / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
