import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="unauthorized-container animate-slide-in">
      <div className="card" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '3.5rem' }}>🚫</span>
        <h2 style={{ fontSize: '1.75rem' }} className="gradient-text">Access Denied (403)</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          Your account role is <span className="badge badge-viewer" style={{ textTransform: 'capitalize' }}>{user?.role || 'unknown'}</span>. 
          You do not have permission to access this page. RBAC protection has successfully blocked this route.
        </p>
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ flexGrow: 1 }}>
            Return to Dashboard
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ flexGrow: 1 }}>
            Switch User
          </button>
        </div>
      </div>
    </div>
  );
};
export default Unauthorized;
