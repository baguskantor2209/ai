import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface PortfolioViewportContextType {
  isMobile: boolean;
  isTablet: boolean;
  mode: ViewportMode;
}

const PortfolioViewportContext = createContext<PortfolioViewportContextType | null>(null);

export const PortfolioViewportProvider: React.FC<{
  mode?: ViewportMode;
  children: React.ReactNode;
}> = ({ mode = 'desktop', children }) => {
  const [windowWidth, setWindowWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  useEffect(() => {
    const check = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isMobile = mode === 'mobile' || (mode === 'desktop' && windowWidth < 768);
  const isTablet = mode === 'tablet' || (mode === 'desktop' && windowWidth >= 768 && windowWidth < 1024);

  return (
    <PortfolioViewportContext.Provider value={{ isMobile, isTablet, mode }}>
      {children}
    </PortfolioViewportContext.Provider>
  );
};

export const usePortfolioViewport = (): PortfolioViewportContextType => {
  const context = useContext(PortfolioViewportContext);
  const [fallbackWidth, setFallbackWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    return 1200;
  });

  useEffect(() => {
    if (context) return;
    const check = () => setFallbackWidth(window.innerWidth);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [context]);

  if (context) {
    return context;
  }

  const isMobile = fallbackWidth < 768;
  const isTablet = fallbackWidth >= 768 && fallbackWidth < 1024;
  const mode: ViewportMode = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  return {
    isMobile,
    isTablet,
    mode,
  };
};
