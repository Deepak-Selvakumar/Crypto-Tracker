import React from 'react';
import CryptoCard from '../CryptoCard/CryptoCard';
import './CryptoList.css';
import { useCrypto } from '../../context/CryptoContext';

const CryptoList: React.FC = () => {
  const { cryptos, loading, error, favorites, toggleFavorite, searchTerm } = useCrypto();

  const filteredCryptos = cryptos.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading cryptocurrencies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="crypto-list">
      {filteredCryptos.map(crypto => (
        <CryptoCard
          key={crypto.id}
          id={crypto.id}
          name={crypto.name}
          symbol={crypto.symbol}
          current_price={crypto.current_price}
          price_change_percentage_24h={crypto.price_change_percentage_24h}
          image={crypto.image}
          isFavorite={favorites.includes(crypto.id)}
          onToggleFavorite={() => toggleFavorite(crypto.id)}
        />
      ))}
    </div>
  );
};

export default CryptoList;