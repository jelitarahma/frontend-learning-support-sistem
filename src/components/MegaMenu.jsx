import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { categoryApi, subjectApi } from '../api/apiClient';
import './MegaMenu.css';

function MegaMenu() {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          categoryApi.getAll(),
          subjectApi.getAll()
        ]);

        const cats = catRes.data.data || catRes.data;
        const subs = subRes.data.data || subRes.data;

        setCategories(cats);
        setSubjects(subs);

        // Set first category as active by default if available
        if (cats.length > 0) {
          setActiveCategory(cats[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch menu data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter subjects based on active category
  // Handles cases where categoryId is populated (object) or unpopulated (string)
  const activeSubjects = subjects.filter(sub => {
    if (!sub.categoryId) return false;
    const subCatId = typeof sub.categoryId === 'object' ? sub.categoryId._id : sub.categoryId;
    return subCatId === activeCategory;
  });

  const currentCategoryName = categories.find(c => c._id === activeCategory)?.name;

  if (loading) return null;

  return (
    <div className="mega-menu-container">
      <div className="nav-link mega-menu-trigger">
        Categories <ChevronDown size={14} />
      </div>

      <div className="mega-menu-dropdown">
        <div className="categories-column">
          {categories.map(cat => (
            <div
              key={cat._id}
              className={`category-item ${activeCategory === cat._id ? 'active' : ''}`}
              onMouseEnter={() => setActiveCategory(cat._id)}
            >
              <div className="flex items-center gap-2">
                <span>{cat.name}</span>
              </div>
              {activeCategory === cat._id && <ChevronRight size={14} />}
            </div>
          ))}
        </div>

        <div className="subjects-column">
          <h4>
            <Layers size={18} />
            {currentCategoryName || 'Subjects'}
          </h4>

          {activeSubjects.length > 0 ? (
            <div className="subjects-grid">
              {activeSubjects.map(sub => (
                <Link
                  to={`/course/${sub._id}`}
                  key={sub._id}
                  className="subject-item"
                >
                  <span className="subject-name">{sub.name}</span>
                  <span className="subject-code">{sub.code}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-subjects">
              <p>No subjects available for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MegaMenu;
