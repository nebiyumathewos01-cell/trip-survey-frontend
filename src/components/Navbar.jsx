import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { RiGraduationCapLine } from 'react-icons/ri'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const linkCls = `text-sm font-medium transition-colors duration-200 hover:text-brand-400 font-sans
    ${scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/80'}`

  return (
    <motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${scrolled
          ? 'bg-white/95 dark:bg-[#0d1524]/95 backdrop-blur-md shadow-lg shadow-black/5 border-b border-gray-100 dark:border-gray-800/60'
          : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600
                            flex items-center justify-center shadow-glow-brand flex-shrink-0">
              <RiGraduationCapLine size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className={`font-semibold text-[13px] tracking-tight font-sans
                ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                CS Trip Survey
              </p>
              <p className={`text-[10px] font-body tracking-wide
                ${scrolled ? 'text-gray-400 dark:text-gray-500' : 'text-white/50'}`}>
                Wachemo University
              </p>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('destinations')} className={linkCls}>
              Destinations
            </button>
            <button onClick={() => scrollTo('about')} className={linkCls}>
              About
            </button>
            <Link to="/admin/login" className={linkCls}>
              Admin
            </Link>
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                ${scrolled
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                  : 'hover:bg-white/15 text-white/75'}`}
            >
              {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
          </div>

          {/* Mobile icons */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-white/10">
              {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
            <button onClick={() => setMenuOpen(o => !o)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-white/10">
              {menuOpen ? <FiX size={19} /> : <FiMenu size={19} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-[#0d1524] border-t border-gray-100
                     dark:border-gray-800 px-4 py-3 space-y-1 shadow-xl"
        >
          {['destinations','about'].map(id => (
            <button key={id} onClick={() => scrollTo(id)}
              className="block w-full text-left px-3 py-2.5 rounded-xl text-gray-700
                         dark:text-gray-200 font-medium font-body hover:bg-gray-50
                         dark:hover:bg-gray-800/60 transition-colors capitalize">
              {id}
            </button>
          ))}
          <Link to="/admin/login"
            className="block px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-200
                       font-medium font-body hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
            Admin
          </Link>
        </motion.div>
      )}
    </motion.nav>
  )
}
