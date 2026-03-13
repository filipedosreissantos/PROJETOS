import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-dark-900 grid-pattern">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="mt-auto py-8 border-t border-glass-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 <span className="text-neon-cyan">NEON</span>SHOP. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
