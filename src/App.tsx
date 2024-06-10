import React, { useState } from 'react';
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

  async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    setProducts(data);
  }

  React.useEffect(() => {
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

  async function fetchProduct() {
    const response = await fetch(`${API_URL}/products/${match.params.id}`);
    const data = await response.json();
    setProduct(data);
  }

  React.useEffect(() => {
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
          <Route path="/cart" component={ShoppingCart} />
          <Route path="/checkout" component={Checkout} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;