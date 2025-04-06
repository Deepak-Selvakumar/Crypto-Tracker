import React from 'react';
import { Link } from 'react-router-dom';
import './CryptoCard.css';

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  name,
  symbol,
  current_price,
  price_change_percentage_24h,
  image,
  isFavorite,
  onToggleFavorite,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggleFavorite();
  };

  return (
    <Link to={`/crypto/${id}`} className="crypto-card-link">
      <div className="crypto-card">
        <div className="card-header">
          <img src={image} alt={name} className="crypto-image" />
          <h3>{name}</h3>
          <span className="symbol">{symbol.toUpperCase()}</span>
          <button 
            onClick={handleFavoriteClick}
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        <div className="card-body">
          <div className="price-info">
            <span className="price">${current_price.toLocaleString()}</span>
            <span className={`change ${price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {price_change_percentage_24h >= 0 ? '↑' : '↓'} {Math.abs(price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
          <div className="details-link">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;