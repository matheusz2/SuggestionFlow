import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import type { Suggestion } from '../types';

interface ExportButtonProps {
  suggestions: Suggestion[];
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: string) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  suggestions,
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    onExportStart?.();

    try {
      // Preparar dados das sugestões
      const exportData = {
        suggestions: suggestions.map(suggestion => ({
          id: suggestion.id,
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          status: suggestion.status,
          author: suggestion.author,
          createdAt: suggestion.createdAt,
          updatedAt: suggestion.updatedAt,
          likes: suggestion.likes,
          commentCount: suggestion.commentCount,
          isHighlighted: suggestion.isHighlighted,
          tags: suggestion.tags
        })),
        exportInfo: {
          totalSuggestions: suggestions.length,
          exportDate: new Date().toISOString(),
          format: 'JSON'
        }
      };

      // Criar arquivo JSON
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Download automático
      const link = document.createElement('a');
      link.href = url;
      link.download = `suggestions_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpar URL
      URL.revokeObjectURL(url);

      onExportComplete?.();
    } catch (error) {
      console.error('Erro na exportação:', error);
      onExportError?.('Erro ao exportar sugestões');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || suggestions.length === 0}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isExporting || suggestions.length === 0
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
        }
      `}
      title={suggestions.length === 0 ? 'No suggestions to export' : 'Export suggestions to JSON'}
    >
      <FileText className="w-4 h-4" />
      <span className="text-sm">
        {isExporting ? 'Exporting...' : 'Export JSON'}
      </span>
    </button>
  );
};

export default ExportButton; 