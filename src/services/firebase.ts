import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { Suggestion, SuggestionFormData } from '../types';
import { firebaseConfig } from '../config/firebase-config';
import type { OrderType } from '../components/OrderButtons';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência para a coleção de sugestões
const suggestionsCollection = collection(db, 'suggestions');

// Função para adicionar uma nova sugestão
export const addSuggestion = async (suggestionData: SuggestionFormData): Promise<string> => {
  try {
    const docRef = await addDoc(suggestionsCollection, {
      ...suggestionData,
      likes: 0,
      isHighlighted: false,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Sugestão adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar sugestão:', error);
    throw error;
  }
};

// Função para atualizar uma sugestão
export const updateSuggestion = async (id: string, updates: Partial<Suggestion>): Promise<void> => {
  try {
    const docRef = doc(db, 'suggestions', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Sugestão atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar sugestão:', error);
    throw error;
  }
};

// Função para deletar uma sugestão
export const deleteSuggestion = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'suggestions', id);
    await deleteDoc(docRef);
    
    console.log('Sugestão deletada:', id);
  } catch (error) {
    console.error('Erro ao deletar sugestão:', error);
    throw error;
  }
};

// Função para dar like em uma sugestão
export const likeSuggestion = async (id: string, currentLikes: number): Promise<void> => {
  try {
    const docRef = doc(db, 'suggestions', id);
    await updateDoc(docRef, {
      likes: currentLikes + 1,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Like adicionado à sugestão:', id);
  } catch (error) {
    console.error('Erro ao dar like:', error);
    throw error;
  }
};

// Função para destacar/desdestacar uma sugestão
export const toggleHighlight = async (id: string, isHighlighted: boolean): Promise<void> => {
  try {
    const docRef = doc(db, 'suggestions', id);
    await updateDoc(docRef, {
      isHighlighted: !isHighlighted,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Destaque alterado para sugestão:', id);
  } catch (error) {
    console.error('Erro ao alterar destaque:', error);
    throw error;
  }
};

// Função para escutar mudanças em tempo real com ordenação
export const subscribeToSuggestions = (
  callback: (suggestions: Suggestion[]) => void,
  orderType: OrderType = 'recent'
) => {
  let q;
  
  if (orderType === 'likes') {
    // Ordenar por likes (decrescente) e depois por data (decrescente)
    q = query(
      suggestionsCollection, 
      orderBy('likes', 'desc'),
      orderBy('createdAt', 'desc')
    );
  } else {
    // Ordenar por data de criação (decrescente) - padrão
    q = query(suggestionsCollection, orderBy('createdAt', 'desc'));
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const suggestions: Suggestion[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      suggestions.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        author: data.author,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        likes: data.likes || 0,
        isHighlighted: data.isHighlighted || false,
        status: data.status || 'pending',
        category: data.category,
        tags: data.tags || [],
      });
    });
    
    callback(suggestions);
  });
};

export { db }; 