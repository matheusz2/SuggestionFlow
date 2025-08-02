import React from 'react';
import { Heart, Star, MessageCircle, Calendar, User, ThumbsUp } from 'lucide-react';
import type { Suggestion } from '../types';
import { likeSuggestion, toggleHighlight } from '../services/firebase';

interface ForumTopicProps {
  suggestion: Suggestion;
  onLike: (id: string) => void;
  onHighlight: (id: string) => void;
}

const ForumTopic: React.FC<ForumTopicProps> = ({ 
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
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-warning-100 text-warning-800';
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
    <div className={`bg-white border border-gray-200 rounded-lg p-6 mb-4 transition-all duration-300 hover:shadow-md ${
      suggestion.isHighlighted ? 'ring-2 ring-primary-500 bg-primary-50' : ''
    }`}>
      <div className="flex gap-4">
        {/* Left Side - Stats */}
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          {/* Like Count */}
          <div className="text-center">
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-200"
            >
              <ThumbsUp className="w-6 h-6" />
              <span className="text-lg font-bold">{suggestion.likes}</span>
              <span className="text-xs text-gray-500">likes</span>
            </button>
          </div>

          {/* Highlight Button */}
          <button
            onClick={handleHighlight}
            className={`p-2 rounded-full transition-colors duration-200 ${
              suggestion.isHighlighted
                ? 'text-primary-600 bg-primary-100 hover:bg-primary-200'
                : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
            }`}
            title={suggestion.isHighlighted ? 'Remover destaque' : 'Destacar sugestão'}
          >
            <Star className={`w-5 h-5 ${suggestion.isHighlighted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {suggestion.title}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{suggestion.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(suggestion.createdAt)}</span>
                </div>
                {suggestion.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {suggestion.category}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(suggestion.status)}`}>
              {getStatusText(suggestion.status)}
            </span>
          </div>

          {/* Description */}
          <div className="text-gray-700 mb-4 leading-relaxed">
            {suggestion.description}
          </div>

          {/* Tags */}
          {suggestion.tags && suggestion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestion.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Curtir</span>
              </button>

              {/* Comment Button (placeholder) */}
              <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Comentar</span>
              </button>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-gray-500">
              Atualizado em {formatDate(suggestion.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumTopic; 