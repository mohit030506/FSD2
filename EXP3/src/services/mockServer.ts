import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { logService } from './logService';

// Base64Url Encoding Helpers
export function base64urlEncode(obj: any): string {
  const str = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(str);
  const binString = String.fromCharCode(...bytes);
  const base64 = btoa(binString);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64urlDecode(str: string): any {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  const binString = atob(str);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  const decoded = new TextDecoder().decode(bytes);
  return JSON.parse(decoded);
}

// Dev Configurations
export const devSettings = {
  latencyMs: 800,
  forceTokenExpired: false,
  secretKey: 'ag-rbac-demo-secret-key-12345',
};

// Database Mock
let USERS = [
  { username: 'admin', password: 'password123', role: 'admin', fullName: 'Administrator', email: 'admin@guardian.io', status: 'Active', department: 'Management' },
  { username: 'editor', password: 'password123', role: 'editor', fullName: 'Content Editor', email: 'editor@guardian.io', status: 'Active', department: 'Content' },
  { username: 'viewer', password: 'password123', role: 'viewer', fullName: 'Guest Viewer', email: 'viewer@guardian.io', status: 'Active', department: 'Support' },
  { username: 'sarah_connor', password: 'password123', role: 'admin', fullName: 'Sarah Connor', email: 'sarah.c@guardian.io', status: 'Active', department: 'Security' },
  { username: 'bruce_wayne', password: 'password123', role: 'admin', fullName: 'Bruce Wayne', email: 'bruce.w@waynecorp.com', status: 'Active', department: 'Management' },
  { username: 'clark_kent', password: 'password123', role: 'editor', fullName: 'Clark Kent', email: 'clark.k@dailyplanet.com', status: 'Active', department: 'Editorial' },
  { username: 'peter_parker', password: 'password123', role: 'editor', fullName: 'Peter Parker', email: 'peter.p@dailybugle.com', status: 'Active', department: 'Photography' },
  { username: 'tony_stark', password: 'password123', role: 'admin', fullName: 'Tony Stark', email: 'tony.s@stark.com', status: 'Active', department: 'Engineering' },
  { username: 'natasha_romanoff', password: 'password123', role: 'admin', fullName: 'Natasha Romanoff', email: 'natasha.r@shield.gov', status: 'Active', department: 'Operations' },
  { username: 'steve_rogers', password: 'password123', role: 'viewer', fullName: 'Steve Rogers', email: 'steve.r@brooklyn.net', status: 'Active', department: 'Personnel' },
  { username: 'wanda_maximoff', password: 'password123', role: 'editor', fullName: 'Wanda Maximoff', email: 'wanda.m@westview.org', status: 'Active', department: 'Content' },
  { username: 'selina_kyle', password: 'password123', role: 'viewer', fullName: 'Selina Kyle', email: 'selina.k@cat.net', status: 'Suspended', department: 'Acquisitions' },
  { username: 'barry_allen', password: 'password123', role: 'editor', fullName: 'Barry Allen', email: 'barry.a@ccpd.gov', status: 'Active', department: 'Forensics' },
  { username: 'diana_prince', password: 'password123', role: 'admin', fullName: 'Diana Prince', email: 'diana.p@louvre.fr', status: 'Active', department: 'Curation' },
  { username: 'hal_jordan', password: 'password123', role: 'viewer', fullName: 'Hal Jordan', email: 'hal.j@ferris.com', status: 'Active', department: 'Aviation' },
  { username: 'arthur_curry', password: 'password123', role: 'viewer', fullName: 'Arthur Curry', email: 'arthur.c@atlantis.org', status: 'Active', department: 'Marine' },
  { username: 'victor_stone', password: 'password123', role: 'editor', fullName: 'Victor Stone', email: 'victor.s@star-labs.com', status: 'Active', department: 'IT Support' },
  { username: 'barbara_gordon', password: 'password123', role: 'admin', fullName: 'Barbara Gordon', email: 'barbara.g@gcpd.gov', status: 'Active', department: 'Database' },
  { username: 'harleen_quinzel', password: 'password123', role: 'viewer', fullName: 'Harleen Quinzel', email: 'harleen.q@arkham.edu', status: 'Suspended', department: 'Medical' },
  { username: 'pamela_isley', password: 'password123', role: 'editor', fullName: 'Pamela Isley', email: 'pamela.i@botany.org', status: 'Active', department: 'Research' },
  { username: 'reed_richards', password: 'password123', role: 'admin', fullName: 'Reed Richards', email: 'reed.r@baxter.org', status: 'Active', department: 'R&D' },
  { username: 'susan_storm', password: 'password123', role: 'editor', fullName: 'Susan Storm', email: 'susan.s@baxter.org', status: 'Active', department: 'PR' },
  { username: 'johnny_storm', password: 'password123', role: 'viewer', fullName: 'Johnny Storm', email: 'johnny.s@baxter.org', status: 'Active', department: 'Marketing' },
  { username: 'ben_grimm', password: 'password123', role: 'viewer', fullName: 'Ben Grimm', email: 'ben.g@baxter.org', status: 'Active', department: 'Logistics' },
  { username: 'charles_xavier', password: 'password123', role: 'admin', fullName: 'Charles Xavier', email: 'charles.x@xavier.edu', status: 'Active', department: 'Education' },
  { username: 'logan_howlett', password: 'password123', role: 'viewer', fullName: 'Logan Howlett', email: 'logan.h@weaponx.ca', status: 'Active', department: 'Security' },
  { username: 'jean_grey', password: 'password123', role: 'editor', fullName: 'Jean Grey', email: 'jean.g@xavier.edu', status: 'Active', department: 'Counseling' },
  { username: 'scott_summers', password: 'password123', role: 'editor', fullName: 'Scott Summers', email: 'scott.s@xavier.edu', status: 'Active', department: 'Operations' },
  { username: 'ororo_munroe', password: 'password123', role: 'admin', fullName: 'Ororo Munroe', email: 'ororo.m@weather.org', status: 'Active', department: 'Atmospheric' },
  { username: 'wade_wilson', password: 'password123', role: 'viewer', fullName: 'Wade Wilson', email: 'wade.w@chimichanga.com', status: 'Suspended', department: 'Contracting' },
];

interface Post {
  id: string;
  title: string;
  author: string;
}

let posts: Post[] = [
  { id: '1', title: 'Securing React Applications', author: 'admin' },
  { id: '2', title: 'Understanding JWT Lifecycles', author: 'editor' },
  { id: '3', title: 'Enterprise RBAC Architectures', author: 'admin' },
];

// Active Refresh Tokens on "Server"
const activeRefreshTokens = new Set<string>();

// Mock Token Generator
function generateTokens(username: string, role: string) {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Access token: short-lived (60s). If forced, it expires immediately.
  const iat = Math.floor(Date.now() / 1000);
  const exp = devSettings.forceTokenExpired ? iat - 10 : iat + 60;
  
  const payload = {
    sub: username,
    username,
    role,
    iat,
    exp,
  };

  const headerB64 = base64urlEncode(header);
  const payloadB64 = base64urlEncode(payload);
  const signatureRaw = `${headerB64}.${payloadB64}.${devSettings.secretKey}`;
  const signatureB64 = btoa(signatureRaw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const accessToken = `${headerB64}.${payloadB64}.${signatureB64}`;

  // Refresh token: longer-lived (15 mins)
  const refreshPayload = {
    sub: username,
    type: 'refresh',
    iat,
    exp: iat + 900,
  };
  const refreshB64 = base64urlEncode(refreshPayload);
  const refreshSignature = btoa(`${refreshB64}.${devSettings.secretKey}`).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const refreshToken = `${refreshB64}.${refreshSignature}`;

  activeRefreshTokens.add(refreshToken);
  
  return { accessToken, refreshToken };
}

// Token Verification
function verifyToken(token: string): { valid: boolean; payload?: any; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: 'Invalid token format (must have 3 parts)' };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const signatureRaw = `${headerB64}.${payloadB64}.${devSettings.secretKey}`;
    const expectedSignature = btoa(signatureRaw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (signatureB64 !== expectedSignature) {
      return { valid: false, reason: 'Signature mismatch (token tampered!)' };
    }

    const payload = base64urlDecode(payloadB64);
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && now > payload.exp) {
      return { valid: false, reason: `Token expired at ${new Date(payload.exp * 1000).toLocaleTimeString()}` };
    }

    return { valid: true, payload };
  } catch (error: any) {
    return { valid: false, reason: 'Failed to decode token: ' + error.message };
  }
}

