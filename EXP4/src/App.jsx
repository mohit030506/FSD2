import React, { useState, useEffect, useCallback } from 'react'
import Calendar from './components/Calendar'
import Dashboard from './components/Dashboard'
import './App.css'

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [memoEnabled, setMemoEnabled] = useState(false)
  const [lagEnabled, setLagEnabled] = useState(false)
  const [calendarKey, setCalendarKey] = useState(0)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/posts')
      if (!res.ok) {
        throw new Error('Failed to fetch posts from MSW')
      }
      const data = await res.json()
      setPosts(data)
    } catch (err) {
      console.error(err)
      setError('Could not fetch scheduled posts. Ensure MSW is initialized.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // 1. Stable Handlers (wrapped in useCallback)
  const handleDropPostStable = useCallback((postId, targetDate) => {
    setPosts(prevPosts => {
      const updated = prevPosts.map(post => 
        post.id === postId ? { ...post, date: targetDate } : post
      )
      // Send background PUT request to MSW mock API
      fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate })
      }).catch(err => console.error('API update failed:', err))
      return updated
    })
  }, [])

  const handleDragStartPostStable = useCallback((e, postId) => {
    // Stable placeholder function
  }, [])

  // 2. Unstable Handlers (inline/dynamic closures, re-created every render)
  // This helps demonstrate how dynamic callback references invalidate React.memo
  const handleDropPostUnstable = (postId, targetDate) => {
    setPosts(prevPosts => {
      const updated = prevPosts.map(post => 
        post.id === postId ? { ...post, date: targetDate } : post
      )
      fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: targetDate })
      }).catch(err => console.error('API update failed:', err))
      return updated
    })
  }

  const handleDragStartPostUnstable = (e, postId) => {
    // Unstable placeholder function
  }

  // Choose callbacks dynamically based on current test mode
  const onDropPost = memoEnabled ? handleDropPostStable : handleDropPostUnstable
  const onDragStartPost = memoEnabled ? handleDragStartPostStable : handleDragStartPostUnstable

  const handleResetCounts = () => {
    // Incrementing key unmounts and remounts Calendar component, resetting render counters
    setCalendarKey(prev => prev + 1)
  }

  const handleResetEvents = () => {
    fetchPosts()
    setCalendarKey(prev => prev + 1)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">📅</span>
          <h1>Interactive Calendar Optimization Lab</h1>
        </div>
        <p className="app-subtitle">Unit 1: Experiment 4 - React Performance, Drag & Drop, & Mock APIs</p>
      </header>

      <main className="app-main">
        <Dashboard
          memoEnabled={memoEnabled}
          setMemoEnabled={setMemoEnabled}
          lagEnabled={lagEnabled}
          setLagEnabled={setLagEnabled}
          onResetCounts={handleResetCounts}
          onResetEvents={handleResetEvents}
        />

        {loading ? (
          <div className="loading-spinner" data-testid="loading-state">
            <div className="spinner"></div>
            <p>Fetching scheduled posts from Mock Service Worker...</p>
          </div>
        ) : error ? (
          <div className="error-banner" data-testid="error-state">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={fetchPosts} className="btn btn-secondary">Retry Connect</button>
          </div>
        ) : (
          <Calendar
            key={calendarKey}
            posts={posts}
            memoEnabled={memoEnabled}
            lagEnabled={lagEnabled}
            onDropPost={onDropPost}
            onDragStartPost={onDragStartPost}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Interactive Calendar Optimization &copy; 2026. Prepared for Advanced Frontend Performance Labs.</p>
      </footer>
    </div>
  )
}
