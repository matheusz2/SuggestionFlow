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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const testConnection = async () => {
    setTestResult('Testing connection...');
    
    try {
      const testSuggestion = {
        title: 'Connection Test',
        description: 'This is a test suggestion to verify the Firebase connection.',
        author: 'System',
        category: 'test',
        tags: ['test', 'connection']
      };

      await addSuggestion(testSuggestion);
      setTestResult('✅ Firebase connection working! Test suggestion created.');
    } catch (error) {
      console.error('Test error:', error);
      setTestResult('❌ Error connecting to Firebase. Check credentials.');
      setError('Firebase connection error');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Firebase Connection Test</h3>
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Firebase Connection Test</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={testConnection}
          className="btn-primary"
        >
          Test Connection
        </button>

        {testResult && (
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium mb-2">Suggestions in Database ({suggestions.length})</h4>
          {suggestions.length === 0 ? (
            <p className="text-gray-500 text-sm">No suggestions found.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {suggestions.slice(0, 5).map((suggestion) => (
                <div key={suggestion.id} className="text-sm p-2 bg-gray-50 rounded-lg">
                  <strong>{suggestion.title}</strong> - {suggestion.author}
                </div>
              ))}
              {suggestions.length > 5 && (
                <p className="text-xs text-gray-500">... and {suggestions.length - 5} more suggestions</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest; 