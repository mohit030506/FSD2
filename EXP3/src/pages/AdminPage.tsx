import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface UserDirectoryEntry {
  username: string;
  role: string;
  fullName: string;
  email: string;
  status: string;
  department: string;
}

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserDirectoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get('/api/data/users');
      setUsers(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (targetUsername: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user @${targetUsername}?`)) {
      return;
    }

    try {
      setActionLoading(targetUsername);
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await api.post('/api/data/users/delete', { targetUsername });
      
      setUsers(res.data.users);
      setSuccessMsg(res.data.message || `Deleted user @${targetUsername} successfully.`);
      
      // Auto-clear success message after 4s
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || `Failed to delete user @${targetUsername}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter users based on query and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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

  const getStatusBadgeStyle = (status: string) => {
    const isActive = status.toLowerCase() === 'active';
    return {
      background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      color: isActive ? 'var(--color-success)' : 'var(--color-error)',
      border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
    };
  };

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem' }} className="gradient-text">System Administration Console</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Authorized Route. Requiring role: <code>admin</code>. Currently logged in as: <strong>{user?.fullName}</strong>.
        </p>
      </div>

      {/* Admin Privilege Banner */}
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
        <h4>👑 Highest Authority Active</h4>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
          You have full read/write administrative access. Below is the active directory of 30 mock accounts. 
          You can test the RBAC delete mechanism by clicking "Delete User" on any account except your own active session.
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--color-success)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem' }}>
          {successMsg}
        </div>
      )}

      {/* Directory Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>User Directory Database ({filteredUsers.length} accounts loaded)</h3>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '12px', flexGrow: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by name, @username, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '220px', padding: '8px 12px', fontSize: '0.85rem' }}
            />
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                background: 'rgba(18, 24, 38, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="editor">Editors</option>
              <option value="viewer">Viewers</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        {loading ? (
          <div className="loading-container" style={{ minHeight: '200px' }}>
            <div className="spinner"></div>
            <p>Fetching user records...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                  <th style={{ padding: '12px 10px' }}>Full Name</th>
                  <th style={{ padding: '12px 10px' }}>Username</th>
                  <th style={{ padding: '12px 10px' }}>Email</th>
                  <th style={{ padding: '12px 10px' }}>Department</th>
                  <th style={{ padding: '12px 10px' }}>Role</th>
                  <th style={{ padding: '12px 10px' }}>Status</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} className="table-row">
                    <td style={{ padding: '12px 10px', fontWeight: 500 }}>{u.fullName}</td>
                    <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      @{u.username}
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '12px 10px' }}>{u.department}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge" style={getStatusBadgeStyle(u.status)}>{u.status}</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(u.username)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        disabled={actionLoading !== null || u.username === user?.username}
                      >
                        {actionLoading === u.username ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                      No user accounts match the current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RBAC Reference Matrix (Rendered Below) */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Role-Based Access Control Matrix Reference</h3>
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
                <th style={{ padding: '12px 8px' }}>User Directory (API)</th>
                <th style={{ padding: '12px 8px' }}>Editor Panel (Route)</th>
                <th style={{ padding: '12px 8px' }}>Admin Console (Route)</th>
                <th style={{ padding: '12px 8px' }}>Create Post (Action)</th>
                <th style={{ padding: '12px 8px' }}>Delete User (Action)</th>
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
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-info)' }}>📝 Editor</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-success)' }}>✓ Yes</td>
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
