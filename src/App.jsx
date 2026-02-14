import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailPage from './pages/CourseDetailPage'
import LessonPage from './pages/LessonPage'
import QuizPage from './pages/QuizPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, canAccessAdmin } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !canAccessAdmin) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
        <Route path="/course/:id" element={<PrivateRoute><CourseDetailPage /></PrivateRoute>} />
        <Route path="/lesson/:id" element={<PrivateRoute><LessonPage /></PrivateRoute>} />
        <Route path="/quiz/:id" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App

