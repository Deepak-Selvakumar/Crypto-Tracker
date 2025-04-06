import React from 'react';
import './Home.css';
import Favorites from '../../components/Favorites/Favorites';
import CryptoList from '../../components/CryptoList/CryptoList';
import { useCrypto } from '../../context/CryptoContext';

const Home: React.FC = () => {
  const { cryptos, loading } = useCrypto();
  const topCryptos = cryptos.slice(0, 6);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Track Your Favorite Cryptocurrencies</h1>
          <p>Real-time prices, charts, and market data for all your crypto needs</p>
        </div>
      </section>

      <div className="container">
        <section className="favorites-section">
          <h2>Your Favorites</h2>
          <Favorites />
        </section>

        <section className="top-cryptos">
          <h2>Top Cryptocurrencies</h2>
          <CryptoList cryptos={topCryptos} />
        </section>
      </div>
    </div>
  );
};

export default Home;