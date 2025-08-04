import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, where, getDocs, increment } from 'firebase/firestore';
import type { Suggestion, SuggestionFormData, Comment } from '../types';
import type { OrderType } from '../components/OrderButtons';
import { getCurrentUserId } from '../utils/userUtils';
import { firebaseConfig } from '../config/firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Request cache to prevent duplicate operations
const pendingRequests = new Map<string, Promise<any>>();

// Helper function to create a unique request key
const createRequestKey = (operation: string, id: string, userId?: string) => {
  return `${operation}:${id}:${userId || ''}`;
};

// Helper function to execute request with cache protection
const executeWithCache = async <T>(
  requestKey: string,
  operation: () => Promise<T>
): Promise<T> => {
  // Check if there's already a pending request for this operation
  if (pendingRequests.has(requestKey)) {
    console.log('Request already in progress, waiting for completion:', requestKey);
    await pendingRequests.get(requestKey);
    return operation(); // Execute again to get the result
  }

  // Create new request promise
  const requestPromise = operation().finally(() => {
    pendingRequests.delete(requestKey);
  });

  // Store the promise in cache
  pendingRequests.set(requestKey, requestPromise);
  
  return requestPromise;
};

// Reference to suggestions collection
const suggestionsCollection = collection(db, 'suggestions');

// Function to add a new suggestion
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
    
    console.log('Suggestion added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding suggestion:', error);
    throw error;
  }
};

// Function to update a suggestion
export const updateSuggestion = async (id: string, updates: Partial<Suggestion>): Promise<void> => {
  try {
    const docRef = doc(db, 'suggestions', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    console.log('Suggestion updated:', id);
  } catch (error) {
    console.error('Error updating suggestion:', error);
    throw error;
  }
};

// Function to delete a suggestion
export const deleteSuggestion = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'suggestions', id);
    await deleteDoc(docRef);
    
    console.log('Suggestion deleted:', id);
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    throw error;
  }
};

// Function to like a suggestion
export const likeSuggestion = async (id: string, currentLikes: number, currentLikedBy: string[] = []): Promise<void> => {
  const currentUserId = getCurrentUserId();
  const requestKey = createRequestKey('like', id, currentUserId);
  
  return executeWithCache(requestKey, async () => {
    try {
      const docRef = doc(db, 'suggestions', id);
      
      // Check if user already liked
      const hasLiked = currentLikedBy.includes(currentUserId);
      
      if (hasLiked) {
        // Remove like
        const newLikedBy = currentLikedBy.filter(userId => userId !== currentUserId);
        await updateDoc(docRef, {
          likes: currentLikes - 1,
          likedBy: newLikedBy,
          updatedAt: serverTimestamp(),
        });
        
        console.log('Like removed from suggestion:', id);
      } else {
        // Add like
        const newLikedBy = [...currentLikedBy, currentUserId];
        await updateDoc(docRef, {
          likes: currentLikes + 1,
          likedBy: newLikedBy,
          updatedAt: serverTimestamp(),
        });
        
        console.log('Like added to suggestion:', id);
      }
    } catch (error) {
      console.error('Error giving like:', error);
      throw error;
    }
  });
};

// Function to highlight/unhighlight a suggestion
export const toggleHighlight = async (id: string, isHighlighted: boolean): Promise<void> => {
  const requestKey = createRequestKey('highlight', id);
  
  return executeWithCache(requestKey, async () => {
    try {
      const docRef = doc(db, 'suggestions', id);
      await updateDoc(docRef, {
        isHighlighted: !isHighlighted,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Highlight changed for suggestion:', id);
    } catch (error) {
      console.error('Error changing highlight:', error);
      throw error;
    }
  });
};

// Function to listen for real-time changes with ordering
export const subscribeToSuggestions = (
  callback: (suggestions: Suggestion[]) => void,
  orderType: OrderType = 'recent'
) => {
  let q;
  
  if (orderType === 'likes') {
    // Sort by likes (descending) and then by date (descending)
    q = query(
      suggestionsCollection, 
      orderBy('likes', 'desc'),
      orderBy('createdAt', 'desc')
    );
  } else {
    // Sort by creation date (descending) - default
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

// Reference to comments collection
const commentsCollection = collection(db, 'comments');

// Function to add a comment
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
    
    // Update comment count in the suggestion
    const suggestionRef = doc(db, 'suggestions', suggestionId);
    await updateDoc(suggestionRef, {
      commentCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Comment added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Function to get comments for a suggestion
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
    console.error('Error getting comments:', error);
    throw error;
  }
};

// Function to listen for real-time comments
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
      console.error('Error in subscribeToComments:', error);
    });
  } catch (error) {
    console.error('Error creating query:', error);
    callback([]);
  }
};

// Function to like a comment
export const likeComment = async (commentId: string, currentLikes: number, currentLikedBy: string[] = []): Promise<void> => {
  try {
    const currentUserId = getCurrentUserId();
    const docRef = doc(db, 'comments', commentId);
    
    // Check if user already liked
    const hasLiked = currentLikedBy.includes(currentUserId);
    
    if (hasLiked) {
      // Remove like
      const newLikedBy = currentLikedBy.filter(userId => userId !== currentUserId);
      await updateDoc(docRef, {
        likes: currentLikes - 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Like removed from comment:', commentId);
    } else {
      // Add like
      const newLikedBy = [...currentLikedBy, currentUserId];
      await updateDoc(docRef, {
        likes: currentLikes + 1,
        likedBy: newLikedBy,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Like added to comment:', commentId);
    }
  } catch (error) {
    console.error('Error giving like to comment:', error);
    throw error;
  }
};

// Function to delete a comment
export const deleteComment = async (commentId: string, suggestionId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'comments', commentId);
    await deleteDoc(docRef);
    
    // Update comment count in the suggestion
    const suggestionRef = doc(db, 'suggestions', suggestionId);
    await updateDoc(suggestionRef, {
      commentCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Comment deleted:', commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export { db }; 