import React from 'react';
import './AllCryptos.css';
import Search from '../../components/Search/Search';
import CryptoList from '../../components/CryptoList/CryptoList';

const AllCryptos: React.FC = () => {
  return (
    <div className="all-cryptos">
      <div className="container">
        <h1>All Cryptocurrencies</h1>
        <Search />
        <CryptoList />
      </div>
    </div>
  );
};

export default AllCryptos;