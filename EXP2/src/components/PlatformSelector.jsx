import React from 'react';
import { PLATFORMS } from '../data/platforms';

export default function PlatformSelector({ selectedPlatforms, onTogglePlatform }) {
  return (
    <div className="component-card">
      <h3 className="section-title">1. Select Target Platforms</h3>
      <p className="section-sub">Choose which social media platforms to target:</p>

      <div className="platform-grid">
        {Object.values(PLATFORMS).map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              type="button"
              className={`platform-btn ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: isSelected ? platform.color : 'transparent',
                backgroundColor: isSelected ? `${platform.color}15` : 'var(--bg-box)'
              }}
              onClick={() => onTogglePlatform(platform.id)}
            >
              <span className="dot" style={{ backgroundColor: platform.color }}></span>
              <span className="platform-name">{platform.name}</span>
              <span className="platform-limit">{platform.charLimit} chars</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
