import React from 'react';
import { Heart, Star, MessageCircle, Calendar, User } from 'lucide-react';
import type { Suggestion } from '../types';
import { likeSuggestion, toggleHighlight } from '../services/firebase';
import { hasUserLiked } from '../utils/userUtils';
import { useCommentModal } from '../contexts/CommentContext';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onLike: (id: string) => void;
  onHighlight: (id: string) => void;
}

const SuggestionCard = React.memo<SuggestionCardProps>(({ 
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
      console.error('Error giving like:', error);
    }
  };

  const handleHighlight = async () => {
    try {
      await toggleHighlight(suggestion.id, suggestion.isHighlighted);
      onHighlight(suggestion.id);
    } catch (error) {
      console.error('Error changing highlight:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="status-badge status-badge-accepted">Accepted</span>;
      case 'rejected':
        return <span className="status-badge status-badge-rejected">Rejected</span>;
      default:
        return <span className="status-badge status-badge-pending">Pending</span>;
    }
  };

  return (
    <div className={`suggestion-card relative ${
      suggestion.isHighlighted 
        ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-xl' 
        : ''
    }`}>
      {/* Header with Title, Status and Highlight Button */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-3">
          {suggestion.title}
        </h3>
        <div className="flex items-center gap-2">
          {getStatusBadge(suggestion.status)}
          {/* Highlight Button - Repositioned to not overlap badge */}
          <button
            onClick={handleHighlight}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              suggestion.isHighlighted
                ? 'text-blue-600 hover:text-blue-700 bg-blue-50'
                : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
            }`}
            title={suggestion.isHighlighted ? 'Remove highlight' : 'Highlight suggestion'}
          >
            <Star className={`w-4 h-4 ${
              suggestion.isHighlighted ? 'fill-current' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {suggestion.description}
      </p>

      {/* Tags */}
      {suggestion.tags && suggestion.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestion.tags.map((tag, index) => (
            <span
              key={index}
              className="tag-badge"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with Actions and Information */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Actions (Likes and Comments) */}
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`action-button ${
              hasUserLiked(suggestion)
                ? 'text-red-500 hover:text-red-600'
                : ''
            }`}
            title={hasUserLiked(suggestion) ? 'Remove like' : 'Like this suggestion'}
          >
            <Heart className={`w-4 h-4 icon-button ${
              hasUserLiked(suggestion) ? 'fill-current' : ''
            }`} />
            <span className="text-sm font-medium">{suggestion.likes}</span>
          </button>

          {/* Comment Button */}
          <button 
            onClick={() => openCommentModal(suggestion.id)}
            className="action-button"
            title="View comments"
          >
            <MessageCircle className="w-4 h-4 icon-button" />
            <span className="text-sm font-medium">{suggestion.commentCount || 0}</span>
          </button>
        </div>

        {/* Author and Date Information */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{suggestion.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(suggestion.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SuggestionCard.displayName = 'SuggestionCard';

export default SuggestionCard; 