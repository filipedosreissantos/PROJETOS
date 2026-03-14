import { Component, type ReactNode } from 'react';
import { logger } from '../../lib';
import type { ErrorInfo } from '../../lib/types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * AppErrorBoundary - A product-ready error boundary component
 * 
 * Features:
 * - Catches render errors in child components
 * - Displays friendly fallback UI
 * - Retry and navigation options
 * - Logs errors to the observability system
 * - Captures component stack trace
 */
export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const info: ErrorInfo = {
      componentStack: errorInfo.componentStack || undefined,
    };

    this.setState({ errorInfo: info });

    // Log to observability system
    logger.captureException(error, {
      componentStack: info.componentStack,
      type: 'react_error_boundary',
    });

    // Call optional callback
    this.props.onError?.(error, info);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default Egyptian-themed fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card-papyrus p-8 md:p-12 max-w-lg w-full text-center">
            {/* Egyptian decorative element */}
            <div className="text-6xl mb-4 animate-float">𓂀</div>
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-nile-blue-dark)] mb-3">
              The Scribes Have Encountered a Problem
            </h1>
            
            {/* Subtitle with hieroglyphic flair */}
            <p className="text-[var(--color-temple-stone)] mb-6 text-sm md:text-base">
              An unexpected error has disturbed the sacred scrolls.
              <br />
              Fear not, for this has been recorded in the temple archives.
            </p>

            {/* Error details (development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-[var(--color-nile-blue-dark)] rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
                <p className="text-[var(--color-seth-error)] font-mono text-xs mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[var(--color-papyrus)] font-mono text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-pharaoh text-sm"
              >
                ☥ Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-nile text-sm"
              >
                △ Return to Temple
              </button>
            </div>

            {/* Decorative hieroglyphs */}
            <div className="mt-8 text-[var(--color-pharaoh-gold)] text-lg tracking-widest opacity-60">
              𓃭 𓆣 𓊖 𓇳 𓆸
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
