import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, UserCircle, Eye, EyeOff } from 'lucide-react';
import './AuthPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
    role: 'STUDENT',
    schoolInfo: {
      schoolName: 'SMA Negeri 1',
      class: '12 IPA 1',
      academicYear: '2025/2026'
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Filter out schoolInfo if user is ADMIN
    const submitData = { ...formData };
    if (submitData.role === 'ADMIN') {
      delete submitData.schoolInfo;
    }

    const result = await register(submitData);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-up">
        {/* Left Side: Visual */}
        <div className="auth-visual">
          <div className="visual-content">
            <img
              src="/assets/login-img.png"
              alt="Register Illustration"
              className="auth-illustration-img"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h1>Daftar</h1>
            <p>Lengkapi data diri Anda untuk mendaftar</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Nama Lengkap</label>
              <div className="input-group">
                <User size={20} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Username</label>
              <div className="input-group">
                <UserCircle size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-group">
                <Mail size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@learning.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <Lock size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Daftar Sebagai</label>
              <div className="input-group">
                <UserCircle size={20} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                <>
                  Buat Akun Sekarang <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Sudah punya akun? <Link to="/login">Login Disini</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
