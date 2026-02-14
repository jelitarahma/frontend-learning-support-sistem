import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import './HomeComponents.css'

function WhyUsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const faqItems = [
    {
      title: "Akun Aman & Personal",
      content: "Setiap siswa memiliki akun pribadi sehingga riwayat belajar dan hasil latihan tersimpan dengan aman dan bisa diakses kapan saja."
    },
    {
      title: "Akses Cepat & Mudah Digunakan",
      content: "Antarmuka yang intuitif memudahkan Anda untuk menavigasi materi dan fitur-fitur penting hanya dalam beberapa klik."
    },
    {
      title: "Rekomendasi Belajar Otomatis",
      content: "Sistem cerdas kami memberikan saran materi berdasarkan kemajuan Anda untuk hasil belajar yang optimal."
    }
  ]

  return (
    <section className="faq-section-v2">
      <div className="container">
        <div className="faq-grid">
          <div className="faq-content-side">
            <div className="flower-icon-box">
              <img src="/assets/shape (4).png" alt="Flower Decor" className="w-12 h-12" />
            </div>
          </div>

          <div className="faq-visual-side">
            <div className="accordion-list-v2">
              <div className="faq-badge">Faq's</div>
              <h2 className="faq-heading-v2">
                Kenapa Platform Ini Cocok <br /> Untuk Persiapan Ujian Kelas 12 ?
              </h2>
              <p className="faq-desc-v2">
                Platform ini dirancang untuk memberikan pengalaman belajar yang sederhana,
                nyaman, dan fokus, supaya kamu bisa belajar tanpa distraksi.
              </p>
              {faqItems.map((item, index) => (
                <div key={index} className={`accordion-item-v2 ${activeIndex === index ? 'active' : ''}`}>
                  <button className="accordion-btn-v2" onClick={() => setActiveIndex(index)}>
                    <span>{item.title}</span>
                    {activeIndex === index ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  {activeIndex === index && (
                    <div className="accordion-body-v2">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="faq-visual-side">
              <div className="organic-dashed-frame">
                <img src="/assets/person-2.png" alt="Students Learning" className="organic-masked-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyUsSection
