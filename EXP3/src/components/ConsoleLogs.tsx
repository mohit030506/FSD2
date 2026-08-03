import React, { useEffect, useState, useRef } from 'react';
import { logService } from '../services/logService';
import type { LogEntry } from '../services/logService';

export const ConsoleLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subscribe to logs
    const unsubscribe = logService.subscribe((currentLogs) => {
      setLogs(currentLogs);
    });
    return unsubscribe;
  }, []);

  const handleClear = () => {
    logService.clear();
  };

  return (
    <div className="card console-panel">
      <div className="console-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-primary)' }}>■</span> Live Dev Console
        </h3>
        <button onClick={handleClear} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          Clear
        </button>
      </div>
      <div className="console-terminal" ref={terminalRef}>
        {logs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
            No logs recorded yet. Perform actions to see data flow.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`log-entry ${log.type}`}>
              <div>
                <span className="log-time">[{log.timestamp}]</span>
                <strong style={{ marginRight: '6px' }}>{log.title}</strong>
                <span>{log.message}</span>
              </div>
              {log.details && (
                <pre className="log-details">
                  {typeof log.details === 'object'
                    ? JSON.stringify(log.details, null, 2)
                    : log.details}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ConsoleLogs;
