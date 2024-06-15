import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

// Simple in-memory cache
const cache: { [url: string]: Product[] } = {};

const ProductsGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const url = `${process.env.REACT_APP_BACKEND_URL}/products`;

      // Check cache first
      if (cache[url]) {
        setProducts(cache[url]);
        return;
      }

      const response = await axios.get(url);

      // Save to cache
      cache[url] = response.data;

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

export default Products 
