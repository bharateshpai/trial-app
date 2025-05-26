import React from 'react';
import { Product } from '../types/types';
import { useBasket } from '../context/BasketContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToBasket } = useBasket();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <button onClick={() => addToBasket(product)} className="add-to-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 