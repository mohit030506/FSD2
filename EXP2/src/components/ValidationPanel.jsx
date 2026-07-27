import React from 'react';
import { PLATFORMS } from '../data/platforms';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Zap, 
  Scissors, 
  PlusCircle, 
  FileEdit 
} from 'lucide-react';

export default function ValidationPanel({ 
  validationState, 
  selectedPlatforms, 
  onAutoTrimText,
  onAddSampleMedia,
  onFocusPinTitle 
}) {
  const { results, overallValid, errorCount, warningCount } = validationState;

  if (selectedPlatforms.length === 0) {
    return (
      <div className="validation-empty-state">
        <ShieldCheck size={36} color="var(--text-dim)" />
        <p>No platforms selected. Click platform chips above to start validation.</p>
      </div>
    );
  }

  return (
    <div className="validation-panel-container">
      {/* Panel Summary Banner */}
      <div className={`validation-summary-banner ${overallValid ? 'banner-valid' : 'banner-invalid'}`}>
        <div className="banner-status-left">
          {overallValid ? (
            <CheckCircle2 size={20} color="var(--status-success)" />
          ) : (
            <XCircle size={20} color="var(--status-error)" />
          )}
          <div className="banner-text">
            <span className="banner-title">
              {overallValid ? 'Ready to Publish' : 'Validation Issues Detected'}
            </span>
            <span className="banner-subtitle">
              {overallValid 
                ? `All ${selectedPlatforms.length} platform constraints passed.`
                : `${errorCount} error${errorCount > 1 ? 's' : ''} and ${warningCount} warning${warningCount > 1 ? 's' : ''} require attention.`}
            </span>
          </div>
        </div>
      </div>

      {/* Platform Validation Cards List */}
      <div className="platform-validation-list">
        {selectedPlatforms.map((platformId) => {
          const platform = PLATFORMS[platformId];
          const v = results[platformId];

          if (!platform || !v) return null;

          // Determine gauge ring color
          let ringColor = 'var(--status-success)';
          if (v.remainingChars < 0) {
            ringColor = 'var(--status-error)';
          } else if (v.remainingChars < 20) {
            ringColor = 'var(--status-warning)';
          }

          // Calculate SVG dashoffset for 36px radius circle (circumference ~ 226)
          const circumference = 2 * Math.PI * 18;
          const strokeDashoffset = circumference - (v.usagePercentage / 100) * circumference;

          return (
            <div 
              key={platformId} 
              className={`platform-val-card ${v.status}`}
              style={{ '--brand-color': platform.brandColor }}
            >
              {/* Card Header & Gauge */}
              <div className="val-card-header">
                <div className="val-platform-info">
                  <span className="platform-dot" style={{ background: platform.brandColor }}></span>
                  <span className="platform-val-name">{platform.name}</span>
                  <span className={`status-pill pill-${v.status}`}>
                    {v.status === 'valid' && 'Ready'}
                    {v.status === 'warning' && 'Warning'}
                    {v.status === 'error' && 'Error'}
                  </span>
                </div>

                {/* Progress Ring */}
                <div className="gauge-wrapper">
                  <svg className="gauge-svg" width="44" height="44" viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      className="gauge-bg"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      className="gauge-progress"
                      style={{
                        stroke: ringColor,
                        strokeDasharray: circumference,
                        strokeDashoffset: Math.max(0, strokeDashoffset),
                      }}
                    />
                  </svg>
                  <span className="gauge-text" style={{ color: ringColor }}>
                    {v.remainingChars < 0 ? `${v.remainingChars}` : `${v.usagePercentage}%`}
                  </span>
                </div>
              </div>

              {/* Character Details Bar */}
              <div className="val-char-detail font-mono">
                <span>Used: {v.effectiveLength} / {v.charLimit}</span>
                <span className={v.remainingChars < 0 ? 'text-error' : ''}>
                  {v.remainingChars < 0 ? `${Math.abs(v.remainingChars)} over limit` : `${v.remainingChars} remaining`}
                </span>
              </div>

              {/* Errors & Warnings List */}
              {(v.errors.length > 0 || v.warnings.length > 0) && (
                <div className="val-messages-list">
                  {v.errors.map((err, idx) => (
                    <div key={`err-${idx}`} className="val-msg msg-error">
                      <XCircle size={14} className="msg-icon" />
                      <span>{err}</span>
                      {/* One Click Resolution Helpers */}
                      {err.includes('Exceeds limit') && (
                        <button
                          type="button"
                          className="quick-fix-btn"
                          onClick={() => onAutoTrimText(platformId)}
                        >
                          <Scissors size={11} /> Trim
                        </button>
                      )}
                      {err.includes('requires at least 1 image') && (
                        <button
                          type="button"
                          className="quick-fix-btn"
                          onClick={onAddSampleMedia}
                        >
                          <PlusCircle size={11} /> Add Demo Media
                        </button>
                      )}
                      {err.includes('Pin Title is required') && (
                        <button
                          type="button"
                          className="quick-fix-btn"
                          onClick={onFocusPinTitle}
                        >
                          <FileEdit size={11} /> Add Title
                        </button>
                      )}
                    </div>
                  ))}

                  {v.warnings.map((warn, idx) => (
                    <div key={`warn-${idx}`} className="val-msg msg-warning">
                      <AlertTriangle size={14} className="msg-icon" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .validation-panel-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .validation-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          text-align: center;
          gap: 0.75rem;
          color: var(--text-dim);
          font-size: 0.9rem;
        }

        .validation-summary-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          border-radius: 14px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .banner-valid {
          background: var(--status-success-bg);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .banner-invalid {
          background: var(--status-error-bg);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .banner-status-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .banner-text {
          display: flex;
          flex-direction: column;
        }

        .banner-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .banner-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .platform-validation-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .platform-val-card {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-left: 4px solid var(--brand-color);
          border-radius: 14px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .platform-val-card.error {
          border-color: rgba(239, 68, 68, 0.4);
          border-left-color: var(--status-error);
          background: rgba(239, 68, 68, 0.04);
        }

        .platform-val-card.warning {
          border-color: rgba(245, 158, 11, 0.4);
          border-left-color: var(--status-warning);
        }

        .val-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .val-platform-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .platform-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .platform-val-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .status-pill {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 6px;
          text-transform: uppercase;
        }

        .pill-valid {
          background: var(--status-success-bg);
          color: var(--status-success);
        }

        .pill-warning {
          background: var(--status-warning-bg);
          color: var(--status-warning);
        }

        .pill-error {
          background: var(--status-error-bg);
          color: var(--status-error);
        }

        .gauge-wrapper {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg {
          transform: rotate(-90deg);
        }

        .gauge-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 4;
        }

        .gauge-progress {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }

        .gauge-text {
          position: absolute;
          font-size: 0.65rem;
          font-weight: 800;
          font-family: var(--font-mono);
        }

        .val-char-detail {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-dim);
          padding-top: 0.2rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .val-messages-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .val-msg {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.78rem;
          padding: 0.35rem 0.6rem;
          border-radius: 8px;
        }

        .val-msg.msg-error {
          background: rgba(239, 68, 68, 0.12);
          color: #FCA5A5;
        }

        .val-msg.msg-warning {
          background: rgba(245, 158, 11, 0.12);
          color: #FDE047;
        }

        .msg-icon {
          flex-shrink: 0;
        }

        .quick-fix-btn {
          margin-left: auto;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: background 0.15s ease;
        }

        .quick-fix-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .text-error { color: var(--status-error); }
      `}</style>
    </div>
  );
}
