import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ fontSize: '2rem' }}>📚</Link>
          <h1 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: '#8a7e70' }}>Sign in to your Kitaab account</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required className="input" autoFocus />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required className="input" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider" />


          <p style={{ textAlign: 'center', color: '#8a7e70', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#c8820a', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
