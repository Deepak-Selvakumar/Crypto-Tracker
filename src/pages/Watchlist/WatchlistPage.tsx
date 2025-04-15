import React, { useState, useEffect } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import CryptoCard from '../../components/CryptoCard/CryptoCard';
import './WatchlistPage.css';

interface WatchlistItem {
  id: number;
  coinId: string;
  userId: string;
  targetPrice: number | null;
  notes: string;
}

const WatchlistPage: React.FC = () => {
  const { 
    watchlist = [], 
    cryptos = [], 
    fetchWatchlist, 
    loading = false, 
    error = null,
    removeFromWatchlist = async () => {},
    updateWatchlistItem = async () => {}
  } = useCrypto();

  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    targetPrice: '',
    notes: ''
  });

  useEffect(() => {
    fetchWatchlist?.();
  }, [fetchWatchlist]);

  // Get full crypto data for watchlist items
  const watchlistCryptos = cryptos.filter(crypto => 
    watchlist.some(item => item.coinId === crypto.id)
  );

  const handleEdit = (item: WatchlistItem) => {
    setEditingItem(item.id);
    setEditForm({
      targetPrice: item.targetPrice?.toString() || '',
      notes: item.notes || ''
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateWatchlistItem(id, {
        targetPrice: editForm.targetPrice ? parseFloat(editForm.targetPrice) : null,
        notes: editForm.notes
      });
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to update watchlist item:', err);
    }
  };

  if (loading) {
    return (
      <div className="watchlist-loading">
        <div className="spinner"></div>
        <p>Loading your watchlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watchlist-error">
        <p>⚠️ Error loading watchlist: {error}</p>
        <button onClick={fetchWatchlist}>Retry</button>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <h2 className="watchlist-header">Your Watchlist</h2>
      
      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <img src="/empty-watchlist.svg" alt="Empty watchlist" />
          <h3>No cryptocurrencies in your watchlist yet</h3>
          <p>Click the + icon on any crypto to add it here</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlistCryptos.map(crypto => {
            const watchlistItem = watchlist.find(item => item.coinId === crypto.id);
            if (!watchlistItem) return null;
            
            return (
              <div key={watchlistItem.id} className="watchlist-item">
                <CryptoCard 
                  id={crypto.id}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  current_price={crypto.current_price}
                  price_change_percentage_24h={crypto.price_change_percentage_24h}
                  image={crypto.image}
                  market_cap={crypto.market_cap}
                />
                
                {editingItem === watchlistItem.id ? (
                  <div className="watchlist-edit-form">
                    <div className="form-group">
                      <label>Target Price ($)</label>
                      <input
                        type="number"
                        value={editForm.targetPrice}
                        onChange={(e) => setEditForm({...editForm, targetPrice: e.target.value})}
                        placeholder="Enter target price"
                        step="0.0001"
                      />
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                        placeholder="Add your notes..."
                        rows={3}
                      />
                    </div>
                    <div className="form-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleUpdate(watchlistItem.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setEditingItem(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="watchlist-item-actions">
                    <div className="watchlist-item-info">
                      {watchlistItem.targetPrice && (
                        <p className="target-price">
                          <span>Target:</span> 
                          <strong>${watchlistItem.targetPrice.toLocaleString()}</strong>
                        </p>
                      )}
                      {watchlistItem.notes && (
                        <p className="notes">
                          <span>Notes:</span> 
                          {watchlistItem.notes}
                        </p>
                      )}
                    </div>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(watchlistItem)}
                      >
                        Edit
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromWatchlist(watchlistItem.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;