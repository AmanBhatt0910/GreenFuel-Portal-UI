/**
 * Utility functions for scrolling
 */

/**
 * Scrolls the window to the top with a smooth animation
 * @param options Configuration options
 */
export const scrollToTop = (options?: {
  behavior?: ScrollBehavior;
  delay?: number;
  position?: number;
}) => {
  const { behavior = 'smooth', delay = 0, position = 0 } = options || {};
  
  if (typeof window === 'undefined') return;
  
  if (delay > 0) {
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: position,
        left: 0,
        behavior,
      });
    }, delay);
    
    return () => clearTimeout(timeout);
  } else {
    window.scrollTo({
      top: position,
      left: 0,
      behavior,
    });
  }
};

/**
 * Hook to scroll to top when component mounts
 */
export const useScrollToTop = (options?: {
  behavior?: ScrollBehavior;
  delay?: number;
  position?: number;
}) => {
  if (typeof window === 'undefined') return;
  
  const { behavior = 'smooth', delay = 0, position = 0 } = options || {};
  
  // Force scroll to top on page load
  if (delay > 0) {
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: position,
        left: 0,
        behavior,
      });
    }, delay);
    
    return () => clearTimeout(timeout);
  } else {
    window.scrollTo({
      top: position,
      left: 0,
      behavior,
    });
  }
};