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
  const [showFirebaseTest, setShowFirebaseTest] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('recent');
  
  // Filtros
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterHighlighted, setFilterHighlighted] = useState(false);

  // Toast notifications
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeToSuggestions((newSuggestions) => {
      setSuggestions(newSuggestions);
      setLoading(false);
    }, orderType);

    return () => unsubscribe();
  }, [orderType]);

  // Filtrar sugestões
  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filterStatus !== 'all' && suggestion.status !== filterStatus) return false;
    if (filterCategory !== 'all' && suggestion.category !== filterCategory) return false;
    if (filterHighlighted && !suggestion.isHighlighted) return false;
    return true;
  });

  // Estatísticas
  const totalSuggestions = suggestions.length;
  const highlightedSuggestions = suggestions.filter(s => s.isHighlighted).length;
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending').length;
  const acceptedSuggestions = suggestions.filter(s => s.status === 'accepted').length;
  const totalLikes = suggestions.reduce((sum, s) => sum + s.likes, 0);

  const handleLike = (id: string) => {
    showSuccess('Like adicionado!', 'Sua curtida foi registrada com sucesso.');
  };

  const handleHighlight = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion?.isHighlighted) {
      showInfo('Destaque removido', 'A sugestão não está mais destacada.');
    } else {
      showSuccess('Sugestão destacada!', 'A sugestão agora aparece em destaque.');
    }
  };

  const handleFormSubmit = () => {
    showSuccess('Sugestão enviada!', 'Sua sugestão foi criada com sucesso.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                SuggestionFlow
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Sugestão
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Firebase Test */}
        {showFirebaseTest && (
          <div className="mb-8">
            <FirebaseTest />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{totalSuggestions}</div>
            <div className="text-sm text-gray-600">Total de Sugestões</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning-600">{pendingSuggestions}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-success-600">{acceptedSuggestions}</div>
            <div className="text-sm text-gray-600">Aceitas</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{highlightedSuggestions}</div>
            <div className="text-sm text-gray-600">Destacadas</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{totalLikes}</div>
            <div className="text-sm text-gray-600">Total de Likes</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <ViewSwitcher viewMode={viewMode} onViewChange={setViewMode} />
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>Filtros:</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              {filteredSuggestions.length} de {totalSuggestions} sugestões
            </span>
          </div>
        </div>

        {/* Order Buttons */}
        <OrderButtons 
          currentOrder={orderType} 
          onOrderChange={setOrderType} 
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="accepted">Aceitas</option>
              <option value="rejected">Rejeitadas</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Categoria:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">Todas</option>
              <option value="melhoria">Melhoria</option>
              <option value="bug">Correção de Bug</option>
              <option value="feature">Nova Funcionalidade</option>
              <option value="design">Design/UX</option>
              <option value="performance">Performance</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterHighlighted}
              onChange={(e) => setFilterHighlighted(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Apenas destacadas</span>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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
              Nenhuma sugestão encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {suggestions.length === 0 
                ? 'Seja o primeiro a fazer uma sugestão!'
                : 'Tente ajustar os filtros para ver mais sugestões.'
              }
            </p>
            {suggestions.length === 0 && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="btn-primary"
              >
                Criar Primeira Sugestão
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
                  onHighlight={handleHighlight}
                />
              ) : (
                <ForumTopic
                  key={suggestion.id}
                  suggestion={suggestion}
                  onLike={handleLike}
                  onHighlight={handleHighlight}
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