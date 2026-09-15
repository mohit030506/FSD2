import React from 'react'
import { PostCardRaw, PostCardMemo } from './PostCard'
import RenderCountBadge from './RenderCountBadge'

export function CalendarDayRaw({
  dayNumber,
  dateString,
  isCurrentMonth,
  posts,
  memoEnabled,
  lagEnabled,
  onDragStartPost,
  onDropPost
}) {
  // Simulate heavy computation bottleneck if lag is enabled
  if (lagEnabled) {
    const start = performance.now()
    while (performance.now() - start < 15) {
      // CPU burning loop to simulate slow components
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const postId = e.dataTransfer.getData('text/plain')
    if (onDropPost && postId) {
      onDropPost(postId, dateString)
    }
  }

  const CardComponent = memoEnabled ? PostCardMemo : PostCardRaw

  return (
    <div 
      className={`calendar-day ${isCurrentMonth ? 'current-month' : 'day-outside'} ${posts.length > 0 ? 'has-posts' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid={`calendar-day-${dateString}`}
    >
      <div className="day-header">
        <span className="day-number">{dayNumber}</span>
        <RenderCountBadge />
      </div>
      <div className="day-posts-container">
        {posts.map(post => (
          <CardComponent 
            key={post.id} 
            post={post} 
            onDragStart={onDragStartPost}
          />
        ))}
      </div>
    </div>
  )
}

// Memoized version
export const CalendarDayMemo = React.memo(CalendarDayRaw)
