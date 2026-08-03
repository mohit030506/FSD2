import React from 'react';
import { useAuth } from '../context/AuthContext';

export const EditorPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="card animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem' }} className="gradient-text">Content Management Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Authorized Route. Requiring role: <code>editor</code> or <code>admin</code>.
        </p>
      </div>

      <div
        style={{
          borderLeft: '4px solid var(--color-info)',
          background: 'rgba(14, 165, 233, 0.04)',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '0.9rem',
          lineHeight: '1.6',
        }}
      >
        <h4>📝 Role-Based Route Validation</h4>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
          You have successfully routed to the editor content management page because your role is 
          <strong style={{ color: 'var(--text-primary)', marginLeft: '4px' }}>{user?.role}</strong>. 
          The protected route guard matched your credentials. 
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '1.1rem' }}>Editor Privileges and Capabilities</h4>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Create Records:</strong> Able to submit articles to the main dashboard database feed.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Draft Content:</strong> Write new content and flag articles for admin review.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Modify metadata:</strong> Edit title and structural components of existing articles.
          </li>
          <li style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>
            <strong>Delete Records:</strong> Permanently erase articles (restricted to Admins only).
          </li>
        </ul>
      </div>
    </div>
  );
};
export default EditorPage;
