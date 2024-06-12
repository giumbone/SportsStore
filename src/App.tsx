import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const STORE_NAME = process.env.REACT_APP_STORE_NAME || "Sports Store";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const cache: { [key: string]: any } = {};

async function fetchWithCache(url: string) {
  if (cache[url]) {
    console.log('Returning from cache:', url);
    return cache[url];
  }
  const response = await fetch(url);
  const data = await response.json();
  cache[url] = data;
  return data;
}

const Header: React.FC = () => {
  return (
    <header>
      <h1>{STORE_NAME}</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart">Shopping Cart</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const data = await fetchWithCache(`${API_URL}/products`);
      setProducts(data);
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
            <Link to={`/product/${product.id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductDetails = ({ match }: {match: any}) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const data = await fetchWithCache(`${API_URL}/products/${match.params.id}`);
      setProduct(data);
    }

    fetchProduct();
  }, [match.params.id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

const ShoppingCart: React.FC = () => {
  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>Your cart is currently empty.</p>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <div>
      <h2>Checkout</h2>
      <p>Checkout process would be implemented here.</p>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={ProductList} />
          <Route path="/product/:id" component={ProductDetails} />
          <Route path="/zcart" component={ShoppingCart} />
          <Route path="/checkout" component={Checkout} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;