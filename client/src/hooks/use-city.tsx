import { createContext, useContext, ReactNode } from 'react';

interface CityContextType {
  city: string;
}

const CityContext = createContext<CityContextType>({ city: 'Amsterdam' });

export function CityProvider({ children }: { children: ReactNode }) {
  return (
    <CityContext.Provider value={{ city: 'Amsterdam' }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
} 