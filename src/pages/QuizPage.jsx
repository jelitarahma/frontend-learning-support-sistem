import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Clock, ArrowRight, Award, Loader2, AlertCircle,
  HelpCircle, ChevronRight, BookOpen, Star, ArrowLeft
} from 'lucide-react'
import { quizApi } from '../api/apiClient'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './QuizPage.css'

function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // States
  const [quiz, setQuiz] = useState(null)
  const [isStarted, setIsStarted] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionId: optionId }
  const [showResult, setShowResult] = useState(false)
  const [resultData, setResultData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)

  const timerRef = useRef(null)

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true)
      try {
        const res = await quizApi.getById(id)
        const data = res.data.data || res.data
        if (!data) throw new Error('Quiz not found')

        const quizData = data.quiz || data
        const questionsData = data.questions || quizData.questions || []

        if (!questionsData || questionsData.length === 0) {
          setError('This quiz has no questions.')
        }

        setQuiz({ ...quizData, questions: questionsData })
        setTimeRemaining(quizData.timeLimit * 60)
      } catch (err) {
        console.error('Fetch quiz error:', err)
        setError('Failed to load quiz details.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuizData()
  }, [id])

  // Timer Effect
  useEffect(() => {
    if (!isStarted || showResult || isSubmitting) return

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [isStarted, showResult, isSubmitting])

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const handleOptionSelect = (questionId, optionId) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleNext = () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const answersArray = quiz.questions.map(q => ({
        questionId: q._id,
        selectedOption: userAnswers[q._id] || null
      }))

      const res = await quizApi.submit({ quizId: id, answers: answersArray })
      setResultData(res.data.data || res.data)
      setShowResult(true)
      clearInterval(timerRef.current)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Failed to submit results.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-center-wrapper">
        <Loader2 className="animate-spin" size={48} color="#5B56E8" />
        <p style={{ fontWeight: 700, color: '#1F1B3D' }}>Menyiapkan kuis untukmu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-error-screen">
        <AlertCircle size={60} color="#FF5151" />
        <h2>Waduh!</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="btn-back-error">Kembali</button>
      </div>
    )
  }

  if (showResult) {
    const totalCorrect = resultData?.answers?.filter(a => a.isCorrect).length || 0
    const totalQuestions = quiz?.questions?.length || 0
    const totalIncorrect = totalQuestions - totalCorrect
    const scoreVal = resultData?.score || 0

    const getResultMessage = (score) => {
      if (score >= 90) return 'Selamat Kamu Udah Menguasai Materi'
      if (score >= 75) return 'Bagus! Kamu Sudah Mengerti Konsep Dasar'
      if (score >= 60) return 'Cukup Baik, Yuk Tingkatkan Lagi Belajarnya'
      return 'Jangan Menyerah! Pelajari Lagi Materinya Ya'
    }

    return (
      <div className="quiz-result-page">
        <Navbar />
        <div className="result-outer-container">
          <div className="result-visual-section animate-up">
            {/* Score Circle Group */}
            <div className="score-circle-wrapper">
              <div className="score-outer-ring">
                <div className="score-inner-circle">
                  <span className="score-label-top">Skor Kamu</span>
                  <span className="score-value-big">{scoreVal}</span>
                </div>
              </div>
              <img src="/assets/Party popper.png" alt="Party" className="party-popper-img" />
            </div>

            {/* Stats Pills */}
            <div className="result-stats-pills">
              <div className="stat-pill-item gray">
                <span>{totalQuestions} Soal</span>
              </div>
              <div className="stat-pill-item gray">
                <span>{totalCorrect} Benar</span>
              </div>
              <div className="stat-pill-item gray">
                <span>{totalIncorrect} Salah</span>
              </div>
            </div>

            {/* Motivational Text */}
            <h2 className="result-congrats-text">
              {getResultMessage(scoreVal)}
            </h2>

            {/* Back Button */}
            <div className="result-action-footer">
              <button onClick={() => navigate('/')} className="btn-result-kembali">
                Kembali <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // --- PREVIEW VIEW ---
  if (!isStarted) {
    return (
      <div className="quiz-preview-page">
        <Navbar />
        <main className="quiz-preview-main">
          <div className="container">
            {/* Decorations */}
            <img src="/assets/yellow-star.png" alt="Star" className="star-decor star-1" />
            <img src="/assets/yellow-star.png" alt="Star" className="star-decor star-2" />
            <img src="/assets/yellow-star.png" alt="Star" className="star-decor star-3" />
            <img src="/assets/yellow-star.png" alt="Star" className="star-decor star-4" />
            <img src="/assets/yellow-star.png" alt="Star" className="star-decor star-5" />

            <div className="preview-card-v2 animate-up">
              <h1 className="preview-title">Kuis: {quiz.title}</h1>

              <div className="preview-info-grid">
                <div className="info-item-v2">
                  <div className="info-icon-box blue">
                    <HelpCircle size={24} />
                  </div>
                  <div className="info-text-box">
                    <span className="info-val">{quiz.questions.length} Pertanyaan</span>
                    <span className="info-sub">Setiap jawaban benar mendapat 10 poin</span>
                  </div>
                </div>

                <div className="info-item-v2">
                  <div className="info-icon-box dark">
                    <Clock size={24} />
                  </div>
                  <div className="info-text-box">
                    <span className="info-val">{quiz.timeLimit} min</span>
                    <span className="info-sub">Durasi Total</span>
                  </div>
                </div>

                <div className="info-item-v2">
                  <div className="info-icon-box yellow">
                    <Star size={24} />
                  </div>
                  <div className="info-text-box">
                    <span className="info-val">{quiz.passingScore} point</span>
                    <span className="info-sub">Minimal mendapatkan {quiz.passingScore} point untuk dinyatakan lulus</span>
                  </div>
                </div>
              </div>

              <div className="preview-instructions">
                <p>Tolong baca instruksi dibawah dengan hati hati, supaya kuis dapat dikerjakan dengan lancar :</p>
                <ul>
                  <li>Baca teks dengan cermat untuk memahami soal</li>
                  <li>Pilih salah satu jawaban untuk memilih jawaban yang benar</li>
                  <li>Klik "Submit" jika yakin ingin menyelesaikan semua kuis.</li>
                </ul>
              </div>

              <div className="preview-footer">
                <button onClick={() => setIsStarted(true)} className="btn-start-quiz-v2">
                  START <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // --- ACTIVE QUIZ VIEW ---
  const currentQ = quiz.questions[currentQuestionIdx]
  const isSelected = (qId, oId) => userAnswers[qId] === oId

  return (
    <div className="quiz-active-page">
      <Navbar />
      <main className="active-quiz-main">
        <div className="container">
          <div className="active-quiz-layout">

            {/* Sidebar Question List */}
            <aside className="question-list-sidebar">
              <div className="sidebar-inner-v2">
                <h3 className="section-title-underline">Question List</h3>
                <div className="question-nav-grid">
                  {quiz.questions.map((_, idx) => (
                    <button
                      key={idx}
                      className={`q-nav-btn ${currentQuestionIdx === idx ? 'active' : ''} ${userAnswers[quiz.questions[idx]._id] ? 'answered' : ''}`}
                      onClick={() => setCurrentQuestionIdx(idx)}
                    >
                      Question {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Question View */}
            <section className="question-view-area">
              <div className="view-inner-v2">
                <div className="view-header">
                  <img src="/assets/dino-2.png" alt="Dino" className="dino-decor-active" />
                  <h3 className="section-title-underline">Question View</h3>
                  <div className="timer-active-v2">
                    <Clock size={16} />
                    <span>{formatTime(timeRemaining)}</span>
                  </div>
                </div>

                <div className="question-body-v2">
                  <div className="question-text-box">
                    <p>{currentQ.questionText || currentQ.question}</p>
                  </div>

                  <div className="options-section">
                    <h4 className="options-subtitle">Options</h4>
                    <div className="options-grid-v2">
                      {currentQ.options.map((opt, idx) => {
                        const optTextValue = opt.optionText || opt;
                        return (
                          <div
                            key={idx}
                            className={`option-row-v2 ${isSelected(currentQ._id, optTextValue) ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(currentQ._id, optTextValue)}
                          >
                            <div className="radio-circle">
                              {isSelected(currentQ._id, optTextValue) && <div className="radio-inner" />}
                            </div>
                            <span className="opt-text-v2">{optTextValue}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="question-navigation-v2">
                  {currentQuestionIdx > 0 && (
                    <button onClick={handleBack} className="btn-nav-prev">
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="btn-nav-next"
                    disabled={isSubmitting || !userAnswers[currentQ._id]}
                  >
                    {isSubmitting ? 'Submitting...' :
                      (currentQuestionIdx === quiz.questions.length - 1 ? 'Finish' : 'Next →')}
                  </button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default QuizPage
