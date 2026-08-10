import React from 'react'
import RenderCountBadge from './RenderCountBadge'

export function PostCardRaw({ post, onDragStart }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', post.id)
    e.dataTransfer.effectAllowed = 'move'
    if (onDragStart) {
      onDragStart(e, post.id)
    }
  }

  const getPlatformClass = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'twitter': return 'platform-twitter'
      case 'linkedin': return 'platform-linkedin'
      case 'instagram': return 'platform-instagram'
      case 'facebook': return 'platform-facebook'
      default: return 'platform-default'
    }
  }

  return (
    <div 
      className={`post-card ${getPlatformClass(post.platform)}`}
      draggable
      onDragStart={handleDragStart}
      data-testid={`post-card-${post.id}`}
    >
      <div className="post-header">
        <span className="platform-tag">{post.platform}</span>
        <RenderCountBadge />
      </div>
      <p className="post-title">{post.title}</p>
    </div>
  )
}

// Memoized version
export const PostCardMemo = React.memo(PostCardRaw)
