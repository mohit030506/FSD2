import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Route redirection location after login
  const from = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect away
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorData = err.response?.data;
      setErrorMsg(errorData?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (userType: 'admin' | 'editor' | 'viewer') => {
    setUsername(userType);
    setPassword('password123');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '16px' }}>
      <div className="card animate-slide-in" style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem' }}>🔐</span>
          <h2 style={{ fontSize: '1.75rem', marginTop: '12px', marginBottom: '6px' }} className="gradient-text">Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to explore the RBAC demo ecosystem</p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-error)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center' }}>
            Quick Credentials (Click to Autofill)
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', flexGrow: 1 }}
              disabled={isSubmitting}
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleQuickLogin('editor')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', flexGrow: 1 }}
              disabled={isSubmitting}
            >
              📝 Editor
            </button>
            <button
              onClick={() => handleQuickLogin('viewer')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', flexGrow: 1 }}
              disabled={isSubmitting}
            >
              👁️ Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
