import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

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
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('7');
  
  const { data: cryptos, loading, error } = useFetch<CryptoData[]>(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h'
  );

  const favoriteCryptos = cryptos ? cryptos.filter(crypto => favorites.includes(crypto.id)) : [];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
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
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    return await response.json();
  };

  return (
    <CryptoContext.Provider value={{ 
      cryptos: cryptos || [], 
      loading, 
      error, 
      favorites, 
      toggleFavorite,
      searchTerm,
      setSearchTerm,
      favoriteCryptos,
      timeRange,
      setTimeRange,
      fetchChartData
    }}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};