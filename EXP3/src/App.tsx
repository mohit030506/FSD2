import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import AdminPage from './pages/AdminPage';
import Unauthorized from './pages/Unauthorized';
import TokenVisualizer from './components/TokenVisualizer';
import DevSettings from './components/DevSettings';
import ConsoleLogs from './components/ConsoleLogs';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <div className="dashboard-grid">
            {/* Main Content Area (Left Column on Desktop) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Route Guard Protected Endpoints */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/editor"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'editor']}>
                      <EditorPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Fallback routing */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>

            {/* Developer Playground Panel (Right Column on Desktop) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TokenVisualizer />
              <DevSettings />
              <ConsoleLogs />
            </div>
          </div>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
