export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'request' | 'response' | 'interceptor-req' | 'interceptor-res' | 'error' | 'success' | 'system';
  title: string;
  message: string;
  details?: any;
}

type LogListener = (logs: LogEntry[]) => void;

class LogService {
  private logs: LogEntry[] = [];
  private listeners: Set<LogListener> = new Set();

  constructor() {
    this.addLog('system', 'System Initialized', 'Auth & RBAC Demonstration project started successfully.');
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public addLog(
    type: LogEntry['type'],
    title: string,
    message: string,
    details?: any
  ) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      title,
      message,
      details,
    };
    this.logs.unshift(entry); // Newest logs first
    if (this.logs.length > 100) {
      this.logs.pop(); // Cap at 100 entries
    }
    this.notify();
  }

  public clear() {
    this.logs = [];
    this.addLog('system', 'Logs Cleared', 'Developer console history cleared.');
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener([...this.logs]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.logs]));
  }
}

export const logService = new LogService();
