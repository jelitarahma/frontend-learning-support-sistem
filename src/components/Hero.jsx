import { ArrowRight } from 'lucide-react'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-background">
        <img src="/assets/hero-cloud-shape.png" alt="Cloud" className="hero-clouds" />
      </div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-subtitle">PERSIAPKAN UJIAN AKHIR LEBIH TERARAH & TERSTRUKTUR</span>
            <h1 className="hero-title">
              Together We'll <br />
              Explore <span className="highlight">New Things</span>
            </h1>
            <p className="hero-description">
              Akses materi lengkap, latihan soal, dan pantau progres belajarmu
              dalam satu platform khusus siswa kelas 12.
            </p>
            <div className="hero-cta">
              <button className="btn-lihat-materi">
                Lihat Semua Materi <ArrowRight size={20} />
              </button>
            </div>

            {/* Decorative Elements on Left */}
            <img src="/assets/balon-udara.png" alt="Balloon" className="decor balloon" />
            <img src="/assets/pesawat-1.png" alt="Path" className="decor path-left" />
          </div>

          <div className="hero-visual">
            <div className="visual-container">
              {/* Paths behind the boy */}
              <img src="/assets/SVG.png" alt="Path" className="decor path-right" />

              <img src="/assets/hero-img.png" alt="Boy learning" className="main-hero-img" />

              {/* Floating Decorative Assets */}
              <img src="/assets/dino-1.png" alt="Dino" className="decor dino-center" />
              <img src="/assets/flower.png" alt="Flower" className="decor flower-right" />
              <img src="/assets/shape (3).png" alt="Spark" className="decor spark-purple" />
            </div>
          </div>
        </div>
        {/* Wave Divider at Bottom */}
        <div className="hero-wave">
          <img src="/assets/hero-cloud-shape.png" alt="Wave" className="hero-wave-img" />
        </div>
      </div>


    </section>
  )
}

export default Hero
