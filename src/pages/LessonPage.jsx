import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Play, FileText, CheckCircle, Clock, BookOpen, X, Info, ChevronRight,
  Menu, Loader2, ArrowRight
} from 'lucide-react'
import { materialApi, quizApi } from '../api/apiClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LessonPage.css'

function LessonPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [material, setMaterial] = useState(null)
  const [progress, setProgress] = useState(null)
  const [allMaterials, setAllMaterials] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    const fetchMaterialData = async () => {
      setIsLoading(true)
      try {
        // Fetch material detail
        const res = await materialApi.getById(id)
        const data = res.data.data || res.data

        setMaterial(data.material || data)
        setProgress(data.progress || null)

        // Fetch all materials from the same chapter
        if (data.material?.chapterId?._id || data.chapterId) {
          const chapterId = data.material?.chapterId?._id || data.chapterId
          const materialsRes = await materialApi.getByChapter(chapterId)
          const materials = materialsRes.data.data || materialsRes.data || []
          setAllMaterials(materials)
        }

        // Fetch quizzes for this material
        try {
          const quizRes = await quizApi.getByMaterial(id)
          const quizData = quizRes.data.data || quizRes.data || []
          setQuizzes(quizData)
        } catch (err) {
          console.log('No quizzes found for this material:', err)
          setQuizzes([])
        }
      } catch (error) {
        console.error('Error fetching material:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterialData()
  }, [id])

  const handleComplete = async () => {
    try {
      setIsCompleting(true)
      await materialApi.complete(id)

      // Navigate to next material
      const currentIndex = allMaterials.findIndex(m => m._id === id)
      if (currentIndex < allMaterials.length - 1) {
        navigate(`/lesson/${allMaterials[currentIndex + 1]._id}`)
      }
    } catch (error) {
      console.error('Error completing material:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null

    // Handle youtu.be format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Handle youtube.com/watch format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Handle youtube.com/embed format (already embedded)
    if (url.includes('youtube.com/embed')) {
      return url
    }

    return null
  }

  // Convert Google Drive URL to embed format
  const getGoogleDriveEmbedUrl = (url) => {
    if (!url) return null

    // Handle Google Drive file URLs
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
    }

    return url
  }

  if (isLoading) {
    return (
      <div className="loading-center-wrapper">
        <Loader2 className="animate-spin" size={48} color="#5B56E8" />
        <p style={{ fontWeight: 700, color: '#1F1B3D' }}>Memuat materi...</p>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="lesson-page-light">
        <Navbar />
        <div className="error-container">
          <h2>Material not found</h2>
          <Link to="/courses" className="back-link">
            Back to Courses
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const chapterInfo = material.chapterId || {}
  const embedUrl = material.type === 'VIDEO'
    ? getYouTubeEmbedUrl(material.mediaUrl)
    : getGoogleDriveEmbedUrl(material.mediaUrl)

  return (
    <div className="lesson-page-light">
      <Navbar />

      <main className="lesson-main-container">
        <div className="container">
          <div className={`lesson-layout ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>

            {/* Left Content Area */}
            <div className={`lesson-content-area ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>

              {/* Media Section */}
              <section className="lesson-media-section">
                <div className="media-card">
                  {embedUrl ? (
                    <div className="media-inner">
                      <iframe
                        src={embedUrl}
                        title={material.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="media-iframe"
                      />
                    </div>
                  ) : (
                    <div className="media-placeholder-light">
                      <div className="play-button-overlay">
                        <Play size={48} fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Title & Metadata */}
              <section className="lesson-info-section">
                <h1 className="lesson-title-light">{material.title}</h1>
                <div className="lesson-meta-row">
                  <div className="meta-item-light">
                    <BookOpen size={20} />
                    <span>{chapterInfo.title || 'Kinematik Gerak'}</span>
                  </div>
                  <div className="meta-item-light">
                    <Clock size={20} />
                    <span>{material.metadata?.readTime || '20'} min</span>
                  </div>
                  <div className="meta-item-light">
                    <Info size={20} />
                    <span>{material.metadata?.difficulty?.toUpperCase() || 'BASIC'}</span>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section className="lesson-about-section">
                <div className="about-card-light">
                  <h2 className="about-title-light">Tentang Materi Ini</h2>
                  <p className="about-desc-light">
                    {material.content || 'Mata pelajaran Fisika kelas 12 semester 1 mempelajari konsep-konsep fundamental tentang gerak, gaya, energi, momentum, dan gelombang. Pembelajaran dirancang untuk membantu siswa memahami hukum-hukum fisika secara konseptual dan matematis, serta mampu menerapkannya dalam penyelesaian masalah kontekstual sehari-hari maupun dalam bidang teknologi dan rekayasa.'}
                  </p>
                  <div className="pills-container">
                    {material.metadata?.tags?.map((tag, idx) => (
                      <span key={idx} className="pill-item">{tag}</span>
                    )) || (
                        <>
                          <span className="pill-item">PHYS-01</span>
                          <span className="pill-item">Sains (IPA)</span>
                          <span className="pill-item">SCIENCE</span>
                        </>
                      )}
                  </div>
                </div>
              </section>

              {/* Quiz Section */}
              <section className="lesson-quiz-section">
                <div className="quiz-header-light">
                  <h2 className="quiz-title-main">Test Pemahaman Anda</h2>
                  <p className="quiz-subtitle-main">{quizzes.length} Quiz tersedia dalam materi ini</p>
                </div>

                <div className="quiz-grid-light">
                  {quizzes.map((quiz) => (
                    <div key={quiz._id} className="quiz-card-light">
                      <div className="quiz-card-top">
                        <div className="brain-icon-wrapper">
                          <img src="/assets/Brain.png" alt="Brain" className="brain-asset-img" />
                        </div>
                        <div className="quiz-card-info">
                          <h3 className="quiz-card-title">{quiz.title}</h3>
                          <div className="quiz-card-meta">
                            <Clock size={16} />
                            <span>{quiz.timeLimit} menit</span>
                          </div>
                        </div>
                      </div>
                      <Link to={`/quiz/${quiz._id}`} className="btn-start-quiz">
                        START <ArrowRight size={18} />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar Sidebar */}
            <aside className={`lesson-sidebar-right ${sidebarOpen ? 'open' : ''}`}>
              <div className="sidebar-card">
                <div className="sidebar-header-light">
                  <h3 className="sidebar-title-light">Course Material</h3>
                  <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="sidebar-material-list">
                  {allMaterials.map((mat, index) => (
                    <Link
                      key={mat._id}
                      to={`/lesson/${mat._id}`}
                      className={`material-link-item ${mat._id === id ? 'active' : ''}`}
                    >
                      <div className="mat-link-icon">
                        <Play size={18} />
                      </div>
                      <div className="mat-link-details">
                        <span className="mat-link-title">{mat.title}</span>
                        <div className="mat-link-meta">
                          <Clock size={14} />
                          <span>{mat.metadata?.readTime || '20'} menit</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {/* Fallback for design if needed */}
                  {allMaterials.length === 0 && Array(5).fill(0).map((_, i) => (
                    <div key={i} className="material-link-item">
                      <div className="mat-link-icon">
                        <Play size={18} />
                      </div>
                      <div className="mat-link-details">
                        <span className="mat-link-title">Matematika Arimatika</span>
                        <div className="mat-link-meta">
                          <Clock size={14} />
                          <span>20 menit</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {!sidebarOpen && (
        <button className="floating-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      )}

      <Footer />
    </div>
  )
}

export default LessonPage
