import React, { useState } from 'react';
import { products } from './data/products';
import ProductCard from './components/ProductCard';
import Basket from './components/Basket';
import { BasketProvider } from './context/BasketContext';
import { useBasket } from './context/BasketContext';
import './App.css';

// Create a separate component for the header to use hooks
const Header: React.FC<{ isBasketOpen: boolean; setIsBasketOpen: (open: boolean) => void }> = ({ 
  isBasketOpen, 
  setIsBasketOpen 
}) => {
  const { basket } = useBasket();
  
  const itemCount = basket.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <h1>Simple E-Commerce</h1>
      <button 
        className="basket-button"
        onClick={() => setIsBasketOpen(!isBasketOpen)}
      >
        {isBasketOpen ? 'Close Basket' : `View Basket (${itemCount})`}
      </button>
    </header>
  );
};

function App() {
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  return (
    <BasketProvider>
      <div className="app">
        <Header isBasketOpen={isBasketOpen} setIsBasketOpen={setIsBasketOpen} />
        <main className="main-content">
          {isBasketOpen ? (
            <Basket />
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </BasketProvider>
  );
}

export default App;
