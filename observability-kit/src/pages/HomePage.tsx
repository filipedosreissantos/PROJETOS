import { Link } from 'react-router-dom';
import { logger } from '../lib';

/**
 * Home Page with Egyptian theme
 */
export function HomePage() {
  const correlationId = logger.getCorrelationId();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="card-papyrus p-8 md:p-12 text-center">
        <div className="text-6xl mb-4 animate-float">𓂀</div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-nile-blue-dark)] mb-4">
          Welcome to the Temple of Observability
        </h1>
        <p className="text-[var(--color-temple-stone)] max-w-2xl mx-auto mb-8">
          A complete front-end observability kit for React applications. 
          Track errors, monitor performance, and gain insights into your application's health
          with the wisdom of the ancient scribes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/demo" className="btn-pharaoh no-underline">
            𓆣 Try the Demo
          </Link>
          <Link to="/admin/observability" className="btn-nile no-underline">
            𓂀 View Logs
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Error Boundary */}
        <div className="card-papyrus p-6">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-lg font-bold text-[var(--color-nile-blue-dark)] mb-2">
            Error Boundary
          </h3>
          <p className="text-sm text-[var(--color-temple-stone)]">
            Gracefully catch and display errors with friendly fallback UI.
            Supports retry and navigation options.
          </p>
        </div>

        {/* Logger */}
        <div className="card-papyrus p-6">
          <div className="text-3xl mb-3">📜</div>
          <h3 className="text-lg font-bold text-[var(--color-nile-blue-dark)] mb-2">
            Sentry-like Logger
          </h3>
          <p className="text-sm text-[var(--color-temple-stone)]">
            Log info, warnings, and errors with automatic context capture.
            Data sanitization and rate limiting included.
          </p>
        </div>

        {/* Web Vitals */}
        <div className="card-papyrus p-6">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-lg font-bold text-[var(--color-nile-blue-dark)] mb-2">
            Web Vitals
          </h3>
          <p className="text-sm text-[var(--color-temple-stone)]">
            Track Core Web Vitals (LCP, INP, CLS) and other metrics
            with automatic performance monitoring.
          </p>
        </div>

        {/* Error Pages */}
        <div className="card-papyrus p-6">
          <div className="text-3xl mb-3">🏜️</div>
          <h3 className="text-lg font-bold text-[var(--color-nile-blue-dark)] mb-2">
            Error Pages
          </h3>
          <p className="text-sm text-[var(--color-temple-stone)]">
            Beautiful 404, 500, and offline error pages with
            Egyptian-themed designs.
          </p>
        </div>

        {/* Admin Dashboard */}
        <div className="card-papyrus p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold text-[var(--color-nile-blue-dark)] mb-2">
            Admin Dashboard
          </h3>
          <p className="text-sm text-[var(--color-temple-stone)]">
            View and filter logged events, analyze performance metrics,
            and clear data as needed.
          </p>
        </div>

        {/* Session Tracking */}
        <div className="card-papyrus p-6">
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="text-lg font-bold text-[var(--color-nile-blue-dark)] mb-2">
            Session Correlation
          </h3>
          <p className="text-sm text-[var(--color-temple-stone)]">
            All events are linked with a session correlation ID
            for easy troubleshooting.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card-temple p-6">
        <h2 className="text-xl font-bold text-[var(--color-pharaoh-gold)] mb-4 text-center">
          Current Session
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[var(--color-papyrus)] text-sm opacity-70">Correlation ID</p>
            <p className="text-[var(--color-pharaoh-gold)] font-mono text-sm mt-1">
              {correlationId}
            </p>
          </div>
          <div>
            <p className="text-[var(--color-papyrus)] text-sm opacity-70">App Version</p>
            <p className="text-[var(--color-pharaoh-gold)] font-mono text-sm mt-1">
              {import.meta.env.VITE_APP_VERSION || '0.0.0'}
            </p>
          </div>
          <div>
            <p className="text-[var(--color-papyrus)] text-sm opacity-70">Environment</p>
            <p className="text-[var(--color-pharaoh-gold)] font-mono text-sm mt-1">
              {import.meta.env.DEV ? 'Development' : 'Production'}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Footer */}
      <div className="text-center text-[var(--color-pharaoh-gold)] text-2xl tracking-widest opacity-60">
        𓃭 𓆣 𓊖 𓇳 𓆸 𓂀 𓃭 𓆣 𓊖 𓇳 𓆸
      </div>
    </div>
  );
}

export default HomePage;
