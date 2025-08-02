import React from 'react';
import { Heart, Star, MessageCircle, Calendar, User } from 'lucide-react';
import type { Suggestion } from '../types';
import { likeSuggestion, toggleHighlight } from '../services/firebase';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onLike: (id: string) => void;
  onHighlight: (id: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  suggestion, 
  onLike, 
  onHighlight 
}) => {
  const handleLike = async () => {
    try {
      await likeSuggestion(suggestion.id, suggestion.likes);
      onLike(suggestion.id);
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  const handleHighlight = async () => {
    try {
      await toggleHighlight(suggestion.id, suggestion.isHighlighted);
      onHighlight(suggestion.id);
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-warning-100 text-warning-800 border-warning-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className={`card transition-all duration-300 hover:shadow-md ${
      suggestion.isHighlighted ? 'ring-2 ring-primary-500 bg-primary-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {suggestion.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{suggestion.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(suggestion.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(suggestion.status)}`}>
          {getStatusText(suggestion.status)}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-3">
        {suggestion.description}
      </p>

      {/* Tags */}
      {suggestion.tags && suggestion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestion.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{suggestion.likes}</span>
          </button>

          {/* Comment Button (placeholder) */}
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">0</span>
          </button>
        </div>

        {/* Highlight Button */}
        <button
          onClick={handleHighlight}
          className={`flex items-center gap-2 transition-colors duration-200 ${
            suggestion.isHighlighted
              ? 'text-primary-600 hover:text-primary-700'
              : 'text-gray-400 hover:text-primary-600'
          }`}
          title={suggestion.isHighlighted ? 'Remover destaque' : 'Destacar sugestão'}
        >
          <Star className={`w-5 h-5 ${suggestion.isHighlighted ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard; 