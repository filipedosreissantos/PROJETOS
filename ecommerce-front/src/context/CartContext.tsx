import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, CartContextType, Product } from '../types';
import { useToast } from './ToastContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'neon-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    const existingItem = items.find((item) => item.product.id === product.id);
    
    if (existingItem) {
      setItems((current) =>
        current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      setTimeout(() => addToast(`Increased quantity of "${product.title}"`, 'success'), 0);
    } else {
      setItems((current) => [...current, { product, quantity: 1 }]);
      setTimeout(() => addToast(`Added "${product.title}" to cart`, 'success'), 0);
    }
  };

  const removeFromCart = (productId: number) => {
    const item = items.find((i) => i.product.id === productId);
    setItems((current) => current.filter((item) => item.product.id !== productId));
    if (item) {
      setTimeout(() => addToast(`Removed "${item.product.title}" from cart`, 'info'), 0);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    addToast('Cart cleared', 'info');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
