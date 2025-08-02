import React from 'react';
import { Heart, Clock } from 'lucide-react';

export type OrderType = 'recent' | 'likes';

interface OrderButtonsProps {
  currentOrder: OrderType;
  onOrderChange: (order: OrderType) => void;
}

const OrderButtons: React.FC<OrderButtonsProps> = ({ 
  currentOrder, 
  onOrderChange 
}) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onOrderChange('recent')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentOrder === 'recent'
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Clock className="w-4 h-4" />
        Mais Recentes
      </button>
      
      <button
        onClick={() => onOrderChange('likes')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          currentOrder === 'likes'
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Heart className="w-4 h-4" />
        Mais Likes
      </button>
    </div>
  );
};

export default OrderButtons; 