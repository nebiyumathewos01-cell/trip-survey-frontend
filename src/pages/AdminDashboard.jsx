import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  FiUsers, FiMapPin, FiAward, FiSearch, FiFilter, FiTrash2,
  FiDownload, FiLogOut, FiHome, FiBarChart2, FiSun, FiMoon,
  FiRefreshCw, FiMenu, FiX
} from 'react-icons/fi'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../api/axios'

const COLORS = ['#f59e0b', '#d97706', '#fbbf24', '#b45309', '#10b981']

const DEST_LABELS = {
  'Arba Minch – Nech Sar National Park': 'Arba Minch',
  'Durame 777': 'Durame 777',
  'Wondo Genet': 'Wondo Genet',
  'Langano Lake': 'Langano',
  'Other Destination': 'Other',
}

function shorten(name) {
  return DEST_LABELS[name] || name
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 truncate">{value}</p>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDest, setFilterDest] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/statistics')
      setStats(res.data.data)
    } catch (err) {
      console.error('Stats fetch error:', err)
    }
  }, [])

  const fetchStudents = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: 200 })
      if (search) params.append('search', search)
      if (filterDest !== 'all') params.append('destination', filterDest)
      const res = await api.get(`/admin/students?${params}`)
      setStudents(res.data.data)
      setTotal(res.data.total)
    } catch (err) {
      console.error('Students fetch error:', err)
    }
  }, [search, filterDest])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchStats(), fetchStudents()])
      setLoading(false)
    }
    load()
  }, [fetchStats, fetchStudents])

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Delete Response?',
      text: `Remove ${name}'s response permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
    })
    if (!result.isConfirmed) return

    try {
      await api.delete(`/admin/student/${id}`)
      setStudents(s => s.filter(s => s._id !== id))
      setTotal(t => t - 1)
      await fetchStats()
      Swal.fire({ icon: 'success', title: 'Deleted', text: 'Response removed.', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Delete failed.' })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const exportCSV = () => {
    const headers = ['Name', 'Student ID', 'Section', 'Destination', 'Custom Destination', 'Reason', 'Date']
    const rows = students.map(s => [
      s.name, s.studentId, s.section, s.destination,
      s.customDestination || '', `"${s.reason}"`,
      new Date(s.createdAt).toLocaleDateString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trip_survey_responses_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Chart data
  const pieData = stats?.destinations?.map((d, i) => ({
    name: shorten(d._id),
    value: d.count,
    fill: COLORS[i % COLORS.length],
  })) || []

  const barData = stats?.destinations?.map((d, i) => ({
    name: shorten(d._id),
    votes: d.count,
    fill: COLORS[i % COLORS.length],
  })) || []

  const navItems = [
    { id: 'overview', icon: FiBarChart2, label: 'Overview' },
    { id: 'responses', icon: FiUsers, label: 'Responses' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          shadow-xl z-50 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-base flex items-center justify-center">CS</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Trip Survey</p>
                <p className="text-gray-400 text-xs">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <FiHome size={18} /> View Survey
            </Link>
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
            <button onClick={toggle} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
              {dark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
              <FiLogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>
      </>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden text-gray-600 dark:text-gray-400">
              <FiMenu size={22} />
            </button>
            <h1 className="font-bold text-gray-900 dark:text-white text-lg capitalize">
              {activeTab === 'overview' ? '📊 Overview' : '👥 Responses'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { fetchStats(); fetchStudents() }} className="p-2 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors" title="Refresh">
              <FiRefreshCw size={18} />
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{admin?.username}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FiUsers}  label="Total Responses"   value={loading ? '…' : stats?.total ?? 0}                                        color="bg-brand-500"  delay={0}    />
                <StatCard icon={FiAward}  label="Most Popular"      value={loading ? '…' : shorten(stats?.mostPopular ?? 'N/A')}                  color="bg-brand-600"  delay={0.05} />
                <StatCard icon={FiMapPin} label="Section A"         value={loading ? '…' : (stats?.sections?.find(s => s._id === 'A')?.count ?? 0)} color="bg-amber-600"  delay={0.1}  />
                <StatCard icon={FiMapPin} label="Section B"         value={loading ? '…' : (stats?.sections?.find(s => s._id === 'B')?.count ?? 0)} color="bg-amber-700"  delay={0.15} />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base">Vote Distribution</h3>
                  {pieData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">No data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} votes`, 'Votes']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>

                {/* Bar */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base">Votes by Destination</h3>
                  {barData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">No data yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={barData} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#f3f4f6'} />
                        <XAxis dataKey="name" tick={{ fill: dark ? '#9ca3af' : '#6b7280', fontSize: 12 }} />
                        <YAxis tick={{ fill: dark ? '#9ca3af' : '#6b7280', fontSize: 12 }} allowDecimals={false} />
                        <Tooltip cursor={{ fill: dark ? '#1f2937' : '#f9fafb' }} formatter={(v) => [`${v} votes`, 'Votes']} />
                        <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                          {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </motion.div>
              </div>

              {/* Recent responses */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Recent Responses</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        {['Name', 'Student ID', 'Section', 'Destination', 'Date'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {(stats?.recent || []).map(s => (
                        <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.name}</td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{s.studentId}</td>
                          <td className="px-4 py-3"><span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-medium px-2 py-0.5 rounded-full">Sec {s.section}</span></td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{shorten(s.destination)}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {(!stats?.recent?.length) && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No responses yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {/* ── RESPONSES TAB ── */}
          {activeTab === 'responses' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or student ID…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-10 h-10 text-sm"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select
                    value={filterDest}
                    onChange={e => setFilterDest(e.target.value)}
                    className="input-field pl-9 h-10 text-sm pr-8 w-full sm:w-52"
                  >
                    <option value="all">All Destinations</option>
                    <option value="Arba Minch – Nech Sar National Park">Arba Minch – Nech Sar</option>
                    <option value="Durame 777">Durame 777</option>
                    <option value="Wondo Genet">Wondo Genet</option>
                    <option value="Langano Lake">Langano Lake</option>
                    <option value="Other Destination">Other Destination</option>
                  </select>
                </div>

                {/* Export */}
                <button
                  onClick={exportCSV}
                  disabled={students.length === 0}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiDownload size={16} /> Export CSV
                </button>
              </div>

              {/* Count */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{students.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{total}</span> responses
              </p>

              {/* Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        {['#', 'Name', 'Student ID', 'Section', 'Destination', 'Reason', 'Date', 'Action'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i}>
                            {[...Array(8)].map((_, j) => (
                              <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-full" /></td>
                            ))}
                          </tr>
                        ))
                      ) : students.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                            No responses found
                          </td>
                        </tr>
                      ) : (
                        students.map((s, i) => (
                          <motion.tr
                            key={s._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{s.name}</td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{s.studentId}</td>
                            <td className="px-4 py-3">
                              <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-medium px-2 py-0.5 rounded-full">
                                Sec {s.section}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                              {shorten(s.destination)}
                              {s.customDestination && (
                                <span className="block text-xs text-amber-500">{s.customDestination}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-xs">
                              <p className="truncate" title={s.reason}>{s.reason}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                              {new Date(s.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleDelete(s._id, s.name)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="Delete"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
