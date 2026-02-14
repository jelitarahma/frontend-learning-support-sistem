import { useState, useEffect } from 'react'
import {
  Plus, Edit2, Trash2, Loader2, X, ChevronRight, BookOpen,
  Video, FileText, Layers, Clock, BarChart, Save, ArrowLeft,
  Globe, Layout, Share2, Info, Eye
} from 'lucide-react'
import { subjectApi, chapterApi, materialApi, categoryApi } from '../../api/apiClient'
import './AdminManagers.css'

function SubjectManager() {
  const [subjects, setSubjects] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // View states: 'list', 'subjectForm', 'subjectDetail', 'chapterForm', 'chapterDetail', 'materialForm'
  const [viewState, setViewState] = useState('list')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [editingItem, setEditingItem] = useState(null) // Generic for sub-forms
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Subject Form State
  const [subjectFormData, setSubjectFormData] = useState({
    name: '', code: '', description: '', categoryId: '', thumbnail: ''
  })

  // Chapter Form State
  const [chapterFormData, setChapterFormData] = useState({
    title: '', description: '', orderNumber: 1, estimatedTime: 30, difficulty: 'BASIC'
  })

  // Material Form State
  const [materialFormData, setMaterialFormData] = useState({
    title: '', content: '', type: 'VIDEO', mediaUrl: '', orderNumber: 1,
    status: 'PUBLISHED', metadata: { readTime: 15, difficulty: 'BASIC', tags: [] }
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    setIsLoading(true)
    try {
      const [sRes, cRes] = await Promise.all([
        subjectApi.getAll(),
        categoryApi.getAll()
      ])
      setSubjects(sRes.data.data || sRes.data)
      setCategories(cRes.data.data || cRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // --- Subject Operations ---
  const handleAddSubject = () => {
    setEditingItem(null)
    setSubjectFormData({ name: '', code: '', description: '', categoryId: categories[0]?._id || '', thumbnail: '' })
    setViewState('subjectForm')
  }

  const handleEditSubject = (sub) => {
    setEditingItem(sub)
    setSubjectFormData({
      name: sub.name,
      code: sub.code || '',
      description: sub.description || '',
      categoryId: sub.categoryId?._id || sub.categoryId || '',
      thumbnail: sub.thumbnail || ''
    })
    setViewState('subjectForm')
  }

  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    setIsActionLoading(true)
    try {
      if (editingItem) {
        await subjectApi.update(editingItem._id, subjectFormData)
      } else {
        await subjectApi.create(subjectFormData)
      }
      setViewState('list')
      fetchInitialData()
    } catch (error) {
      alert('Failed to save subject')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Delete subject and all its content?')) return
    try {
      await subjectApi.delete(id)
      fetchInitialData()
    } catch (error) {
      alert('Delete failed')
    }
  }

  // --- Chapter Operations ---
  const handleViewSubjectDetail = async (sub) => {
    setIsLoading(true)
    try {
      const res = await subjectApi.getById(sub._id)
      setSelectedSubject(res.data.data)
      setViewState('subjectDetail')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddChapter = () => {
    setEditingItem(null)
    setChapterFormData({ title: '', description: '', orderNumber: (selectedSubject?.chapters?.length || 0) + 1, estimatedTime: 30, difficulty: 'BASIC' })
    setViewState('chapterForm')
  }

  const handleEditChapter = (ch) => {
    setEditingItem(ch)
    setChapterFormData({
      title: ch.title,
      description: ch.description || '',
      orderNumber: ch.orderNumber || 1,
      estimatedTime: ch.estimatedTime || 30,
      difficulty: ch.difficulty || 'BASIC'
    })
    setViewState('chapterForm')
  }

  const handleChapterSubmit = async (e) => {
    e.preventDefault()
    setIsActionLoading(true)
    try {
      if (editingItem) {
        await chapterApi.update(editingItem._id, chapterFormData)
      } else {
        await chapterApi.create({ ...chapterFormData, subjectId: selectedSubject._id })
      }
      handleViewSubjectDetail(selectedSubject) // Refresh
    } catch (error) {
      alert('Save failed')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteChapter = async (id) => {
    if (!window.confirm('Delete chapter?')) return
    try {
      await chapterApi.delete(id)
      handleViewSubjectDetail(selectedSubject)
    } catch (error) {
      alert('Delete failed')
    }
  }

  // --- Material Operations ---
  const handleViewChapterDetail = async (chapter) => {
    setIsLoading(true)
    try {
      const res = await materialApi.getByChapter(chapter._id)
      setSelectedChapter({ ...chapter, materials: res.data.data })
      setViewState('chapterDetail')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMaterial = () => {
    setEditingItem(null)
    setMaterialFormData({
      title: '', content: '', type: 'VIDEO', mediaUrl: '',
      orderNumber: (selectedChapter?.materials?.length || 0) + 1,
      status: 'PUBLISHED',
      metadata: { readTime: 15, difficulty: 'BASIC', tags: [] }
    })
    setViewState('materialForm')
  }

  const handleEditMaterial = (m) => {
    setEditingItem(m)
    setMaterialFormData({
      title: m.title,
      content: m.content || '',
      type: m.type || 'VIDEO',
      mediaUrl: m.mediaUrl || '',
      orderNumber: m.orderNumber || 1,
      status: m.status || 'PUBLISHED',
      metadata: {
        readTime: m.metadata?.readTime || 15,
        difficulty: m.metadata?.difficulty || 'BASIC',
        tags: m.metadata?.tags || []
      }
    })
    setViewState('materialForm')
  }

  const handleMaterialSubmit = async (e) => {
    e.preventDefault()
    setIsActionLoading(true)
    try {
      if (editingItem) {
        await materialApi.update(editingItem._id, materialFormData)
      } else {
        await materialApi.create({ ...materialFormData, chapterId: selectedChapter._id })
      }
      handleViewChapterDetail(selectedChapter)
    } catch (error) {
      alert('Save failed')
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Delete material?')) return
    try {
      await materialApi.delete(id)
      handleViewChapterDetail(selectedChapter)
    } catch (error) {
      alert('Delete failed')
    }
  }

  // --- Render Functions ---

  if (isLoading && (viewState === 'list' || viewState === 'subjectDetail' || viewState === 'chapterDetail')) {
    return (
      <div className="loading-centered">
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p>Loading components...</p>
      </div>
    )
  }

  // 1. Subject List View
  if (viewState === 'list') {
    return (
      <div className="manager-container full-width animate-up">
        <div className="manager-header">
          <div>
            <h2>Subjects Management</h2>
            <p className="text-secondary">Manage curriculum, chapters and learning materials</p>
          </div>
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <Plus size={18} /> New Subject
          </button>
        </div>

        <div className="table-responsive">
          <table className="manager-table">
            <thead>
              <tr>
                <th width="60">No</th>
                <th width="100">Thumbnail</th>
                <th>Subject Info</th>
                <th>Category</th>
                <th width="150" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub, idx) => (
                <tr key={sub._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <img
                      src={sub.thumbnail || 'https://placehold.co/400x300?text=No+Image'}
                      className="mini-thumb" alt={sub.name}
                      onError={e => e.target.src = 'https://placehold.co/400x300?text=No+Image'}
                    />
                  </td>
                  <td>
                    <div className="font-semibold">{sub.name}</div>
                    <div className="badge-code">{sub.code || 'NO-CODE'}</div>
                  </td>
                  <td><span className="badge-category">{sub.categoryId?.name || 'General'}</span></td>
                  <td>
                    <div className="action-buttons justify-end">
                      <button className="icon-btn-small detail" title="Manage Chapters" onClick={() => handleViewSubjectDetail(sub)}>
                        <Layers size={16} />
                      </button>
                      <button className="icon-btn-small edit" onClick={() => handleEditSubject(sub)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-small delete" onClick={() => handleDeleteSubject(sub._id)}>
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

  // 2. Subject Add/Edit View
  if (viewState === 'subjectForm') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('list')}>
          <ArrowLeft size={18} /> Back to List
        </button>
        <div className="full-page-form">
          <h3>{editingItem ? 'Edit Subject' : 'Add New Subject'}</h3>
          <form onSubmit={handleSubjectSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Subject Name</label>
                <input required value={subjectFormData.name} onChange={e => setSubjectFormData({ ...subjectFormData, name: e.target.value })} placeholder="e.g. Advanced Physics" />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input required value={subjectFormData.code} onChange={e => setSubjectFormData({ ...subjectFormData, code: e.target.value })} placeholder="e.g. PHYS-101" />
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={subjectFormData.categoryId} onChange={e => setSubjectFormData({ ...subjectFormData, categoryId: e.target.value })}>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input value={subjectFormData.thumbnail} onChange={e => setSubjectFormData({ ...subjectFormData, thumbnail: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" value={subjectFormData.description} onChange={e => setSubjectFormData({ ...subjectFormData, description: e.target.value })} placeholder="Brief overview of the subject..."></textarea>
            </div>
            <div className="form-actions-bar">
              <button type="button" className="btn btn-outline" onClick={() => setViewState('list')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <span><Save size={18} /> Save Subject</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 3. Subject Detail View (Chapter List)
  if (viewState === 'subjectDetail') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('list')}>
          <ArrowLeft size={18} /> Back to Subjects
        </button>

        <div className="subject-info-banner card">
          <img src={selectedSubject?.thumbnail} className="detail-thumb" alt="" onError={e => e.target.src = 'https://placehold.co/400x300?text=No+Image'} />
          <div className="info-text">
            <span className="category-tag">{selectedSubject?.categoryId?.name}</span>
            <h2>{selectedSubject?.name}</h2>
            <p className="text-secondary">{selectedSubject?.description}</p>
          </div>
        </div>

        <div className="section-header">
          <h3>Chapters ({selectedSubject?.chapters?.length || 0})</h3>
          <button className="btn btn-primary" onClick={handleAddChapter}><Plus size={18} /> Add Chapter</button>
        </div>

        <div className="chapters-list">
          {selectedSubject?.chapters?.sort((a, b) => a.orderNumber - b.orderNumber).map((ch, idx) => (
            <div key={ch._id} className="chapter-card card">
              <div className="chapter-header">
                <div className="chapter-title">
                  <div className="badge-code" style={{ height: 'fit-content' }}>CH {ch.orderNumber}</div>
                  <div>
                    <h4>{ch.title}</h4>
                    <p>{ch.description}</p>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                      <span className="badge-type"><Clock size={12} /> {ch.estimatedTime} mins</span>
                      <span className={`badge-difficulty difficulty-${ch.difficulty}`}>{ch.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="chapter-actions">
                  <button className="btn btn-sm btn-outline btn-icon-label" onClick={() => handleViewChapterDetail(ch)}>
                    <BookOpen size={16} /> Manage Materials
                  </button>
                  <button className="icon-btn-small edit" onClick={() => handleEditChapter(ch)}><Edit2 size={16} /></button>
                  <button className="icon-btn-small delete" onClick={() => handleDeleteChapter(ch._id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {(!selectedSubject?.chapters || selectedSubject.chapters.length === 0) && (
            <div className="empty-state card" style={{ padding: '40px' }}>
              <Layers size={40} style={{ opacity: 0.2 }} />
              <p>No chapters added yet for this subject.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 4. Chapter Form
  if (viewState === 'chapterForm') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('subjectDetail')}>
          <ArrowLeft size={18} /> Back to Subject
        </button>
        <div className="full-page-form">
          <h3>{editingItem ? 'Edit Chapter' : 'Add Chapter to ' + selectedSubject?.name}</h3>
          <form onSubmit={handleChapterSubmit}>
            <div className="form-group">
              <label>Chapter Title</label>
              <input required value={chapterFormData.title} onChange={e => setChapterFormData({ ...chapterFormData, title: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Order Number</label>
                <input type="number" value={chapterFormData.orderNumber} onChange={e => setChapterFormData({ ...chapterFormData, orderNumber: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={chapterFormData.difficulty} onChange={e => setChapterFormData({ ...chapterFormData, difficulty: e.target.value })}>
                  <option value="BASIC">Basic</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Estimated Time (minutes)</label>
              <input type="number" value={chapterFormData.estimatedTime} onChange={e => setChapterFormData({ ...chapterFormData, estimatedTime: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows="3" value={chapterFormData.description} onChange={e => setChapterFormData({ ...chapterFormData, description: e.target.value })}></textarea>
            </div>
            <div className="form-actions-bar">
              <button type="button" className="btn btn-outline" onClick={() => setViewState('subjectDetail')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <span><Save size={18} /> Save Chapter</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // 5. Chapter Detail View (Material List)
  if (viewState === 'chapterDetail') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('subjectDetail')}>
          <ArrowLeft size={18} /> Back to Chapters
        </button>

        <div className="subject-info-banner card">
          <div className="info-text">
            <span className="category-tag">Chapter {selectedChapter?.orderNumber}</span>
            <h2>{selectedChapter?.title}</h2>
            <p className="text-secondary">{selectedChapter?.description}</p>
          </div>
        </div>

        <div className="section-header">
          <h3>Materials ({selectedChapter?.materials?.length || 0})</h3>
          <button className="btn btn-primary" onClick={handleAddMaterial}><Plus size={18} /> Add Material</button>
        </div>

        <div className="materials-grid">
          {selectedChapter?.materials?.sort((a, b) => a.orderNumber - b.orderNumber).map((m, idx) => (
            <div key={m._id} className="material-item card animate-up" style={{ marginBottom: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div className="badge-code">{m.orderNumber}</div>
                  <div>
                    <div className="font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {m.type === 'VIDEO' ? <Video size={14} /> : m.type === 'TEXT' ? <FileText size={14} /> : < Globe size={14} />}
                      {m.title}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', marginTop: '4px' }}>
                      <span className={`status-badge ${m.status?.toLowerCase()}`}>{m.status}</span>
                      <span className="text-secondary">{m.metadata?.readTime} mins • {m.metadata?.difficulty}</span>
                    </div>
                  </div>
                </div>
                <div className="action-buttons">
                  <button className="icon-btn-small edit" onClick={() => handleEditMaterial(m)}><Edit2 size={16} /></button>
                  <button className="icon-btn-small delete" onClick={() => handleDeleteMaterial(m._id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {(!selectedChapter?.materials || selectedChapter.materials.length === 0) && (
            <div className="empty-state text-center card" style={{ padding: '60px' }}>
              <BookOpen size={40} style={{ opacity: 0.1, marginBottom: '16px' }} />
              <p>No materials in this chapter.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 6. Material Form
  if (viewState === 'materialForm') {
    return (
      <div className="manager-container full-width animate-up">
        <button className="btn-back" onClick={() => setViewState('chapterDetail')}>
          <ArrowLeft size={18} /> Back to Chapter
        </button>
        <div className="full-page-form">
          <h3>{editingItem ? 'Edit Material' : 'Add Material to ' + selectedChapter?.title}</h3>
          <form onSubmit={handleMaterialSubmit}>
            <div className="form-group">
              <label>Material Title</label>
              <input required value={materialFormData.title} onChange={e => setMaterialFormData({ ...materialFormData, title: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={materialFormData.type} onChange={e => setMaterialFormData({ ...materialFormData, type: e.target.value })}>
                  <option value="VIDEO">Video</option>
                  <option value="TEXT">Article / Text</option>
                  <option value="DOCUMENT">Document / PDF</option>
                  <option value="INTERACTIVE">Interactive Content</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={materialFormData.status} onChange={e => setMaterialFormData({ ...materialFormData, status: e.target.value })}>
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Media URL / Resource Link</label>
              <input value={materialFormData.mediaUrl} onChange={e => setMaterialFormData({ ...materialFormData, mediaUrl: e.target.value })} placeholder="YouTube link, PDF link, etc." />
            </div>

            <div className="section-divider"><Info size={20} /> Content & Metadata</div>

            <div className="form-group">
              <label>Content Text / HTML Description</label>
              <textarea rows="6" value={materialFormData.content} onChange={e => setMaterialFormData({ ...materialFormData, content: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Estimated Read/Watch Time (mins)</label>
                <input type="number" value={materialFormData.metadata.readTime} onChange={e => setMaterialFormData({ ...materialFormData, metadata: { ...materialFormData.metadata, readTime: parseInt(e.target.value) } })} />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select value={materialFormData.metadata.difficulty} onChange={e => setMaterialFormData({ ...materialFormData, metadata: { ...materialFormData.metadata, difficulty: e.target.value } })}>
                  <option value="BASIC">Basic</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-actions-bar">
              <button type="button" className="btn btn-outline" onClick={() => setViewState('chapterDetail')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isActionLoading}>
                {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <span><Save size={18} /> Save Material</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="loading-centered">
      <p>Transitioning views...</p>
    </div>
  )
}

export default SubjectManager
