import React, { useState, useCallback } from 'react';
import Toast, { type ToastType, type Toast as ToastInterface } from './Toast';

export interface ToastContainerProps {
  toasts: ToastInterface[];
  onRemoveToast: (id: string) => void;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastInterface[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastInterface = {
      id,
      type,
      title,
      message,
      duration
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    addToast('success', title, message, duration);
  }, [addToast]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    addToast('error', title, message, duration);
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    addToast('info', title, message, duration);
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    addToast('warning', title, message, duration);
  }, [addToast]);

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeToast
  };
};

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemoveToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 