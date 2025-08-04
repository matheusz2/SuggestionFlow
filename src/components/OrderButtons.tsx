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
    <div className="flex gap-2">
      <button
        onClick={() => onOrderChange('recent')}
        className={`filter-button flex items-center gap-2 ${
          currentOrder === 'recent'
            ? 'filter-button-active'
            : 'filter-button-inactive'
        }`}
      >
        <Clock className="w-4 h-4" />
        Most Recent
      </button>
      
      <button
        onClick={() => onOrderChange('likes')}
        className={`filter-button flex items-center gap-2 ${
          currentOrder === 'likes'
            ? 'filter-button-active'
            : 'filter-button-inactive'
        }`}
      >
        <Heart className="w-4 h-4" />
        Most Liked
      </button>
    </div>
  );
};

export default OrderButtons; 