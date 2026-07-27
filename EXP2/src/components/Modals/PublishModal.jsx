import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PLATFORMS } from '../../data/platforms';
import { Send, CheckCircle2, Loader2, Sparkles, X, ExternalLink } from 'lucide-react';

export default function PublishModal({ isOpen, onClose, selectedPlatforms, postData }) {
  const [publishingState, setPublishingState] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPublishingState({});
      setIsFinished(false);
      return;
    }

    // Initialize progress map
    const initial = {};
    selectedPlatforms.forEach(id => {
      initial[id] = { status: 'pending', progress: 0 };
    });
    setPublishingState(initial);

    // Simulate multi-platform posting sequence
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= selectedPlatforms.length) {
        clearInterval(interval);
        setIsFinished(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        return;
      }

      const pId = selectedPlatforms[currentStep];
      setPublishingState(prev => ({
        ...prev,
        [pId]: { status: 'success', progress: 100 }
      }));

      currentStep++;
    }, 900);

    return () => clearInterval(interval);
  }, [isOpen, selectedPlatforms]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-fade-in">
        <div className="modal-header">
          <div className="modal-title">
            <Send size={18} color="var(--accent-primary)" />
            {isFinished ? 'Post Published Successfully!' : 'Publishing to Social Networks...'}
          </div>
          {isFinished && (
            <button type="button" className="close-modal-btn" onClick={onClose}>
              <X size={18} />
            </button>
          )}
        </div>

        <div className="modal-body">
          <div className="publish-steps-list">
            {selectedPlatforms.map(id => {
              const platform = PLATFORMS[id];
              const st = publishingState[id] || { status: 'pending', progress: 0 };

              return (
                <div key={id} className="publish-step-item">
                  <div className="platform-left">
                    <span className="step-dot" style={{ background: platform.brandColor }}></span>
                    <span className="step-name">{platform.name}</span>
                  </div>

                  <div className="step-status-right">
                    {st.status === 'pending' && (
                      <span className="status-label pending"><Loader2 size={14} className="spin" /> Publishing...</span>
                    )}
                    {st.status === 'success' && (
                      <span className="status-label success"><CheckCircle2 size={14} /> Published</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isFinished && (
            <div className="finish-celebration-card animate-fade-in">
              <Sparkles size={24} color="var(--accent-cyan)" />
              <div className="finish-text">
                <span className="finish-heading">Multi-Platform Sync Completed!</span>
                <span className="finish-sub">Your content is live across {selectedPlatforms.length} social channels.</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {isFinished ? (
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Done & Reset Composer
            </button>
          ) : (
            <span className="publishing-note">Synchronizing API payloads...</span>
          )}
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .publish-steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .publish-step-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 12px;
        }

        .platform-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .step-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .step-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
        }

        .status-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 600;
        }

        .status-label.pending {
          color: var(--accent-cyan);
        }

        .status-label.success {
          color: var(--status-success);
        }

        .finish-celebration-card {
          margin-top: 1rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15));
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .finish-text {
          display: flex;
          flex-direction: column;
        }

        .finish-heading {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
        }

        .finish-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .publishing-note {
          font-size: 0.78rem;
          color: var(--text-dim);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
