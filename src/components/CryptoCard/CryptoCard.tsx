import React from 'react';
import { Link } from 'react-router-dom';
import { useCrypto } from '../../context/CryptoContext';
import './CryptoCard.css';

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap?: number;
  sparkline_in_7d?: { price: number[] };
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  name,
  symbol,
  current_price,
  price_change_percentage_24h,
  image,
  market_cap,
  sparkline_in_7d
}) => {
  const { 
    favorites = [],
    toggleFavorite = () => {},
    watchlist = [],
    addToWatchlist = async () => {},
    removeFromWatchlist = async () => {}
  } = useCrypto();

  const isFavorite = favorites.includes(id);
  const isInWatchlist = watchlist.some(item => item.coinId === id);
  const watchlistItem = watchlist.find(item => item.coinId === id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(id);
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWatchlist && watchlistItem) {
      removeFromWatchlist(watchlistItem.id);
    } else {
      addToWatchlist(id);
    }
  };

  return (
    <Link to={`/crypto/${id}`} className="crypto-card-link">
      <div className="crypto-card">
        <div className="card-header">
          <img src={image} alt={name} className="crypto-image" />
          <div className="coin-info">
            <h3>{name}</h3>
            <span className="symbol">{symbol.toUpperCase()}</span>
          </div>
          <div className="card-actions">
            <button
              onClick={handleFavoriteToggle}
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
            <button
              onClick={handleWatchlistToggle}
              className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? '✓' : '+'}
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="price-section">
            <div className="price-group">
              <span className="label">Price:</span>
              <span className="value">${current_price.toLocaleString()}</span>
            </div>
            <span className={`change ${price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>

          {market_cap && (
            <div className="market-cap">
              <span className="label">Market Cap:</span>
              <span className="value">${market_cap.toLocaleString()}</span>
            </div>
          )}

          {watchlistItem?.targetPrice && (
            <div className="target-price">
              <span className="label">Your Target:</span>
              <span className="value">${watchlistItem.targetPrice.toLocaleString()}</span>
            </div>
          )}

          <div className="details-btn">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;