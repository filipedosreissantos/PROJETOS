import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * Main App Layout with Sidebar and Header
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-[var(--color-nile-blue)] bg-opacity-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
