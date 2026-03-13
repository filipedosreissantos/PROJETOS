import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Package, Shield, Truck } from 'lucide-react';
import type { Product } from '../types';
import { fetchProduct } from '../services/api';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { ProductDetailsSkeleton } from '../components/ui/Skeleton';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchProduct(parseInt(id));
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <h2 className="text-2xl font-semibold text-white mb-4">Product not found</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="glass rounded-3xl p-8 lg:p-12">
          <div className="relative aspect-square bg-white rounded-2xl p-8 overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5 pointer-events-none" />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category */}
          <p className="text-neon-cyan text-sm uppercase tracking-wider font-medium">
            {product.category}
          </p>

          {/* Title */}
          <h1 className="font-['Orbitron'] text-3xl lg:text-4xl font-bold text-white">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating.rate)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="py-4 border-y border-glass-border">
            <p className="text-4xl font-bold">
              <span className="text-neon-cyan">$</span>
              <span className="text-white">{product.price.toFixed(2)}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-300 font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center text-lg font-medium">{quantity}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="flex items-center gap-3 p-4 glass rounded-xl">
              <Truck className="w-6 h-6 text-neon-cyan" />
              <div>
                <p className="text-sm font-medium text-white">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass rounded-xl">
              <Shield className="w-6 h-6 text-neon-purple" />
              <div>
                <p className="text-sm font-medium text-white">Warranty</p>
                <p className="text-xs text-gray-500">2 years coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass rounded-xl">
              <Package className="w-6 h-6 text-neon-pink" />
              <div>
                <p className="text-sm font-medium text-white">Easy Returns</p>
                <p className="text-xs text-gray-500">30 days return</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
