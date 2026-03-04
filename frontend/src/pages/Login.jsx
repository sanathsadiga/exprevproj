import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authAPI } from '../api/client';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user, token);
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div className="form" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Expense & Revenue</h1>
        <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '30px' }}>Login</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Do not have an account? <Link to="/register">Register here</Link>
        </p>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
          Demo Admin: admin@example.com / admin123
        </p>
      </div>
    </div>
  );
};

export default Login;
