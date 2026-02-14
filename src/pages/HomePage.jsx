import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CourseList from '../components/CourseList'
import Footer from '../components/Footer'
import CategorySection from '../components/home/CategorySection'
import LearningMethods from '../components/home/LearningMethods'
import SupportSection from '../components/home/SupportSection'
import WhyUsSection from '../components/home/WhyUsSection'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />
      <Hero />
      <CategorySection />
      <LearningMethods />
      <SupportSection />
      <CourseList />
      <WhyUsSection />
      <Footer />
    </div>
  )
}

export default HomePage
