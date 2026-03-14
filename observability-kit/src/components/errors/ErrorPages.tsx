import { Link } from 'react-router-dom';

interface ErrorPageProps {
  code: number;
  title: string;
  message: string;
  icon: string;
  showHomeButton?: boolean;
  showReportButton?: boolean;
}

/**
 * Generic Error Page Component with Egyptian theme
 */
export function ErrorPage({
  code,
  title,
  message,
  icon,
  showHomeButton = true,
  showReportButton = false,
}: ErrorPageProps) {
  return (
    <div className="error-page">
      <div className="error-container">
        {/* Animated icon */}
        <div className="error-icon animate-float">{icon}</div>
        
        {/* Error code */}
        <div className="text-6xl font-bold text-[var(--color-pharaoh-gold)] mb-4">
          {code}
        </div>
        
        {/* Title */}
        <h1 className="error-title">{title}</h1>
        
        {/* Message */}
        <p className="error-message">{message}</p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showHomeButton && (
            <Link to="/" className="btn-pharaoh text-sm no-underline">
              △ Return to Temple
            </Link>
          )}
          {showReportButton && (
            <Link to="/admin/observability" className="btn-nile text-sm no-underline">
              𓂀 View Reports
            </Link>
          )}
        </div>
        
        {/* Decorative hieroglyphs */}
        <div className="mt-8 text-[var(--color-pharaoh-gold)] text-lg tracking-widest opacity-60">
          𓃭 𓆣 𓊖 𓇳 𓆸
        </div>
      </div>
    </div>
  );
}

/**
 * 404 Not Found Page
 */
export function NotFoundPage() {
  return (
    <ErrorPage
      code={404}
      title="Lost in the Desert"
      message="The sacred scroll you seek cannot be found. Perhaps it has been buried beneath the sands of time."
      icon="🏜️"
      showHomeButton={true}
    />
  );
}

/**
 * 500 Server Error Page
 */
export function ServerErrorPage() {
  return (
    <ErrorPage
      code={500}
      title="The Temple Has Fallen"
      message="An ancient curse has disrupted our sacred systems. Our scribes are working to restore order."
      icon="⚡"
      showHomeButton={true}
      showReportButton={true}
    />
  );
}

/**
 * Offline Page
 */
export function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon animate-pulse-scarab">📡</div>
        
        <h1 className="error-title">Disconnected from the Nile</h1>
        
        <p className="error-message">
          Your connection to the kingdom has been lost. 
          Check your papyrus network settings and try again.
        </p>
        
        <button onClick={handleRetry} className="btn-pharaoh text-sm">
          ☥ Retry Connection
        </button>
        
        <div className="mt-8 text-[var(--color-pharaoh-gold)] text-lg tracking-widest opacity-60">
          𓃭 𓆣 𓊖 𓇳 𓆸
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
