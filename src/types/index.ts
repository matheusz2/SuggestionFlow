export interface Comment {
  id: string;
  suggestionId: string;
  author: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  likes: number;
  likedBy: string[];
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked
  isHighlighted: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  category?: string;
  tags?: string[];
  commentCount: number; // Comment counter
}

export interface SuggestionFormData {
  title: string;
  description: string;
  author: string;
  category?: string;
  tags?: string[];
}

export type ViewMode = 'cards' | 'forum';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AppState {
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  filter: {
    status: string;
    category: string;
    highlighted: boolean;
  };
} 