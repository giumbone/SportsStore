import React, { useState } from 'react';
import axios from 'axios';

interface DeliveryAddress {
  name: string;
  street: string;
  city: string;
  country: string;
}

interface PaymentInformation {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutForm: React.FC = () => {
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: '',
    street: '',
    city: '',
    country: '',
  });

  const [paymentInformation, setPaymentInformation] = useState<PaymentInformation>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/orders`, {
        deliveryAddress,
        paymentInformation,
      });
      console.log('Order created successfully', response.data);
      alert('Order has been submitted successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was a problem submitting your order.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Delivery Address</h2>
      {Object.keys(deliveryAddress).map((key) => (
        <input
          key={key}
          name={key}
          value={(deliveryAddress as any)[key]}
          onChange={(e) => handleChange(e, setDeliveryAddress)}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          required
        />
      ))}
      <h2>Payment Information</h2>
      {Object.keys(paymentInformation).map((key) => (
        <input
          key={key}
          name={key}
          type={key === 'cvv' ? 'password' : 'text'}
          value={(paymentInformation as any)[key]}
          onChange={(e) => handleChange(e, setPaymentInformation)}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          required
        />
      ))}
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default CheckoutForm;