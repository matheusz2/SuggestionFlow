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
import ExportButton from '../components/ExportButton';

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

  const handleExportStart = () => {
    showSuccess('Export started!', 'Preparing your data for export...');
  };

  const handleExportComplete = () => {
    showSuccess('Export completed!', 'Your data has been exported successfully.');
  };

  const handleExportError = (error: string) => {
    showSuccess('Export failed!', `Error: ${error}`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-white animate-gradient relative">
      {/* Background Image for entire page */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('./rootputer.webp')" }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header - Mobile First */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/40">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Header */}
            <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
              <div className="flex items-center min-w-0 flex-1 pr-4">
                {/* Hierarchical Title */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 truncate leading-tight">
                    RootPuter
                  </h1>
                  <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                    SuggestionFlow
                  </span>
                </div>
              </div>

              <div className="flex items-center flex-shrink-0 gap-3 sm:gap-4">
                {/* New Suggestion Button - Glassmorphism */}
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="backdrop-blur-md border border-white/30 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-xl transition-all duration-200 hover:brightness-110 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 text-sm lg:text-base whitespace-nowrap"
                  style={{ backgroundColor: 'rgb(48, 36, 230)' }}
                >
                  <Plus className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-200 group-hover:scale-105" />
                  <span className="hidden sm:inline">New Suggestion</span>
                  <span className="sm:hidden font-extrabold">NEW</span>
                </button>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-200/60 mx-4 sm:mx-6 lg:mx-8"></div>


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
            <div className="metric-card metric-card-blue text-center bg-white/90 backdrop-blur-sm">
              <div className="text-sm text-gray-500 mb-1">Total Suggestions</div>
              <div className="text-2xl font-bold text-gray-800">{totalSuggestions}</div>
            </div>

            <div className="metric-card metric-card-yellow text-center bg-white/90 backdrop-blur-sm">
              <div className="text-sm text-gray-500 mb-1">Pending</div>
              <div className="text-2xl font-bold text-gray-800">{pendingSuggestions}</div>
            </div>

            <div className="metric-card metric-card-green text-center bg-white/90 backdrop-blur-sm">
              <div className="text-sm text-gray-500 mb-1">Accepted</div>
              <div className="text-2xl font-bold text-gray-800">{acceptedSuggestions}</div>
            </div>

            <div className="metric-card metric-card-red text-center bg-white/90 backdrop-blur-sm">
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

            <div className="flex items-center gap-4">
              <ExportButton
                suggestions={filteredSuggestions}
                onExportStart={handleExportStart}
                onExportComplete={handleExportComplete}
                onExportError={handleExportError}
              />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {filteredSuggestions.length} of {totalSuggestions} suggestions
                </span>
              </div>
            </div>
          </div>

          {/* Filters and Order Buttons Grouped */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/50">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field text-sm bg-white/80 backdrop-blur-sm"
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
                  className="input-field text-sm bg-white/80 backdrop-blur-sm"
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
            <div className="bg-red-50/90 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl mb-6">
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

        {/* Market Chart - Only shown when button is clicked */}
        {/* This section is removed as per the edit hint */}

        {/* Form Modal */}
        <SuggestionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

        {/* Footer */}
        <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 mt-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img src='./rootputer.webp' alt='RootPuter Logo' className='w-12 h-12 sm:w-14 sm:h-14 rounded-full' />
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Share the RootPuter Experience
                </h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg sm:text-xl max-w-2xl mx-auto">
                Help us grow our community! Share this amazing platform with your friends and let them discover the power of collaborative innovation. 🚀
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-black">
              <p className="text-sm text-gray-500">
                © 2025 RootPuter SuggestionFlow. Made with ❤️ for the community.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Developed by{' '}
                <a 
                  href="https://x.com/MatheusDevSaas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  MatheusDevSaas
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home; 