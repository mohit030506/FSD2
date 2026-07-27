import React from 'react';
import { PLATFORMS } from '../data/platforms';

export default function ValidationFeedback({ text, selectedPlatforms, hasImage }) {
  if (selectedPlatforms.length === 0) {
    return (
      <div className="component-card">
        <h3 className="section-title">2. Constraint Validation Feedback</h3>
        <p className="placeholder-text">Please select at least one platform to view real-time validation.</p>
      </div>
    );
  }

  return (
    <div className="component-card">
      <h3 className="section-title">2. Real-Time Constraint Validation</h3>

      <div className="validation-list">
        {selectedPlatforms.map((id) => {
          const platform = PLATFORMS[id];
          if (!platform) return null;

          const currentLen = text.length;
          const limit = platform.charLimit;
          const remaining = limit - currentLen;
          const percentage = Math.min(100, Math.round((currentLen / limit) * 100));

          // Validation Checks
          const isCharOver = currentLen > limit;
          const isImageMissing = platform.requiresImage && !hasImage;
          const hasError = isCharOver || isImageMissing;

          return (
            <div key={id} className={`val-item ${hasError ? 'error-card' : 'valid-card'}`}>
              <div className="val-item-header">
                <div className="val-title-group">
                  <span className="dot" style={{ backgroundColor: platform.color }}></span>
                  <strong>{platform.name}</strong>
                </div>

                <span className={`status-tag ${hasError ? 'tag-error' : 'tag-valid'}`}>
                  {hasError ? '❌ Error' : '✅ Ready'}
                </span>
              </div>

              {/* Character Progress Bar */}
              <div className="progress-container">
                <div 
                  className={`progress-bar ${isCharOver ? 'bg-red' : 'bg-green'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {/* Detailed Feedback Text */}
              <div className="val-details font-mono">
                <span>Used: {currentLen} / {limit} chars</span>
                <span>{remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over limit!`}</span>
              </div>

              {/* Error Bullet Points */}
              {isCharOver && (
                <div className="error-msg">
                  ⚠️ Character count exceeds {platform.name}'s limit of {limit}!
                </div>
              )}
              {isImageMissing && (
                <div className="error-msg">
                  📷 {platform.name} requires an image to be attached.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
