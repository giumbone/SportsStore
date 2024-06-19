import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Props {
  productId: number;
}

const ProductDetail: React.FC<Props> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get<Product>(`${process.env.REACT_APP_BACKEND_URL}/products/${productId}`);
        if (response.status === 200) {
          setProduct(response.data);
        } else {
          // Handle non-200 responses
          setError(`Server responded with status code: ${response.status}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle errors thrown from Axios specifically
          setError(error.response?.data?.message || error.message);
        } else if (error instanceof Error) {
          // Handle general JS errors
          setError(error.message);
        } else {
          // Handle anything else that got thrown
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    console.log(`Product ${product?.id} added to cart.`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {product ? (
        <div>
          <h2>{product.name}</h1>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <button onClick={handleAddToMart}>Add to Mart</button>
        </div>
      ) : (
        <div>Product not found.</div>
      )}
    </div>
  );
};

export default ProductDetail;