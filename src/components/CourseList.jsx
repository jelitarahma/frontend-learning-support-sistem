import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Loader2 } from 'lucide-react'
import { subjectApi } from '../api/apiClient'
import './CourseList.css'
import './home/HomeComponents.css'

function CourseList() {
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await subjectApi.getAll()
        const data = res.data.data || res.data
        setSubjects(data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  if (isLoading) {
    return (
      <section className="courses-showcase">
        <div className="container relative">
          <div className="section-header text-center mb-16">
            <div className="skeleton mb-4" style={{ width: '200px', height: '32px', borderRadius: '50px' }}></div>
            <div className="skeleton mb-2" style={{ width: '60%', height: '40px' }}></div>
            <div className="skeleton" style={{ width: '40%', height: '40px' }}></div>
          </div>
          <div className="courses-matrix-v2">
            {[1, 2, 3, 4].map(i => (
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
        </div>
      </section>
    )
  }

  return (
    <section className="courses-showcase">
      <div className="container relative">
        <div className="pink-star-box">
          <img src="/assets/pink-star.png" alt="Sun Happy" className="pink-star-decor-asset" />
        </div>

        <div className="section-header text-center mb-16">
          <div className="trending-badge bg-indigo-100 text-indigo-600 px-6 py-2 rounded-full font-bold inline-block mb-4">Top Class Courses</div>
          <h2 className="section-title text-4xl font-black text-slate-900 leading-tight">
            Dapatkan Pengalaman Belajar <br />
            Terbaik Bersama Kami
          </h2>
        </div>

        <div className="courses-matrix-v2">
          {subjects.slice(0, 4).map(subject => (
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
      </div>
    </section>
  )
}

export default CourseList
