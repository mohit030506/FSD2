import React, { useState } from 'react';
import { PLATFORMS } from '../../data/platforms';
import { 
  TwitterMockup, 
  LinkedInMockup, 
  InstagramMockup, 
  FacebookMockup, 
  ThreadsMockup, 
  PinterestMockup 
} from './MockupComponents';
import { Smartphone, Monitor, Eye, Layers } from 'lucide-react';

export default function PreviewContainer({ postData, selectedPlatforms }) {
  const [activeTab, setActiveTab] = useState(selectedPlatforms[0] || 'twitter');
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

  // Ensure activeTab is valid if selectedPlatforms change
  const currentTab = selectedPlatforms.includes(activeTab) 
    ? activeTab 
    : (selectedPlatforms[0] || 'twitter');

  if (selectedPlatforms.length === 0) {
    return (
      <div className="preview-empty-state">
        <Eye size={36} color="var(--text-dim)" />
        <p>Select at least 1 target platform above to render live preview mockups.</p>
      </div>
    );
  }

  const currentPlatform = PLATFORMS[currentTab];

  return (
    <div className="preview-container-wrapper">
      {/* Top Header & View Mode Switcher */}
      <div className="preview-header">
        <div className="preview-tab-pills">
          {selectedPlatforms.map((id) => {
            const p = PLATFORMS[id];
            if (!p) return null;
            return (
              <button
                key={id}
                type="button"
                className={`preview-tab-btn ${currentTab === id ? 'active' : ''}`}
                style={{ '--brand-color': p.brandColor }}
                onClick={() => setActiveTab(id)}
              >
                <span className="tab-dot" style={{ background: p.brandColor }}></span>
                {p.shortName}
              </button>
            );
          })}
        </div>

        <div className="viewmode-toggle">
          <button
            type="button"
            className={`viewmode-btn ${viewMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewMode('mobile')}
            title="Mobile device viewport preview"
          >
            <Smartphone size={14} /> Mobile
          </button>
          <button
            type="button"
            className={`viewmode-btn ${viewMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewMode('desktop')}
            title="Desktop feed preview"
          >
            <Monitor size={14} /> Desktop
          </button>
        </div>
      </div>

      {/* Mockup Canvas */}
      <div className={`mockup-viewport-canvas view-${viewMode}`}>
        {currentTab === 'twitter' && (
          <TwitterMockup text={postData.text} media={postData.media} pinTitle={postData.pinTitle} />
        )}
        {currentTab === 'linkedin' && (
          <LinkedInMockup text={postData.text} media={postData.media} />
        )}
        {currentTab === 'instagram' && (
          <InstagramMockup text={postData.text} media={postData.media} firstComment={postData.firstComment} />
        )}
        {currentTab === 'facebook' && (
          <FacebookMockup text={postData.text} media={postData.media} />
        )}
        {currentTab === 'threads' && (
          <ThreadsMockup text={postData.text} media={postData.media} />
        )}
        {currentTab === 'pinterest' && (
          <PinterestMockup 
            text={postData.text} 
            media={postData.media} 
            pinTitle={postData.pinTitle}
            destinationUrl={postData.destinationUrl}
          />
        )}
      </div>

      <style>{`
        .preview-container-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .preview-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
          gap: 0.75rem;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        .preview-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .preview-tab-pills {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .preview-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.35rem 0.75rem;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preview-tab-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }

        .preview-tab-btn.active {
          background: rgba(18, 26, 44, 0.95);
          border-color: var(--brand-color);
          color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .tab-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .viewmode-toggle {
          display: flex;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 2px;
        }

        .viewmode-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          color: var(--text-dim);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .viewmode-btn.active {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
        }

        .mockup-viewport-canvas {
          margin: 0 auto;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .mockup-viewport-canvas.view-mobile {
          max-width: 420px;
        }

        .mockup-viewport-canvas.view-desktop {
          max-width: 580px;
        }

        /* Generic Mockup Card Styles */
        .mockup-card {
          width: 100%;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 1rem;
          color: #E7E9EA;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          animation: fadeIn 0.25s ease-out forwards;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .avatar-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-img-sm {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .header-meta {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .user-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #fff;
        }

        .user-handle, .time-ago, .dot {
          color: #71767B;
          font-size: 0.82rem;
        }

        .more-btn {
          color: #71767B;
          cursor: pointer;
        }

        .post-text-body {
          font-size: 0.92rem;
          line-height: 1.45;
          white-space: pre-wrap;
          word-break: break-word;
          color: #F7F9F9;
        }

        /* Tweet Media Grid */
        .media-grid {
          display: grid;
          gap: 4px;
          border-radius: 12px;
          overflow: hidden;
          margin-top: 0.6rem;
          max-height: 280px;
        }

        .grid-count-1 { grid-template-columns: 1fr; }
        .grid-count-2 { grid-template-columns: 1fr 1fr; }
        .grid-count-3 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
        .grid-count-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }

        .grid-media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tweet-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #71767B;
          font-size: 0.8rem;
        }

        .tweet-action {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
        }

        .tweet-action:hover { color: #1DA1F2; }
        .action-retweet:hover { color: #00BA7C; }
        .action-like:hover { color: #F91880; }

        /* LinkedIn Specific */
        .linkedin-card {
          background: #1B1F23;
          color: #E1E9F1;
        }

        .user-headline {
          font-size: 0.72rem;
          color: #9EA3A8;
        }

        .time-row {
          font-size: 0.7rem;
          color: #9EA3A8;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .single-cover-img {
          width: 100%;
          max-height: 320px;
          object-fit: cover;
          border-radius: 8px;
          margin-top: 0.5rem;
        }

        .linkedin-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #9EA3A8;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .linkedin-actions {
          display: flex;
          justify-content: space-around;
        }

        .li-action-btn {
          background: transparent;
          border: none;
          color: #9EA3A8;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem;
          cursor: pointer;
          border-radius: 6px;
        }

        .li-action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        /* Instagram Specific */
        .instagram-card {
          background: #000;
          border-color: #262626;
          padding: 0;
        }

        .instagram-card .card-header {
          padding: 0.75rem;
        }

        .story-ring {
          padding: 2px;
          background: linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045);
          border-radius: 50%;
        }

        .location-tag {
          font-size: 0.7rem;
          color: #A8A8A8;
        }

        .insta-media-viewport {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #121212;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .insta-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .insta-placeholder {
          color: var(--text-dim);
          font-size: 0.82rem;
          padding: 2rem;
          text-align: center;
        }

        .insta-footer {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .insta-actions-bar {
          display: flex;
          justify-content: space-between;
          color: #fff;
        }

        .left-actions {
          display: flex;
          gap: 0.85rem;
        }

        .insta-likes-label {
          font-size: 0.82rem;
          color: #fff;
        }

        .insta-caption {
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .caption-handle, .comment-handle {
          font-weight: 700;
          color: #fff;
        }

        .insta-first-comment {
          font-size: 0.82rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.35rem 0.5rem;
          border-radius: 6px;
        }

        .insta-time {
          font-size: 0.68rem;
          color: #A8A8A8;
          margin-top: 0.2rem;
        }

        /* Facebook Specific */
        .facebook-card {
          background: #242526;
        }

        .fb-actions {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 0.4rem;
        }

        .fb-btn {
          background: transparent;
          border: none;
          color: #B0B3B8;
          font-size: 0.82rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          border-radius: 6px;
        }

        .fb-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

        /* Threads Specific */
        .threads-card {
          background: #101010;
        }

        .threads-row {
          display: flex;
          gap: 0.75rem;
        }

        .threads-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .threads-line {
          width: 2px;
          flex: 1;
          background: #262626;
          margin-top: 6px;
        }

        .threads-right {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .threads-header {
          display: flex;
          justify-content: space-between;
        }

        .threads-time {
          font-size: 0.75rem;
          color: #777;
        }

        .threads-media img {
          width: 100%;
          border-radius: 10px;
          margin-top: 0.3rem;
          max-height: 240px;
          object-fit: cover;
        }

        .threads-footer-actions {
          display: flex;
          gap: 1rem;
          color: #fff;
          margin-top: 0.4rem;
        }

        /* Pinterest Specific */
        .pinterest-card {
          background: #111;
          padding: 0.75rem;
        }

        .pin-visual-wrapper {
          position: relative;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: #222;
        }

        .pin-image {
          width: 100%;
          aspect-ratio: 2 / 3;
          object-fit: cover;
        }

        .pin-placeholder {
          aspect-ratio: 2 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          font-size: 0.82rem;
          padding: 1.5rem;
          text-align: center;
        }

        .pin-save-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #E60023;
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 0.82rem;
          padding: 0.4rem 0.85rem;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .pin-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.6rem;
        }

        .pin-title {
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
        }

        .pin-desc {
          font-size: 0.82rem;
          color: #B2B2B2;
        }

        .pin-link {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pin-user {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.3rem;
        }

        .pin-author {
          font-size: 0.78rem;
          font-weight: 600;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
