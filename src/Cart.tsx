import React, { useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const initialProducts: Product[] = [
  { id: '1', name: 'Product 1', price: 100, quantity: 1 },
  { id: '2', name: 'Product 2', price: 200, quantity: 2 },
];

const ShoppingCart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, quantity: Math.max(quantity, 1) } : product
    );
    setProducts(updatedProducts);
  };

  const handleRemoveProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const handleChangeProductPrice = (id: string, newPrice: number) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, price: newPrice } : product
    );
    setProducts(updatedProducts);
  };

  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + product.price * product.quantity, 0);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              {product.name} - ${product.price} x {product.quantity}
              <button onClick={() => handleQuantityChange(product.id, product.quantity + 1)}>+</button>
              <button onClick={() => handleQuantityChange(product.id, product.quantity - 1)} disabled={product.quantity <= 1}>-</button>
              <button onClick={() => handleRemoveProduct(product.id)}>Remove</button>
              <button onClick={() => handleChangeProductPrice(product.id, product.price - 10)}>- $10</button>
              <button onClick={() => handleChangeProductPrice(product.id, product.price + 10)}>+ $10</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <h2>Total price: ${calculateTotalPrice()}</h2>
      <button onClick={() => alert('Checkout functionality not implemented.')}>Checkout</button>
      <button onClick={() => handleAddProduct({ id: Date.now().toString(), name: 'New Product', price: 150, quantity: 1 })}>Add New Product</button>
    </div>
  );
};

export default ShoppingCart;