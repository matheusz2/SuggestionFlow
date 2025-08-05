import React, { useState } from 'react';
import { Heart, MessageCircle, Calendar, User, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
import type { Suggestion } from '../types';
import { likeSuggestion } from '../services/firebase';
import { hasUserLiked } from '../utils/userUtils';
import { useCommentModal } from '../contexts/CommentContext';
import { useLikeButton } from '../utils/debounceUtils';

interface ForumTopicProps {
  suggestion: Suggestion;
  onLike: (id: string) => void;
}

const ForumTopic = React.memo<ForumTopicProps>(({ 
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
  const isDescriptionLong = suggestion.description.length > 200;

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
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
    <div className={`bg-white border border-gray-100 rounded-xl p-6 mb-4 transition-all duration-200 hover:shadow-lg shadow-md ${
      suggestion.isHighlighted 
        ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-xl' 
        : ''
    }`}>
      <div className="flex gap-4">
        {/* Left Side - Stats */}
        <div className="flex flex-col items-center gap-2 min-w-[60px]">
          {/* Like Count */}
          <div className="text-center">
            <button
              onClick={onLikeClick}
              disabled={isLikeLoading}
              className={`flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105 ${
                hasUserLiked(suggestion)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-600 hover:text-red-500'
              } ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isLikeLoading ? 'Processing...' : (hasUserLiked(suggestion) ? 'Remove like' : 'Like this suggestion')}
            >
              <ThumbsUp className={`w-5 h-5 ${
                hasUserLiked(suggestion) ? 'fill-current' : ''
              } ${isLikeLoading ? 'animate-pulse' : ''}`} />
              <span className="text-base font-bold">{suggestion.likes}</span>
              <span className="text-xs text-gray-500">likes</span>
            </button>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
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
                  <span className="tag-badge">
                    {suggestion.category}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            {getStatusBadge(suggestion.status)}
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className={`text-gray-600 leading-relaxed ${
              isDescriptionLong && !isDescriptionExpanded 
                ? 'line-clamp-4' 
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

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <button
                onClick={onLikeClick}
                className={`flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200 ${
                  hasUserLiked(suggestion)
                    ? 'text-red-500 bg-red-50'
                    : ''
                }`}
                title={hasUserLiked(suggestion) ? 'Remove like' : 'Like this suggestion'}
              >
                <Heart className={`w-3.5 h-3.5 ${
                  hasUserLiked(suggestion) ? 'fill-current' : ''
                }`} />
                <span className="font-medium text-xs">
                  {hasUserLiked(suggestion) ? 'Liked' : 'Like'}
                </span>
              </button>

              {/* Comment Button */}
              <button 
                onClick={() => openCommentModal(suggestion.id)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-200"
                title="View comments"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="font-medium text-xs">
                  Comment ({suggestion.commentCount || 0})
                </span>
              </button>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-gray-400">
              Updated at {formatDate(suggestion.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ForumTopic.displayName = 'ForumTopic';

export default ForumTopic; 