import React, { createContext, useContext, useState, ReactNode } from 'react';

type City = 'amsterdam' | 'dublin' | 'calgary' | null;

interface CityContextType {
  city: City;
  setCity: (city: City) => void;
  cityColor: string;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City>(null);

  const cityColor = {
    amsterdam: '#FFA500',
    dublin: '#4CAF50',
    calgary: '#B91C1C',
  }[city || 'amsterdam'];

  return (
    <CityContext.Provider value={{ city, setCity, cityColor }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
} 