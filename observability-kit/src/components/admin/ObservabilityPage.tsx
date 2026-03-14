import { useState, useMemo } from 'react';
import { logger } from '../../lib';
import type { LogEvent, LogLevel } from '../../lib/types';
import { EventDetailModal, FilterBar, EventsTable } from './ObservabilityComponents';

/**
 * Admin Observability Page
 * Displays logged events with filtering and search capabilities
 */
export function ObservabilityPage() {
  const [events, setEvents] = useState<LogEvent[]>(() => logger.getEvents());
  const [selectedEvent, setSelectedEvent] = useState<LogEvent | null>(null);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Level filter
      if (levelFilter !== 'all' && event.level !== levelFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter) {
        const eventDate = new Date(event.timestamp).toISOString().split('T')[0];
        if (eventDate !== dateFilter) {
          return false;
        }
      }
      
      return true;
    });
  }, [events, levelFilter, dateFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = events.length;
    const info = events.filter((e) => e.level === 'info').length;
    const warn = events.filter((e) => e.level === 'warn').length;
    const error = events.filter((e) => e.level === 'error').length;
    return { total, info, warn, error };
  }, [events]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all events? This cannot be undone.')) {
      logger.clearEvents();
      setEvents([]);
    }
  };

  const handleRefresh = () => {
    setEvents(logger.getEvents());
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-papyrus)]">
            𓂀 Temple Archives
          </h1>
          <p className="text-[var(--color-pharaoh-gold)] opacity-70">
            View and analyze logged events
          </p>
        </div>
        <button onClick={handleRefresh} className="btn-pharaoh text-sm">
          ↻ Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-papyrus p-4 text-center">
          <div className="text-3xl font-bold text-[var(--color-nile-blue-dark)]">
            {stats.total}
          </div>
          <div className="text-sm text-[var(--color-temple-stone)] uppercase">Total Events</div>
        </div>
        <div className="card-papyrus p-4 text-center border-l-4 border-l-[var(--color-nile-blue)]">
          <div className="text-3xl font-bold text-[var(--color-nile-blue)]">
            {stats.info}
          </div>
          <div className="text-sm text-[var(--color-temple-stone)] uppercase">Info</div>
        </div>
        <div className="card-papyrus p-4 text-center border-l-4 border-l-[var(--color-ra-warning)]">
          <div className="text-3xl font-bold text-[var(--color-ra-warning)]">
            {stats.warn}
          </div>
          <div className="text-sm text-[var(--color-temple-stone)] uppercase">Warnings</div>
        </div>
        <div className="card-papyrus p-4 text-center border-l-4 border-l-[var(--color-seth-error)]">
          <div className="text-3xl font-bold text-[var(--color-seth-error)]">
            {stats.error}
          </div>
          <div className="text-sm text-[var(--color-temple-stone)] uppercase">Errors</div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        onClear={handleClear}
        eventCount={filteredEvents.length}
      />

      {/* Events Table */}
      <EventsTable
        events={filteredEvents}
        onEventClick={setSelectedEvent}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}

export default ObservabilityPage;
