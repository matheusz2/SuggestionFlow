import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to prevent multiple rapid clicks on buttons
 * @param delay - Delay in milliseconds before allowing another click (default: 500ms)
 * @returns Object with loading state and debounced function wrapper
 */
export const useDebouncedClick = (delay: number = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(async (
    asyncFunction: () => Promise<void>
  ) => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log('Request already in progress, ignoring click');
      return;
    }

    setIsLoading(true);
    
    try {
      await asyncFunction();
    } catch (error) {
      console.error('Error in debounced function:', error);
    } finally {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Add a delay to prevent rapid successive clicks
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }
  }, [isLoading, delay]);

  return {
    isLoading,
    debouncedFunction
  };
};

/**
 * Custom hook for like button with specific Firebase protection
 * @returns Object with like loading state and debounced like function
 */
export const useLikeButton = () => {
  const { isLoading: isLikeLoading, debouncedFunction: debouncedLike } = useDebouncedClick(500);
  
  const handleLike = useCallback(async (
    likeFunction: () => Promise<void>
  ) => {
    await debouncedLike(likeFunction);
  }, [debouncedLike]);

  return {
    isLikeLoading,
    handleLike
  };
};

/**
 * Custom hook for highlight button with specific Firebase protection
 * @returns Object with highlight loading state and debounced highlight function
 */
export const useHighlightButton = () => {
  const { isLoading: isHighlightLoading, debouncedFunction: debouncedHighlight } = useDebouncedClick(500);
  
  const handleHighlight = useCallback(async (
    highlightFunction: () => Promise<void>
  ) => {
    await debouncedHighlight(highlightFunction);
  }, [debouncedHighlight]);

  return {
    isHighlightLoading,
    handleHighlight
  };
}; 