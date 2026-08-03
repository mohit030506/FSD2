import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { base64urlDecode } from '../services/mockServer';

export const TokenVisualizer: React.FC = () => {
  const { accessToken, refreshToken } = useAuth();
  const [decodedHeader, setDecodedHeader] = useState<any>(null);
  const [decodedPayload, setDecodedPayload] = useState<any>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setDecodedHeader(null);
      setDecodedPayload(null);
      setSecondsLeft(null);
      return;
    }

    try {
      const parts = accessToken.split('.');
      if (parts.length === 3) {
        setDecodedHeader(base64urlDecode(parts[0]));
        const payload = base64urlDecode(parts[1]);
        setDecodedPayload(payload);

        const exp = payload.exp;
        const updateTimer = () => {
          const now = Math.floor(Date.now() / 1000);
          const diff = exp - now;
          setSecondsLeft(diff > 0 ? diff : 0);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
      }
    } catch (err) {
      console.error('Failed to decode token for visualization', err);
    }
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 className="gradient-text">JWT Token Monitor</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No active session detected. Log in as any user to inspect and decode their JSON Web Token (JWT) in real-time.
        </p>
      </div>
    );
  }

  const parts = accessToken.split('.');
  const headerPart = parts[0] || '';
  const payloadPart = parts[1] || '';
  const signaturePart = parts[2] || '';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="gradient-text">JWT Token Visualizer</h3>
        {secondsLeft !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>TTL:</span>
            <span
              className="badge"
              style={{
                background: secondsLeft > 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: secondsLeft > 10 ? 'var(--color-success)' : 'var(--color-error)',
                border: secondsLeft > 10 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {secondsLeft}s {secondsLeft === 0 ? '(Expired)' : ''}
            </span>
          </div>
        )}
      </div>

      <div>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Encoded JWT string</h4>
        <div className="jwt-token-string">
          <span className="jwt-part-header">{headerPart}</span>
          <span className="jwt-part-dot">.</span>
          <span className="jwt-part-payload">{payloadPart}</span>
          <span className="jwt-part-dot">.</span>
          <span className="jwt-part-signature">{signaturePart}</span>
        </div>
      </div>

      <div className="jwt-visualizer-grid">
        {decodedHeader && (
          <div className="jwt-section-card header">
            <div className="jwt-part-header jwt-section-title">Header (Algorithm & Type)</div>
            <pre className="jwt-section-json">{JSON.stringify(decodedHeader, null, 2)}</pre>
          </div>
        )}

        {decodedPayload && (
          <div className="jwt-section-card payload">
            <div className="jwt-part-payload jwt-section-title">Payload (Data Claims)</div>
            <pre className="jwt-section-json">{JSON.stringify(decodedPayload, null, 2)}</pre>
          </div>
        )}

        <div className="jwt-section-card signature">
          <div className="jwt-part-signature jwt-section-title">Signature (Simulated Integrity Verify)</div>
          <pre className="jwt-section-json" style={{ color: 'var(--text-secondary)' }}>
            HMACSHA256(
              base64UrlEncode(header) + "." +
              base64UrlEncode(payload),
              <span style={{ color: 'var(--color-warning)' }}>"SECRET_KEY"</span>
            )
          </pre>
        </div>
      </div>

      {refreshToken && (
        <div style={{ marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Refresh Token (Stored in LocalStorage)
          </h4>
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {refreshToken.slice(0, 30)}...{refreshToken.slice(-30)}
          </div>
        </div>
      )}
    </div>
  );
};
export default TokenVisualizer;
