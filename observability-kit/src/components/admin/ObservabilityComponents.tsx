import { useMemo } from 'react';
import type { LogEvent, LogLevel } from '../../lib/types';

interface EventDetailModalProps {
  event: LogEvent | null;
  onClose: () => void;
}

/**
 * JSON Viewer with syntax highlighting
 */
function JsonViewer({ data }: { data: unknown }) {
  const formatted = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  return (
    <pre className="json-viewer text-sm overflow-auto max-h-60">
      {formatted}
    </pre>
  );
}

/**
 * Modal for viewing event details
 */
export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title flex items-center gap-2">
            <span>{getLevelIcon(event.level)}</span>
            Event Details
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--color-temple-stone)] hover:text-[var(--color-nile-blue-dark)] text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">Level</label>
              <p className={`badge-${event.level} inline-block mt-1`}>{event.level}</p>
            </div>
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">Timestamp</label>
              <p className="text-[var(--color-nile-blue-dark)] text-sm mt-1">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Message */}
          <div>
            <label className="text-xs text-[var(--color-temple-stone)] uppercase">Message</label>
            <p className="text-[var(--color-nile-blue-dark)] mt-1 p-3 bg-[var(--color-papyrus-light)] rounded">
              {event.message}
            </p>
          </div>
          
          {/* URL */}
          <div>
            <label className="text-xs text-[var(--color-temple-stone)] uppercase">URL</label>
            <p className="text-[var(--color-nile-blue-dark)] text-sm mt-1 font-mono break-all">
              {event.url}
            </p>
          </div>
          
          {/* Correlation ID */}
          <div>
            <label className="text-xs text-[var(--color-temple-stone)] uppercase">Correlation ID</label>
            <p className="text-[var(--color-nile-blue-dark)] text-sm mt-1 font-mono">
              {event.correlationId}
            </p>
          </div>
          
          {/* Stack trace */}
          {event.stack && (
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">Stack Trace</label>
              <pre className="mt-1 p-3 bg-[var(--color-nile-blue-dark)] text-[var(--color-papyrus)] rounded text-xs overflow-auto max-h-40 font-mono">
                {event.stack}
              </pre>
            </div>
          )}
          
          {/* Component Stack */}
          {event.componentStack && (
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">Component Stack</label>
              <pre className="mt-1 p-3 bg-[var(--color-nile-blue-dark)] text-[var(--color-papyrus)] rounded text-xs overflow-auto max-h-40 font-mono">
                {event.componentStack}
              </pre>
            </div>
          )}
          
          {/* Context */}
          {event.context && Object.keys(event.context).length > 0 && (
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">Context</label>
              <div className="mt-1">
                <JsonViewer data={event.context} />
              </div>
            </div>
          )}
          
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-pyramid-sand-dark)]">
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">App Version</label>
              <p className="text-[var(--color-nile-blue-dark)] text-sm mt-1">
                {event.appVersion}
              </p>
            </div>
            <div>
              <label className="text-xs text-[var(--color-temple-stone)] uppercase">Event ID</label>
              <p className="text-[var(--color-nile-blue-dark)] text-xs mt-1 font-mono">
                {event.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLevelIcon(level: LogLevel): string {
  const icons = {
    info: '𓂀',
    warn: '⚠️',
    error: '💀',
  };
  return icons[level];
}

interface FilterBarProps {
  levelFilter: LogLevel | 'all';
  onLevelChange: (level: LogLevel | 'all') => void;
  dateFilter: string;
  onDateChange: (date: string) => void;
  onClear: () => void;
  eventCount: number;
}

/**
 * Filter bar for events
 */
export function FilterBar({
  levelFilter,
  onLevelChange,
  dateFilter,
  onDateChange,
  onClear,
  eventCount,
}: FilterBarProps) {
  return (
    <div className="card-papyrus p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Level filter */}
        <div>
          <label className="text-xs text-[var(--color-temple-stone)] uppercase block mb-1">
            Level
          </label>
          <select
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value as LogLevel | 'all')}
            className="select-temple"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        {/* Date filter */}
        <div>
          <label className="text-xs text-[var(--color-temple-stone)] uppercase block mb-1">
            Date
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="input-papyrus"
          />
        </div>
        
        {/* Count */}
        <div className="flex-1 text-right">
          <span className="text-[var(--color-nile-blue-dark)] font-medium">
            {eventCount} events
          </span>
        </div>
        
        {/* Clear button */}
        <button
          onClick={onClear}
          className="btn-nile text-sm"
        >
          🗑️ Clear All
        </button>
      </div>
    </div>
  );
}

interface EventsTableProps {
  events: LogEvent[];
  onEventClick: (event: LogEvent) => void;
}

/**
 * Events table
 */
export function EventsTable({ events, onEventClick }: EventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="card-papyrus p-12 text-center">
        <div className="text-4xl mb-4">📜</div>
        <h3 className="text-xl font-bold text-[var(--color-nile-blue-dark)] mb-2">
          No Events Recorded
        </h3>
        <p className="text-[var(--color-temple-stone)]">
          The sacred scrolls are empty. Events will appear here when logged.
        </p>
      </div>
    );
  }

  return (
    <div className="card-papyrus overflow-hidden rounded-lg">
      <table className="table-temple">
        <thead>
          <tr>
            <th>Level</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="cursor-pointer" onClick={() => onEventClick(event)}>
              <td>
                <span className={`badge-${event.level}`}>
                  {getLevelIcon(event.level)} {event.level}
                </span>
              </td>
              <td className="max-w-xs truncate" title={event.message}>
                {event.message}
              </td>
              <td className="text-sm whitespace-nowrap">
                {new Date(event.timestamp).toLocaleString()}
              </td>
              <td className="max-w-xs truncate text-sm font-mono" title={event.url}>
                {new URL(event.url).pathname}
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className="text-[var(--color-nile-blue)] hover:text-[var(--color-pharaoh-gold)] text-sm"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { JsonViewer };
