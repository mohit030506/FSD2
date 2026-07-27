import React, { useState } from 'react';
import PlatformSelector from './components/PlatformSelector';
import ValidationFeedback from './components/ValidationFeedback';
import PostPreview from './components/PostPreview';
import { PLATFORMS } from './data/platforms';

export default function App() {
  // State 1: User Post Text
  const [text, setText] = useState(
    '🚀 Welcome to our Multi-Platform Post Composer! Built with React.js for dynamic constraint validation. #CollegeLabProject'
  );

  // State 2: Selected Platforms Array
  const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter', 'linkedin', 'instagram']);

  // State 3: Attached Image URL
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  );

  // Handler: Toggle platform selection on/off
  const handleTogglePlatform = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  // Handler: Simple image uploader
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Check if post is overall valid for publishing
  const isValid = selectedPlatforms.every((id) => {
    const p = PLATFORMS[id];
    if (!p) return true;
    const isCharOk = text.length <= p.charLimit;
    const isImageOk = !p.requiresImage || image !== null;
    return isCharOk && isImageOk;
  });

  const handlePublish = () => {
    if (isValid && selectedPlatforms.length > 0) {
      alert('🎉 Success! Post published successfully across selected platforms.');
    } else {
      alert('⚠️ Please fix validation errors before publishing.');
    }
  };

  return (
    <div className="main-wrapper">
      <header className="app-header">
        <h1>Dynamic Post Composer</h1>
        <p className="subtitle">Multi-Platform Content Composition & Constraint Validation Suite</p>
      </header>

      <div className="app-grid">
        {/* Left Column: Composition Form */}
        <div className="left-panel">
          {/* Step 1: Select Platforms */}
          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
          />

          {/* Step 2: Post Content Input */}
          <div className="component-card">
            <h3 className="section-title">Compose Post Text</h3>
            <textarea
              className="post-textarea"
              rows={5}
              placeholder="Type your post content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="char-count font-mono">
              Raw Character Length: <strong>{text.length}</strong>
            </div>

            {/* Image Attachment Input */}
            <div className="image-upload-section">
              <label className="upload-label">
                📷 Attach Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <span className="btn-upload">Browse Image</span>
              </label>

              {image && (
                <div className="image-preview-badge">
                  <span>Image Attached</span>
                  <button type="button" onClick={() => setImage(null)} className="btn-remove">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Publish Button */}
          <button
            type="button"
            className={`btn-publish ${isValid && selectedPlatforms.length > 0 ? 'active' : 'disabled'}`}
            onClick={handlePublish}
          >
            🚀 Publish Post to Selected Platforms
          </button>
        </div>

        {/* Right Column: Real-Time Feedback & Live Preview */}
        <div className="right-panel">
          {/* Validation Feedback */}
          <ValidationFeedback
            text={text}
            selectedPlatforms={selectedPlatforms}
            hasImage={image !== null}
          />

          {/* Live Mockup Preview */}
          <PostPreview
            text={text}
            selectedPlatforms={selectedPlatforms}
            image={image}
          />
        </div>
      </div>
    </div>
  );
}
