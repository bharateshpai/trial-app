export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface BasketItem extends Product {
  quantity: number;
}

export interface BasketContextType {
  basket: BasketItem[];
  addToBasket: (product: Product) => void;
  removeFromBasket: (productId: number) => void;
  getTotalPrice: () => number;
} 