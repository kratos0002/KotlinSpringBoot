import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCity } from '@/hooks/use-city.tsx';
import { Lightbulb, Search, CheckCircle, Dog, Cat, Fish, Bird, ThumbsUp, Heart, User, Calendar, Map, Star, Bell, MessageCircle, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define the structure of a feature
interface Feature {
  id: number;
  name: string;
  description: string;
  icon: string;
  votes: number;
  voted: boolean;
  category: string;
}

const FeatureVoting = () => {
  const { city } = useCity();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeature, setNewFeature] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('popular'); // 'popular' or 'newest'
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [voted, setVoted] = useState(false);
  
  // Fix the useInView hook to properly get ref and inView
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/features');
        if (!response.ok) {
          throw new Error('Failed to fetch features');
        }
        const data = await response.json();
        setFeatures(data.map((feature: any) => ({
          ...feature,
          voted: false // Initialize voted state
        })));
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleUpvote = async (id: number) => {
    try {
      const response = await fetch(`/api/features/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to record vote');
      }

      const updatedFeature = await response.json();
      
      const updatedFeatures = features.map(feature =>
        feature.id === id ? { ...feature, votes: updatedFeature.votes, voted: true } : feature
      );
      setFeatures(updatedFeatures);
      
      // Show toast notification (fallback to alert)
      alert("Vote recorded! Thanks for helping us prioritize our roadmap.");
      setVoted(true);
    } catch (error) {
      console.error('Error recording vote:', error);
      alert('Failed to record your vote. Please try again.');
    }
  };

  const handleNewFeature = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newFeature.trim() === '') return;
    
    // Add new feature to the list
    const newFeatureObject = {
      id: features.length + 1,
      name: newFeature,
      description: "User suggested feature",
      icon: "Lightbulb",
      votes: 1,
      voted: true,
      category: "custom"
    };
    
    setFeatures([...features, newFeatureObject]);
    setNewFeature('');
    
    // Show toast notification (fallback to alert)
    alert("Feature suggested! Thanks for your suggestion! Other users can now vote on it.");
    
    setIsAddingFeature(false);
  };

  // Filter features based on search term and category
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    if (sortOrder === 'popular') {
      return b.votes - a.votes;
    } else {
      return b.id - a.id;
    }
  });

  const toggleAddingFeature = () => {
    setIsAddingFeature(!isAddingFeature);
  };

  // Define accent colors based on city
  const accentClass = cn(
    city === 'Amsterdam' && 'text-amsterdam',
    city === 'Dublin' && 'text-dublin',
    city === 'Calgary' && 'text-calgary',
    !city && 'text-primary'
  );
  
  const accentBgClass = cn(
    city === 'Amsterdam' && 'bg-amsterdam',
    city === 'Dublin' && 'bg-dublin',
    city === 'Calgary' && 'bg-calgary',
    !city && 'bg-primary'
  );

  // Get icon component based on name
  const getIconComponent = (iconName: string, className: string) => {
    const iconMap = {
      "Mobile": Zap,
      "User": User,
      "Percent": Star,
      "Heart": Heart,
      "Activity": MessageCircle,
      "Bell": Bell,
      "Map": Map,
      "Home": Calendar,
      "Graduation": Lightbulb,
      "Lightbulb": Lightbulb
    };
    
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Lightbulb;
    return <IconComponent className={className} />;
  };

  // Get random pet icon for decorative elements
  const getRandomPetIcon = (size: number, className: string) => {
    const icons = [Dog, Cat, Bird, Fish];
    const RandomIcon = icons[Math.floor(Math.random() * icons.length)];
    return <RandomIcon className={`w-${size} h-${size} ${className}`} />;
  };

  // Categories for tabs
  const categories = [
    { id: 'all', name: 'All Features', icon: Star },
    { id: 'community', name: 'Community', icon: Heart },
    { id: 'profile', name: 'Profiles', icon: User },
    { id: 'health', name: 'Pet Health', icon: MessageCircle },
    { id: 'services', name: 'Services', icon: Calendar },
    { id: 'safety', name: 'Safety', icon: Bell },
    { id: 'platform', name: 'Platform', icon: Zap },
    { id: 'education', name: 'Education', icon: Lightbulb },
    { id: 'custom', name: 'Your Ideas', icon: Lightbulb }
  ];

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden" aria-labelledby="feature-voting-title" id="feature-voting">
      {/* Decorative pet silhouettes */}
      <div className="absolute top-0 right-0 opacity-5 transform rotate-12">
        <Cat className="w-48 h-48" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-5 transform -rotate-12">
        <Dog className="w-56 h-56" />
      </div>
      
      {/* Background pattern with paw prints */}
      <div className="absolute inset-0 opacity-5">
        <div className="relative w-full h-full">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {getRandomPetIcon(8, "opacity-20")}
            </div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 
            id="feature-voting-title"
            className="text-3xl font-bold mb-4 relative inline-block font-heading"
          >
            Vote on Future Features
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary"></div>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Help us shape the future of PawConnect by voting on features that matter most to you and your pets
          </p>
        </motion.div>
        
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search box */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search features..."
              className="pl-10 bg-white border border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Sort and Suggest */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-500 whitespace-nowrap">Sort by:</label>
              <select
                id="sort"
                className="text-sm border border-gray-200 rounded-md px-2 py-1"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="popular">Most Voted</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            <Button
              onClick={toggleAddingFeature}
              className="bg-primary text-white hover:bg-primary/90 gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Suggest a Feature
            </Button>
          </div>
        </motion.div>
        
        {/* Feature suggestion form */}
        {isAddingFeature && (
          <motion.div
            className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Suggest a New Feature</h3>
            <form onSubmit={handleNewFeature} className="flex gap-4">
              <Input
                type="text"
                placeholder="Your feature idea..."
                className="flex-1"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="whitespace-nowrap bg-primary text-white hover:bg-primary/90"
              >
                Add Suggestion
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={toggleAddingFeature}
              >
                Cancel
              </Button>
            </form>
          </motion.div>
        )}
        
        {/* Category tabs */}
        <Tabs
          defaultValue="all"
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="bg-gray-100 p-1 overflow-auto max-w-full flex snap-x scrollbar-hide">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Features list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <div className="col-span-3 text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
              <h3 className="text-xl font-medium text-gray-700 mt-4">Loading features...</h3>
            </div>
          ) : sortedFeatures.length > 0 ? (
            sortedFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-full ${accentBgClass} bg-opacity-10 text-primary`}>
                          {getIconComponent(feature.icon, "h-5 w-5")}
                        </div>
                        <h3 className="font-medium text-lg">{feature.name}</h3>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm font-medium mr-2">
                          {feature.votes}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-sm">
                      {feature.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {feature.category.charAt(0).toUpperCase() + feature.category.slice(1)}
                      </span>
                      
                      <Button
                        size="sm"
                        variant={feature.voted ? "outline" : "default"}
                        onClick={() => handleUpvote(feature.id)}
                        disabled={feature.voted}
                        className={`${feature.voted ? 'border-green-500 text-green-500' : 'bg-primary text-white hover:bg-primary/90'} gap-2`}
                      >
                        {feature.voted ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Voted
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="h-4 w-4" />
                            Upvote
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
              <Lightbulb className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No features found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Try a different search term or category" 
                  : "Be the first to suggest a feature!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeatureVoting; 