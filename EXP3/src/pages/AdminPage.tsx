import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="card animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem' }} className="gradient-text">System Administration Console</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Restricted Route. Requiring role: <code>admin</code>.
        </p>
      </div>

      <div
        style={{
          borderLeft: '4px solid var(--color-secondary)',
          background: 'rgba(168, 85, 247, 0.04)',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '0.9rem',
          lineHeight: '1.6',
        }}
      >
        <h4>👑 Highest Authority Granted</h4>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
          Access confirmed. Your role is <strong style={{ color: 'var(--text-primary)' }}>{user?.role}</strong>. 
          You have full read, write, update, and delete capability over system states and configurations.
        </p>
      </div>

      {/* RBAC Reference Matrix */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Role-Based Access Control Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              textAlign: 'left',
              color: 'var(--text-secondary)',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <th style={{ padding: '12px 8px' }}>User Role</th>
                <th style={{ padding: '12px 8px' }}>Dashboard (API)</th>
                <th style={{ padding: '12px 8px' }}>Editor Panel (Route)</th>
                <th style={{ padding: '12px 8px' }}>Admin Console (Route)</th>
                <th style={{ padding: '12px 8px' }}>Create Post (Action)</th>
                <th style={{ padding: '12px 8px' }}>Delete Post (Action)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-secondary)' }}>👑 Admin</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-info)' }}>📝 Editor</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-error)' }}>✗ No</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-error)' }}>✗ No</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-success)' }}>👁️ Viewer</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-error)' }}>✗ No</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-error)' }}>✗ No</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-error)' }}>✗ No</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-error)' }}>✗ No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
