import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, X, Eye, Image as ImageIcon, Layout, Tag, Code, Save } from 'lucide-react'
import { categoryApi } from '../../api/apiClient'
import './AdminManagers.css'

function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    thumbnail: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await categoryApi.getAll()
      setCategories(res.data.data || res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory._id, formData)
      } else {
        await categoryApi.create(formData)
      }
      setShowModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return
    try {
      await categoryApi.delete(id)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const handleEdit = (cat) => {
    setEditingCategory(cat)
    setFormData({
      name: cat.name,
      code: cat.code || '',
      description: cat.description || '',
      thumbnail: cat.thumbnail || ''
    })
    setShowModal(true)
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setFormData({ name: '', code: '', description: '', thumbnail: '' })
    setShowModal(true)
  }

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="manager-container full-width animate-up">
      <div className="manager-header">
        <div>
          <h2>Category Management</h2>
          <p className="text-secondary">Organize your courses into logical groups</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={18} /> New Category
        </button>
      </div>

      {isLoading ? (
        <div className="loading-centered">
          <Loader2 className="animate-spin" size={40} color="var(--primary)" />
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="manager-table">
            <thead>
              <tr>
                <th width="60">No</th>
                <th width="80">Icon</th>
                <th>Category Info</th>
                <th>Description</th>
                <th width="120" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={cat.thumbnail || 'https://placehold.co/100?text=Icon'}
                      alt="" className="mini-thumb"
                      onError={e => e.target.src = 'https://placehold.co/100?text=Icon'}
                    />
                  </td>
                  <td>
                    <div className="font-semibold">{cat.name}</div>
                    <div className="badge-code">{cat.code || 'NO-CODE'}</div>
                  </td>
                  <td title={cat.description}>{truncate(cat.description, 60)}</td>
                  <td>
                    <div className="action-buttons justify-end">
                      <button className="icon-btn-small edit" onClick={() => handleEdit(cat)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-small delete" onClick={() => handleDelete(cat._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '4rem' }}>
                    <div className="empty-state">
                      <Layout size={48} style={{ opacity: 0.1 }} />
                      <p>No categories found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-lg">
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3>{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Programming" />
                </div>
                <div className="form-group">
                  <label>Unique Code</label>
                  <input required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. PROG" />
                </div>
              </div>

              <div className="form-group">
                <label>Thumbnail / Icon URL</label>
                <input value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="https://..." />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="What's this category about?" />
              </div>

              {formData.thumbnail && (
                <div className="thumbnail-preview-container" style={{ marginTop: 0, marginBottom: '20px' }}>
                  <label>Preview</label>
                  <div className="preview-box" style={{ height: '80px', width: '80px' }}>
                    <img src={formData.thumbnail} alt="" onError={e => e.target.src = 'https://placehold.co/100?text=Invalid'} />
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <span><Save size={18} /> Save Category</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
