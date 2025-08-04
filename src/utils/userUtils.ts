// Utility to manage user ID
class UserManager {
  private userId: string | null = null;

  // Get or create user ID
  getUserId(): string {
    if (!this.userId) {
      // Try to recover from localStorage
      const storedUserId = localStorage.getItem('SuggestionFlow_user_id');
      
      if (storedUserId) {
        this.userId = storedUserId;
      } else {
        // Create new ID
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('SuggestionFlow_user_id', this.userId);
      }
    }
    
    return this.userId;
  }

  // Check if user liked a suggestion
  hasLiked(suggestion: { likedBy?: string[] }): boolean {
    if (!suggestion.likedBy || suggestion.likedBy.length === 0) {
      return false;
    }
    
    return suggestion.likedBy.includes(this.getUserId());
  }

  // Clear user ID (for logout)
  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem('SuggestionFlow_user_id');
  }
}

// Singleton instance
export const userManager = new UserManager();

// Helper function to check if current user liked
export const hasUserLiked = (suggestion: { likedBy?: string[] }): boolean => {
  return userManager.hasLiked(suggestion);
};

// Helper function to get user ID
export const getCurrentUserId = (): string => {
  return userManager.getUserId();
}; 