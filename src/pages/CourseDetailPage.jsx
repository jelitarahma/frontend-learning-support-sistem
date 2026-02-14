import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Play, FileText, CheckCircle, Clock, Users, Star,
  ChevronDown, ChevronUp, Loader2, Share2, BookOpen,
  Monitor, ArrowLeft, Video, Heart, CheckCircleIcon
} from 'lucide-react'
import { subjectApi, materialApi } from '../api/apiClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './CourseDetailPage.css'

function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [chapters, setChapters] = useState([])
  const [activeChapterIndex, setActiveChapterIndex] = useState(0) // Tab state for chapters
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const targetId = id || "698aaad6b2e9c0ced309ea98";
        console.log("Fetching data for ID:", targetId);

        const res = await subjectApi.getById(targetId);

        let subjectData = null;
        let chaptersData = [];

        if (res.data && res.data.success && res.data.data && res.data.data.subject) {
          subjectData = res.data.data.subject;
          chaptersData = res.data.data.chapters || [];
        } else if (res.data && res.data.subject) {
          subjectData = res.data.subject;
          chaptersData = res.data.chapters || [];
        } else {
          subjectData = res.data.data || res.data;
          chaptersData = [];
        }

        setSubject(subjectData);

        if (chaptersData.length > 0) {
          const chaptersWithMaterials = await Promise.all(chaptersData.map(async (chap) => {
            if (chap.materials && chap.materials.length > 0) return chap;

            try {
              const matRes = await materialApi.getByChapter(chap._id);
              const materials = matRes.data.data || matRes.data || [];
              return { ...chap, materials };
            } catch (err) {
              console.log(`No materials found or error for chapter ${chap._id}:`, err);
              return { ...chap, materials: [] };
            }
          }));
          setChapters(chaptersWithMaterials);
        } else {
          setChapters([]);
        }

      } catch (error) {
        console.error('Error fetching course detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-center-wrapper">
        <Loader2 className="animate-spin" size={48} color="#5B56E8" />
        <p style={{ fontWeight: 700, color: '#1F1B3D' }}>Memuat detail kursus...</p>
      </div>
    )
  }

  if (!subject) return (
    <div className="course-detail-page">
      <Navbar />
      <div className="container error-screen">
        <h2>Course Not Found</h2>
        <Link to="/courses" className="back-link">Back to Courses</Link>
      </div>
      <Footer />
    </div>
  );

  const activeChapter = chapters[activeChapterIndex];

  return (
    <div className="course-detail-page-v2">
      <Navbar />

      <div className="main-content">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section-v2">
            <div className="hero-info">
              <h1 className="hero-title">{subject.name}</h1>
              <div className="hero-badges">
                <span className="badge badge-yellow">{subject.code || 'PHYS-01'}</span>
                {subject.categoryId && (
                  <span className="badge badge-yellow">{subject.categoryId.name}</span>
                )}
                <span className="badge badge-yellow">SCIENCE</span>
              </div>

              <p className="hero-desc">
                {subject.description || "Mata pelajaran Fisika kelas 12 semester 1 mempelajari konsep-konsep fundamental tentang gerak, gaya, energi, momentum, dan gelombang. Pembelajaran dirancang untuk membantu siswa memahami hukum-hukum fisika secara konseptual dan matematis, serta mampu menerapkannya dalam penyelesaian masalah kontekstual sehari-hari maupun dalam bidang teknologi dan rekayasa."}
              </p>

              <div className="hero-stats-v2">
                <div className="stat-v2">
                  <Users size={18} />
                  <span>1.2k Students</span>
                </div>
                <div className="stat-v2">
                  <Heart size={18} />
                  <span>750k Favorite</span>
                </div>
                <div className="stat-v2">
                  <CheckCircleIcon size={18} />
                  <span>{chapters.length} chapters</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="video-placeholder">
                <img
                  src={subject.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                  alt={subject.name}
                />
              </div>
            </div>
          </div>

          {/* Chapter Tabs */}
          <div className="chapter-tabs-v2">
            {chapters.map((chapter, index) => (
              <div
                key={chapter._id}
                className={`chapter-tab-v2 ${activeChapterIndex === index ? 'active' : ''}`}
                onClick={() => setActiveChapterIndex(index)}
              >
                Chapter {index + 1}
              </div>
            ))}
          </div>

          {/* Active Chapter Content */}
          {activeChapter ? (
            <div className="active-chapter-container">
              <div className="shape-decoration">
                <img src="/assets/shape (3).png" alt="decoration" />
              </div>

              <h2 className="chapter-title">{activeChapter.title}</h2>

              <div className="chapter-badges-v2">
                <span className="badge-v2">
                  <Star size={14} fill="currentColor" />
                  BASIC
                </span>
                <span className="badge-v2">
                  <Clock size={14} />
                  {activeChapter.estimatedTime || 25} MIN
                </span>
              </div>

              <p className="chapter-description-v2">
                {activeChapter.description || "Mata pelajaran Fisika kelas 12 semester 1 mempelajari konsep-konsep fundamental tentang gerak, gaya, energi, momentum, dan gelombang. Pembelajaran dirancang untuk membantu siswa memahami hukum-hukum fisika secara konseptual dan matematis."}
              </p>

              <div className="materials-list-v2">
                {activeChapter.materials && activeChapter.materials.length > 0 ? (
                  activeChapter.materials.map((material, idx) => (
                    <div key={material._id} className="material-item-v2">
                      <div className="material-icon-v2">
                        <div className="play-circle">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                      <div className="material-content-v2">
                        <h3 className="material-name">{material.title}</h3>
                        <p className="material-text">
                          {material.content?.substring(0, 200) || "Mata pelajaran Fisika kelas 12 semester 1 mempelajari konsep-konsep fundamental tentang gerak, gaya, energi, momentum, dan gelombang."}
                        </p>
                        <div className="material-info">
                          <div className="material-tags-v2">
                            <span className="m-tag">{material.type === 'VIDEO' ? 'Video' : 'Document'}</span>
                            <span className="m-tag">Basic</span>
                            <span className="m-tag">{material.metadata?.readTime || 25} Menit</span>
                          </div>
                          <Link to={`/lesson/${material._id}`} className="pelajari-btn">
                            Pelajari Materi
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>

                      </div>

                    </div>
                  ))
                ) : (
                  <div className="empty-materials">No materials available for this chapter.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-chapters">No chapters available.</div>
          )}
        </div>
      </div>

      <Footer />
    </div>

  )
}

export default CourseDetailPage
