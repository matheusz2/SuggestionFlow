import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, where, getDocs, increment } from 'firebase/firestore';
import type { Suggestion, SuggestionFormData, Comment } from '../types';
import { firebaseConfig } from '../config/firebase-config';
import type { OrderType } from '../components/OrderButtons';
import { getCurrentUserId } from '../utils/userUtils';

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
      likedBy: [],
      isHighlighted: false,
      status: 'pending',
      commentCount: 0,
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
export const likeSuggestion = async (id: string, currentLikes: number, currentLikedBy: string[] = []): Promise<void> => {
  try {
    const currentUserId = getCurrentUserId();
    const docRef = doc(db, 'suggestions', id);
    
    // Verificar se o usuário já deu like
    const hasLiked = currentLikedBy.includes(currentUserId);
    
    if (hasLiked) {
      // Remover like
      const newLikedBy = currentLikedBy.filter(userId => userId !== currentUserId);
      await updateDoc(docRef, {
        likes: currentLikes - 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Like removido da sugestão:', id);
    } else {
      // Adicionar like
      const newLikedBy = [...currentLikedBy, currentUserId];
      await updateDoc(docRef, {
        likes: currentLikes + 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Like adicionado à sugestão:', id);
    }
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
        likedBy: data.likedBy || [],
        isHighlighted: data.isHighlighted || false,
        status: data.status || 'pending',
        category: data.category,
        tags: data.tags || [],
        commentCount: data.commentCount || 0,
      });
    });
    
    callback(suggestions);
  });
};

// Referência para a coleção de comentários
const commentsCollection = collection(db, 'comments');

// Função para adicionar um comentário
export const addComment = async (suggestionId: string, content: string, author: string): Promise<string> => {
  try {
    const docRef = await addDoc(commentsCollection, {
      suggestionId,
      content,
      author,
      likes: 0,
      likedBy: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Atualizar contador de comentários na sugestão
    const suggestionRef = doc(db, 'suggestions', suggestionId);
    await updateDoc(suggestionRef, {
      commentCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Comentário adicionado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    throw error;
  }
};

// Função para obter comentários de uma sugestão
export const getComments = async (suggestionId: string): Promise<Comment[]> => {
  try {
    const q = query(
      commentsCollection,
      where('suggestionId', '==', suggestionId)
    );

    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        suggestionId: data.suggestionId,
        author: data.author,
        content: data.content,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        likes: data.likes || 0,
        likedBy: data.likedBy || [],
      });
    });

    return comments;
  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    throw error;
  }
};

// Função para escutar comentários em tempo real
export const subscribeToComments = (
  suggestionId: string,
  callback: (comments: Comment[]) => void
) => {
  try {
    const q = query(
      commentsCollection,
      where('suggestionId', '==', suggestionId)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const comments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          suggestionId: data.suggestionId,
          author: data.author,
          content: data.content,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          likes: data.likes || 0,
          likedBy: data.likedBy || [],
        });
      });
      
      callback(comments);
    }, (error) => {
      console.error('Erro no subscribeToComments:', error);
    });
  } catch (error) {
    console.error('Erro ao criar query:', error);
    callback([]);
  }
};

// Função para dar like em um comentário
export const likeComment = async (commentId: string, currentLikes: number, currentLikedBy: string[] = []): Promise<void> => {
  try {
    const currentUserId = getCurrentUserId();
    const docRef = doc(db, 'comments', commentId);
    
    // Verificar se o usuário já deu like
    const hasLiked = currentLikedBy.includes(currentUserId);
    
    if (hasLiked) {
      // Remover like
      const newLikedBy = currentLikedBy.filter(userId => userId !== currentUserId);
      await updateDoc(docRef, {
        likes: currentLikes - 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Like removido do comentário:', commentId);
    } else {
      // Adicionar like
      const newLikedBy = [...currentLikedBy, currentUserId];
      await updateDoc(docRef, {
        likes: currentLikes + 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Like adicionado ao comentário:', commentId);
    }
  } catch (error) {
    console.error('Erro ao dar like no comentário:', error);
    throw error;
  }
};

// Função para deletar um comentário
export const deleteComment = async (commentId: string, suggestionId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'comments', commentId);
    await deleteDoc(docRef);
    
    // Atualizar contador de comentários na sugestão
    const suggestionRef = doc(db, 'suggestions', suggestionId);
    await updateDoc(suggestionRef, {
      commentCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Comentário deletado:', commentId);
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    throw error;
  }
};

export { db }; 