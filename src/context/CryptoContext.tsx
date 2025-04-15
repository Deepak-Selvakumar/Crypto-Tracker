import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface SparklineData {
  price: number[];
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  sparkline_in_7d?: SparklineData;
}

interface WatchlistItem {
  id: number;
  coinId: string;
  userId: string;
  targetPrice: number | null;
  notes: string;
}

interface CryptoContextType {
  cryptos: CryptoData[];
  loading: boolean;
  error: string | null;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  favoriteCryptos: CryptoData[];
  timeRange: string;
  setTimeRange: (range: string) => void;
  fetchChartData: (id: string) => Promise<{ prices: [number, number][] }>;
  watchlist: WatchlistItem[];
  addToWatchlist: (coinId: string) => Promise<void>;
  removeFromWatchlist: (id: number) => Promise<void>;
  updateWatchlistItem: (id: number, updates: Partial<WatchlistItem>) => Promise<void>;
  fetchWatchlist: () => Promise<void>;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('7');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Fetch all cryptocurrencies
  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get<CryptoData[]>(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h'
        );
        setCryptos(response.data);
      } catch (err) {
        setError('Failed to fetch cryptocurrencies');
      } finally {
        setLoading(false);
      }
    };
    fetchCryptos();
  }, []);

  const favoriteCryptos = cryptos.filter(crypto => favorites.includes(crypto.id));

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get<WatchlistItem[]>('http://localhost:8080/api/watchlist/user1');
      setWatchlist(response.data);
    } catch (err) {
      setError('Failed to fetch watchlist');
    }
  };

  const addToWatchlist = async (coinId: string) => {
    try {
      const response = await axios.post<WatchlistItem>('http://localhost:8080/api/watchlist', {
        coinId,
        userId: 'user1',
        targetPrice: null,
        notes: ''
      });
      setWatchlist(prev => [...prev, response.data]);
    } catch (err) {
      setError('Failed to add to watchlist');
    }
  };

  const removeFromWatchlist = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/watchlist/${id}`);
      setWatchlist(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to remove from watchlist');
    }
  };

  const updateWatchlistItem = async (id: number, updates: Partial<WatchlistItem>) => {
    try {
      const response = await axios.put<WatchlistItem>(
        `http://localhost:8080/api/watchlist/${id}`,
        updates
      );
      setWatchlist(prev => 
        prev.map(item => item.id === id ? { ...item, ...response.data } : item)
      );
    } catch (err) {
      setError('Failed to update watchlist item');
    }
  };

  const fetchChartData = async (id: string) => {
    let days = '1';
    switch(timeRange) {
      case '1d': days = '1'; break;
      case '5d': days = '5'; break;
      case '1m': days = '30'; break;
      case '6m': days = '180'; break;
      case '1y': days = '365'; break;
      case '5y': days = '1825'; break;
      default: days = '7';
    }
    
    try {
      const response = await axios.get<{ prices: [number, number][] }>(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      return response.data;
    } catch (err) {
      setError('Failed to fetch chart data');
      throw err;
    }
  };

  return (
    <CryptoContext.Provider value={{ 
      cryptos, 
      loading, 
      error, 
      favorites, 
      toggleFavorite,
      searchTerm,
      setSearchTerm,
      favoriteCryptos,
      timeRange,
      setTimeRange,
      fetchChartData,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      updateWatchlistItem,
      fetchWatchlist
    }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};