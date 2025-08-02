import React from 'react';
import { Grid, List } from 'lucide-react';
import type { ViewMode } from '../types';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewChange('cards')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
          viewMode === 'cards'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        title="Visualização em Cards"
      >
        <Grid className="w-4 h-4" />
        <span className="text-sm font-medium">Cards</span>
      </button>
      
      <button
        onClick={() => onViewChange('forum')}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
          viewMode === 'forum'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
        title="Visualização em Fórum"
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">Fórum</span>
      </button>
    </div>
  );
};

export default ViewSwitcher; 