import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { NotificationList } from './components/notifications/NotificationList';
import { DebugPanel } from './components/debug/DebugPanel';
import { AppRoutes } from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import './styles/theme.css';
import { DebugProvider } from './contexts/DebugContext';

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
          <DebugProvider>
            <ProjectsProvider>
              <NotificationProvider>
                <div className="min-h-screen bg-app text-primary">
                  <AppRoutes />
                  <NotificationList />
                  <DebugPanel />
                </div>
              </NotificationProvider>
            </ProjectsProvider>
          </DebugProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
