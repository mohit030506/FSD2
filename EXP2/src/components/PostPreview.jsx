import React, { useState } from 'react';
import { PLATFORMS } from '../data/platforms';

export default function PostPreview({ text, selectedPlatforms, image }) {
  const [activeTab, setActiveTab] = useState(selectedPlatforms[0] || 'twitter');

  if (selectedPlatforms.length === 0) {
    return (
      <div className="component-card">
        <h3 className="section-title">3. Live Post Preview</h3>
        <p className="placeholder-text">Select a platform to see post preview.</p>
      </div>
    );
  }

  const currentTab = selectedPlatforms.includes(activeTab) ? activeTab : selectedPlatforms[0];
  const platform = PLATFORMS[currentTab];

  return (
    <div className="component-card">
      <h3 className="section-title">3. Live Post Preview</h3>

      {/* Tabs to switch platform previews */}
      <div className="preview-tabs">
        {selectedPlatforms.map((id) => (
          <button
            key={id}
            type="button"
            className={`tab-btn ${currentTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {PLATFORMS[id]?.name}
          </button>
        ))}
      </div>

      {/* Preview Card Mockup */}
      <div className="mockup-box">
        <div className="mockup-header">
          <div className="mockup-user">
            <div className="avatar">U</div>
            <div>
              <div className="user-name">College Student</div>
              <div className="user-handle">@{platform?.id}_post</div>
            </div>
          </div>
          <span className="platform-tag" style={{ backgroundColor: platform?.color }}>
            {platform?.name}
          </span>
        </div>

        <div className="mockup-body">
          <p className="post-text">{text || 'Your post text will appear here...'}</p>

          {image && (
            <div className="image-container">
              <img src={image} alt="Post Attachment" className="post-img" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
