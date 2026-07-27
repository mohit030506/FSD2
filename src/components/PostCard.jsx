import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reactionAdded, deletePostAsync } from '../features/posts/postsSlice';
import { selectPlatformById } from '../features/platforms/platformsSlice';
import PlatformIcon from './PlatformIcon';
import { ThumbsUp, Heart, Rocket, Eye, Edit3, Trash2, Loader, Calendar } from 'lucide-react';

const reactionEmojis = {
  thumbsUp: { icon: ThumbsUp, label: 'Thumbs Up' },
  heart: { icon: Heart, label: 'Heart' },
  rocket: { icon: Rocket, label: 'Rocket' },
  eyes: { icon: Eye, label: 'Eyes' }
};

export const PostCard = ({ post, onEdit }) => {
  const dispatch = useDispatch();
  const platform = useSelector(state => selectPlatformById(state, post.platformId));
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      // If it is today, show relative or short time. Otherwise show date
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 1000 / 60);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        await dispatch(deletePostAsync({ postId: post.id, platformId: post.platformId })).unwrap();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
        setIsDeleting(false);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    }
  };

  const platformColor = platform?.color || '#a855f7';

  return (
    <div 
      className={`glass-panel p-5 relative overflow-hidden flex flex-col justify-between min-h-[220px] glow-${post.platformId}`}
      style={{ borderLeft: `4px solid ${platformColor}` }}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-[#080a10]/80 backdrop-filter blur-sm flex flex-col justify-center items-center gap-2 z-10">
          <Loader className="animate-spin text-[#a855f7]" size={28} />
          <span className="text-sm font-semibold text-gray-400">Removing post...</span>
        </div>
      )}

      {/* Top Header section */}
      <div>
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-lg font-bold text-white tracking-wide font-display line-clamp-1">
            {post.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getStatusStyle(post.status)}`}>
              {post.status}
            </span>
            <PlatformIcon type={post.platformId} size={18} />
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Calendar size={12} />
          <span>{formatTime(post.date)}</span>
        </div>

        {/* Content Body */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.content}
        </p>
      </div>

      {/* Footer section (Reactions + Actions) */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 border-t border-white/5 mt-auto">
        {/* Reaction Buttons */}
        <div className="flex gap-2">
          {Object.entries(reactionEmojis).map(([name, { icon: IconComponent, label }]) => {
            const count = post.reactions?.[name] || 0;
            return (
              <button
                key={name}
                type="button"
                onClick={() => dispatch(reactionAdded({ postId: post.id, reaction: name }))}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-transparent hover:border-white/10 transition"
                title={label}
              >
                <IconComponent size={12} />
                <span className="font-semibold">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => onEdit(post)}
            className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-[#a855f7]/15 border border-transparent hover:border-[#a855f7]/25 text-gray-400 hover:text-[#a855f7] transition"
            title="Edit Post"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-[#f43f5e]/15 border border-transparent hover:border-[#f43f5e]/25 text-gray-400 hover:text-[#f43f5e] transition"
            title="Delete Post"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
