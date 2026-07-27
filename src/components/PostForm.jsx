import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost, updatePostAsync } from '../features/posts/postsSlice';
import { selectAllPlatforms } from '../features/platforms/platformsSlice';
import { PenTool, Check, X, Loader } from 'lucide-react';

export const PostForm = ({ postToEdit, onCancelEdit }) => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platformId, setPlatformId] = useState('twitter');
  const [status, setStatus] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Update form fields if postToEdit changes (Edit Mode)
  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setPlatformId(postToEdit.platformId);
      setStatus(postToEdit.status);
      setValidationError('');
    } else {
      resetForm();
    }
  }, [postToEdit]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setPlatformId('twitter');
    setStatus('draft');
    setValidationError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setValidationError('Please fill in both title and content.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      if (postToEdit) {
        // Edit mode
        await dispatch(updatePostAsync({
          id: postToEdit.id,
          title,
          content,
          platformId,
          status,
          date: postToEdit.date // Keep original date
        })).unwrap();
        onCancelEdit();
      } else {
        // Create mode
        await dispatch(addNewPost({
          title,
          content,
          platformId,
          status
        })).unwrap();
        resetForm();
      }
    } catch (err) {
      setValidationError('Failed to save post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 mb-8 relative">
      <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2 text-white">
        <PenTool size={20} className="text-[#a855f7]" />
        {postToEdit ? 'Edit Post' : 'Create New Post'}
      </h2>

      {validationError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
          {validationError}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Post Title
          </label>
          <input
            type="text"
            placeholder="Type your headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="glass-input text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Social Network
            </label>
            <select
              value={platformId}
              onChange={(e) => setPlatformId(e.target.value)}
              disabled={isSubmitting || !!postToEdit} // Disable changing platform on edit to keep platform counts accurate and simple
              className="glass-input bg-[#0f121d] text-white cursor-pointer"
            >
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id} className="bg-[#0f121d]">
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Scheduling Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitting}
              className="glass-input bg-[#0f121d] text-white cursor-pointer"
            >
              <option value="draft" className="bg-[#0f121d]">Draft</option>
              <option value="scheduled" className="bg-[#0f121d]">Scheduled</option>
              <option value="published" className="bg-[#0f121d]">Published</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Post Content
          </label>
          <textarea
            placeholder="Write content for this platform..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="glass-input text-white resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          {postToEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>{postToEdit ? 'Update Post' : 'Publish Post'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
