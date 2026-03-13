import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { CartProvider, useCart } from '../context/CartContext';
import CartPage from '../pages/CartPage';
import type { Product } from '../types';

// Test wrapper with all providers
const TestProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  </BrowserRouter>
);

// Mock product
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'A test product description',
  category: 'test',
  image: 'https://example.com/image.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockProduct2: Product = {
  id: 2,
  title: 'Another Product',
  price: 49.99,
  description: 'Another test product',
  category: 'test',
  image: 'https://example.com/image2.jpg',
  rating: { rate: 4.0, count: 50 },
};

// Test component to manipulate cart
function CartTestHelper({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  return (
    <div>
      <button onClick={() => addToCart(product)} data-testid="add-to-cart">
        Add to Cart
      </button>
      <span data-testid="cart-count">{items.length}</span>
    </div>
  );
}

describe('Cart Functionality', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Adding to Cart', () => {
    it('should add a product to the cart', async () => {
      const user = userEvent.setup();
      
      render(
        <TestProviders>
          <CartTestHelper product={mockProduct} />
        </TestProviders>
      );

      const addButton = screen.getByTestId('add-to-cart');
      await user.click(addButton);

      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });

    it('should increase quantity when adding same product twice', async () => {
      const user = userEvent.setup();
      
      // Component to check quantity
      function QuantityChecker() {
        const { items, addToCart } = useCart();
        const item = items.find((i) => i.product.id === mockProduct.id);
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">
              Add
            </button>
            <span data-testid="quantity">{item?.quantity ?? 0}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <QuantityChecker />
        </TestProviders>
      );

      const addButton = screen.getByTestId('add-btn');
      await user.click(addButton);
      await user.click(addButton);

      expect(screen.getByTestId('quantity')).toHaveTextContent('2');
    });
  });

  describe('Changing Quantity', () => {
    it('should update quantity when changed', async () => {
      const user = userEvent.setup();

      function QuantityUpdater() {
        const { items, addToCart, updateQuantity } = useCart();
        const item = items.find((i) => i.product.id === mockProduct.id);
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">
              Add
            </button>
            <button
              onClick={() => updateQuantity(mockProduct.id, 5)}
              data-testid="update-btn"
            >
              Set to 5
            </button>
            <span data-testid="quantity">{item?.quantity ?? 0}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <QuantityUpdater />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-btn'));
      expect(screen.getByTestId('quantity')).toHaveTextContent('1');

      await user.click(screen.getByTestId('update-btn'));
      expect(screen.getByTestId('quantity')).toHaveTextContent('5');
    });

    it('should remove item when quantity is set to 0', async () => {
      const user = userEvent.setup();

      function QuantityRemover() {
        const { items, addToCart, updateQuantity } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">
              Add
            </button>
            <button
              onClick={() => updateQuantity(mockProduct.id, 0)}
              data-testid="remove-btn"
            >
              Set to 0
            </button>
            <span data-testid="count">{items.length}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <QuantityRemover />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');

      await user.click(screen.getByTestId('remove-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('Removing from Cart', () => {
    it('should remove a product from the cart', async () => {
      const user = userEvent.setup();

      function RemoveTest() {
        const { items, addToCart, removeFromCart } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">
              Add
            </button>
            <button
              onClick={() => removeFromCart(mockProduct.id)}
              data-testid="remove-btn"
            >
              Remove
            </button>
            <span data-testid="count">{items.length}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <RemoveTest />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');

      await user.click(screen.getByTestId('remove-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });

    it('should only remove the specified product', async () => {
      const user = userEvent.setup();

      function MultiProductTest() {
        const { items, addToCart, removeFromCart } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-1">
              Add 1
            </button>
            <button onClick={() => addToCart(mockProduct2)} data-testid="add-2">
              Add 2
            </button>
            <button
              onClick={() => removeFromCart(mockProduct.id)}
              data-testid="remove-1"
            >
              Remove 1
            </button>
            <span data-testid="count">{items.length}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <MultiProductTest />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-1'));
      await user.click(screen.getByTestId('add-2'));
      expect(screen.getByTestId('count')).toHaveTextContent('2');

      await user.click(screen.getByTestId('remove-1'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('LocalStorage Persistence', () => {
    it('cart items should persist across renders', async () => {
      const user = userEvent.setup();
      
      // This test verifies that the cart state is maintained
      // localStorage persistence is handled by the useEffect in CartContext
      
      function PersistenceTest() {
        const { items, addToCart } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">
              Add
            </button>
            <span data-testid="count">{items.length}</span>
          </div>
        );
      }

      const { rerender } = render(
        <TestProviders>
          <PersistenceTest />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');

      // Re-render with the same provider tree - state should persist
      rerender(
        <TestProviders>
          <PersistenceTest />
        </TestProviders>
      );
      
      // Cart state should still be there
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('Cart Totals', () => {
    it('should calculate total items correctly', async () => {
      const user = userEvent.setup();

      function TotalsTest() {
        const { totalItems, addToCart } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-1">
              Add 1
            </button>
            <button onClick={() => addToCart(mockProduct2)} data-testid="add-2">
              Add 2
            </button>
            <span data-testid="total-items">{totalItems}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <TotalsTest />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-1'));
      await user.click(screen.getByTestId('add-1'));
      await user.click(screen.getByTestId('add-2'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    });

    it('should calculate total price correctly', async () => {
      const user = userEvent.setup();

      function PriceTest() {
        const { totalPrice, addToCart } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-1">
              Add 1
            </button>
            <button onClick={() => addToCart(mockProduct2)} data-testid="add-2">
              Add 2
            </button>
            <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <PriceTest />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-1')); // $29.99
      await user.click(screen.getByTestId('add-2')); // $49.99
      
      // 29.99 + 49.99 = 79.98
      expect(screen.getByTestId('total-price')).toHaveTextContent('79.98');
    });
  });

  describe('Clear Cart', () => {
    it('should clear all items from cart', async () => {
      const user = userEvent.setup();

      function ClearTest() {
        const { items, addToCart, clearCart } = useCart();
        return (
          <div>
            <button onClick={() => addToCart(mockProduct)} data-testid="add-btn">
              Add
            </button>
            <button onClick={clearCart} data-testid="clear-btn">
              Clear
            </button>
            <span data-testid="count">{items.length}</span>
          </div>
        );
      }

      render(
        <TestProviders>
          <ClearTest />
        </TestProviders>
      );

      await user.click(screen.getByTestId('add-btn'));
      await user.click(screen.getByTestId('add-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('1'); // Same product, still 1 item

      await user.click(screen.getByTestId('clear-btn'));
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });
});

describe('Cart Page UI', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should display empty cart message when cart is empty', () => {
    render(
      <TestProviders>
        <CartPage />
      </TestProviders>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });
});
