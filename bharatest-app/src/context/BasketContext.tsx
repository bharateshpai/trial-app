import React, { createContext, useState, useContext } from 'react';
import { Product, BasketItem, BasketContextType } from '../types/types';

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const addToBasket = (product: Product) => {
    setBasket(currentBasket => {
      const existingItem = currentBasket.find(item => item.id === product.id);
      if (existingItem) {
        return currentBasket.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentBasket, { ...product, quantity: 1 }];
    });
  };

  const removeFromBasket = (productId: number) => {
    setBasket(currentBasket => {
      const existingItem = currentBasket.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return currentBasket.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return currentBasket.filter(item => item.id !== productId);
    });
  };

  const getTotalPrice = () => {
    return basket.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, getTotalPrice }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}; 