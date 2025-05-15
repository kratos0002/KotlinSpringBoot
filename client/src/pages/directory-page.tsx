import React, { useState, useEffect, useMemo } from 'react';
import { useCity } from '@/context/CityContext';
import { cn } from '@/lib/utils';
import { ListFilter, Map, Grid3X3, Store, MapPin, Filter, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ServiceCard from '@/components/directory/ServiceCard';
import DirectorySearch, { SearchFilters } from '@/components/directory/DirectorySearch';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { mockServiceProviders, serviceCategories } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 6;

const Directory = () => {
  const { city, cityColor } = useCity();
  const [view, setView] = useState<'list' | 'grid' | 'map' | 'table'>('list');
  const [filteredProviders, setFilteredProviders] = useState(mockServiceProviders);
  const [filters, setFilters] = useState({
    query: '',
    categories: [] as number[],
    sortBy: 'rating' as 'rating' | 'name' | 'newest',
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [mapView, setMapView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    rating: undefined as number | undefined,
    priceRange: undefined as string | undefined,
    services: [] as string[],
    availability: [] as string[]
  });
  const { toast } = useToast();

  // Get unique cities from service providers
  const availableCities = useMemo(() => {
    return Array.from(new Set(mockServiceProviders.map(provider => provider.city)));
  }, []);

  // Filter service providers based on city, tab and search criteria
  useEffect(() => {
    let filtered = mockServiceProviders;
    
    // Filter by city
    if (city) {
      filtered = filtered.filter(provider => provider.city === city);
    }
    
    // Filter by active tab (category)
    if (activeTab !== "all") {
      const categoryId = parseInt(activeTab);
      filtered = filtered.filter(provider => provider.category === categoryId);
    }
    
    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(query) || 
        provider.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(provider => 
        filters.categories.includes(provider.category)
      );
    }
    
    // Sort results
    switch(filters.sortBy) {
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // For demo purposes, we'll just reverse the array to simulate newest first
        filtered = [...filtered].reverse();
        break;
    }
    
    setFilteredProviders(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [city, filters, activeTab]);

  // Handle search and filter
  const handleSearch = (filters: SearchFilters) => {
    setSearchQuery(filters.query);
    setFilterOptions({
      rating: filters.rating,
      priceRange: filters.priceRange,
      services: filters.services || [],
      availability: filters.availability || []
    });
  };

  // Handle sorting change
  const handleSortChange = (value: 'rating' | 'name' | 'newest') => {
    setFilters({
      ...filters,
      sortBy: value,
    });
    toast({
      title: "Sorted by " + value,
      description: `Results are now sorted by ${value}`,
    });
  };

  // Get category name
  const getCategoryName = (categoryId: number) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // Get category icon
  const getCategoryIcon = (categoryId: number) => {
    const category = serviceCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : Store;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);
  const currentItems = filteredProviders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Generate pagination items
  const getPaginationItems = () => {
    let items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => setCurrentPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  const handleViewMap = () => {
    setMapView(true);
    toast({
      title: "Map view coming soon",
      description: "This feature is currently under development",
    });
  };

  // City color class for styling based on the selected city
  const cityAccentClass = cn(
    city === 'amsterdam' && 'text-amsterdam border-amsterdam',
    city === 'dublin' && 'text-dublin border-dublin', 
    city === 'calgary' && 'text-calgary border-calgary',
    !city && 'text-primary border-primary'
  );

  const cityBgClass = cn(
    city === 'amsterdam' && 'bg-amsterdam hover:bg-amsterdam-dark',
    city === 'dublin' && 'bg-dublin hover:bg-dublin-dark',
    city === 'calgary' && 'bg-calgary hover:bg-calgary-dark',
    !city && 'bg-primary hover:bg-primary/90'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-16 mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Local Pet Service Directory</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find trusted pet services in {city ? city.charAt(0).toUpperCase() + city.slice(1) : 'your city'}, from veterinarians to pet-friendly cafés.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8">
            <DirectorySearch onSearch={handleSearch} />
          </div>
          
          {/* Categories Tabs */}
          <div className="mb-6">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="mb-4 overflow-x-auto pb-2">
                <TabsList className="inline-flex min-w-full md:w-auto">
                  <TabsTrigger value="all" className="px-4">All Services</TabsTrigger>
                  {serviceCategories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id.toString()} className="px-4">
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
          
          {/* View Toggle, Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              Showing <span className="font-medium text-foreground">{filteredProviders.length}</span> service providers
              {city && <> in <span className="font-medium text-foreground">{city.charAt(0).toUpperCase() + city.slice(1)}</span></>}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              {/* Sort Options */}
              <div className="mr-2 text-sm text-muted-foreground">Sort by:</div>
              <ToggleGroup type="single" value={filters.sortBy} onValueChange={(value) => value && handleSortChange(value as any)}>
                <ToggleGroupItem value="rating">Highest Rated</ToggleGroupItem>
                <ToggleGroupItem value="name">Name</ToggleGroupItem>
                <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
              </ToggleGroup>
              
              {/* View Options */}
              <div className="flex items-center ml-4">
                <span className="text-sm text-muted-foreground mr-2">View:</span>
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={cn(
                      "px-3 py-1.5 flex items-center text-sm",
                      view === 'list' 
                        ? cn('bg-primary text-primary-foreground',
                            city === 'amsterdam' && 'bg-amsterdam',
                            city === 'dublin' && 'bg-dublin',
                            city === 'calgary' && 'bg-calgary',
                            !city && 'bg-primary'
                          )
                        : 'bg-card hover:bg-muted'
                    )}
                    onClick={() => setView('list')}
                  >
                    <ListFilter className="w-4 h-4 mr-1" />
                    List
                  </button>
                  <button
                    className={cn(
                      "px-3 py-1.5 flex items-center text-sm",
                      view === 'grid' 
                        ? cn('bg-primary text-primary-foreground',
                            city === 'amsterdam' && 'bg-amsterdam',
                            city === 'dublin' && 'bg-dublin',
                            city === 'calgary' && 'bg-calgary',
                            !city && 'bg-primary'
                          )
                        : 'bg-card hover:bg-muted'
                    )}
                    onClick={() => setView('grid')}
                  >
                    <Grid3X3 className="w-4 h-4 mr-1" />
                    Grid
                  </button>
                  <button
                    className={cn(
                      "px-3 py-1.5 flex items-center text-sm",
                      view === 'table' 
                        ? cn('bg-primary text-primary-foreground',
                            city === 'amsterdam' && 'bg-amsterdam',
                            city === 'dublin' && 'bg-dublin',
                            city === 'calgary' && 'bg-calgary',
                            !city && 'bg-primary'
                          )
                        : 'bg-card hover:bg-muted'
                    )}
                    onClick={() => setView('table')}
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Table
                  </button>
                </div>
                
                <button
                  className={cn(
                    "ml-2 px-3 py-1.5 border rounded-md flex items-center text-sm",
                    mapView ? cityBgClass + " text-white" : "bg-card hover:bg-muted"
                  )}
                  onClick={handleViewMap}
                >
                  <Map className="w-4 h-4 mr-1" />
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Map View Preview (placeholder) */}
          {mapView && (
            <div className="mb-6 rounded-xl overflow-hidden border shadow-md">
              <div className="bg-muted/20 p-8 flex flex-col items-center justify-center">
                <div className="w-full aspect-[16/9] bg-muted/30 rounded-lg border border-dashed flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Map View Coming Soon</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      We're working on an interactive map feature to help you find pet services near you.
                    </p>
                    <AnimatedButton 
                      onClick={() => setMapView(false)}
                      hoverEffect="scale"
                      className={cityBgClass}
                    >
                      Return to List View
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Service Provider Listings */}
          {!mapView && filteredProviders.length > 0 ? (
            <>
              {view === 'table' ? (
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map(provider => {
                          const CategoryIcon = getCategoryIcon(provider.category);
                          return (
                            <TableRow key={provider.id}>
                              <TableCell className="font-medium">{provider.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <CategoryIcon className="w-4 h-4 mr-2" />
                                  {getCategoryName(provider.category)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {provider.city.charAt(0).toUpperCase() + provider.city.slice(1)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {Array(5).fill(0).map((_, i) => (
                                    <svg 
                                      key={i} 
                                      className={`w-4 h-4 ${i < Math.floor(provider.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                  <span className="ml-1 text-sm">{provider.rating.toFixed(1)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{provider.phone}</TableCell>
                              <TableCell className="text-right">
                                <AnimatedButton 
                                  className={`${cityBgClass} px-2 py-1 text-xs`} 
                                  hoverEffect="scale"
                                >
                                  View Details
                                </AnimatedButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <div className={cn(
                  view === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                )}>
                  {currentItems.map(provider => (
                    <ServiceCard
                      key={provider.id}
                      id={provider.id}
                      name={provider.name}
                      category={provider.category}
                      categoryName={getCategoryName(provider.category)}
                      city={provider.city}
                      address={provider.address}
                      phone={provider.phone}
                      website={provider.website}
                      email={provider.email}
                      rating={provider.rating}
                      image={provider.image}
                      description={provider.description}
                      tags={provider.tags}
                      icon={getCategoryIcon(provider.category)}
                    />
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(1, prev - 1));
                        }} 
                      />
                    </PaginationItem>
                    
                    {getPaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        }} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : !mapView && (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">No service providers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters or browse all categories.
              </p>
              <AnimatedButton 
                onClick={() => {
                  setFilters({ query: '', categories: [], sortBy: 'rating' });
                  setActiveTab("all");
                }}
                hoverEffect="scale"
                className={cityBgClass}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Clear All Filters
              </AnimatedButton>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Directory; 