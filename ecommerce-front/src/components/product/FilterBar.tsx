import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import type { FilterState, SortOption } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface FilterBarProps {
  filters: FilterState;
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A-Z' },
];

export function FilterBar({ filters, categories, onFilterChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as SortOption });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, minPrice: parseFloat(e.target.value) || 0 });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: parseFloat(e.target.value) || Infinity });
  };

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      minPrice: 0,
      maxPrice: Infinity,
      sortBy: 'default',
      search: '',
    });
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < Infinity ||
    filters.sortBy !== 'default' ||
    filters.search !== '';

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-12"
            aria-label="Search products"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div
          id="filter-panel"
          className="glass rounded-2xl p-4 animate-slide-up"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters.category}
              onChange={handleCategoryChange}
            />
            <Select
              label="Sort By"
              options={sortOptions}
              value={filters.sortBy}
              onChange={handleSortChange}
            />
            <Input
              label="Min Price"
              type="number"
              placeholder="0"
              min="0"
              value={filters.minPrice || ''}
              onChange={handleMinPriceChange}
            />
            <Input
              label="Max Price"
              type="number"
              placeholder="No limit"
              min="0"
              value={filters.maxPrice === Infinity ? '' : filters.maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="ml-1 hover:text-white"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-sm">
              {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
              <button
                onClick={() => onFilterChange({ ...filters, category: 'all' })}
                className="ml-1 hover:text-white"
                aria-label="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.minPrice > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink text-sm">
              Min: ${filters.minPrice}
              <button
                onClick={() => onFilterChange({ ...filters, minPrice: 0 })}
                className="ml-1 hover:text-white"
                aria-label="Remove minimum price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.maxPrice < Infinity && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink text-sm">
              Max: ${filters.maxPrice}
              <button
                onClick={() => onFilterChange({ ...filters, maxPrice: Infinity })}
                className="ml-1 hover:text-white"
                aria-label="Remove maximum price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
