import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import AllCryptos from './pages/AllCryptos/AllCryptos';
import CryptoPage from './pages/CryptoPage/CryptoPage';
import { CryptoProvider } from './context/CryptoContext';
import WatchlistPage from './pages/Watchlist/WatchlistPage';
import './App.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <CryptoProvider>
      <Router>
        <div className="app">
          <Header toggleTheme={toggleTheme} theme={theme} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-cryptos" element={<AllCryptos />} />
              <Route path="/crypto/:id" element={<CryptoPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CryptoProvider>
  );
};

export default App;