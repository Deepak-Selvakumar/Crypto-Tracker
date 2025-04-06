import React from 'react';
import './Search.css';
import { useCrypto } from '../../context/CryptoContext';

const Search: React.FC = () => {
  const { searchTerm, setSearchTerm } = useCrypto();

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default Search;