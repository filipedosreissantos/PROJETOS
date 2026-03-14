import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from './test-utils';
import { AppErrorBoundary } from '../components/errors/AppErrorBoundary';

// Component that throws an error
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error!');
  }
  return <div>No error</div>;
}

describe('AppErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <AppErrorBoundary>
        <div>Test content</div>
      </AppErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child component throws', () => {
    render(
      <AppErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    // Check for fallback UI elements
    expect(screen.getByText(/The Scribes Have Encountered a Problem/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Temple/i)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <AppErrorBoundary fallback={<div>Custom error fallback</div>}>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    
    render(
      <AppErrorBoundary onError={onError}>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe('Test error!');
  });

  it('recovers when retry button is clicked', async () => {
    const { rerender } = render(
      <AppErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </AppErrorBoundary>
    );

    // Verify we're in error state
    expect(screen.getByText(/The Scribes Have Encountered a Problem/i)).toBeInTheDocument();

    // Click try again button
    const retryButton = screen.getByText(/Try Again/i);
    retryButton.click();

    // Re-render with non-throwing component to simulate recovery
    rerender(
      <AppErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </AppErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
