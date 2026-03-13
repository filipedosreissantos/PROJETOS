import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block glass rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,245,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
    >
      <div className="relative aspect-square bg-white p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-dark-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium">{product.rating.rate}</span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-neon-cyan uppercase tracking-wider font-medium">
            {product.category}
          </p>
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-neon-cyan transition-colors">
            {product.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <p className="text-xl font-bold text-white">
            <span className="text-neon-cyan">$</span>
            {product.price.toFixed(2)}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="p-2! rounded-full!"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
