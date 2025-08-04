import { useState, useEffect } from 'react';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  xl: 1440
};

// Hook to detect screen size and device type
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setIsMobile(width < BREAKPOINTS.tablet);
      setIsTablet(width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop);
      setIsDesktop(width >= BREAKPOINTS.desktop);
    }

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for responsive values
  const getResponsiveValue = (mobile, tablet, desktop) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet || mobile;
    return desktop || tablet || mobile;
  };

  const getGridColumns = (mobileColumns = 1, tabletColumns = 2, desktopColumns = 3) => {
    return getResponsiveValue(mobileColumns, tabletColumns, desktopColumns);
  };

  // Touch device detection
  const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  };

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    getResponsiveValue,
    getGridColumns,
    isTouchDevice: isTouchDevice(),
    breakpoints: BREAKPOINTS
  };
};

// Responsive style helper
export const getResponsiveStyle = (isMobile, isTablet, styles) => {
  if (isMobile && styles.mobile) return styles.mobile;
  if (isTablet && styles.tablet) return styles.tablet;
  return styles.desktop || styles.default || {};
};

export default useResponsive;