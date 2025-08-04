import React, { useState } from 'react';
import { Heart, MessageCircle, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { likeSuggestion } from '../services/firebase';
import { useCommentModal } from '../contexts/CommentContext';
import { hasUserLiked } from '../utils/userUtils';
import { useLikeButton } from '../utils/debounceUtils';
import type { Suggestion } from '../types';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onLike: (id: string) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  suggestion, 
  onLike
}) => {
  const { openCommentModal } = useCommentModal();
  const { isLikeLoading, handleLike } = useLikeButton();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const onLikeClick = async () => {
    await handleLike(async () => {
      await likeSuggestion(suggestion.id, suggestion.likes, suggestion.likedBy);
      onLike(suggestion.id);
    });
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Check if description is long enough to need truncation
  const isDescriptionLong = suggestion.description.length > 150;

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
      {/* Header with Title and Status */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-3">
          {suggestion.title}
        </h3>
        <div className="flex items-center gap-2">
          {getStatusBadge(suggestion.status)}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className={`text-sm text-gray-600 ${
          isDescriptionLong && !isDescriptionExpanded 
            ? 'line-clamp-3' 
            : ''
        }`}>
          {suggestion.description}
        </p>
        
        {isDescriptionLong && (
          <button
            onClick={toggleDescription}
            className="flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            {isDescriptionExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show more
              </>
            )}
          </button>
        )}
      </div>

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
            onClick={onLikeClick}
            disabled={isLikeLoading}
            className={`action-button ${
              hasUserLiked(suggestion)
                ? 'text-red-500 hover:text-red-600'
                : ''
            } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isLikeLoading ? 'Processing...' : (hasUserLiked(suggestion) ? 'Remove like' : 'Like this suggestion')}
          >
            <Heart className={`w-4 h-4 icon-button ${
              hasUserLiked(suggestion) ? 'fill-current' : ''
            } ${isLikeLoading ? 'animate-pulse' : ''}`} />
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
};

SuggestionCard.displayName = 'SuggestionCard';

export default SuggestionCard; 