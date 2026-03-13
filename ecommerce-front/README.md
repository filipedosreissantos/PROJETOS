# 🛒 NEONSHOP - Futuristic E-commerce

![NEONSHOP Banner](https://via.placeholder.com/1200x400/0a0a0f/00f5ff?text=NEONSHOP+-+Futuristic+E-commerce)

A modern, futuristic e-commerce frontend built with React, TypeScript, Vite, and Tailwind CSS. Features a stunning cyberpunk/neon aesthetic with smooth animations and excellent UX.

## 🔗 Live Demo

**[View Live Demo →](https://neonshop.vercel.app)**

## ✨ Features

### Core Functionality
- 📦 **Product Catalog** - Responsive grid with skeleton loading
- 🔍 **Search & Filters** - Filter by category, price range, and sort options
- 📄 **Product Details** - Detailed product page with quantity selector
- 🛒 **Shopping Cart** - Add, remove, update quantities
- 💾 **LocalStorage Persistence** - Cart survives page refresh
- 💳 **Checkout Flow** - Form validation with simulated order
- ✅ **Order Confirmation** - Success page with order details

### UX & Quality
- ⏳ **Skeleton Loading** - Beautiful loading states
- 🚫 **Empty/Error States** - Informative fallback UI
- 🔔 **Toast Notifications** - Feedback for all actions
- ♿ **Accessibility** - Proper labels, focus states, keyboard navigation
- 📱 **Fully Responsive** - Works on all screen sizes
- 🎨 **Futuristic Design** - Neon colors, glass morphism, smooth animations

### Tech Stack
- ⚛️ **React 19** - Latest React with hooks
- 📘 **TypeScript** - Full type safety
- ⚡ **Vite** - Lightning-fast dev server
- 🎨 **Tailwind CSS v4** - Utility-first styling
- 🔀 **React Router v7** - Client-side routing
- 📋 **React Hook Form** - Form handling
- ✅ **Zod** - Schema validation
- 🧪 **Vitest + Testing Library** - Unit & integration tests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neonshop.git

# Navigate to project directory
cd neonshop

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Run ESLint |

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/        # Header, Layout
│   ├── product/       # ProductCard, ProductGrid, FilterBar
│   └── ui/            # Button, Input, Select, Toast, Skeleton
├── context/
│   ├── CartContext    # Shopping cart state management
│   └── ToastContext   # Toast notifications
├── hooks/
│   └── useProducts    # Product data fetching & filtering
├── pages/
│   ├── CatalogPage    # Home page with product grid
│   ├── ProductDetailsPage
│   ├── CartPage
│   ├── CheckoutPage
│   └── SuccessPage
├── services/
│   └── api.ts         # API calls to Fake Store API
├── test/
│   └── cart.test.tsx  # Cart functionality tests
└── types/
    └── index.ts       # TypeScript interfaces
```

## 🧪 Testing

The project includes comprehensive tests for cart functionality:

- ✅ Adding products to cart
- ✅ Updating quantities
- ✅ Removing products
- ✅ LocalStorage persistence
- ✅ Cart totals calculation
- ✅ Clear cart functionality

Run tests:
```bash
npm run test
```

## 🎨 Design System

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Neon Cyan | `#00f5ff` | Primary accents |
| Neon Pink | `#ff00e5` | Secondary accents |
| Neon Purple | `#b400ff` | Tertiary accents |
| Dark 900 | `#0a0a0f` | Background |
| Dark 700 | `#1a1a25` | Cards/surfaces |

### Typography
- **Headings**: Orbitron (futuristic display font)
- **Body**: Inter (clean sans-serif)

## 📡 API

The app uses the [Fake Store API](https://fakestoreapi.com/) for product data:

- `GET /products` - All products
- `GET /products/:id` - Single product
- `GET /products/categories` - All categories
- `GET /products/category/:name` - Products by category

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Deploy with default settings

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/neonshop)

## 📝 License

MIT License - feel free to use this project for learning or as a template.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  Built with 💜 using React + TypeScript + Tailwind CSS
</p>
