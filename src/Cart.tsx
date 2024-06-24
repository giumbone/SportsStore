import React, { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const ShoppingCart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, quantity: quantity } : product
    );
    setProducts(updatedProducts);
  };

  const handleRemoveProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} x {product.quantity}
            <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>+</button>
            <button onClick={() => handleQuantityChange(product.id, product.quantity - 1)} disabled={product.quantity <= 1}>-</button>
            <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Total price: ${calculateTotalPrice()}</h2>
      <button onClick={() => alert('Checkout functionality not implemented.')}>Checkout</button>
    </div>
  );
};

export default ShoppingCart;