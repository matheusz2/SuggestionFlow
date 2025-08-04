import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CommentContextType {
  isCommentModalOpen: boolean;
  currentSuggestionId: string | null;
  openCommentModal: (suggestionId: string) => void;
  closeCommentModal: () => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const useCommentModal = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useCommentModal must be used within a CommentProvider');
  }
  return context;
};

interface CommentProviderProps {
  children: ReactNode;
}

export const CommentProvider: React.FC<CommentProviderProps> = ({ children }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [currentSuggestionId, setCurrentSuggestionId] = useState<string | null>(null);

  const openCommentModal = (suggestionId: string) => {
    setCurrentSuggestionId(suggestionId);
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setCurrentSuggestionId(null);
  };

  return (
    <CommentContext.Provider
      value={{
        isCommentModalOpen,
        currentSuggestionId,
        openCommentModal,
        closeCommentModal,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}; 