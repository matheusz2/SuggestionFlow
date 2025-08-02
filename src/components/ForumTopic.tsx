import React from 'react';
import { Heart, Star, MessageCircle, Calendar, User, ThumbsUp } from 'lucide-react';
import type { Suggestion } from '../types';
import { likeSuggestion, toggleHighlight } from '../services/firebase';
import { hasUserLiked } from '../utils/userUtils';
import { useCommentModal } from '../contexts/CommentContext';

interface ForumTopicProps {
  suggestion: Suggestion;
  onLike: (id: string) => void;
  onHighlight: (id: string) => void;
}

const ForumTopic = React.memo<ForumTopicProps>(({ 
  suggestion, 
  onLike, 
  onHighlight 
}) => {
  const { openCommentModal } = useCommentModal();

  const handleLike = async () => {
    try {
      await likeSuggestion(suggestion.id, suggestion.likes, suggestion.likedBy);
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
    <div className={`bg-white border border-gray-200 rounded-lg p-6 mb-4 transition-all duration-500 ease-in-out hover:shadow-md transform hover:-translate-y-1 ${
      suggestion.isHighlighted 
        ? 'ring-2 ring-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg animate-pulse' 
        : 'hover:shadow-lg'
    }`}>
      <div className="flex gap-4">
        {/* Left Side - Stats */}
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          {/* Like Count */}
          <div className="text-center">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center gap-1 transition-all duration-300 transform hover:scale-110 ${
                hasUserLiked(suggestion)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-600 hover:text-red-500'
              }`}
              title={hasUserLiked(suggestion) ? 'Remover curtida' : 'Curtir esta sugestão'}
            >
              <ThumbsUp className={`w-6 h-6 transition-transform duration-200 hover:scale-125 ${
                hasUserLiked(suggestion) ? 'fill-current' : ''
              }`} />
              <span className="text-lg font-bold">{suggestion.likes}</span>
              <span className="text-xs text-gray-500">likes</span>
            </button>
          </div>

          {/* Highlight Button */}
          <button
            onClick={handleHighlight}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              suggestion.isHighlighted
                ? 'text-primary-600 bg-primary-100 hover:bg-primary-200'
                : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
            }`}
            title={suggestion.isHighlighted ? 'Remover destaque' : 'Destacar sugestão'}
          >
            <Star className={`w-5 h-5 transition-all duration-300 ${suggestion.isHighlighted ? 'fill-current animate-bounce' : 'hover:scale-125'}`} />
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
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs transition-colors duration-200 hover:bg-gray-200">
                    {suggestion.category}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <span className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${getStatusColor(suggestion.status)}`}>
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
                className={`flex items-center gap-2 transition-all duration-300 transform hover:scale-110 ${
                  hasUserLiked(suggestion)
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-600 hover:text-red-500'
                }`}
                title={hasUserLiked(suggestion) ? 'Remover curtida' : 'Curtir esta sugestão'}
              >
                <Heart className={`w-5 h-5 transition-transform duration-200 hover:scale-125 ${
                  hasUserLiked(suggestion) ? 'fill-current' : ''
                }`} />
                <span className="font-medium">
                  {hasUserLiked(suggestion) ? 'Curtido' : 'Curtir'}
                </span>
              </button>

              {/* Comment Button */}
              <button 
                onClick={() => openCommentModal(suggestion.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  suggestion.commentCount > 0
                    ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                    : 'bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
                title="Ver comentários"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">
                  Comentar ({suggestion.commentCount || 0})
                </span>
                {suggestion.commentCount > 0 && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                )}
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
});

ForumTopic.displayName = 'ForumTopic';

export default ForumTopic; 