import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from 'lucide-react'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-v3">
      {/* Wave Top Asset */}
      <div className="footer-wave-asset">
        <img src="/assets/footer-shape.png" alt="Wave" className="wave-img" />
      </div>

      <div className="footer-content-wrapper">
        <div className="footer-container-v3">
          {/* Floating Planet & Stars (Left) */}
          <div className="footer-decor-left">
            <img src="/assets/planet.png" alt="Planet" className="footer-planet" />
          </div>

          {/* Floating Rocket (Right) */}
          <div className="footer-decor-right">
            <img src="/assets/rocket.png" alt="Rocket" className="footer-rocket" />
          </div>
          {/* Floating Rocket (Right) */}
          <div className="footer-decor-right2">
            <img src="/assets/SVG.png" alt="Rocket" className="footer-rocket2" />
          </div>

          {/* Squiggle Decor (Bottom Left) */}
          <div className="footer-squiggle-box">
            <img src="/assets/shape-2.png" alt="Squiggle" className="footer-squiggle-img" />
          </div>

          <div className="footer-content-grid">
            {/* Brand Info */}
            <div className="footer-col-brand">
              <Link to="/" className="footer-logo-v3">
                <div className="logo-icon-v3">
                  <img src="/assets/logo-white.png" alt="Edujar" />
                </div>
              </Link>
              <div className="contact-details-v3">
                <p>Jl. Al-Islah, Jatijajar, Kec. Tapos,</p>
                <p>Kota Depok, Jawa Barat 16451</p>
                <p className="phone-v3">+62 88 9900 456</p>
                <p>info@gmail.com</p>
              </div>
            </div>

            {/* Useful Links */}
            <div className="footer-col">
              <h4 className="footer-header-v3">Useful Links</h4>
              <div className="footer-header-underline"></div>
              <ul className="footer-links-v3">
                <li><Link to="#">Our values</Link></li>
                <li><Link to="#">Our advisory board</Link></li>
                <li><Link to="#">Our partners</Link></li>
                <li><Link to="#">Become a partner</Link></li>
                <li><Link to="#">Work at Future Learn</Link></li>
                <li><Link to="#">Quizlet Plus</Link></li>
              </ul>
            </div>

            {/* Our Company */}
            <div className="footer-col">
              <h4 className="footer-header-v3">Our Company</h4>
              <div className="footer-header-underline"></div>
              <ul className="footer-links-v3">
                <li><Link to="#">Contact Us</Link></li>
                <li><Link to="#">Become Teacher</Link></li>
                <li><Link to="#">Blog</Link></li>
                <li><Link to="#">Instructor</Link></li>
                <li><Link to="#">Events</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-col-newsletter">
              <h4 className="footer-header-v3">Newsletter SignUp!</h4>
              <div className="footer-header-underline"></div>
              <p className="newsletter-text-v3">Get the latest UniComp news delivered to your inbox</p>
              <div className="newsletter-form-v3">
                <input type="email" placeholder="Type your E-mail" />
                <button type="button">Subscribe</button>
              </div>
              <div className="footer-social-v3">
                <span className="follow-text">Follow Us:</span>
                <div className="social-icons-v3">
                  <Link to="#" title="Facebook"><Facebook size={18} /></Link>
                  <Link to="#" title="Twitter"><Twitter size={18} /></Link>
                  <Link to="#" title="WhatsApp"><MessageCircle size={18} /></Link>
                  <Link to="#" title="Instagram"><Instagram size={18} /></Link>
                  <Link to="#" title="Youtube"><Youtube size={18} /></Link>
                </div>
              </div>
            </div>
          </div>

          {/* Dino Decor Bottom Center */}
          <div className="footer-dino-box">
            <img src="/assets/dino-2.png" alt="Dino" className="footer-dino-img" />
          </div>
        </div>
      </div>

      <div className="footer-copyright-v3">
        <div className="copyright-wrapper">
          <p>© Created by Jelita Rahma Ayu Guntari | BINUS Online 2026.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
