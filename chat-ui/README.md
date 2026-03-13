# 🏛️ Nile Chat - Egyptian Themed Messenger

![Nile Chat Preview](https://raw.githubusercontent.com/user/nile-chat/main/preview.gif)

A beautiful Egyptian-themed real-time chat application showcasing advanced React patterns, optimistic updates, infinite scroll, and sophisticated cache management.

## ⚡ Live Demo

🔗 [View on Vercel](https://nile-chat.vercel.app)

## ✨ Features

- 🏺 **Egyptian Design** - Stunning gold, lapis lazuli, and papyrus themed UI
- 💬 **Real-time Messaging** - Simulated WebSocket with typing indicators
- ⚡ **Optimistic Updates** - Messages appear instantly before confirmation
- ♾️ **Infinite Scroll** - Load older messages seamlessly
- 💾 **Persistent Cache** - Messages survive page refresh
- 📱 **Responsive** - Works on mobile and desktop
- ♿ **Accessible** - Keyboard navigation, ARIA labels

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| TanStack Query | Data Fetching & Cache |
| Zustand | UI State Management |
| Vitest | Testing |
| Testing Library | Component Testing |

## 🏗️ Architecture

### FakeSocket (EventEmitter Pattern)

The app simulates real-time communication using a custom `FakeSocket` class that implements the EventEmitter pattern:

```typescript
// Events emitted:
- message:new     // When a new message arrives
- typing:start    // When someone starts typing
- typing:stop     // When someone stops typing
- thread:read     // When messages are marked as read
- message:status  // When message status changes (sending → sent → delivered → read)
```

**How it works:**
1. `fakeSocket.sendMessage()` creates an optimistic message
2. After 300ms, status changes to `sent`
3. After 500ms more, status changes to `delivered`
4. Other user starts "typing" and responds after 1.5-3.5s
5. Random auto-messages every 15s (30% chance) simulate activity

### Query Keys Strategy

```typescript
const queryKeys = {
  all: ['nile-chat'],
  threads: () => [...queryKeys.all, 'threads'],
  thread: (id) => [...queryKeys.all, 'thread', id],
  messages: (threadId) => [...queryKeys.all, 'messages', threadId],
  messagesInfinite: (threadId) => [...queryKeys.messages(threadId), 'infinite'],
};
```

### Cache Update Flow

```
┌─────────────────┐
│  User sends     │
│  message        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Optimistic     │────▶│  Update threads │
│  message added  │     │  lastMessage    │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  fakeSocket     │
│  confirms send  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Message status │────▶│  Other user     │
│  → delivered    │     │  typing...      │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  New message    │
                        │  received       │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Cache updated  │
                        │  + unread badge │
                        └─────────────────┘
```

### Persistence Strategy

- **Query Cache**: `PersistQueryClientProvider` with `localStorage`
- **UI State**: Zustand with `persist` middleware
- **Rehydration**: Automatic on app initialization

```typescript
// Persisted data:
- threads list
- messages (per thread)
- selected thread ID
```

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatArea.tsx      # Main chat container
│   │   ├── ChatHeader.tsx    # Thread header with user info
│   │   ├── ChatInput.tsx     # Message input with Enter to send
│   │   ├── MessageList.tsx   # Messages with infinite scroll
│   │   └── Sidebar.tsx       # Thread list with search
│   └── ui/
│       ├── Avatar.tsx        # User avatar with status
│       ├── Button.tsx        # Egyptian styled button
│       ├── Icons.tsx         # SVG icons
│       ├── Input.tsx         # Styled input
│       └── Skeleton.tsx      # Loading skeletons
├── hooks/
│   └── useChat.ts            # All chat-related hooks
├── lib/
│   ├── fakeSocket.ts         # WebSocket simulation
│   ├── queryClient.ts        # TanStack Query config
│   └── utils.ts              # Helper functions
├── store/
│   └── uiStore.ts            # Zustand UI state
├── test/
│   ├── chat.test.tsx         # Chat component tests
│   ├── sidebar.test.tsx      # Sidebar tests
│   ├── setup.ts              # Test setup
│   └── test-utils.tsx        # Testing utilities
├── types/
│   └── index.ts              # TypeScript types
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Tailwind + Egyptian styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/user/nile-chat.git
cd nile-chat

# Install dependencies
npm install

# Start development server
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest tests |
| `npm run lint` | Run ESLint |

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Test Coverage

- ✅ Send message adds to screen (optimistic)
- ✅ `message:new` event updates conversation & badge
- ✅ Opening thread marks as read
- ✅ Infinite scroll loads more messages
- ✅ Search filters conversations
- ✅ Keyboard navigation (Enter to send)

## 🎨 Egyptian Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#D4AF37` | Primary, accents, badges |
| Lapis | `#1E5AAF` | Sent messages, links |
| Papyrus | `#D4C4A1` | Text, backgrounds |
| Nile | `#2AA3A3` | Online status, read receipts |
| Terracotta | `#C45C4D` | Errors, warnings |
| Tomb | `#1A1A1A` | Dark backgrounds |

### Typography

- **Headings**: Cinzel (Egyptian serif)
- **Body**: Noto Sans (readable)

### Components

- Egyptian border decorations
- Gold shimmer effects
- Hieroglyph background patterns
- Pyramid-inspired decorative corners

## 📱 Responsive Behavior

- **Desktop** (≥768px): Side-by-side sidebar and chat
- **Mobile** (<768px): Toggle between sidebar and chat

## 🔧 Configuration

### Environment Variables

No environment variables required for local development.

### Vercel Deployment

1. Push to GitHub
2. Import to Vercel
3. Deploy (zero config needed)

## 📄 License

MIT License - feel free to use this project for learning or as a template!

---

<div align="center">
  <p>Built with ☥ by the River Nile</p>
  <p>
    <strong>May Ra illuminate your code! ☀️</strong>
  </p>
</div>
