import React, { useState } from 'react';
import { useTheme } from './ThemeContext';

const DiscountNewsletter: React.FC = () => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Discount newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className={`discount-newsletter ${isDark ? 'dark' : ''}`}>
      <h2 className="discount-title">
        Subscribe and get upto<br />
        10% OFF
      </h2>
      <p className="discount-subtitle">
        Get 10% discount for all products
      </p>
      <form onSubmit={handleSubmit} className="discount-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="@email.com"
          className="discount-input"
          required
        />
        <button type="submit" className="discount-button">
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default DiscountNewsletter;