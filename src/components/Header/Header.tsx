import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Crypto Tracker</h1>
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/all-cryptos">All Cryptos</Link>
          </nav>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;