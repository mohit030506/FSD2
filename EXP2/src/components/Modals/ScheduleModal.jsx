import React, { useState } from 'react';
import { Calendar, Clock, Globe, Sparkles, Check, X } from 'lucide-react';

const TIMEZONE_OPTIONS = [
  'UTC (Coordinated Universal Time)',
  'PST - Los Angeles (UTC-8)',
  'EST - New York (UTC-5)',
  'IST - India (UTC+5:30)',
  'GMT - London (UTC+0)',
];

const BEST_TIME_SLOTS = [
  { label: '🚀 Today at 5:00 PM (Peak Engagement)', value: '17:00' },
  { label: '🔥 Tomorrow at 9:00 AM (Morning Catchup)', value: '09:00' },
  { label: '📈 Thursday at 1:00 PM (Lunch Break Peak)', value: '13:00' },
];

export default function ScheduleModal({ isOpen, onClose, onConfirmSchedule, selectedPlatforms }) {
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('17:00');
  const [selectedTimezone, setSelectedTimezone] = useState('IST - India (UTC+5:30)');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmSchedule({
      date: scheduledDate,
      time: scheduledTime,
      timezone: selectedTimezone,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-fade-in">
        <div className="modal-header">
          <div className="modal-title">
            <Calendar size={18} color="var(--accent-cyan)" /> Schedule Multi-Platform Post
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Set optimal date and time for automated publishing across {selectedPlatforms.length} platforms.
          </p>

          {/* Quick Best Time Slots */}
          <div className="best-times-card">
            <span className="best-times-title"><Sparkles size={13} /> Recommended Best Posting Slots</span>
            <div className="slot-chips">
              {BEST_TIME_SLOTS.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="slot-chip"
                  onClick={() => setScheduledTime(slot.value)}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="input-label"><Calendar size={14} /> Date</label>
              <input
                type="date"
                className="modal-input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="input-label"><Clock size={14} /> Time</label>
              <input
                type="time"
                className="modal-input"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="input-label"><Globe size={14} /> Timezone</label>
            <select
              className="modal-input"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={handleConfirm}>
            <Check size={16} /> Confirm Schedule
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }

        .modal-card {
          background: #0F172A;
          border: 1px solid var(--border-hover);
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          padding: 1.5rem;
          box-shadow: var(--shadow-glow);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        .modal-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .close-modal-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
        }

        .modal-intro {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .best-times-card {
          background: rgba(6, 182, 212, 0.06);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 12px;
          padding: 0.75rem;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .best-times-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .slot-chips {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .slot-chip {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 0.35rem 0.6rem;
          color: var(--text-main);
          font-size: 0.78rem;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s ease;
        }

        .slot-chip:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .input-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .modal-input {
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          color: #fff;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          outline: none;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.6rem;
          border-top: 1px solid var(--border-color);
          padding-top: 0.85rem;
        }
      `}</style>
    </div>
  );
}
