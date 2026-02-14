import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './AuthPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser && (savedUser.role === 'ADMIN' || savedUser.role === 'TEACHER')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-up">
        {/* Left Side: Visual */}
        <div className="auth-visual">
          <div className="visual-content">
            <img
              src="/assets/Mask Group.png"
              alt="Login Illustration"
              className="auth-illustration-img"
            />
            <h2>Welcome Back!</h2>
            <p>Ayo lanjut belajar dan kejar mimpimu bersama Skillvers.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <img src="/assets/logo.11dc4d9c.svg fill.png" alt="Skillvers" style={{ height: '40px' }} />
            </Link>
            <h1>Login</h1>
            <p>Silahkan masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-group">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="name@learning.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button type="submit" className="btn-auth" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : (
                <>
                  Login Ke Akun <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>Belum punya akun? <Link to="/register">Daftar Sekarang</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
