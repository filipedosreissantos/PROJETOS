import { NavLink } from 'react-router-dom';

/**
 * Navigation Sidebar for the Admin area
 */
export function Sidebar() {
  const navItems = [
    { to: '/', label: 'Home', icon: '△' },
    { to: '/admin/observability', label: 'Observability', icon: '𓂀' },
    { to: '/admin/performance', label: 'Performance', icon: '⚡' },
    { to: '/demo', label: 'Demo', icon: '𓆣' },
  ];

  return (
    <aside className="sidebar-temple w-64 flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b-2 border-[var(--color-pharaoh-gold)]">
        <div className="flex items-center gap-3">
          <span className="text-3xl">𓂀</span>
          <div>
            <h1 className="text-[var(--color-pharaoh-gold)] font-bold text-lg">
              Observability
            </h1>
            <p className="text-[var(--color-papyrus)] text-xs opacity-70">
              Temple of Insights
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-pharaoh-gold)] border-opacity-30">
        <p className="text-[var(--color-papyrus)] text-xs opacity-50 text-center">
          𓃭 𓆣 𓊖 𓇳 𓆸
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
