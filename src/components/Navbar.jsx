import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MegaMenu from './MegaMenu'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, canAccessAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`)
      }
    }
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className={`navbar-wrapper ${scrolled ? 'sticky' : ''}`}>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="left-side">
              <Link to="/" className="navbar-brand">
                <img src="/assets/logo.11dc4d9c.svg fill.png" alt="Skillvers" className="logo-img" />
              </Link>

              <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="nav-item-dropdown">
                  <MegaMenu />
                </div>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                <Link to="/courses" className={`nav-link ${isActive('/courses') ? 'active' : ''}`}>Courses</Link>
                {user && (
                  <Link to={canAccessAdmin ? "/admin" : "/dashboard"} className={`nav-link ${isActive('/admin') || isActive('/dashboard') ? 'active' : ''}`}>
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="navbar-actions">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <button className="search-btn" onClick={handleSearch}>
                  <Search size={18} />
                </button>
              </div>

              {user ? (
                <div className="user-controls">
                  <Link to="/profile" className="icon-btn" title="Profile">
                    <User size={20} />
                  </Link>
                  <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="icon-btn" title="Login">
                  <User size={20} />
                </Link>
              )}

              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
