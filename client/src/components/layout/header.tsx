import React from 'react';
import { useCity } from '@/context/CityContext';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';

const Header = () => {
  const { city, setCity } = useCity();

  const cities = [
    { id: 'amsterdam', name: 'Amsterdam' },
    { id: 'dublin', name: 'Dublin' },
    { id: 'calgary', name: 'Calgary' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold">
              PawConnect
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/info-hub" className="text-sm font-medium hover:text-primary">
              Info Hub
            </a>
            <a href="/directory" className="text-sm font-medium hover:text-primary">
              Directory
            </a>
            <a href="/education" className="text-sm font-medium hover:text-primary">
              Education
            </a>
          </nav>

          {/* City Selection */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">City:</span>
            </div>
            <div className="flex items-center space-x-2">
              {cities.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCity(c.id as any)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full transition-colors',
                    city === c.id
                      ? cn(
                          'text-white',
                          c.id === 'amsterdam' && 'bg-amsterdam',
                          c.id === 'dublin' && 'bg-dublin',
                          c.id === 'calgary' && 'bg-calgary'
                        )
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
