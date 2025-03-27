import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ProjectsProvider } from '../../contexts/ProjectsContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <div className="admin-main">
          <ProjectsProvider>{children || <Outlet />}</ProjectsProvider>
        </div>
      </main>
    </div>
  );
}
