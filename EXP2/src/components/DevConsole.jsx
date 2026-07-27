import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllLogs, clearLogs } from '../features/logs/logsSlice';
import { Terminal, Trash2, ChevronDown, ChevronRight, ShieldAlert } from 'lucide-react';

export const DevConsole = () => {
  const dispatch = useDispatch();
  const logs = useSelector(selectAllLogs);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = (id) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  const getActionColor = (type) => {
    if (type.includes('/pending')) return 'text-amber-400';
    if (type.includes('/fulfilled')) return 'text-emerald-400';
    if (type.includes('/rejected')) return 'text-rose-400';
    if (type.includes('reactionAdded')) return 'text-cyan-400';
    return 'text-indigo-400';
  };

  return (
    <div className="glass-panel overflow-hidden border border-white/10 shadow-2xl transition-all duration-300">
      {/* Terminal Title Bar */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-black/50 px-4 py-2.5 flex items-center justify-between border-b border-white/5 cursor-pointer hover:bg-black/60 transition"
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
            Redux Dispatch Console
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono border border-emerald-500/25">
            Active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(clearLogs());
            }}
            className="p-1 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded transition"
            title="Clear Console"
          >
            <Trash2 size={12} />
          </button>
          <div className="text-gray-400 hover:text-white transition">
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      {!isCollapsed && (
        <div className="bg-[#030508] p-4 font-mono text-xs max-h-[220px] overflow-y-auto flex flex-col gap-2 scrollbar-thin">
          {logs.length === 0 ? (
            <div className="text-gray-600 flex items-center justify-center gap-2 py-6 text-[11px]">
              <ShieldAlert size={14} />
              No actions logged yet. Interact with the UI to capture state dispatches.
            </div>
          ) : (
            logs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              
              return (
                <div key={log.id} className="border-b border-white/[0.02] pb-1.5 last:border-0 last:pb-0">
                  <div 
                    onClick={() => toggleExpand(log.id)}
                    className="flex items-start gap-1.5 cursor-pointer hover:bg-white/5 py-0.5 px-1 rounded transition"
                  >
                    <span className="text-gray-600 font-semibold select-none">
                      [{log.timestamp}]
                    </span>
                    <span className={`font-bold flex-1 break-all ${getActionColor(log.type)}`}>
                      {log.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans mt-0.5">
                      {isExpanded ? 'Collapse' : 'Inspect'}
                    </span>
                  </div>

                  {/* JSON Payload Details (Collapsible) */}
                  {isExpanded && log.payload && (
                    <pre className="mt-2 p-2.5 rounded bg-black/40 border border-white/5 text-[10px] text-emerald-300/90 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all max-h-[140px]">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DevConsole;
