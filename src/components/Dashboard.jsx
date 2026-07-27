import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectAllPosts } from '../features/posts/postsSlice';
import PlatformStats from './PlatformStats';
import AnalyticsChart from './AnalyticsChart';
import DevConsole from './DevConsole';
import PostForm from './PostForm';
import PostCard from './PostCard';
import { RefreshCw, LayoutGrid, CheckCircle2, AlertTriangle, Database, Activity, Search } from 'lucide-react';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(state => state.posts.status);
  const postsError = useSelector(state => state.posts.error);

  const [activePlatform, setActivePlatform] = useState(null);
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [postToEdit, setPostToEdit] = useState(null);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postsStatus, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchPosts());
  };

  const handleEditInit = (post) => {
    setPostToEdit(post);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setPostToEdit(null);
  };

  // Filter and Sort posts based on current selections
  const filteredPosts = posts
    .filter(post => {
      const platformMatch = !activePlatform || post.platformId === activePlatform;
      const statusMatch = activeStatus === 'all' || post.status === activeStatus;
      
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchLower) || 
        post.content.toLowerCase().includes(searchLower);
        
      return platformMatch && statusMatch && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b.date.localeCompare(a.date);
      }
      if (sortBy === 'oldest') {
        return a.date.localeCompare(b.date);
      }
      if (sortBy === 'reactions') {
        const sumA = Object.values(a.reactions || {}).reduce((s, v) => s + v, 0);
        const sumB = Object.values(b.reactions || {}).reduce((s, v) => s + v, 0);
        return sumB - sumA; // Descending order
      }
      return 0;
    });

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6 relative">
      {/* Background Animated Blobs */}
      <div className="mesh-blob-1" />
      <div className="mesh-blob-2" />

      {/* Header section (Centered) */}
      <header className="flex flex-col items-center text-center gap-4 border-b border-white/5 pb-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Database size={11} />
              Centralized RTK Store Active
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
            Multi-Platform Post Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            Redux Toolkit Centralized State Management system demonstrating normalized data models, logging middleware, and asynchronous mock flows.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={postsStatus === 'loading'}
          className="flex items-center justify-center gap-2 px-5 py-2 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={postsStatus === 'loading' ? 'animate-spin' : ''} />
          Refresh Sync
        </button>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form, Analytics & Logs (span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PostForm postToEdit={postToEdit} onCancelEdit={handleCancelEdit} />
          
          <AnalyticsChart activePlatform={activePlatform} onSelectPlatform={setActivePlatform} />

          <DevConsole />
          
          {/* Tech Details Card */}
          <div className="glass-panel p-5 text-xs text-gray-400 leading-relaxed">
            <h4 className="font-bold text-gray-300 mb-3 font-display uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-indigo-400" />
              State Architecture
            </h4>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between">
                <span>Store Status:</span>
                <span className="font-semibold text-[#d946ef] font-mono uppercase">{postsStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Posts (Normalized):</span>
                <span className="font-semibold text-white font-mono">{posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Filtered Posts:</span>
                <span className="font-semibold text-white font-mono">{filteredPosts.length}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2.5 mt-1">
                <span>Adapter Entity Keys:</span>
                <span className="font-semibold text-indigo-400 font-mono">ids, entities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Post List (span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Platform Stat Cards */}
          <PlatformStats 
            activePlatform={activePlatform} 
            onSelectPlatform={setActivePlatform} 
          />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <LayoutGrid size={18} className="text-[#6366f1]" />
              Posts Feed {activePlatform && <span className="text-[#38bdf8] text-sm">({activePlatform})</span>}
            </h2>

            {/* Status Filters */}
            <div className="flex items-center gap-1.5 glass-panel p-1 rounded-lg self-start sm:self-auto border border-white/5">
              {['all', 'draft', 'scheduled', 'published'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition ${
                    activeStatus === status
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-2">
            <div className="sm:col-span-8 flex relative">
              <input
                type="text"
                placeholder="Search posts by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pr-10 text-sm py-2 px-3"
              />
              <span className="absolute right-3 top-2.5 text-gray-500">
                <Search size={16} />
              </span>
            </div>
            
            <div className="sm:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input bg-[#0f121d] w-full text-sm py-2 px-3 cursor-pointer"
              >
                <option value="newest" className="bg-[#0f121d]">Newest First</option>
                <option value="oldest" className="bg-[#0f121d]">Oldest First</option>
                <option value="reactions" className="bg-[#0f121d]">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Posts list / State renderings */}
          {postsStatus === 'loading' && posts.length === 0 ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="glass-panel p-5 min-h-[220px] flex flex-col justify-between shimmer border border-white/5">
                  <div>
                    <div className="h-6 w-3/4 bg-white/5 rounded mb-4" />
                    <div className="h-3 w-full bg-white/5 rounded mb-2" />
                    <div className="h-3 w-5/6 bg-white/5 rounded mb-2" />
                    <div className="h-3 w-2/3 bg-white/5 rounded" />
                  </div>
                  <div className="h-8 w-1/2 bg-white/5 rounded mt-4" />
                </div>
              ))}
            </div>
          ) : postsStatus === 'failed' ? (
            /* Error State */
            <div className="glass-panel p-8 text-center flex flex-col items-center gap-3 border border-red-500/20">
              <AlertTriangle className="text-red-400" size={36} />
              <h3 className="text-lg font-bold text-white">Sync Failed</h3>
              <p className="text-sm text-gray-400">{postsError}</p>
              <button 
                onClick={handleRefresh}
                className="mt-2 px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg text-sm transition"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            /* Empty State */
            <div className="glass-panel p-12 text-center flex flex-col items-center gap-4">
              <CheckCircle2 className="text-[#d946ef]" size={42} />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">No Posts Found</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  {activePlatform || activeStatus !== 'all' || searchQuery
                    ? 'No posts match your selected filters or search terms. Try clearing parameters.'
                    : 'Get started by creating your first social media post using the form on the left!'}
                </p>
              </div>
              {(activePlatform || activeStatus !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setActivePlatform(null);
                    setActiveStatus('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-lg text-sm transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* Actual post grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onEdit={handleEditInit} 
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
