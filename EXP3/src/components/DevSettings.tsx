import React, { useState } from 'react';
import { devSettings } from '../services/mockServer';
import { getAccessToken, setAccessToken } from '../services/api';
import { logService } from '../services/logService';
import { useAuth } from '../context/AuthContext';

export const DevSettings: React.FC = () => {
  const { user } = useAuth();
  const [latency, setLatency] = useState<number>(devSettings.latencyMs);
  const [forceExpired, setForceExpired] = useState<boolean>(devSettings.forceTokenExpired);

  const handleLatencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setLatency(val);
    devSettings.latencyMs = val;
    logService.addLog('system', '⚙️ Latency Configured', `Network simulation latency set to ${val}ms.`);
  };

  const handleForceExpiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setForceExpired(checked);
    devSettings.forceTokenExpired = checked;
    logService.addLog(
      'system',
      '⚙️ Expiry Mode Configured',
      checked
        ? 'Forced Expiry ACTIVE. Next token generated will expire instantly.'
        : 'Forced Expiry INACTIVE. Standard token lifetimes applied.'
    );
  };

  const corruptAccessToken = () => {
    const currentToken = getAccessToken();
    if (!currentToken) {
      logService.addLog('error', '⚡ Tamper Failed', 'No access token available to corrupt.');
      return;
    }

    // Corrupt the token by modifying the signature part (end of token)
    const parts = currentToken.split('.');
    if (parts.length === 3) {
      const corruptedSignature = parts[2].substring(0, 10) + 'TAMPERED_HASH_XYZ';
      const corruptedToken = `${parts[0]}.${parts[1]}.${corruptedSignature}`;
      
      setAccessToken(corruptedToken);
      window.dispatchEvent(
        new CustomEvent('auth-token-updated', {
          detail: { accessToken: corruptedToken },
        })
      );

      logService.addLog(
        'system',
        '⚡ Token Tampered',
        'Appended illegal characters to JWT signature. Server verification will fail.'
      );
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 className="gradient-text">Simulation controls</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Latency Control */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Network latency</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>{latency}ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="3000"
            step="100"
            value={latency}
            onChange={handleLatencyChange}
            style={{
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              height: '6px',
              borderRadius: '3px',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>

        {/* Force Expiration Toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          <input
            type="checkbox"
            checked={forceExpired}
            onChange={handleForceExpiredChange}
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          />
          <span>Force access token expiry (instantly)</span>
        </label>

        {/* Token Tamper Button */}
        {user && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Simulate security testing (e.g. signature verification)
            </div>
            <button onClick={corruptAccessToken} className="btn btn-danger" style={{ width: '100%' }}>
              Tamper Access Token Signature
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DevSettings;
