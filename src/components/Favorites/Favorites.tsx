import React from 'react';
import './Favorites.css';
import CryptoCard from '../CryptoCard/CryptoCard';
import { useCrypto } from '../../context/CryptoContext';

const Favorites: React.FC = () => {
  const { favoriteCryptos, toggleFavorite } = useCrypto();

  if (favoriteCryptos.length === 0) {
    return (
      <div className="no-favorites">
        <p>You don't have any favorite cryptocurrencies yet.</p>
        <p>Click the star icon on any crypto to add it to your favorites.</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      {favoriteCryptos.map(crypto => (
        <CryptoCard
          key={crypto.id}
          id={crypto.id}
          name={crypto.name}
          symbol={crypto.symbol}
          current_price={crypto.current_price}
          price_change_percentage_24h={crypto.price_change_percentage_24h}
          image={crypto.image}
          isFavorite={true}
          onToggleFavorite={() => toggleFavorite(crypto.id)}
        />
      ))}
    </div>
  );
};

export default Favorites;