import React from 'react'

export default function Dashboard({ 
  memoEnabled, 
  setMemoEnabled, 
  lagEnabled, 
  setLagEnabled,
  onResetCounts,
  onResetEvents
}) {
  return (
    <div className="dashboard-card">
      <h2>🔬 Experiment 4: Laboratory Controls</h2>
      <p className="dashboard-description">
        Observe how React components re-render during interactions. Drag and drop posts between days, and observe the flashing render badges.
      </p>
      
      <div className="controls-grid">
        <div className="control-group">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={memoEnabled} 
              onChange={(e) => setMemoEnabled(e.target.checked)} 
              data-testid="toggle-memo"
            />
            <span className="slider"></span>
            <span className="label-text">
              <strong>React.memo Optimization</strong>
              <small>{memoEnabled ? 'ON (Memoized components only re-render if props change)' : 'OFF (All components re-render on state change)'}</small>
            </span>
          </label>
        </div>

        <div className="control-group">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={lagEnabled} 
              onChange={(e) => setLagEnabled(e.target.checked)} 
              data-testid="toggle-lag"
            />
            <span className="slider"></span>
            <span className="label-text">
              <strong>Simulate Component Lag</strong>
              <small>{lagEnabled ? 'ON (Adds synthetic 50ms CPU block to each cell)' : 'OFF (Normal lightning-fast render)'}</small>
            </span>
          </label>
        </div>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={onResetCounts} 
          className="btn btn-secondary"
          data-testid="btn-reset-counts"
        >
          🧹 Reset Render Counts
        </button>
        <button 
          onClick={onResetEvents} 
          className="btn btn-primary"
          data-testid="btn-reset-events"
        >
          🔄 Reload Mock API Data
        </button>
      </div>

      <div className="learning-instructions">
        <h3>💡 Student Observation Tasks:</h3>
        <ol>
          <li>
            <strong>With Memoization OFF:</strong> Drag a post to another day. Notice how <em>every single day</em> on the calendar flashes, indicating unnecessary re-renders.
          </li>
          <li>
            <strong>With Memoization ON:</strong> Drag a post. Notice how only the <em>origin day</em>, <em>destination day</em>, and the <em>dragged card</em> re-render. All other cells stay idle!
          </li>
          <li>
            <strong>Profiling with React DevTools:</strong> Turn on "Simulate Component Lag", open the React DevTools Profiler, record, drag a card, and analyze the Flame Graph. Disable memoization to see the visual bottleneck of unoptimized cells.
          </li>
        </ol>
      </div>
    </div>
  )
}
