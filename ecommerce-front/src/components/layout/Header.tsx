import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

export function Header() {
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Products' },
    { to: '/cart', label: 'Cart' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="NEONSHOP Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Zap className="relative w-8 h-8 text-neon-cyan" />
            </div>
            <span className="font-['Orbitron'] text-xl font-bold tracking-wider">
              <span className="text-neon-cyan">NEON</span>
              <span className="text-white">SHOP</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-neon-cyan'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple" />
                )}
              </Link>
            ))}
          </div>

          {/* Cart Button */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 rounded-xl glass hover:bg-white/10 transition-all group"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-neon-cyan transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-neon">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl glass hover:bg-white/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-colors ${
                    isActive(link.to)
                      ? 'bg-neon-cyan/10 text-neon-cyan'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
