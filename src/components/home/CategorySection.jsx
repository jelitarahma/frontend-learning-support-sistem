import { useState, useEffect } from 'react'
import { categoryApi } from '../../api/apiClient'
import './HomeComponents.css'

function CategorySection() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll()
        const data = res.data.data || res.data
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header text-center">
          <div className="trending-badge">Trending Categories</div>
          <h2 className="section-title">Top Category We Have</h2>
          <p className="section-desc">when known printer took a galley of type scrambl edmake</p>
        </div>

        <div className="category-slider-outer">
          <button className="slider-nav-btn prev">
            <img src="/assets/right-button-slider.png" alt="Previous" />
          </button>

          <div className="category-slider-inner">
            <div className="category-grid-ui">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="category-item-ui">
                    <div className="icon-circle-ui skeleton" style={{ width: '85px', height: '85px', borderRadius: '50%' }}></div>
                    <div className="cat-info-ui">
                      <div className="cat-name-ui skeleton" style={{ width: '100px', height: '18px' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                categories.slice(0, 6).map((cat, index) => (
                  <div key={cat._id || index} className="category-item-ui">
                    <div className="icon-circle-ui">
                      <img src="/assets/category-Icon.png" alt={cat.name} className="main-icon" />
                      <img src="/assets/category-icon-additional.png" alt="Sparkle" className="sparkle-icon-overlay" />
                    </div>
                    <div className="cat-info-ui">
                      <h3 className="cat-name-ui">{cat.name}</h3>
                      <span className="cat-count-ui">({Math.floor(Math.random() * 50) + 10})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button className="slider-nav-btn next">
            <img src="/assets/left-button-slider.png" alt="Next" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default CategorySection
