import { ArrowRight } from 'lucide-react'
import './HomeComponents.css'

function SupportSection() {
  return (
    <section className="support-section">
      <div className="container">
        <div className="support-flex">
          <div className="support-visual">
            <div className="organic-blob-wrapper">
              <img src="/assets/Mask Group.png" alt="Students Studying" className="support-main-img-blob" />
              <div className="star-container-dashed">
                <img src="/assets/shape (3).png" alt="Pink Star Decor" className="pink-star-asset" />
              </div>
            </div>
          </div>

          <div className="support-info-side">
            <div className="sun-icon-box">
              <img src="/assets/shape (2).png" alt="Sun Happy" className="sun-decor-asset" />
            </div>

            <div className="support-badge">Get More About Us</div>
            <h2 className="support-heading">Kami Hadir Untuk Mendukung Perjalanan Belajarmu</h2>
            <p className="support-description">
              Platform ini dirancang untuk membantu kamu memahami materi dengan lebih terarah,
              latihan soal yang relevan, serta memantau progres belajar secara jelas dan terukur.
            </p>

            <ul className="support-item-list">
              <li>
                <div className="yellow-check-icon">
                  <img src="/assets/chevron-right.png" alt="Check" />
                </div>
                <span>Materi Sesuai Kurikulum</span>
              </li>
              <li>
                <div className="yellow-check-icon">
                  <img src="/assets/chevron-right.png" alt="Check" />
                </div>
                <span>Latihan Soal & Evaluasi</span>
              </li>
              <li>
                <div className="yellow-check-icon">
                  <img src="/assets/chevron-right.png" alt="Check" />
                </div>
                <span>Belajar Fleksibel</span>
              </li>
            </ul>

            <button className="btn-explore-blue">
              Jelajahi Materi <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportSection
