import React, { useState, useEffect } from 'react';
import './CryptoDetails.css';
import Chart from '../Chart/Chart';
import { useCrypto } from '../../context/CryptoContext';
import { useParams } from 'react-router-dom';

const CryptoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cryptos, favorites, toggleFavorite, timeRange, setTimeRange, fetchChartData } = useCrypto();
  const [chartData, setChartData] = useState<[number, number][]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  
  const crypto = cryptos.find(c => c.id === id);
  
  useEffect(() => {
    if (id) {
      setLoadingChart(true);
      fetchChartData(id)
        .then(data => {
          setChartData(data.prices);
          setLoadingChart(false);
        })
        .catch(() => setLoadingChart(false));
    }
  }, [id, timeRange, fetchChartData]);

  if (!crypto) {
    return <div className="not-found">Cryptocurrency not found</div>;
  }

  const isFavorite = favorites.includes(crypto.id);
  const priceChangePositive = crypto.price_change_percentage_24h >= 0;

  const timeRanges = [
    { label: '24h', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1m' },
    { label: '6M', value: '6m' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' },
  ];

  return (
    <div className="crypto-details">
      <div className="details-header">
        <div className="crypto-info">
          <img src={crypto.image} alt={crypto.name} className="detail-image" />
          <h2>{crypto.name} <span className="symbol">{crypto.symbol.toUpperCase()}</span></h2>
          <button 
            onClick={() => toggleFavorite(crypto.id)} 
            className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          >
            {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
          </button>
        </div>
        <div className="price-info">
          <div className="current-price">${crypto.current_price.toLocaleString()}</div>
          <div className={`price-change ${priceChangePositive ? 'positive' : 'negative'}`}>
            {priceChangePositive ? '↑' : '↓'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}% (24h)
          </div>
        </div>
      </div>
      
      <div className="chart-section">
        <div className="chart-header">
          <h3>Price Chart</h3>
          <div className="time-range-selector">
            {timeRanges.map(range => (
              <button
                key={range.value}
                className={`time-range-btn ${timeRange === range.value ? 'active' : ''}`}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        {loadingChart ? (
          <div className="loading-chart">Loading chart data...</div>
        ) : (
          <Chart 
            data={chartData} 
            width={800} 
            height={400} 
            positive={priceChangePositive} 
          />
        )}
      </div>
      
      <div className="market-info">
        <div className="info-card">
          <h4>Market Cap</h4>
          <p>${crypto.market_cap.toLocaleString()}</p>
        </div>
        <div className="info-card">
          <h4>24h Change</h4>
          <p className={`${priceChangePositive ? 'positive' : 'negative'}`}>
            {priceChangePositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;