import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { logService } from '../services/logService';

interface Post {
  id: string;
  title: string;
  author: string;
}

interface DashboardData {
  posts: Post[];
  systemStatus: string;
  sessionExpiry: string;
  stats: {
    totalPosts: number;
    usersCount: number;
    activeRoles: string[];
  };
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get('/api/data/dashboard');
      setData(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setActionLoading(true);
      setErrorMsg(null);
      // Calls the editor-protected endpoint
      const res = await api.post('/api/data/editor', { title: newTitle });
      
      // Update state
      if (data) {
        setData({
          ...data,
          posts: res.data.posts,
          stats: {
            ...data.stats,
            totalPosts: res.data.posts.length,
          },
        });
      }
      setNewTitle('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Unauthorized to create posts.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setActionLoading(true);
      setErrorMsg(null);
      // Calls the admin-protected endpoint
      const res = await api.post('/api/data/admin', { postId });
      
      // Update state
      if (data) {
        setData({
          ...data,
          posts: res.data.posts,
          stats: {
            ...data.stats,
            totalPosts: res.data.posts.length,
          },
        });
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Unauthorized to delete posts.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to trigger concurrent API calls (tests queuing in interceptor!)
  const triggerConcurrentRequests = async () => {
    logService.addLog('system', '⚡ Concurrent API Calls', 'Triggering 3 rapid-fire API requests to test queueing during silent refreshes.');
    
    // We fire all three without await, and resolve them together
    Promise.all([
      api.get('/api/data/dashboard'),
      api.get('/api/data/dashboard'),
      api.get('/api/data/dashboard')
    ]).then(() => {
      logService.addLog('success', '⚡ Concurrent Calls Done', 'All 3 concurrent calls completed successfully.');
      fetchDashboardData();
    }).catch((err) => {
      logService.addLog('error', '⚡ Concurrent Calls Failed', err.message);
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  const hasWritePermission = user?.role === 'admin' || user?.role === 'editor';
  const hasDeletePermission = user?.role === 'admin';

  return (
    <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem' }} className="gradient-text">Operational Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Welcome, <strong>{user?.fullName}</strong>. View details and execute actions below.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={triggerConcurrentRequests} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            ⚡ Parallel Request Test
          </button>
          <button onClick={fetchDashboardData} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-error)',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
          }}
        >
          <strong>Error: </strong> {errorMsg}
        </div>
      )}

      {/* Analytics Cards */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              System Integrity
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-success)' }}>
              🟢 {data.systemStatus}
            </span>
          </div>

          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Records
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {data.stats.totalPosts}
            </span>
          </div>

          <div className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              System Users
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {data.stats.usersCount} Accounts
            </span>
          </div>
        </div>
      )}

      {/* Dashboard Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Posts Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Resource Table (Mock Articles)
          </h3>

          {/* Conditional Input Box */}
          {hasWritePermission ? (
            <form onSubmit={handleCreatePost} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Type new post title..."
                style={{ flexGrow: 1 }}
                disabled={actionLoading}
              />
              <button type="submit" className="btn btn-primary" disabled={actionLoading || !newTitle.trim()}>
                Add Record
              </button>
            </form>
          ) : (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed var(--border-color)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
              }}
            >
              🔒 You have viewer-only access. Log in as an Editor or Admin to add new posts.
            </div>
          )}

          {/* Posts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.posts.map((post) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(18, 24, 38, 0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 500 }}>{post.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Author: @{post.author} • ID: {post.id}
                  </span>
                </div>
                
                {/* Conditional Delete Button */}
                {hasDeletePermission ? (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                ) : (
                  user?.role === 'editor' && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Admin delete only
                    </span>
                  )
                )}
              </div>
            ))}

            {data?.posts.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                No records found in database.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
