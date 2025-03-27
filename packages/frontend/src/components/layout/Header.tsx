import { useLocation } from 'react-router-dom';
import { FiMenu, FiBell } from 'react-icons/fi';

const getPageTitle = (pathname: string): string => {
  const path = pathname.split('/').pop() || '';
  return path.charAt(0).toUpperCase() + path.slice(1);
};

interface HeaderProps {
  actions?: React.ReactNode;
}

export function Header({ actions }: HeaderProps) {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="admin-header">
      <div className="header-left">
        <button type="button" className="header-menu-button">
          <FiMenu className="header-icon" />
        </button>
        <h1 className="header-title">{pageTitle}</h1>
      </div>
      <div className="header-right">
        {actions}
        <button type="button" className="header-notification-button">
          <FiBell className="header-icon" />
        </button>
      </div>
    </header>
  );
}
