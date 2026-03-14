# 𓂀 Observability Kit

> A "Temple of Insights" - A complete front-end observability solution for React applications with Egyptian-themed design.

![Egyptian Theme](https://img.shields.io/badge/Theme-Egyptian-D4AF37?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

## 📜 Overview

Observability Kit is a production-ready observability solution for React applications. It provides comprehensive error tracking, performance monitoring, and logging capabilities—all wrapped in a beautiful Egyptian-themed design.

### Features

- 🛡️ **Error Boundary** - Graceful error handling with retry capabilities
- 📜 **Sentry-like Logger** - Full-featured logging with automatic context
- ⚡ **Web Vitals** - Core Web Vitals tracking and monitoring
- 🏜️ **Error Pages** - Beautiful 404, 500, and offline pages
- 📊 **Admin Dashboard** - View logs and performance metrics
- 🔐 **Data Sanitization** - Automatic redaction of sensitive data
- 🔗 **Session Correlation** - Link all events with a session ID
- 🎨 **Egyptian Theme** - Stunning pharaoh-inspired design

## 🏗️ Architecture

```
src/
├── lib/                    # Core observability modules
│   ├── logger.ts          # Sentry-like logging service
│   ├── webVitals.ts       # Web Vitals tracking
│   ├── config.ts          # Configuration and thresholds
│   └── types.ts           # TypeScript definitions
├── components/
│   ├── errors/            # Error handling components
│   │   ├── AppErrorBoundary.tsx
│   │   └── ErrorPages.tsx
│   ├── layout/            # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── admin/             # Admin dashboard components
│       ├── ObservabilityPage.tsx
│       └── PerformancePage.tsx
└── pages/                 # Application pages
    ├── HomePage.tsx
    └── DemoPage.tsx
```

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd observability-kit

# Install dependencies
npm install

# Start development server
npm run dev
```

### Basic Usage

#### 1. Logger API

```typescript
import { logger } from './lib';

// Log info events
logger.info('User logged in', { userId: '123', role: 'admin' });

// Log warnings
logger.warn('API response slow', { latency: 2500, endpoint: '/api/users' });

// Log errors
logger.error('Failed to fetch data', { statusCode: 500 });

// Capture exceptions with full stack trace
try {
  throw new Error('Something went wrong');
} catch (error) {
  logger.captureException(error, { context: 'checkout_flow' });
}
```

#### 2. Error Boundary

```tsx
import { AppErrorBoundary } from './components/errors';

function App() {
  return (
    <AppErrorBoundary
      onError={(error, errorInfo) => {
        // Optional: send to external service
        console.log('Error caught:', error.message);
      }}
    >
      <YourApp />
    </AppErrorBoundary>
  );
}
```

#### 3. Web Vitals

```typescript
import { initWebVitals, getLatestMetrics, getMetricAverage } from './lib';

// Initialize tracking (usually in main.tsx)
initWebVitals();

// Access metrics
const latest = getLatestMetrics();
console.log('LCP:', latest.LCP?.value, 'ms');
console.log('CLS:', latest.CLS?.value);

// Get average over multiple measurements
const avgLCP = getMetricAverage('LCP');
```

## 📊 Admin Dashboard

### Observability Page (`/admin/observability`)

- View all logged events (info, warn, error)
- Filter by level and date
- View detailed event information
- Clear logs functionality

### Performance Page (`/admin/performance`)

- Core Web Vitals (LCP, INP, CLS)
- Additional metrics (FCP, TTFB, FID)
- Historical data and averages
- Status indicators (good/needs improvement/poor)

## 🔧 Configuration

### Environment Variables

```env
# Enable/disable observability in production (default: true in prod)
VITE_OBSERVABILITY_ENABLED=true

# Optional: endpoint for sending logs to external service
VITE_OBSERVABILITY_ENDPOINT=https://your-api.com/logs

# App version (auto-detected from package.json)
VITE_APP_VERSION=1.0.0
```

### Logger Configuration

```typescript
import { ObservabilityLogger } from './lib';

const customLogger = new ObservabilityLogger({
  enabled: true,
  maxEvents: 500,           // Max events to store
  maxMetrics: 100,          // Max metrics to store
  rateLimitMs: 1000,        // Rate limit between error logs
  deduplicationWindowMs: 5000,  // Dedup window for same errors
  sanitizeKeys: [           // Keys to redact
    'password', 'token', 'secret', 
    'apiKey', 'authorization'
  ],
});
```

## 📐 Web Vitals Thresholds

Based on Google's recommendations:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤2500ms | ≤4000ms | >4000ms |
| INP | ≤200ms | ≤500ms | >500ms |
| CLS | ≤0.1 | ≤0.25 | >0.25 |
| FCP | ≤1800ms | ≤3000ms | >3000ms |
| TTFB | ≤800ms | ≤1800ms | >1800ms |

## 🎨 Egyptian Theme

The UI features a cohesive Egyptian-inspired design:

- **Gold** (`#D4AF37`) - Primary accent color
- **Nile Blue** (`#1E3A5F`) - Primary background
- **Papyrus** (`#F4E9D5`) - Card backgrounds
- **Temple Stone** (`#6B5B47`) - Text color

Custom CSS classes:
- `.card-papyrus` - Papyrus-styled cards
- `.card-temple` - Dark temple-styled cards
- `.btn-pharaoh` - Gold primary buttons
- `.btn-nile` - Blue secondary buttons
- `.badge-info/warn/error` - Status badges
- `.table-temple` - Styled tables

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage
```

### Test Coverage

- ✅ Error Boundary renders fallback on error
- ✅ Error Boundary calls onError callback
- ✅ Logger stores and retrieves events
- ✅ Logger sanitizes sensitive data
- ✅ Admin page displays events
- ✅ Admin page filters work correctly

## 🛠️ Technical Decisions

### Why LocalStorage?

- **Simplicity**: No server setup required
- **Persistence**: Survives page refreshes
- **Privacy**: Data stays on client
- **Debugging**: Easy to inspect in DevTools

For production, the logger supports sending to an external endpoint via `VITE_OBSERVABILITY_ENDPOINT`.

### Global Error Capture

The logger automatically attaches handlers for:
- `window.onerror` - Global JavaScript errors
- `window.onunhandledrejection` - Unhandled promise rejections

These work alongside React's Error Boundary to capture all error types.

### Web Vitals Integration

Using the official `web-vitals` library ensures accurate metrics that match what Google measures. All metrics are automatically logged and stored for historical analysis.

## ⚠️ Limitations

1. **Mock Backend**: Events are stored in LocalStorage only. For production, configure `VITE_OBSERVABILITY_ENDPOINT`.

2. **Storage Limits**: LocalStorage has ~5MB limit. Events are automatically pruned to stay within `maxEvents`.

3. **No Real-time Updates**: The admin dashboard requires manual refresh to see new events.

4. **Client-side Only**: No server-side error tracking (use with SSR frameworks requires additional setup).

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist` folder to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📁 Project Structure

```
observability-kit/
├── src/
│   ├── lib/                 # Core library
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard
│   │   ├── errors/         # Error handling
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   └── test/               # Test files
├── public/                  # Static assets
├── index.html              # Entry HTML
├── vite.config.ts          # Vite configuration
├── vitest.config.ts        # Test configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

## 🏆 Senior Differentiators

- ✅ **Correlation ID**: All events linked by session
- ✅ **Data Sanitization**: Automatic PII redaction
- ✅ **Rate Limiting**: Prevents log flooding
- ✅ **Deduplication**: No duplicate errors within window
- ✅ **Feature Flags**: Enable/disable via environment
- ✅ **TypeScript**: Full type safety
- ✅ **Comprehensive Tests**: Unit tests for core features
- ✅ **Documentation**: Complete usage examples

## 📜 License

MIT

---

<div align="center">
  <p>𓃭 𓆣 𓊖 𓇳 𓆸 𓂀 𓃭 𓆣 𓊖 𓇳 𓆸</p>
  <p><em>Built with the wisdom of the ancient scribes</em></p>
</div>
