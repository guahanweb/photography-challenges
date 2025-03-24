import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationList } from './components/notifications/NotificationList';
import { DebugPanel } from './components/debug/DebugPanel';
import { AppRoutes } from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-app text-primary">
              <AppRoutes />
              <NotificationList />
              <DebugPanel />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
