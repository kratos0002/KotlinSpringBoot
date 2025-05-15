import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DirectorySearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  rating?: number;
  priceRange?: string;
  services?: string[];
  availability?: string[];
}

const DirectorySearch: React.FC<DirectorySearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    rating: undefined,
    priceRange: undefined,
    services: [],
    availability: []
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, query: e.target.value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleFilterChange = (type: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      query: '',
      rating: undefined,
      priceRange: undefined,
      services: [],
      availability: []
    };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const hasActiveFilters = () => {
    return filters.rating || filters.priceRange || 
           (filters.services && filters.services.length > 0) || 
           (filters.availability && filters.availability.length > 0);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for pet services..."
            className="w-full rounded-md border border-input pl-9 pr-4 py-2 text-sm"
            value={filters.query}
            onChange={handleInputChange}
          />
          {filters.query && (
            <button
              onClick={() => handleFilterChange('query', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center space-x-2 text-sm",
              showFilters && "text-primary"
            )}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid gap-4 pt-4 border-t">
            {/* Rating Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('rating', rating)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-sm",
                      filters.rating === rating
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {rating}★
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Price Range</label>
              <div className="flex space-x-2">
                {['$', '$$', '$$$'].map((price) => (
                  <button
                    key={price}
                    onClick={() => handleFilterChange('priceRange', price)}
                    className={cn(
                      "px-3 py-1 rounded-md text-sm",
                      filters.priceRange === price
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap gap-2 pt-2">
                {filters.rating && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filters.rating}★
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('rating', undefined)}
                    />
                  </Badge>
                )}
                {filters.priceRange && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filters.priceRange}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange('priceRange', undefined)}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DirectorySearch; 