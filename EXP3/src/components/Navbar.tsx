import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'badge badge-admin';
      case 'editor':
        return 'badge badge-editor';
      default:
        return 'badge badge-viewer';
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span style={{ fontSize: '1.5rem' }}>🛡️</span>
        <span className="gradient-text" style={{ fontWeight: 800 }}>RBAC Guardian</span>
      </Link>

      {isAuthenticated && user && (
        <div className="nav-links">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          
          {(user.role === 'admin' || user.role === 'editor') && (
            <NavLink to="/editor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Editor Panel
            </NavLink>
          )}

          {user.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Admin Console
            </NavLink>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginLeft: '16px',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.fullName}
              </span>
              <span className={getRoleBadgeClass(user.role)} style={{ fontSize: '0.65rem', marginTop: '2px' }}>
                {user.role}
              </span>
            </div>
            
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="nav-links">
          <NavLink to="/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.875rem' }}>
            Sign In
          </NavLink>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
