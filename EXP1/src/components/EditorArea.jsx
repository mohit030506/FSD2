import React, { useState } from 'react';
import { PRESET_TEMPLATES } from '../data/presetTemplates';
import { 
  Sparkles, 
  Smile, 
  Hash, 
  Wand2, 
  Trash2, 
  FileText, 
  Link as LinkIcon, 
  MessageSquare, 
  Info,
  Scissors
} from 'lucide-react';

const COMMON_EMOJIS = ['🚀', '⚡', '🔥', '💡', '✨', '🎯', '📌', '📈', '👇', '🎨', '📅', '❤️', '👏', '🤖'];
const QUICK_HASHTAGS = ['#AI', '#Tech', '#ReactJS', '#Marketing', '#Design', '#SocialMedia', '#ProductLaunch', '#DevCommunity'];

export default function EditorArea({ 
  postData, 
  onChangePostData, 
  selectedPlatforms, 
  onAutoTrimText,
  parsedMeta 
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const isPinterestSelected = selectedPlatforms.includes('pinterest');
  const isInstaOrFbSelected = selectedPlatforms.includes('instagram') || selectedPlatforms.includes('facebook');

  const handleTextChange = (e) => {
    onChangePostData({ ...postData, text: e.target.value });
  };

  const handleAddEmoji = (emoji) => {
    onChangePostData({ ...postData, text: postData.text + emoji });
  };

  const handleAddHashtag = (tag) => {
    if (!postData.text.includes(tag)) {
      const space = postData.text.length && !postData.text.endsWith(' ') ? ' ' : '';
      onChangePostData({ ...postData, text: postData.text + space + tag });
    }
  };

  const handleSelectTemplate = (template) => {
    onChangePostData({
      ...postData,
      text: template.text,
      pinTitle: template.pinTitle || postData.pinTitle,
    });
    setShowTemplateDropdown(false);
  };

  const handleClear = () => {
    onChangePostData({
      text: '',
      pinTitle: '',
      destinationUrl: '',
      firstComment: '',
      media: [],
    });
  };

  return (
    <div className="editor-area-container">
      {/* Top Action Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          {/* Preset Templates */}
          <div className="dropdown-wrapper">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
            >
              <FileText size={14} /> Templates
            </button>

            {showTemplateDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Choose Sample Template</div>
                {PRESET_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleSelectTemplate(tmpl)}
                  >
                    <span className="tmpl-name">{tmpl.name}</span>
                    <span className="tmpl-category">{tmpl.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Emoji Picker Toggle */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={14} /> Emojis
          </button>
        </div>

        <div className="toolbar-group">
          {selectedPlatforms.includes('twitter') && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              title="Auto-trim text to fit Twitter limit cleanly"
              onClick={() => onAutoTrimText('twitter')}
            >
              <Scissors size={14} /> Trim for X
            </button>
          )}

          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleClear}
            title="Clear composer"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Emoji Picker Bar */}
      {showEmojiPicker && (
        <div className="emoji-picker-bar animate-fade-in">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="emoji-btn"
              onClick={() => handleAddEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Text Composer Textarea */}
      <div className="textarea-wrapper">
        <textarea
          className="composer-textarea"
          rows={7}
          placeholder="Compose your post here... Type #for hashtags, @for mentions, or paste a link..."
          value={postData.text}
          onChange={handleTextChange}
        />

        {/* Live Meta Badges Bar */}
        <div className="editor-meta-bar">
          <div className="meta-pills">
            <span className="meta-pill">
              <Hash size={12} /> {parsedMeta.hashtagCount} Hashtags
            </span>
            <span className="meta-pill">
              @ {parsedMeta.mentionCount} Mentions
            </span>
            <span className="meta-pill">
              <LinkIcon size={12} /> {parsedMeta.linkCount} Links
            </span>
          </div>

          <div className="raw-char-counter">
            {parsedMeta.rawLength} characters
          </div>
        </div>
      </div>

      {/* Quick Hashtag Chips */}
      <div className="quick-hashtags-row">
        <span className="hashtags-label"><Hash size={13} /> Quick Tags:</span>
        <div className="quick-tags-list">
          {QUICK_HASHTAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-chip"
              onClick={() => handleAddHashtag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Specific Fields: Pinterest Pin Title & URL */}
      {isPinterestSelected && (
        <div className="pinterest-fields-card animate-fade-in">
          <div className="field-card-title">
            <Info size={14} color="#E60023" /> Pinterest Specific Fields
          </div>
          <div className="field-group">
            <label className="field-label">
              Pin Title <span className="text-req">*Required (max 100 chars)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. NextGen AI Engine Launch ⚡"
              maxLength={100}
              value={postData.pinTitle}
              onChange={(e) => onChangePostData({ ...postData, pinTitle: e.target.value })}
            />
          </div>

          <div className="field-group" style={{ marginTop: '0.6rem' }}>
            <label className="field-label">Destination Link URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/pin-destination"
              value={postData.destinationUrl}
              onChange={(e) => onChangePostData({ ...postData, destinationUrl: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Optional First Comment (Instagram/Facebook) */}
      {isInstaOrFbSelected && (
        <div className="first-comment-card">
          <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={14} color="var(--accent-cyan)" /> Auto First Comment (Optional)
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Link in bio! Follow @ourhandle for daily updates."
            value={postData.firstComment}
            onChange={(e) => onChangePostData({ ...postData, firstComment: e.target.value })}
          />
        </div>
      )}

      <style>{`
        .editor-area-container {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .toolbar-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          background: #111827;
          border: 1px solid var(--border-hover);
          border-radius: 12px;
          padding: 0.5rem;
          width: 280px;
          z-index: 50;
          box-shadow: var(--shadow-glow);
        }

        .dropdown-header {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-dim);
          text-transform: uppercase;
          padding: 0.3rem 0.6rem;
        }

        .dropdown-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          padding: 0.5rem 0.6rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-main);
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .tmpl-name {
          font-size: 0.82rem;
          font-weight: 600;
        }

        .tmpl-category {
          font-size: 0.7rem;
          color: var(--accent-cyan);
        }

        .emoji-picker-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          background: var(--bg-input);
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .emoji-btn {
          background: transparent;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 6px;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .emoji-btn:hover {
          transform: scale(1.2);
          background: rgba(255, 255, 255, 0.1);
        }

        .textarea-wrapper {
          position: relative;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 0.85rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .textarea-wrapper:focus-within {
          border-color: var(--border-glow);
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.2);
        }

        .composer-textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.5;
          resize: vertical;
          min-height: 140px;
        }

        .editor-meta-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .meta-pills {
          display: flex;
          gap: 0.5rem;
        }

        .meta-pill {
          font-size: 0.72rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .raw-char-counter {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }

        .quick-hashtags-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .hashtags-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
        }

        .quick-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .tag-chip {
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.25);
          color: var(--accent-cyan);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tag-chip:hover {
          background: rgba(6, 182, 212, 0.25);
          transform: translateY(-1px);
        }

        .pinterest-fields-card, .first-comment-card {
          background: rgba(230, 0, 35, 0.06);
          border: 1px solid rgba(230, 0, 35, 0.25);
          border-radius: 12px;
          padding: 0.85rem;
        }

        .first-comment-card {
          background: rgba(6, 182, 212, 0.05);
          border-color: rgba(6, 182, 212, 0.2);
        }

        .field-card-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #E60023;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.6rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .text-req {
          color: var(--status-error);
          font-size: 0.7rem;
        }

        .form-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.45rem 0.75rem;
          color: var(--text-main);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .form-input:focus {
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
