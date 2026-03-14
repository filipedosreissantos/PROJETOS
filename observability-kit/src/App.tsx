import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Layout
import { AppLayout } from './components/layout';

// Pages
import { HomePage, DemoPage } from './pages';

// Admin Pages
import { ObservabilityPage, PerformancePage } from './components/admin';

// Error Components
import { AppErrorBoundary, NotFoundPage, ServerErrorPage, OfflinePage } from './components/errors';

// Lib
import { initWebVitals, logger } from './lib';

/**
 * Offline detector hook
 */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      logger.info('Network connection restored');
    };
    const handleOffline = () => {
      setIsOnline(false);
      logger.warn('Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Main App Component
 */
function App() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // Initialize web vitals tracking
    initWebVitals();
    
    // Log app start
    logger.info('App initialized', {
      url: window.location.href,
      referrer: document.referrer,
    });
  }, []);

  // Show offline page when not connected
  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/demo" element={
              <AppErrorBoundary>
                <DemoPage />
              </AppErrorBoundary>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/observability" element={<ObservabilityPage />} />
            <Route path="/admin/performance" element={<PerformancePage />} />
          </Route>

          {/* Error Routes (outside layout) */}
          <Route path="/error" element={<ServerErrorPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="/offline" element={<OfflinePage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
