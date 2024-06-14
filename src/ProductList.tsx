import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products`);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button onClick={() => alert(`Viewing ${product.name}`)}>View Details</button>
          <button onClick={() => alert(`Added ${product.name} to cart`)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default Products Slate