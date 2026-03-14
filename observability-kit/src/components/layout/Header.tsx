import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { logger } from '../../lib';

interface HeaderProps {
  title?: string;
}

/**
 * Header component with Egyptian theme
 */
export function Header({ title }: HeaderProps) {
  const location = useLocation();
  
  // Derive title from path if not provided
  const pageTitle = title || getPageTitle(location.pathname);
  
  return (
    <header className="bg-[var(--color-nile-blue)] border-b-2 border-[var(--color-pharaoh-gold)] px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-papyrus)]">
            {pageTitle}
          </h1>
          <p className="text-[var(--color-pharaoh-gold)] text-sm opacity-70">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Session ID display */}
          <div className="text-right hidden md:block">
            <p className="text-[var(--color-papyrus)] text-xs opacity-70">Session ID</p>
            <p className="text-[var(--color-pharaoh-gold)] text-xs font-mono">
              {logger.getCorrelationId().substring(0, 8)}...
            </p>
          </div>
          
          {/* Decorative element */}
          <div className="text-2xl animate-float">☥</div>
        </div>
      </div>
    </header>
  );
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/': 'Welcome, Pharaoh',
    '/admin/observability': 'Temple Archives',
    '/admin/performance': 'Performance Metrics',
    '/demo': 'Sacred Demonstrations',
    '/error': 'Temple Error',
    '/not-found': 'Lost Scroll',
    '/offline': 'Disconnected',
  };
  
  return titles[pathname] || 'Sacred Scrolls';
}

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main Layout with Sidebar
 */
export function MainLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Header;
