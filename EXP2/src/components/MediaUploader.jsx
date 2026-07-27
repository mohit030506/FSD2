import React, { useRef } from 'react';
import { PRESET_IMAGES } from '../data/presetImages';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Plus, 
  Sparkles, 
  FileText, 
  AlertCircle
} from 'lucide-react';

export default function MediaUploader({ mediaList, onChangeMedia, selectedPlatforms }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newMediaItems = files.map((file, idx) => {
      const sizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(1));
      const url = URL.createObjectURL(file);
      return {
        id: `custom-${Date.now()}-${idx}`,
        name: file.name,
        url,
        sizeMB,
        type: file.type.startsWith('video') ? 'video' : 'image',
        aspectRatio: '16:9', // Default estimated aspect ratio for uploaded file
        altText: '',
      };
    });

    onChangeMedia([...mediaList, ...newMediaItems]);
  };

  const handleAddPresetImage = (preset) => {
    if (mediaList.some(item => item.id === preset.id)) return;
    onChangeMedia([...mediaList, preset]);
  };

  const handleRemoveMedia = (id) => {
    onChangeMedia(mediaList.filter(item => item.id !== id));
  };

  const handleAltTextChange = (id, altText) => {
    onChangeMedia(
      mediaList.map(item => item.id === id ? { ...item, altText } : item)
    );
  };

  return (
    <div className="media-uploader-container">
      <div className="media-header">
        <label className="media-title">
          <ImageIcon size={16} /> Media Attachments ({mediaList.length})
        </label>
        
        <div className="preset-picker-actions">
          <span className="preset-label"><Sparkles size={12} /> Add Demo Asset:</span>
          {PRESET_IMAGES.map((img) => (
            <button
              key={img.id}
              type="button"
              className="preset-btn"
              title={`${img.name} (${img.aspectRatio}, ${img.sizeMB}MB)`}
              onClick={() => handleAddPresetImage(img)}
            >
              <img src={img.url} alt={img.name} className="preset-thumb" />
              <span>{img.aspectRatio}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop / Upload Area */}
      <div 
        className="upload-dropzone"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <Upload size={22} color="var(--accent-primary)" />
        <div className="dropzone-text">
          <span className="dropzone-main">Click or Drag & Drop media here</span>
          <span className="dropzone-sub">Supports JPG, PNG, MP4, GIF (Auto aspect ratio & size validation)</span>
        </div>
      </div>

      {/* Attached Media Cards Grid */}
      {mediaList.length > 0 && (
        <div className="media-preview-grid">
          {mediaList.map((item, index) => (
            <div key={item.id} className="media-card animate-fade-in">
              <div className="media-preview-wrapper">
                <img src={item.url} alt={item.altText || item.name} className="media-img" />
                <span className="media-badge index-badge">#{index + 1}</span>
                <span className={`media-badge ratio-badge ${item.sizeMB > 15 ? 'warning-badge' : ''}`}>
                  {item.aspectRatio} • {item.sizeMB}MB
                </span>
                <button
                  type="button"
                  className="remove-media-btn"
                  onClick={() => handleRemoveMedia(item.id)}
                  title="Remove media"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="alt-text-input-group">
                <input
                  type="text"
                  className="alt-input"
                  placeholder="Alt text for accessibility..."
                  value={item.altText || ''}
                  onChange={(e) => handleAltTextChange(item.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .media-uploader-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .media-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .media-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .preset-picker-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .preset-label {
          font-size: 0.72rem;
          color: var(--accent-purple);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .preset-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.15rem 0.4rem 0.15rem 0.2rem;
          color: var(--text-muted);
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .preset-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: var(--accent-purple);
          color: var(--text-main);
        }

        .preset-thumb {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          object-fit: cover;
        }

        .upload-dropzone {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: rgba(11, 17, 31, 0.5);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-dropzone:hover {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .dropzone-text {
          display: flex;
          flex-direction: column;
        }

        .dropzone-main {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .dropzone-sub {
          font-size: 0.72rem;
          color: var(--text-dim);
        }

        .media-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }

        .media-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .media-preview-wrapper {
          position: relative;
          width: 100%;
          height: 100px;
          background: #000;
        }

        .media-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-badge {
          position: absolute;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          backdrop-filter: blur(4px);
        }

        .index-badge {
          top: 6px;
          left: 6px;
          background: rgba(0, 0, 0, 0.75);
          color: #fff;
        }

        .ratio-badge {
          bottom: 6px;
          left: 6px;
          background: rgba(0, 0, 0, 0.75);
          color: var(--text-muted);
        }

        .ratio-badge.warning-badge {
          background: rgba(239, 68, 68, 0.85);
          color: #fff;
        }

        .remove-media-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.85);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .remove-media-btn:hover {
          transform: scale(1.15);
        }

        .alt-text-input-group {
          padding: 0.4rem;
        }

        .alt-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-size: 0.72rem;
          font-family: var(--font-sans);
        }
      `}</style>
    </div>
  );
}
