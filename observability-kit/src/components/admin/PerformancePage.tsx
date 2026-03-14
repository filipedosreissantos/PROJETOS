import { useState, useEffect } from 'react';
import {
  getLatestMetrics,
  getMetricHistory,
  getMetricAverage,
  clearMetrics,
  performanceThresholds,
} from '../../lib';
import type { WebVitalMetric } from '../../lib/types';

type MetricName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

const metricInfo: Record<MetricName, { name: string; unit: string; description: string }> = {
  CLS: { name: 'Cumulative Layout Shift', unit: '', description: 'Visual stability' },
  FCP: { name: 'First Contentful Paint', unit: 'ms', description: 'First content rendered' },
  INP: { name: 'Interaction to Next Paint', unit: 'ms', description: 'Overall responsiveness' },
  LCP: { name: 'Largest Contentful Paint', unit: 'ms', description: 'Main content loaded' },
  TTFB: { name: 'Time to First Byte', unit: 'ms', description: 'Server response time' },
};

interface MetricCardProps {
  name: MetricName;
  metric: WebVitalMetric | null;
  average: number | null;
}

/**
 * Individual metric card
 */
function MetricCard({ name, metric, average }: MetricCardProps) {
  const info = metricInfo[name];
  const thresholds = performanceThresholds[name];
  
  const getStatusClass = (rating?: string) => {
    if (!rating) return '';
    return rating === 'good' ? 'status-good' : rating === 'needs-improvement' ? 'status-needs-improvement' : 'status-poor';
  };

  const getStatusColor = (rating?: string) => {
    if (!rating) return 'var(--color-temple-stone)';
    return rating === 'good' 
      ? 'var(--color-ankh-success)' 
      : rating === 'needs-improvement' 
        ? 'var(--color-ra-warning)' 
        : 'var(--color-seth-error)';
  };

  const formatValue = (value: number): string => {
    if (name === 'CLS') return value.toFixed(3);
    return Math.round(value).toString();
  };

  return (
    <div className={`metric-card ${getStatusClass(metric?.rating)}`}>
      <div className="text-2xl mb-2">
        {name === 'CLS' ? '📐' : name === 'LCP' ? '🖼️' : name === 'INP' ? '👆' : name === 'FCP' ? '🎨' : name === 'TTFB' ? '🌐' : '⚡'}
      </div>
      
      <h3 className="text-sm font-bold text-[var(--color-nile-blue-dark)] uppercase tracking-wide">
        {name}
      </h3>
      
      <p className="text-xs text-[var(--color-temple-stone)] mb-3">
        {info.description}
      </p>
      
      {metric ? (
        <>
          <div 
            className="metric-value"
            style={{ color: getStatusColor(metric.rating) }}
          >
            {formatValue(metric.value)}
            <span className="text-sm font-normal ml-1">{info.unit}</span>
          </div>
          
          <div className={`badge-${metric.rating === 'good' ? 'success' : metric.rating === 'needs-improvement' ? 'warn' : 'error'} text-xs mt-2`}>
            {metric.rating === 'good' ? '☥ Good' : metric.rating === 'needs-improvement' ? '⚠️ Needs Work' : '💀 Poor'}
          </div>
          
          {average !== null && (
            <p className="text-xs text-[var(--color-temple-stone)] mt-3">
              Avg: {formatValue(average)}{info.unit}
            </p>
          )}
        </>
      ) : (
        <div className="text-[var(--color-temple-stone)] text-sm py-4">
          No data yet
        </div>
      )}
      
      {/* Thresholds info */}
      <div className="mt-4 pt-3 border-t border-[var(--color-pyramid-sand-dark)]">
        <p className="text-xs text-[var(--color-temple-stone)]">
          Good: ≤{thresholds.good}{info.unit} | Poor: &gt;{thresholds.needsImprovement}{info.unit}
        </p>
      </div>
    </div>
  );
}

interface MetricHistoryProps {
  name: MetricName;
  history: WebVitalMetric[];
}

/**
 * Metric history table
 */
