// Utilitário para gerenciar o ID do usuário
class UserManager {
  private userId: string | null = null;

  // Obter ou criar ID do usuário
  getUserId(): string {
    if (!this.userId) {
      // Tentar recuperar do localStorage
      const storedUserId = localStorage.getItem('suggestionflow_user_id');
      
      if (storedUserId) {
        this.userId = storedUserId;
      } else {
        // Criar novo ID
        this.userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('suggestionflow_user_id', this.userId);
      }
    }
    
    return this.userId;
  }

  // Verificar se o usuário deu like em uma sugestão
  hasLiked(suggestion: { likedBy?: string[] }): boolean {
    if (!suggestion.likedBy || suggestion.likedBy.length === 0) {
      return false;
    }
    
    return suggestion.likedBy.includes(this.getUserId());
  }

  // Limpar ID do usuário (para logout)
  clearUserId(): void {
    this.userId = null;
    localStorage.removeItem('suggestionflow_user_id');
  }
}

// Instância singleton
export const userManager = new UserManager();

// Função helper para verificar se o usuário atual deu like
export const hasUserLiked = (suggestion: { likedBy?: string[] }): boolean => {
  return userManager.hasLiked(suggestion);
};

// Função helper para obter ID do usuário
export const getCurrentUserId = (): string => {
  return userManager.getUserId();
}; 