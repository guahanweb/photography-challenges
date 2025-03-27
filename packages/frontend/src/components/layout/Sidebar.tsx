import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiUsers, FiGrid, FiSettings, FiChevronDown, FiChevronRight, FiPlus } from 'react-icons/fi';

interface NavSection {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: {
    title: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'Projects',
    path: '/admin/projects',
    icon: <FiGrid className="sidebar-icon" />,
    children: [
      {
        title: 'All Projects',
        path: '/admin/projects',
        icon: <FiGrid className="sidebar-icon" />,
      },
      {
        title: 'New Project',
        path: '/admin/projects/new',
        icon: <FiPlus className="sidebar-icon" />,
      },
    ],
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: <FiUsers className="sidebar-icon" />,
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    icon: <FiSettings className="sidebar-icon" />,
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['/admin/projects']);

  const toggleSection = (path: string) => {
    setExpandedSections(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (section: NavSection) => {
    if (!section.children) return isActive(section.path);
    return section.children.some(child => isActive(child.path)) || isActive(section.path);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {navSections.map(section => (
            <div key={section.path} className="sidebar-section">
              {section.children ? (
                <>
                  <Link
                    to={section.path}
                    className={`sidebar-section-header ${isSectionActive(section) ? 'active' : ''}`}
                    onClick={e => {
                      e.preventDefault();
                      toggleSection(section.path);
                    }}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                    <span className="ml-auto">
                      {expandedSections.includes(section.path) ? (
                        <FiChevronDown className="sidebar-icon" />
                      ) : (
                        <FiChevronRight className="sidebar-icon" />
                      )}
                    </span>
                  </Link>
                </>
              ) : (
                <Link
                  to={section.path}
                  className={`sidebar-section-header ${isSectionActive(section) ? 'active' : ''}`}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </Link>
              )}
              {section.children && expandedSections.includes(section.path) && (
                <div className="sidebar-section-content">
                  {section.children.map(child => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`sidebar-link ${isActive(child.path) ? 'active' : ''}`}
                    >
                      {child.icon}
                      <span>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <button className="sidebar-user-button">
          <FiUsers className="sidebar-icon" />
          <span>Admin User</span>
        </button>
      </div>
    </aside>
  );
}
