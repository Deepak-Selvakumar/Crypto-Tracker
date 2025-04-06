import React from 'react';
import './CryptoPage.css';
import CryptoDetails from '../../components/CryptoDetails/CryptoDetails';

const CryptoPage: React.FC = () => {
  return (
    <div className="crypto-page">
      <div className="container">
        <CryptoDetails />
      </div>
    </div>
  );
};

export default CryptoPage;