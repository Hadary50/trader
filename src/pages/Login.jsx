import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/'; // Redirect and refresh to update state
    } catch (err) {
      setError(err.response?.data?.message || 'خطأ في الاتصال بالسيرفر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="bg-primary text-white d-inline-block p-3 rounded-circle mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 className="fw-bold">دخول الإدارة</h3>
            <p className="text-secondary small">أدخل كلمة المرور للوصول لصلاحيات التعديل</p>
          </div>
          
          {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label fw-semibold">كلمة المرور</label>
              <input 
                type="password" 
                className="form-control form-control-lg" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm"></span> : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
