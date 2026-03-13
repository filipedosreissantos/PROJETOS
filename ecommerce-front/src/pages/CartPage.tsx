import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-dark-700 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-500" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Looks like you haven't added anything yet</p>
        <Link to="/">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-['Orbitron'] text-3xl font-bold text-white">
          Shopping Cart
        </h1>
        <Button variant="ghost" onClick={clearCart} className="text-gray-400">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="glass rounded-2xl p-4 flex gap-4 animate-fade-in"
            >
              {/* Product Image */}
              <Link
                to={`/product/${item.product.id}`}
                className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white rounded-xl p-2 overflow-hidden"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-full h-full object-contain"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product.id}`}
                  className="font-semibold text-white hover:text-neon-cyan transition-colors line-clamp-2"
                >
                  {item.product.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.product.category}</p>
                <p className="text-lg font-bold text-neon-cyan mt-2">
                  ${item.product.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    aria-label={`Remove ${item.product.title} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Item Total */}
              <div className="hidden sm:flex flex-col items-end justify-center">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="font-['Orbitron'] text-xl font-bold text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-neon-cyan">Free</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span className="text-white">${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-glass-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-neon-cyan">
                  ${(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link
              to="/"
              className="block text-center text-gray-400 hover:text-neon-cyan transition-colors mt-4 text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
