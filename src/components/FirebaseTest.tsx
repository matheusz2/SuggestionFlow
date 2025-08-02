import React, { useState, useEffect } from 'react';
import { addSuggestion, subscribeToSuggestions } from '../services/firebase';
import type { Suggestion } from '../types';

const FirebaseTest: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    const unsubscribe = subscribeToSuggestions((newSuggestions) => {
      setSuggestions(newSuggestions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const testConnection = async () => {
    setTestResult('Testando conexão...');
    
    try {
      const testSuggestion = {
        title: 'Teste de Conexão',
        description: 'Esta é uma sugestão de teste para verificar a conexão com o Firebase.',
        author: 'Sistema',
        category: 'teste',
        tags: ['teste', 'conexão']
      };

      await addSuggestion(testSuggestion);
      setTestResult('✅ Conexão com Firebase funcionando! Sugestão de teste criada.');
    } catch (error) {
      console.error('Erro no teste:', error);
      setTestResult('❌ Erro na conexão com Firebase. Verifique as credenciais.');
      setError('Erro na conexão com Firebase');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Teste de Conexão Firebase</h3>
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Teste de Conexão Firebase</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={testConnection}
          className="btn-primary"
        >
          Testar Conexão
        </button>

        {testResult && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Sugestões no Banco ({suggestions.length})</h4>
          {suggestions.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma sugestão encontrada.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {suggestions.slice(0, 5).map((suggestion) => (
                <div key={suggestion.id} className="text-sm p-2 bg-gray-50 rounded">
                  <strong>{suggestion.title}</strong> - {suggestion.author}
                </div>
              ))}
              {suggestions.length > 5 && (
                <p className="text-xs text-gray-500">... e mais {suggestions.length - 5} sugestões</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest; 