function MetricHistoryTable({ name, history }: MetricHistoryProps) {
  const info = metricInfo[name];
  
  if (history.length === 0) {
    return null;
  }

  const formatValue = (value: number): string => {
    if (name === 'CLS') return value.toFixed(3);
    return Math.round(value).toString();
  };

  return (
    <div className="card-papyrus overflow-hidden">
      <div className="p-4 border-b border-[var(--color-pharaoh-gold)]">
        <h3 className="font-bold text-[var(--color-nile-blue-dark)]">
          {info.name} History
        </h3>
      </div>
      <table className="table-temple">
        <thead>
          <tr>
            <th>Value</th>
            <th>Rating</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((m) => (
            <tr key={m.id}>
              <td className="font-mono">
                {formatValue(m.value)}{info.unit}
              </td>
              <td>
                <span className={`badge-${m.rating === 'good' ? 'success' : m.rating === 'needs-improvement' ? 'warn' : 'error'}`}>
                  {m.rating}
                </span>
              </td>
              <td className="text-sm">
                {new Date(m.timestamp).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Admin Performance Page
 * Displays Web Vitals metrics and history
 */
export function PerformancePage() {
  const [latest, setLatest] = useState<Record<MetricName, WebVitalMetric | null>>({
    CLS: null, FCP: null, INP: null, LCP: null, TTFB: null,
  });
  const [averages, setAverages] = useState<Record<MetricName, number | null>>({
    CLS: null, FCP: null, INP: null, LCP: null, TTFB: null,
  });
  const [selectedMetric, setSelectedMetric] = useState<MetricName | null>(null);
  const [history, setHistory] = useState<WebVitalMetric[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (selectedMetric) {
      setHistory(getMetricHistory(selectedMetric, 10));
    }
  }, [selectedMetric]);

  const refreshData = () => {
    setLatest(getLatestMetrics());
    setAverages({
      CLS: getMetricAverage('CLS'),
      FCP: getMetricAverage('FCP'),
      INP: getMetricAverage('INP'),
      LCP: getMetricAverage('LCP'),
      TTFB: getMetricAverage('TTFB'),
    });
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all performance metrics?')) {
      clearMetrics();
      refreshData();
      setHistory([]);
    }
  };

  // Calculate overall health
  const getOverallHealth = () => {
    const metrics = Object.values(latest).filter(Boolean) as WebVitalMetric[];
    if (metrics.length === 0) return null;
    
    const scores = { good: 0, 'needs-improvement': 0, poor: 0 };
    metrics.forEach((m) => scores[m.rating]++);
    
    if (scores.poor > 0) return 'poor';
    if (scores['needs-improvement'] > scores.good) return 'needs-improvement';
    return 'good';
  };

  const health = getOverallHealth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-papyrus)]">
            ⚡ Performance Metrics
          </h1>
          <p className="text-[var(--color-pharaoh-gold)] opacity-70">
            Core Web Vitals and performance tracking
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={refreshData} className="btn-pharaoh text-sm">
            ↻ Refresh
          </button>
          <button onClick={handleClear} className="btn-nile text-sm">
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Overall Health */}
      {health && (
        <div className={`card-papyrus p-6 text-center ${health === 'good' ? 'border-l-4 border-l-[var(--color-ankh-success)]' : health === 'needs-improvement' ? 'border-l-4 border-l-[var(--color-ra-warning)]' : 'border-l-4 border-l-[var(--color-seth-error)]'}`}>
          <div className="text-4xl mb-2">
            {health === 'good' ? '☥' : health === 'needs-improvement' ? '⚠️' : '💀'}
          </div>
          <h2 className="text-xl font-bold text-[var(--color-nile-blue-dark)]">
            Overall Health: {health === 'good' ? 'Excellent' : health === 'needs-improvement' ? 'Needs Improvement' : 'Critical'}
          </h2>
          <p className="text-[var(--color-temple-stone)] text-sm mt-2">
            {health === 'good' 
              ? 'Your temple performs like the great pyramids - standing strong!' 
              : health === 'needs-improvement'
                ? 'Some metrics need attention. The scribes recommend optimization.'
                : 'Multiple metrics are in poor condition. Immediate attention required!'}
          </p>
        </div>
      )}

      {/* Core Web Vitals */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-papyrus)] mb-4 flex items-center gap-2">
          <span>🏆</span> Core Web Vitals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['LCP', 'INP', 'CLS'] as MetricName[]).map((name) => (
            <div 
              key={name} 
              onClick={() => setSelectedMetric(name)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <MetricCard
                name={name}
                metric={latest[name]}
                average={averages[name]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Other Metrics */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-papyrus)] mb-4 flex items-center gap-2">
          <span>📊</span> Additional Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['FCP', 'TTFB'] as MetricName[]).map((name) => (
            <div 
              key={name} 
              onClick={() => setSelectedMetric(name)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <MetricCard
                name={name}
                metric={latest[name]}
                average={averages[name]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      {selectedMetric && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--color-papyrus)]">
              Measurement History
            </h2>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-[var(--color-pharaoh-gold)] hover:underline text-sm"
            >
              × Close
            </button>
          </div>
          <MetricHistoryTable name={selectedMetric} history={history} />
        </div>
      )}

      {/* No Data State */}
      {!health && (
        <div className="card-papyrus p-12 text-center">
          <div className="text-4xl mb-4">📏</div>
          <h3 className="text-xl font-bold text-[var(--color-nile-blue-dark)] mb-2">
            No Metrics Recorded Yet
          </h3>
          <p className="text-[var(--color-temple-stone)]">
            Navigate around the app to collect Web Vitals measurements.
            <br />
            The scribes will record performance data automatically.
          </p>
        </div>
      )}
    </div>
  );
}

export default PerformancePage;
