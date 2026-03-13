import { useState } from 'react';
import { FilterBar } from '../components/product/FilterBar';
import { ProductGrid } from '../components/product/ProductGrid';
import { useProducts, useCategories, useFilteredProducts } from '../hooks/useProducts';
import type { FilterState } from '../types';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function CatalogPage() {
  const { products, loading, error } = useProducts();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    minPrice: 0,
    maxPrice: Infinity,
    sortBy: 'default',
    search: '',
  });

  const filteredProducts = useFilteredProducts(products, filters);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="font-['Orbitron'] text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-white">Discover the </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink neon-text">
            Future
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore our collection of cutting-edge products designed for tomorrow
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        categories={categories}
        onFilterChange={setFilters}
      />

      {/* Results Count */}
      {!loading && (
        <p className="text-gray-500 text-sm mb-6">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} loading={loading} />
    </div>
  );
}
