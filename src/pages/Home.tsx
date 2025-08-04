import React, { useState, useEffect } from 'react';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import type { Suggestion, ViewMode } from '../types';
import { subscribeToSuggestions } from '../services/firebase';
import SuggestionCard from '../components/SuggestionCard';
import ForumTopic from '../components/ForumTopic';
import SuggestionForm from '../components/SuggestionForm';
import ViewSwitcher from '../components/ViewSwitcher';
import FirebaseTest from '../components/FirebaseTest';
import OrderButtons, { type OrderType } from '../components/OrderButtons';
import ToastContainer, { useToast } from '../components/ToastContainer';

const Home: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showFirebaseTest] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('recent');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Toast notifications
  const { toasts, showSuccess, removeToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToSuggestions((newSuggestions) => {
      setSuggestions(newSuggestions);
      setLoading(false);
    }, orderType);

    return () => unsubscribe();
  }, [orderType]);

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filterStatus !== 'all' && suggestion.status !== filterStatus) return false;
    if (filterCategory !== 'all' && suggestion.category !== filterCategory) return false;
    return true;
  });

  // Statistics
  const totalSuggestions = suggestions.length;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const acceptedSuggestions = suggestions.filter(s => s.status === 'accepted').length;
  const totalLikes = suggestions.reduce((sum, s) => sum + s.likes, 0);

  const handleLike = () => {
    showSuccess('Like added!', 'Your like has been registered successfully.');
  };

  const handleFormSubmit = () => {
    showSuccess('Suggestion sent!', 'Your suggestion has been created successfully.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-14 lg:h-16">
            <div className="flex items-center min-w-0 flex-1 pr-2">
              <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate leading-tight">
                BonkPuter - SuggestionFlow
              </h1>
            </div>
            
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base whitespace-nowrap border-0 btn-new-highlight"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">New Suggestion</span>
                <span className="xs:hidden font-extrabold">NEW</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6 lg:py-8">
        {/* Firebase Test */}
        {showFirebaseTest && (
          <div className="mb-8">
            <FirebaseTest />
          </div>
        )}

        {/* Stats - Enhanced Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="metric-card metric-card-blue text-center">
            <div className="text-sm text-gray-500 mb-1">Total Suggestions</div>
            <div className="text-2xl font-bold text-gray-800">{totalSuggestions}</div>
          </div>
          
          <div className="metric-card metric-card-yellow text-center">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-2xl font-bold text-gray-800">{pendingSuggestions}</div>
          </div>
          
          <div className="metric-card metric-card-green text-center">
            <div className="text-sm text-gray-500 mb-1">Accepted</div>
            <div className="text-2xl font-bold text-gray-800">{acceptedSuggestions}</div>
          </div>
          
          <div className="metric-card metric-card-red text-center">
            <div className="text-sm text-gray-500 mb-1">Total Likes</div>
            <div className="text-2xl font-bold text-gray-800">{totalLikes}</div>
          </div>
        </div>

        {/* Controls and Filters Reorganized */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <ViewSwitcher viewMode={viewMode} onViewChange={setViewMode} />
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {filteredSuggestions.length} of {totalSuggestions} suggestions
            </span>
          </div>
        </div>

        {/* Filters and Order Buttons Grouped */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All</option>
                <option value="improvement">Improvement</option>
                <option value="bug">Bug Fix</option>
                <option value="feature">New Feature</option>
                <option value="design">Design/UX</option>
                <option value="performance">Performance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Order Buttons */}
          <OrderButtons 
            currentOrder={orderType} 
            onOrderChange={setOrderType} 
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Suggestions List */}
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No suggestions found
            </h3>
            <p className="text-gray-600 mb-4">
              {suggestions.length === 0 
                ? 'Be the first to make a suggestion!'
                : 'Try adjusting the filters to see more suggestions.'
              }
            </p>
            {suggestions.length === 0 && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary"
              >
                Create First Suggestion
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'cards' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredSuggestions.map((suggestion) => (
              viewMode === 'cards' ? (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onLike={handleLike}
                />
              ) : (
                <ForumTopic
                  key={suggestion.id}
                  suggestion={suggestion}
                  onLike={handleLike}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <SuggestionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default Home; 