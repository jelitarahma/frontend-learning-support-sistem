import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Calendar,
  BarChart3,
  Users,
  Award,
  Settings,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Play,
  FileText,
  LogOut,
  MessageSquare,
  Loader2,
  Sparkles, // Replaces ✨
  Globe,    // Replaces 🌐
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { categoryApi, subjectApi, quizApi, analyticsApi } from '../api/apiClient'
import CategoryManager from '../components/admin/CategoryManager'
import SubjectManager from '../components/admin/SubjectManager'
import QuizManager from '../components/admin/QuizManager'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ categories: 0, subjects: 0, quizzes: 0 })
  const [recentSubjects, setRecentSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('Dashboard')
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, subRes, quizRes, analyticsRes] = await Promise.all([
          categoryApi.getAll(),
          subjectApi.getAll(),
          quizApi.getAll(),
          analyticsApi.getDashboard()
        ])

        const cats = catRes.data.data || catRes.data
        const subs = subRes.data.data || subRes.data
        const quizzes = quizRes.data.data || quizRes.data
        const analytics = analyticsRes.data.data

        setDashboardData(analytics)
        setStats({
          categories: cats.length,
          subjects: subs.length,
          quizzes: quizzes.length
        })
        setRecentSubjects(subs.slice(0, 5))

      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', view: 'Dashboard' },
    { icon: <BookOpen size={20} />, label: 'Categories', view: 'Categories' },
    { icon: <Compass size={20} />, label: 'Subjects', view: 'Subjects' },
    { icon: <Award size={20} />, label: 'Quizzes', view: 'Quizzes' },
    { icon: <Globe size={20} />, label: 'E-learning', view: 'E-learning' },
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'Categories':
        return <CategoryManager />
      case 'Subjects':
        return <SubjectManager />
      case 'Quizzes':
        return <QuizManager />
      case 'Dashboard':
      default:
        return (
          <div className="main-grid">
            {/* Welcome Banner */}
            <section className="welcome-banner">
              <div className="banner-content">
                <h2>Welcome, {user?.fullName || 'Admin'}!</h2>
                <p>You are logged in as <strong>{user?.role}</strong>. Managing the system with full database access.</p>
              </div>
            </section>

            {/* Mini Stats */}
            <div className="stats-row">
              <div className="stat-card card">
                <div className="stat-icon-bg blue">
                  <LayoutDashboard size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Categories</span>
                  <span className="stat-value">{stats.categories} Items</span>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon-bg lightblue">
                  <BookOpen size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Subjects</span>
                  <span className="stat-value">{stats.subjects} Courses</span>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon-bg purple">
                  <Award size={20} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Active Quizzes</span>
                  <span className="stat-value">{stats.quizzes} Published</span>
                </div>
              </div>
            </div>

            {/* Dashboard Analytics Section */}
            <div className="analytics-grid">
              {/* User Progress */}
              <section className="progress-section">
                <div className="section-header">
                  <h3>Recent User Progress</h3>
                </div>
                <div className="progress-list card" style={{ padding: '0', overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.progress?.length > 0 ? (
                        dashboardData.progress.map((p, idx) => (
                          <tr key={idx}>
                            <td>{p.materialId?.title || 'Unknown Material'}</td>
                            <td>{p.userId?.fullName || 'N/A'}</td>
                            <td>
                              <span className={`status-badge ${p.status?.toLowerCase()}`}>
                                {p.status}
                              </span>
                            </td>
                            <td>{p.progress}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No progress data</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent Quiz Attempts */}
              <section className="attempts-section">
                <div className="section-header">
                  <h3>Recent Quiz Attempts</h3>
                </div>
                <div className="attempts-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dashboardData?.recentAttempts?.length > 0 ? (
                    dashboardData.recentAttempts.map((attempt, idx) => (
                      <div key={idx} className="attempt-card card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="attempt-icon" style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)' }}>
                          <Award size={24} color="var(--primary)" />
                        </div>
                        <div className="attempt-info">
                          <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{attempt.quizId?.title || 'Quiz'}</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Learner: <strong>{attempt.userId?.fullName || 'Unknown'}</strong> • Score: {attempt.score}
                          </p>
                        </div>
                        <div className="attempt-status" style={{ marginLeft: 'auto' }}>
                          <span className={`status-badge ${attempt.status?.toLowerCase()}`}>{attempt.status}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>No recent attempts</div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="loading-center-wrapper">
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Menyiapkan dashboard admin...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src="/assets/logo.11dc4d9c.svg fill.png" alt="" />
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item, idx) => (
            <div
              key={idx}
              className={`nav-item ${currentView === item.view ? 'active' : ''}`}
              onClick={() => {
                if (item.view === 'E-learning') {
                  navigate('/')
                } else {
                  setCurrentView(item.view)
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-pro-card">
          <div className="pro-card-content">
            <button className="pro-btn" onClick={logout}>Logout Admin</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <div className="header-left">
            <h1>Admin Panel</h1>
            <p className="current-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="header-actions">
            <div className="header-user-mini" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginRight: '1rem' }}>
              <img src="https://unair.ac.id/wp-content/uploads/2023/04/gambar1-19-1-1024x929.jpg" alt="Avatar" style={{ width: 35, height: 35, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.fullName || 'Admin'}</span>
            </div>
            <button className="icon-btn"><MessageSquare size={20} /></button>
            <button className="icon-btn notify"><Bell size={20} /></button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  )
}

export default AdminDashboard
