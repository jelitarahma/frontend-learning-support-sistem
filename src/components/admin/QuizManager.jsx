import { useState, useEffect } from 'react'
import {
  Plus, Edit2, Trash2, Loader2, X, List, HelpCircle,
  CheckCircle, Save, ArrowLeft, Info, HelpCircle as HelpIcon,
  Award, Clock, BarChart2
} from 'lucide-react'
import { quizApi, subjectApi, materialApi } from '../../api/apiClient'
import './AdminManagers.css'

function QuizManager() {
  const [quizzes, setQuizzes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // View states: 'list', 'quizForm', 'questions'
  const [viewState, setViewState] = useState('list')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  // Quiz Form State
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    materialId: '',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    difficulty: 'BASIC',
    status: 'PUBLISHED'
  })

  // Question Form State
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questionFormData, setQuestionFormData] = useState({
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    points: 10,
    options: [
      { optionText: '', isCorrect: true },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ],
    explanation: '',
    orderNumber: 1
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setIsLoading(true)
    try {
      const [qRes, sRes, mRes] = await Promise.all([
        quizApi.getAll(),
        subjectApi.getAll(),
        materialApi.getAll()
      ])
      setQuizzes(qRes.data.data || qRes.data)
      setSubjects(sRes.data.data || sRes.data)
      setMaterials(mRes.data.data || mRes.data)
    } catch (error) {
      console.error('Error fetching quiz data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // --- Quiz CRUD ---
  const handleAddQuiz = () => {
    setEditingItem(null)
    setQuizFormData({
      title: '',
      materialId: materials[0]?._id || '',
      description: '',
      timeLimit: 30,
      passingScore: 70,
      difficulty: 'BASIC',
      status: 'PUBLISHED'
    })
    setViewState('quizForm')
  }

  const handleEditQuiz = (quiz) => {
    setEditingItem(quiz)
    setQuizFormData({
      title: quiz.title,
      materialId: quiz.materialId?._id || quiz.materialId || '',
      description: quiz.description || '',
      timeLimit: quiz.timeLimit || 30,
      passingScore: quiz.passingScore || 70,
      difficulty: quiz.difficulty || 'BASIC',
      status: quiz.status || 'PUBLISHED'
    })
    setViewState('quizForm')
  }

  const handleQuizSubmit = async (e) => {
    e.preventDefault()
    setIsActionLoading(true)
    try {
      if (editingItem) {
        await quizApi.update(editingItem._id, quizFormData)
      } else {
        await quizApi.create(quizFormData)
      }
      setViewState('list')
      fetchInitialData()
    } catch (error) {
      alert('Failed to save quiz')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return
    try {
      await quizApi.delete(id)
      fetchInitialData()
    } catch (error) {
      alert('Delete failed')
    }
  }

  // --- Question Management ---
  const handleManageQuestions = async (quiz) => {
    setIsLoading(true)
    try {
      const res = await quizApi.getById(quiz._id)
      setSelectedQuiz(res.data.data.quiz || res.data.data)
      // If the API returns questions separately or nested
      const detailRes = await quizApi.getById(quiz._id)
      setSelectedQuiz({
        ...detailRes.data.data.quiz,
        questions: detailRes.data.data.questions || []
      })
      setViewState('questions')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddQuestion = () => {
    setEditingItem(null)
    setQuestionFormData({
      questionText: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 10,
      options: [
        { optionText: '', isCorrect: true },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ],
      explanation: '',
      orderNumber: (selectedQuiz?.questions?.length || 0) + 1
    })
    setShowQuestionForm(true)
  }

  const handleEditQuestion = (q) => {
    setEditingItem(q)
    setQuestionFormData({
      questionText: q.questionText,
      questionType: q.questionType || 'MULTIPLE_CHOICE',
      points: q.points || 10,
      options: q.options.map(opt => ({ ...opt })),
      explanation: q.explanation || '',
      orderNumber: q.orderNumber || 1
    })
    setShowQuestionForm(true)
  }

  const setCorrectOption = (index) => {
    const updatedOptions = questionFormData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }))
    setQuestionFormData({ ...questionFormData, options: updatedOptions })
  }

  const handleQuestionSubmit = async (e) => {
    e.preventDefault()
    setIsActionLoading(true)
    try {
      if (editingItem) {
        await quizApi.updateQuestion(editingItem._id, questionFormData)
      } else {
        // User pointed out API might take an array
        await quizApi.addQuestions([{ ...questionFormData, quizId: selectedQuiz._id }])
      }
      setShowQuestionForm(false)
      handleManageQuestions(selectedQuiz)
    } catch (error) {
      alert('Failed to save question')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete question?')) return
    try {
      await quizApi.deleteQuestion(id)
      handleManageQuestions(selectedQuiz)
    } catch (error) {
      alert('Delete failed')
    }
  }

  // --- Render Views ---

  if (isLoading && viewState === 'list') {
    return (
      <div className="loading-centered">
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p>Loading quiz center...</p>
      </div>
    )
  }

  // 1. List View
  if (viewState === 'list') {
    return (
      <div className="manager-container full-width animate-up">
        <div className="manager-header">
          <div>
            <h2>Quiz Management</h2>
            <p className="text-secondary">Create assessments and manage question banks</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddQuiz}>
            <Plus size={18} /> New Quiz
          </button>
        </div>

        <div className="table-responsive">
          <table className="manager-table">
            <thead>
              <tr>
                <th width="60">No</th>
                <th>Quiz Info</th>
                <th>Associated Material</th>
                <th>Stats</th>
                <th width="150" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, idx) => (
                <tr key={quiz._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div className="font-semibold">{quiz.title}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className={`status-badge ${quiz.status?.toLowerCase()}`}>{quiz.status}</span>
                      <span className={`badge-difficulty difficulty-${quiz.difficulty}`}>{quiz.difficulty}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      {quiz.materialId?.title || 'No material linked'}
                    </div>
                  </td>
                  <td>
                    <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                      {quiz.timeLimit}m • {quiz.passingScore}% pass
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons justify-end">
                      <button className="icon-btn-small detail" title="Questions" onClick={() => handleManageQuestions(quiz)}>
                        <List size={16} />
                      </button>
                      <button className="icon-btn-small edit" onClick={() => handleEditQuiz(quiz)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-small delete" onClick={() => handleDeleteQuiz(quiz._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 2. Quiz Form View
  if (viewState === 'quizForm') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('list')}>
          <ArrowLeft size={18} /> Back to List
        </button>
        <div className="full-page-form">
          <h3>{editingItem ? 'Edit Quiz Settings' : 'Create New Assessment'}</h3>
          <form onSubmit={handleQuizSubmit}>
            <div className="form-group">
              <label>Quiz Title</label>
              <input required value={quizFormData.title} onChange={e => setQuizFormData({ ...quizFormData, title: e.target.value })} placeholder="e.g. Mid-term Exam" />
            </div>

            <div className="form-group">
              <label>Link to Material</label>
              <select value={quizFormData.materialId} onChange={e => setQuizFormData({ ...quizFormData, materialId: e.target.value })}>
                {materials.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Difficulty</label>
                <select value={quizFormData.difficulty} onChange={e => setQuizFormData({ ...quizFormData, difficulty: e.target.value })}>
                  <option value="BASIC">Basic</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={quizFormData.status} onChange={e => setQuizFormData({ ...quizFormData, status: e.target.value })}>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Time Limit (minutes)</label>
                <input type="number" value={quizFormData.timeLimit} onChange={e => setQuizFormData({ ...quizFormData, timeLimit: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Passing Score (%)</label>
                <input type="number" value={quizFormData.passingScore} onChange={e => setQuizFormData({ ...quizFormData, passingScore: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="form-group">
              <label>Internal Description</label>
              <textarea rows="3" value={quizFormData.description} onChange={e => setQuizFormData({ ...quizFormData, description: e.target.value })} />
            </div>

            <div className="form-actions-bar">
              <button type="button" className="btn btn-outline" onClick={() => setViewState('list')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <span><Save size={18} /> Save Quiz</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 3. Question Bank View
  if (viewState === 'questions') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('list')}>
          <ArrowLeft size={18} /> Back to Quizzes
        </button>

        <div className="subject-info-banner card">
          <div className="info-text">
            <span className="category-tag">Question Bank</span>
            <h2>{selectedQuiz?.title}</h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <span className="text-secondary"><Clock size={14} /> {selectedQuiz?.timeLimit}m</span>
              <span className="text-secondary"><Award size={14} /> {selectedQuiz?.passingScore}% to pass</span>
              <span className="text-secondary"><BarChart2 size={14} /> {selectedQuiz?.questions?.length || 0} Questions</span>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h3>Questions ({selectedQuiz?.questions?.length || 0})</h3>
          <button className="btn btn-primary" onClick={handleAddQuestion}><Plus size={18} /> Add Question</button>
        </div>

        <div className="questions-list">
          {selectedQuiz?.questions?.sort((a, b) => a.orderNumber - b.orderNumber).map((q, idx) => (
            <div key={q._id} className="question-item card animate-up" style={{ padding: '24px', marginBottom: '20px' }}>
              <div className="question-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="badge-code">Q {q.orderNumber || idx + 1}</div>
                  <span className="badge-type">{q.points} Points</span>
                </div>
                <div className="action-buttons">
                  <button className="icon-btn-small edit" onClick={() => handleEditQuestion(q)}><Edit2 size={16} /></button>
                  <button className="icon-btn-small delete" onClick={() => handleDeleteQuestion(q._id)}><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1e293b', marginBottom: '20px' }}>{q.questionText}</p>

              <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {q.options?.map((opt, i) => (
                  <div key={i} className={`option-preview ${opt.isCorrect ? 'correct' : ''}`} style={{
                    padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9',
                    background: opt.isCorrect ? '#f0fdf4' : '#fff',
                    borderColor: opt.isCorrect ? '#bcf0da' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                    {opt.isCorrect ? <CheckCircle size={16} color="#10b981" /> : <div style={{ width: 16 }} />}
                    <span>{opt.optionText}</span>
                  </div>
                ))}
              </div>
              {q.explanation && (
                <div style={{ marginTop: '20px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
          {(!selectedQuiz?.questions || selectedQuiz.questions.length === 0) && (
            <div className="empty-state text-center card" style={{ padding: '80px' }}>
              <HelpIcon size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
              <p>This quiz has no questions yet. Use the button above to add one.</p>
            </div>
          )}
        </div>

        {/* Question Form Overlay (Modal but Premium) */}
        {showQuestionForm && (
          <div className="modal-overlay">
            <div className="modal-content card" style={{ maxWidth: '800px' }}>
              <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3>{editingItem ? 'Edit Question' : 'New Question'}</h3>
                <button className="close-btn" onClick={() => setShowQuestionForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={handleQuestionSubmit}>
                <div className="form-group">
                  <label>Question Text</label>
                  <textarea required rows="3" value={questionFormData.questionText} onChange={e => setQuestionFormData({ ...questionFormData, questionText: e.target.value })} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Points</label>
                    <input type="number" value={questionFormData.points} onChange={e => setQuestionFormData({ ...questionFormData, points: parseInt(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Order Number</label>
                    <input type="number" value={questionFormData.orderNumber} onChange={e => setQuestionFormData({ ...questionFormData, orderNumber: parseInt(e.target.value) })} />
                  </div>
                </div>

                <div className="section-divider"><Info size={20} /> Options</div>

                <div className="options-edit-bank">
                  {questionFormData.options.map((opt, i) => (
                    <div key={i} className={`option-edit-row ${opt.isCorrect ? 'correct' : ''}`}>
                      <input type="radio" checked={opt.isCorrect} onChange={() => setCorrectOption(i)} name="correct-tag" />
                      <input required type="text" value={opt.optionText} onChange={e => {
                        const newOpts = [...questionFormData.options];
                        newOpts[i].optionText = e.target.value;
                        setQuestionFormData({ ...questionFormData, options: newOpts });
                      }} placeholder={`Option ${i + 1}`} />
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: '20px' }}>
                  <label>Explanation (Optional)</label>
                  <textarea rows="2" value={questionFormData.explanation} onChange={e => setQuestionFormData({ ...questionFormData, explanation: e.target.value })} />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowQuestionForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isActionLoading}>
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <span><Save size={18} /> Save Question</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="loading-centered">
      <p>Transitioning views...</p>
    </div>
  )
}

export default QuizManager