// Custom Axios Mock Adapter
export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const { url, method, data, headers } = config;
  const requestBody = data ? JSON.parse(data) : null;
  const path = url || '';

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, devSettings.latencyMs));

  logService.addLog('request', `➡️ Outgoing Request`, `[${method?.toUpperCase()}] ${path}`, {
    headers: { ...headers },
    body: requestBody,
  });

  // Extract Auth Token
  const authHeader = headers?.Authorization as string || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // Endpoint Router
  // 1. POST /api/login
  if (path === '/api/login' && method === 'post') {
    const { username, password } = requestBody || {};
    const user = USERS.find((u) => u.username === username && u.password === password);

    if (user) {
      const tokens = generateTokens(user.username, user.role);
      logService.addLog('success', '🔐 Login Successful', `Authenticated user: ${user.fullName} (${user.role})`);
      return createSuccessResponse(config, 200, {
        user: { username: user.username, role: user.role, fullName: user.fullName },
        ...tokens,
      });
    } else {
      logService.addLog('error', '❌ Login Failed', 'Invalid username or password credentials.');
      return createErrorResponse(config, 401, 'Invalid username or password');
    }
  }

  // 2. POST /api/refresh
  if (path === '/api/refresh' && method === 'post') {
    const { refreshToken } = requestBody || {};
    if (!refreshToken) {
      logService.addLog('error', '🔄 Refresh Failed', 'No refresh token provided.');
      return createErrorResponse(config, 400, 'Refresh token required');
    }

    if (!activeRefreshTokens.has(refreshToken)) {
      logService.addLog('error', '🔄 Refresh Failed', 'Refresh token is invalid or already rotated/revoked.');
      return createErrorResponse(config, 401, 'Invalid refresh token');
    }

    const verification = verifyToken(refreshToken);
    if (!verification.valid) {
      logService.addLog('error', '🔄 Refresh Failed', `Token invalid: ${verification.reason}`);
      activeRefreshTokens.delete(refreshToken); // Revoke
      return createErrorResponse(config, 401, 'Expired or invalid refresh token');
    }

    // Success - Rotate Tokens (remove old, generate new)
    activeRefreshTokens.delete(refreshToken);
    const username = verification.payload.sub;
    const user = USERS.find((u) => u.username === username)!;
    
    // Automatically turn off forceTokenExpired on refresh so the retried request succeeds!
    const wasForced = devSettings.forceTokenExpired;
    if (wasForced) {
      devSettings.forceTokenExpired = false;
    }

    const tokens = generateTokens(user.username, user.role);
    logService.addLog(
      'success',
      '🔄 Token Refreshed',
      `Silent refresh succeeded for ${user.username}. Rotated tokens. ${wasForced ? '(Disabled simulated expiry)' : ''}`
    );

    return createSuccessResponse(config, 200, tokens);
  }

  // Auth Guard for other API endpoints
  if (!token) {
    logService.addLog('error', '🛡️ Access Blocked', 'No access token was sent in the Authorization header.');
    return createErrorResponse(config, 401, 'Authentication token missing');
  }

  const tokenVerification = verifyToken(token);
  if (!tokenVerification.valid) {
    logService.addLog('error', '🛡️ Access Blocked', `Token verification failed: ${tokenVerification.reason}`);
    return createErrorResponse(config, 401, tokenVerification.reason || 'Token verification failed');
  }

  const currentUser = tokenVerification.payload;

  // 3. GET /api/data/dashboard (All authenticated users)
  if (path === '/api/data/dashboard' && method === 'get') {
    logService.addLog('success', '📥 Resource Access', `User ${currentUser.username} loaded dashboard metrics.`);
    return createSuccessResponse(config, 200, {
      posts,
      systemStatus: 'Healthy',
      sessionExpiry: new Date(currentUser.exp * 1000).toLocaleTimeString(),
      stats: {
        totalPosts: posts.length,
        usersCount: USERS.length,
        activeRoles: ['admin', 'editor', 'viewer'],
      },
    });
  }

  // 4. POST /api/data/editor (Editor or Admin only)
  if (path === '/api/data/editor' && method === 'post') {
    if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
      logService.addLog('error', '🚫 Forbidden Access', `User ${currentUser.username} (${currentUser.role}) attempted to modify posts but lacks 'editor' privileges.`);
      return createErrorResponse(config, 403, 'Forbidden: Editor or Admin privileges required');
    }

    const { title } = requestBody || {};
    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 9),
      title: title || 'New Post Title',
      author: currentUser.username,
    };
    posts.push(newPost);
    logService.addLog('success', '📝 Resource Created', `Post "${newPost.title}" created by ${currentUser.username}.`);
    return createSuccessResponse(config, 201, { posts, message: 'Post created successfully.' });
  }

  // 4b. POST /api/data/editor/edit (Editor or Admin only)
  if (path === '/api/data/editor/edit' && method === 'post') {
    if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
      logService.addLog('error', '🚫 Forbidden Access', `User ${currentUser.username} (${currentUser.role}) attempted to edit posts but lacks 'editor' privileges.`);
      return createErrorResponse(config, 403, 'Forbidden: Editor or Admin privileges required');
    }

    const { postId, title } = requestBody || {};
    const postIndex = posts.findIndex((p) => p.id === postId);
    
    if (postIndex !== -1) {
      const oldTitle = posts[postIndex].title;
      posts[postIndex].title = title || posts[postIndex].title;
      logService.addLog('success', '✏️ Resource Edited', `Post "${oldTitle}" renamed to "${posts[postIndex].title}" by ${currentUser.username}.`);
      return createSuccessResponse(config, 200, { posts, message: 'Post edited successfully.' });
    } else {
      logService.addLog('error', '🔍 Edit Failed', `Post ID ${postId} not found.`);
      return createErrorResponse(config, 404, 'Post not found');
    }
  }

  // 5. DELETE /api/data/admin (Admin only)
  if (path === '/api/data/admin' && method === 'post') {
    if (currentUser.role !== 'admin') {
      logService.addLog('error', '🚫 Forbidden Access', `User ${currentUser.username} (${currentUser.role}) attempted to delete posts but lacks 'admin' privileges.`);
      return createErrorResponse(config, 403, 'Forbidden: Admin privileges required');
    }

    const { postId } = requestBody || {};
    posts = posts.filter((p) => p.id !== postId);
    logService.addLog('success', '🗑️ Resource Deleted', `Post ${postId} deleted by admin.`);
    return createSuccessResponse(config, 200, { posts, message: 'Post deleted successfully by administrator.' });
  }

  // 6. GET /api/data/users (Editor or Admin only)
  if (path === '/api/data/users' && method === 'get') {
    if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
      logService.addLog('error', '🚫 Forbidden Access', `User ${currentUser.username} (${currentUser.role}) attempted to fetch user list but lacks 'editor' or 'admin' privileges.`);
      return createErrorResponse(config, 403, 'Forbidden: Admin or Editor privileges required');
    }
    logService.addLog('success', '📥 Resource Access', `User ${currentUser.username} loaded user directory of 30 accounts.`);
    return createSuccessResponse(config, 200, USERS.map(u => ({
      username: u.username,
      role: u.role,
      fullName: u.fullName,
      email: u.email,
      status: u.status,
      department: u.department
    })));
  }

  // 7. POST /api/data/users/delete (Admin only)
  if (path === '/api/data/users/delete' && method === 'post') {
    if (currentUser.role !== 'admin') {
      logService.addLog('error', '🚫 Forbidden Access', `User ${currentUser.username} (${currentUser.role}) attempted to delete a user but lacks 'admin' privileges.`);
      return createErrorResponse(config, 403, 'Forbidden: Admin privileges required');
    }
    const { targetUsername } = requestBody || {};
    
    if (targetUsername === currentUser.username) {
      logService.addLog('error', '⚡ Self Deletion Blocked', `Admin ${currentUser.username} attempted to delete their own active session.`);
      return createErrorResponse(config, 400, 'Cannot delete your own active administrator account');
    }

    const index = USERS.findIndex(u => u.username === targetUsername);
    if (index !== -1) {
      const deletedUser = USERS[index];
      USERS.splice(index, 1);
      logService.addLog('success', '🗑️ User Deleted', `User account "${deletedUser.fullName}" (@${targetUsername}) was deleted by admin.`);
      return createSuccessResponse(config, 200, {
        message: `User ${targetUsername} deleted successfully.`,
        users: USERS.map(u => ({
          username: u.username,
          role: u.role,
          fullName: u.fullName,
          email: u.email,
          status: u.status,
          department: u.department
        }))
      });
    } else {
      logService.addLog('error', '🔍 Delete Failed', `User @${targetUsername} not found.`);
      return createErrorResponse(config, 404, 'User not found');
    }
  }

  logService.addLog('error', '🔍 Route Not Found', `Requested endpoint ${path} does not exist.`);
  return createErrorResponse(config, 404, 'Endpoint not found');
}

// Helpers for Response Generation
function createSuccessResponse(config: InternalAxiosRequestConfig, status: number, data: any): AxiosResponse {
  const response: AxiosResponse = {
    data,
    status,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
  };
  logService.addLog('response', `⬅️ Response Success`, `[${status}] for ${config.url}`, data);
  return response;
}

function createErrorResponse(config: InternalAxiosRequestConfig, status: number, message: string): Promise<AxiosResponse> {
  const errorObj = {
    response: {
      data: { message },
      status,
      statusText: getStatusText(status),
      headers: { 'content-type': 'application/json' },
      config,
    },
    message: `Request failed with status code ${status}`,
    isAxiosError: true,
    config,
  };
  logService.addLog('response', `⬅️ Response Error`, `[${status}] for ${config.url}: ${message}`, errorObj.response.data);
  return Promise.reject(errorObj);
}

function getStatusText(code: number): string {
  switch (code) {
    case 400: return 'Bad Request';
    case 401: return 'Unauthorized';
    case 403: return 'Forbidden';
    case 404: return 'Not Found';
    default: return 'Internal Server Error';
  }
}
