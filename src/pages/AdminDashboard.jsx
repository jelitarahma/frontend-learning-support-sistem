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
              <div className="banner-image">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/men-working-on-laptop-illustration-download-in-svg-png-gif-formats--student-college-office-work-business-activities-pack-illustrations-5221978.png" alt="Welcome" />
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
            <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem', marginTop: '2rem' }}>
              {/* User Progress */}
              <section className="progress-section">
                <div className="section-header">
                  <h3>Recent User Progress</h3>
                </div>
                <div className="progress-list card" style={{ padding: '0' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Material</th>
                        <th>User ID</th>
                        <th>Status</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.progress?.length > 0 ? (
                        dashboardData.progress.map((p, idx) => (
                          <tr key={idx}>
                            <td>{p.materialId?.title || 'Unknown Material'}</td>
                            <td>{p.userId || 'N/A'}</td>
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
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Score: {attempt.score}</p>
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

            {/* Recent Subjects Table (Replaces Dummy Assignments) */}
            <section className="assignments-section" style={{ marginTop: '2rem' }}>
              <div className="assignments-header">
                <h3>System Subjects</h3>
              </div>
              <div className="assignments-list card">
                <table className="assignments-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Thumbnail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubjects.length > 0 ? recentSubjects.map(sub => (
                      <tr key={sub._id}>
                        <td>
                          <div className="task-name-cell">
                            <div className="task-icon blue">
                              <Compass size={18} />
                            </div>
                            <div>
                              <p className="task-title">{sub.title || sub.name}</p>
                            </div>
                          </div>
                        </td>
                        <td>{sub.categoryId?.name || 'Uncategorized'}</td>
                        <td>
                          {sub.thumbnail ? <img src={sub.thumbnail} alt="thumb" style={{ width: 30, height: 30, borderRadius: 4 }} /> : 'No image'}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" style={{ padding: 20, textAlign: 'center' }}>No subjects found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
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
          <div className="logo-icon-blue">
            <BookOpen size={20} color="white" />
          </div>
          <span>Learnzie</span>
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
            <div className="pro-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <Sparkles size={20} color="#FFD700" />
            </div>
            <h4>System Status</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--dash-text-sec)' }}>All systems operational. Backend v1.2.0 fully connected.</p>
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
            <button className="icon-btn"><MessageSquare size={20} /></button>
            <button className="icon-btn notify"><Bell size={20} /></button>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Right Sidebar - only show on Dashboard view for now to keep layout clean on manager views */}
      {currentView === 'Dashboard' && (
        <aside className="right-sidebar">
          <div className="user-profile-header">
            <div className="user-info">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="Avatar" className="profile-img" />
              <div>
                <h4>{user?.fullName || 'Admin User'}</h4>
                <p>@{user?.username || 'admin'}</p>
              </div>
            </div>
            <button className="icon-btn-gray"><Settings size={18} /></button>
          </div>

          <section className="calendar-section card">
            <div className="calendar-header">
              <button className="cal-nav"><ChevronLeft size={16} /></button>
              <h4>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
              <button className="cal-nav"><ChevronRight size={16} /></button>
            </div>
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d} className="cal-day-label">{d[0]}</span>)}
              {[...Array(30)].map((_, i) => (
                <span key={i} className={`cal-date ${i + 1 === new Date().getDate() ? 'active' : ''}`}>{i + 1}</span>
              ))}
            </div>
          </section>

          <section className="activities-section">
            <div className="section-title-row">
              <h3>Recent Activities</h3>
              <MoreHorizontal size={20} />
            </div>
            <p className="activity-group-label">Today</p>
            <div className="activity-timeline">
              <div className="activity-item">
                <div className="activity-icon-blue"><Play size={16} /></div>
                <div className="activity-details">
                  <p>Watched a lecture video on **Business Ethics**</p>
                  <span className="activity-time">1:00 PM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-pink"><FileText size={16} /></div>
                <div className="activity-details">
                  <p>Created new Subject **Intro to Calculus**</p>
                  <span className="activity-time">10:30 AM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-orange"><Search size={16} /></div>
                <div className="activity-details">
                  <p>Updated **Physics** Quiz</p>
                  <span className="activity-time">9:15 AM</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon-dark"><LogOut size={16} /></div>
                <div className="activity-details">
                  <p>Logged into the dashboard</p>
                  <span className="activity-time">9:00 AM</span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      )}
    </div>
  )
}

export default AdminDashboard
