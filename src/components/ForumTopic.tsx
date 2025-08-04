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
        <div className="flex flex-col items-center gap-2 min-w-[80px]">
          {/* Like Count */}
          <div className="text-center">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105 ${
                hasUserLiked(suggestion)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-600 hover:text-red-500'
              }`}
              title={hasUserLiked(suggestion) ? 'Remove like' : 'Like this suggestion'}
            >
              <ThumbsUp className={`w-6 h-6 icon-button ${
                hasUserLiked(suggestion) ? 'fill-current' : ''
              }`} />
              <span className="text-lg font-bold">{suggestion.likes}</span>
              <span className="text-xs text-gray-500">likes</span>
            </button>
          </div>

          {/* Highlight Button */}
          <button
            onClick={handleHighlight}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
              suggestion.isHighlighted
                ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
            }`}
            title={suggestion.isHighlighted ? 'Remove highlight' : 'Highlight suggestion'}
          >
            <Star className={`w-5 h-5 ${
              suggestion.isHighlighted ? 'fill-current' : ''
            }`} />
          </button>
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
          <div className="text-gray-600 mb-4 leading-relaxed">
            {suggestion.description}
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
            <div className="flex items-center gap-6">
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
                <Heart className={`w-5 h-5 icon-button ${
                  hasUserLiked(suggestion) ? 'fill-current' : ''
                }`} />
                <span className="font-medium">
                  {hasUserLiked(suggestion) ? 'Liked' : 'Like'}
                </span>
              </button>

              {/* Comment Button */}
              <button 
                onClick={() => openCommentModal(suggestion.id)}
                className="action-button"
                title="View comments"
              >
                <MessageCircle className="w-4 h-4 icon-button" />
                <span className="font-medium">
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