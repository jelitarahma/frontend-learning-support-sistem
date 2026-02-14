import './HomeComponents.css'

function LearningMethods() {
  const methods = [
    {
      title: "Materi Fokus Ujian",
      desc: "Disusun Khusus Untuk Siswa Kelas 12 Agar Lebih Siap Menghadapi Ujian Akhir.",
      type: "dark",
      icon: "/assets/Icon-1.png",
      bgSvg: "/assets/SVG1.png"
    },
    {
      title: "Progress Terpantau",
      desc: "Lihat Perkembangan Belajarmu Secara Real-Time Dan Tahu Bagian Mana Yang Perlu Ditingkatkan.",
      type: "yellow",
      icon: "/assets/Icon-2.png",
      bgSvg: "/assets/SVG (1).png"
    },
    {
      title: "Kuis & Evaluasi",
      desc: "Kerjakan Kuis Dan Langsung Dapatkan Skor Serta Pembahasan Untuk Mengukur Pemahamanmu.",
      type: "dark",
      icon: "/assets/Icon-3.png",
      bgSvg: "/assets/SVG1.png"
    },
    {
      title: "Belajar Fleksibel",
      desc: "Akses Materi Dari Mana Pun Dan Atur Waktu Belajar Sesuai Ritme Kamu Sendiri.",
      type: "yellow",
      icon: "/assets/Icon-4.png",
      bgSvg: "/assets/SVG (1).png"
    }
  ]

  return (
    <section className="methods-section">
      <div className="container">
        <div className="section-header text-center">
          <img src="/assets/yellow-star.png" alt="Balloon" className="decor balloon" />
          <h2 className="section-title">
            Kembangkan Kemampuanmu Dengan Cara <br />
            Belajar Yang Seru Dan Mudah Dipahami
          </h2>
          <p className="section-desc">
            Belajar jadi lebih terarah, percaya diri meningkat, dan kamu tahu sejauh mana <br />
            perkembanganmu setiap hari.
          </p>
        </div>

        <div className="methods-grid-ui">
          {methods.map((method, index) => (
            <div key={index} className={`method-card-ui ${method.type}`}>
              {/* Outline Layer */}
              <img src="/assets/SVG-outline.png" alt="Outline" className="card-outline-overlay" />

              {/* Background Shape */}
              <img src={method.bgSvg} alt="Shape" className="card-bg-shape" />

              <div className="method-card-content">
                <div className="method-icon-container">
                  <img src={method.icon} alt={method.title} className="method-main-icon" />
                  <img src="/assets/splash.png" alt="Splash" className="icon-splash-overlay" />
                </div>
                <h3>{method.title}</h3>
                <p>{method.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LearningMethods
