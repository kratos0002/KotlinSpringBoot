import React, { useState, useEffect } from 'react';
import { useCity } from '@/context/CityContext';
import { cn } from '@/lib/utils';
import { Search, X, ArrowLeft, BookOpen, TrendingUp, ListCheck, DatabaseZap } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import InfoCard from '@/components/hub/InfoCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { mockArticles } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const InfoHub = () => {
  const { city } = useCity();
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredArticles, setFilteredArticles] = useState(mockArticles);
  const [contentView, setContentView] = useState<'all' | 'trending' | 'local' | 'saved'>('all');
  const [isPersonalized, setIsPersonalized] = useState(false);

  // Extract unique categories
  const categories = Array.from(new Set(mockArticles.map(article => article.category)));

  // Define trending articles based on a popularity metric
  const trendingArticles = [...mockArticles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  // Define recommended articles based on user preferences (mock data)
  const recommendedArticles = [...mockArticles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Define local articles
  const localArticles = city 
    ? mockArticles.filter(article => article.city === city)
    : mockArticles;

  // Define saved articles (mock data)
  const savedArticles = [...mockArticles]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  // Frequently asked questions (mock data)
  const faqs = [
    { 
      question: "What vaccinations does my pet need?",
      answer: "Core vaccines for dogs include rabies, distemper, parvovirus, and adenovirus. For cats, core vaccines include rabies, feline viral rhinotracheitis, calicivirus, and panleukopenia. Consult with your veterinarian for a personalized vaccination schedule."
    },
    { 
      question: "How often should I take my pet to the vet?",
      answer: "Most healthy adult pets should see a veterinarian once a year for a check-up. Puppies and kittens need more frequent visits for vaccines, while senior pets (over 7 years old) benefit from twice-yearly check-ups. Always consult with your vet for personalized advice."
    },
    { 
      question: "What pet insurance options are available in my area?",
      answer: "Pet insurance options vary by location. Common providers include Healthy Paws, Trupanion, ASPCA Pet Health Insurance, and Nationwide. Coverage typically includes accidents, illnesses, and sometimes wellness care. Compare plans based on premium costs, deductibles, and coverage limits."
    },
    { 
      question: "How can I find pet-friendly housing?",
      answer: "Look for pet-friendly filters on housing websites, work with a pet-friendly realtor, consider negotiating with landlords by providing pet references or paying an additional deposit, and check local pet-friendly housing resources or Facebook groups specific to your area."
    }
  ];

  // Filter articles based on city, search query, and category
  useEffect(() => {
    let filtered = mockArticles;
    
    // Apply content view filter
    if (contentView === 'trending') {
      filtered = [...trendingArticles];
    } else if (contentView === 'local' && city) {
      filtered = filtered.filter(article => article.city === city);
    } else if (contentView === 'saved') {
      filtered = [...savedArticles];
    }
    
    // Filter by city if personalized
    if (isPersonalized && city) {
      filtered = filtered.filter(article => article.city === city);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    setFilteredArticles(filtered);
  }, [city, searchQuery, selectedCategory, contentView, isPersonalized, trendingArticles, savedArticles]);

  // Handle article selection
  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setContentView('all');
  };

  // Toggle personalization
  const togglePersonalization = () => {
    setIsPersonalized(!isPersonalized);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8 mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {selectedArticle ? (
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center text-muted-foreground hover:text-foreground mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Back to articles
              </button>
              
              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <div 
                    className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full text-white",
                      city === 'amsterdam' && 'bg-amsterdam',
                      city === 'dublin' && 'bg-dublin',
                      city === 'calgary' && 'bg-calgary',
                      !city && 'bg-primary'
                    )}
                  >
                    {selectedArticle.category}
                  </div>
                  {selectedArticle.trending && (
                    <div className="ml-2 flex items-center text-amber-500 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </div>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{selectedArticle.title}</h1>
                <p className="text-lg text-muted-foreground">{selectedArticle.excerpt}</p>
              </div>
              
              {/* Article Image */}
              <div className="rounded-xl overflow-hidden mb-8 shadow-md">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line">{selectedArticle.content}</p>
              </div>
              
              {/* Related Articles */}
              <div className="mt-10 pt-8 border-t border-border">
                <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockArticles
                    .filter(article => 
                      article.id !== selectedArticle.id && 
                      (article.category === selectedArticle.category || 
                       article.tags.some(tag => selectedArticle.tags.includes(tag)))
                    )
                    .slice(0, 2)
                    .map(article => (
                      <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleArticleClick(article)}>
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-lg">{article.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{article.excerpt}</p>
                        </CardContent>
                      </Card>
                    ))
                  }
                </div>
              </div>
              
              {/* Tags */}
              <div className="mt-8 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className={cn(
                        "px-2 py-1 rounded text-xs",
                        city === 'amsterdam' && 'bg-amsterdam/10',
                        city === 'dublin' && 'bg-dublin/10',
                        city === 'calgary' && 'bg-calgary/10',
                        !city && 'bg-primary/10'
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Information Hub</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Essential resources, trending topics, and personalized guides for pet owners in {city ? city.charAt(0).toUpperCase() + city.slice(1) : 'your city'}.
                </p>
              </div>
              
              {/* Featured Banner */}
              <div className="mb-8">
                <Card className={cn(
                  "overflow-hidden border-0 shadow-lg",
                  city === 'amsterdam' ? 'bg-gradient-to-r from-amber-100 to-amber-50' : 
                  city === 'dublin' ? 'bg-gradient-to-r from-emerald-100 to-emerald-50' : 
                  city === 'calgary' ? 'bg-gradient-to-r from-amber-100 to-amber-50' : 
                  'bg-gradient-to-r from-orange-100 to-orange-50'
                )}>
                  <div className="grid md:grid-cols-2">
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pet Health & Wellness</h2>
                      <p className="text-muted-foreground mb-6">
                        Explore our latest collection of expert advice, trending topics, and essential resources for keeping your pets healthy and happy.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <AnimatedButton 
                          onClick={() => {
                            setContentView('trending');
                            window.scrollTo({
                              top: document.getElementById('content-section')?.offsetTop,
                              behavior: 'smooth'
                            });
                          }}
                          hoverEffect="scale"
                          className={cn(
                            city === 'amsterdam' && 'bg-amsterdam hover:bg-amsterdam/90',
                            city === 'dublin' && 'bg-dublin hover:bg-dublin/90',
                            city === 'calgary' && 'bg-calgary hover:bg-calgary/90',
                            !city && 'bg-primary hover:bg-primary/90'
                          )}
                        >
                          Explore Trending Topics
                        </AnimatedButton>
                        <AnimatedButton 
                          onClick={togglePersonalization}
                          hoverEffect="scale"
                          variant="outline"
                          className="border-2 font-medium"
                        >
                          {isPersonalized ? "Show All Content" : "Show Personalized"}
                        </AnimatedButton>
                      </div>
                    </div>
                    <AspectRatio ratio={16/9} className="bg-muted">
                      <img 
                        src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=1000" 
                        alt="Pets" 
                        className="object-cover rounded-r-lg"
                      />
                    </AspectRatio>
                  </div>
                </Card>
              </div>
              
              {/* Search and Filter */}
              <div className="mb-8">
                <div className="rounded-xl border shadow-sm bg-card p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        placeholder="Search for articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                          onClick={() => setSearchQuery('')}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            selectedCategory === category 
                              ? cn(
                                  'text-white',
                                  city === 'amsterdam' && 'bg-amsterdam',
                                  city === 'dublin' && 'bg-dublin',
                                  city === 'calgary' && 'bg-calgary',
                                  !city && 'bg-primary'
                                )
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          )}
                          onClick={() => {
                            if (selectedCategory === category) {
                              setSelectedCategory(null);
                            } else {
                              setSelectedCategory(category);
                            }
                          }}
                        >
                          {category}
                        </button>
                      ))}
                      
                      {(selectedCategory || searchQuery || contentView !== 'all' || isPersonalized) && (
                        <button
                          className="px-3 py-1.5 rounded-md border border-input text-sm font-medium flex items-center hover:bg-muted transition-colors"
                          onClick={clearFilters}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content Tabs */}
              <div id="content-section" className="mb-8">
                <Tabs 
                  defaultValue="articles" 
                  className="w-full"
                >
                  <TabsList className="mb-4 bg-transparent space-x-1 w-full flex flex-wrap">
                    <TabsTrigger 
                      value="articles"
                      className={cn(
                        "px-4 py-2 text-base data-[state=active]:shadow-none data-[state=active]:text-foreground",
                        "data-[state=active]:border-b-2",
                        city === 'amsterdam' && 'data-[state=active]:border-amsterdam',
                        city === 'dublin' && 'data-[state=active]:border-dublin',
                        city === 'calgary' && 'data-[state=active]:border-calgary',
                        !city && 'data-[state=active]:border-primary'
                      )}
                    >
                      <ListCheck className="w-4 h-4 mr-2" />
                      Articles
                    </TabsTrigger>
                    <TabsTrigger 
                      value="trending"
                      className={cn(
                        "px-4 py-2 text-base data-[state=active]:shadow-none data-[state=active]:text-foreground",
                        "data-[state=active]:border-b-2",
                        city === 'amsterdam' && 'data-[state=active]:border-amsterdam',
                        city === 'dublin' && 'data-[state=active]:border-dublin',
                        city === 'calgary' && 'data-[state=active]:border-calgary',
                        !city && 'data-[state=active]:border-primary'
                      )}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending
                    </TabsTrigger>
                    <TabsTrigger 
                      value="recommendations"
                      className={cn(
                        "px-4 py-2 text-base data-[state=active]:shadow-none data-[state=active]:text-foreground",
                        "data-[state=active]:border-b-2",
                        city === 'amsterdam' && 'data-[state=active]:border-amsterdam',
                        city === 'dublin' && 'data-[state=active]:border-dublin',
                        city === 'calgary' && 'data-[state=active]:border-calgary',
                        !city && 'data-[state=active]:border-primary'
                      )}
                    >
                      <DatabaseZap className="w-4 h-4 mr-2" />
                      For You
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="articles" className="mt-6">
                    {/* View Filters */}
                    <div className="flex mb-6 overflow-x-auto space-x-2 pb-2">
                      <button
                        onClick={() => setContentView('all')}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                          contentView === 'all'
                            ? cn(
                                'text-white',
                                city === 'amsterdam' && 'bg-amsterdam',
                                city === 'dublin' && 'bg-dublin',
                                city === 'calgary' && 'bg-calgary',
                                !city && 'bg-primary'
                              )
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        All Articles
                      </button>
                      <button
                        onClick={() => setContentView('trending')}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center",
                          contentView === 'trending'
                            ? cn(
                                'text-white',
                                city === 'amsterdam' && 'bg-amsterdam',
                                city === 'dublin' && 'bg-dublin',
                                city === 'calgary' && 'bg-calgary',
                                !city && 'bg-primary'
                              )
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </button>
                      <button
                        onClick={() => setContentView('local')}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                          contentView === 'local'
                            ? cn(
                                'text-white',
                                city === 'amsterdam' && 'bg-amsterdam',
                                city === 'dublin' && 'bg-dublin',
                                city === 'calgary' && 'bg-calgary',
                                !city && 'bg-primary'
                              )
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        Local Resources
                      </button>
                      <button
                        onClick={() => setContentView('saved')}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                          contentView === 'saved'
                            ? cn(
                                'text-white',
                                city === 'amsterdam' && 'bg-amsterdam',
                                city === 'dublin' && 'bg-dublin',
                                city === 'calgary' && 'bg-calgary',
                                !city && 'bg-primary'
                              )
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        Saved
                      </button>
                    </div>
                    
                    {/* Articles Grid */}
                    {filteredArticles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map(article => (
                          <InfoCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            city={article.city}
                            category={article.category}
                            image={article.image}
                            excerpt={article.excerpt}
                            content={article.content}
                            date={article.date}
                            tags={article.tags}
                            icon={article.icon}
                            onClick={() => handleArticleClick(article)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-1">No articles found</h3>
                        <p className="text-muted-foreground mb-4">
                          Try adjusting your search filters or browse all categories.
                        </p>
                        <AnimatedButton 
                          onClick={clearFilters}
                          hoverEffect="scale"
                        >
                          Clear All Filters
                        </AnimatedButton>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="trending" className="mt-6">
                    {/* Trending Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trendingArticles.map((article) => (
                        <InfoCard
                          key={article.id}
                          id={article.id}
                          title={article.title}
                          city={article.city}
                          category={article.category}
                          image={article.image}
                          excerpt={article.excerpt}
                          content={article.content}
                          date={article.date}
                          tags={article.tags}
                          icon={article.icon}
                          onClick={() => handleArticleClick(article)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="mt-6">
                    <h3 className="text-xl font-bold mb-4">Recommended For You</h3>
                    {/* Recommendations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {recommendedArticles.map((article) => (
                        <InfoCard
                          key={article.id}
                          id={article.id}
                          title={article.title}
                          city={article.city}
                          category={article.category}
                          image={article.image}
                          excerpt={article.excerpt}
                          content={article.content}
                          date={article.date}
                          tags={article.tags}
                          icon={article.icon}
                          onClick={() => handleArticleClick(article)}
                        />
                      ))}
                    </div>
                    
                    {/* FAQs Section */}
                    <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                    <div className="bg-muted/30 rounded-xl p-6 mb-8">
                      <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`faq-${index}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InfoHub;
