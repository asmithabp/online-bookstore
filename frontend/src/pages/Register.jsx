import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome to Kitaab!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{ fontSize: '2rem' }}>📚</Link>
          <h1 style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: '#8a7e70' }}>Join thousands of book lovers on Kitaab</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Arjun Sharma" required className="input" autoFocus />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="arjun@example.com" required className="input" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Minimum 6 characters" required className="input" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Repeat your password" required className="input" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', color: '#8a7e70', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c8820a', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
