import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, BookOpen, Clock, Star, Heart, Loader2, ChevronRight, LayoutGrid, List } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { categoryApi, subjectApi } from '../api/apiClient'
import '../components/CourseList.css'
import './CoursesPage.css'

function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const categoryParam = searchParams.get('category') || 'all'

  const [categories, setCategories] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filteredSubjects, setFilteredSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [catRes, subRes] = await Promise.all([
          categoryApi.getAll(),
          subjectApi.getAll()
        ])

        const catData = catRes.data.data || catRes.data
        const subData = subRes.data.data || subRes.data

        setCategories(catData)
        setSubjects(subData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...subjects]

    // Filter by Category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sub =>
        sub.categoryId === selectedCategory ||
        (sub.categoryId?._id === selectedCategory)
      )
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(query) ||
        (sub.description && sub.description.toLowerCase().includes(query))
      )
    }

    setFilteredSubjects(filtered)
  }, [subjects, selectedCategory, searchQuery])

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    setSearchParams(prev => {
      if (catId === 'all') {
        prev.delete('category')
      } else {
        prev.set('category', catId)
      }
      return prev
    })
  }

  return (
    <div className="courses-page-v2">
      <Navbar />

      <header className="courses-header">
        <div className="container">
          <div className="header-content">
            <h1 className="header-title">Explorasi Materi Terbaik</h1>
            <p className="header-subtitle">Temukan kursus yang sesuai dengan kebutuhan belajarmu hari ini.</p>
          </div>
        </div>
      </header>

      <main className="courses-main container">
        <div className="courses-layout">
          {/* Sidebar Filter */}
          <aside className="courses-sidebar">
            <div className="sidebar-section">
              <h3 className="section-title">
                <Filter size={18} /> Filter Kategori
              </h3>
              <div className="category-list">
                <button
                  className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  Semua Materi
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={`category-item ${selectedCategory === cat._id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat._id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-promo">
              <div className="promo-card">
                <h4>Siap Belajar?</h4>
                <p>Klik kurikulum terbaru kami dan dapatkan update materi setiap minggunya.</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="courses-results">
            <div className="results-header">
              <div className="results-count">
                Menampilkan <strong>{filteredSubjects.length}</strong> materi ditemukan
                {searchQuery && <span> untuk "<strong>{searchQuery}</strong>"</span>}
              </div>
              <div className="results-view-toggle">
                <button className="view-btn active"><LayoutGrid size={18} /></button>
                <button className="view-btn"><List size={18} /></button>
              </div>
            </div>

            {isLoading ? (
              <div className="courses-grid-v3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="course-card-premium">
                    <div className="card-thumb-v2 skeleton"></div>
                    <div className="card-content-v2">
                      <div className="skeleton mb-4" style={{ width: '80%', height: '24px' }}></div>
                      <div className="skeleton mb-2" style={{ width: '100%', height: '16px' }}></div>
                      <div className="skeleton mb-6" style={{ width: '60%', height: '16px' }}></div>
                      <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '50px', margin: '0 auto' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSubjects.length > 0 ? (
              <div className="courses-grid-v3">
                {filteredSubjects.map(subject => (
                  <div key={subject._id} className="course-card-premium">
                    <div className="card-thumb-v2">
                      <img src={subject.thumbnail || 'https://unair.ac.id/wp-content/uploads/2023/04/gambar1-19-1-1024x929.jpg'} alt={subject.name} />
                      <button className="heart-btn-overlay">
                        <Heart size={18} fill="white" color="white" />
                      </button>
                    </div>
                    <div className="card-content-v2">
                      <h3 className="card-title-v2">{subject.name}</h3>
                      <p className="card-desc-v2">Materi persiapan ujian {subject.name} kelas 12</p>
                      <Link to={`/course/${subject._id}`} className="btn-jelajahi-materi">
                        Jelajahi Materi
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <img src="/assets/Brain.png" alt="No Results" className="no-results-img" />
                <h3>Materi Tidak Ditemukan</h3>
                <p>Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
                <button onClick={() => { setSelectedCategory('all'); setSearchParams({}) }} className="btn-reset">Reset Filter</button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CoursesPage
