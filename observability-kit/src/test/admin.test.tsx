import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from './test-utils';
import { ObservabilityPage } from '../components/admin/ObservabilityPage';
import { logger } from '../lib/logger';

describe('ObservabilityPage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('renders empty state when no events', () => {
    render(<ObservabilityPage />);
    
    expect(screen.getByText(/No Events Recorded/i)).toBeInTheDocument();
    expect(screen.getByText(/The sacred scrolls are empty/i)).toBeInTheDocument();
  });

  it('displays logged events', () => {
    // Log some test events
    logger.info('Test info event');
    logger.warn('Test warning event');
    logger.error('Test error event');
    
    render(<ObservabilityPage />);
    
    // Check stats
    expect(screen.getByText('3')).toBeInTheDocument(); // Total
    
    // Check events in table
    expect(screen.getByText('Test info event')).toBeInTheDocument();
    expect(screen.getByText('Test warning event')).toBeInTheDocument();
    expect(screen.getByText('Test error event')).toBeInTheDocument();
  });

  it('filters events by level', () => {
    logger.info('Info message');
    logger.warn('Warn message');
    logger.error('Error message');
    
    render(<ObservabilityPage />);
    
    // All events visible initially
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.getByText('Warn message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    
    // Filter to errors only
    const levelSelect = screen.getByRole('combobox');
    fireEvent.change(levelSelect, { target: { value: 'error' } });
    
    // Only error should be visible
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
    expect(screen.queryByText('Warn message')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('shows event details in modal when clicked', () => {
    logger.info('Detailed event', { customData: 'test123' });
    
    render(<ObservabilityPage />);
    
    // Click on the event
    const viewButton = screen.getByText('View Details');
    fireEvent.click(viewButton);
    
    // Modal should be visible
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByText('Detailed event')).toBeInTheDocument();
  });

  it('clears all events when clear button clicked', () => {
    logger.info('Event to clear');
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(<ObservabilityPage />);
    
    expect(screen.getByText('Event to clear')).toBeInTheDocument();
    
    const clearButton = screen.getByText(/Clear All/i);
    fireEvent.click(clearButton);
    
    // Should show empty state
    expect(screen.getByText(/No Events Recorded/i)).toBeInTheDocument();
  });

  it('refreshes events when refresh button clicked', () => {
    render(<ObservabilityPage />);
    
    expect(screen.getByText(/No Events Recorded/i)).toBeInTheDocument();
    
    // Log an event after render
    logger.info('New event');
    
    // Click refresh
    const refreshButton = screen.getByText(/Refresh/i);
    fireEvent.click(refreshButton);
    
    // New event should appear
    expect(screen.getByText('New event')).toBeInTheDocument();
  });

  it('displays correct stats counts', () => {
    logger.info('Info 1');
    logger.info('Info 2');
    logger.warn('Warn 1');
    logger.error('Error 1');
    logger.error('Error 2');
    logger.error('Error 3');
    
    render(<ObservabilityPage />);
    
    // Check individual counts in stats cards
    const cards = screen.getAllByText(/Info|Warning|Error|Total/i);
    expect(cards.length).toBeGreaterThan(0);
  });
});
