import React from 'react';
import './exchangeHoldings.css';

const ExchangeHoldings = ({ balance, username, userBuyingStocks, onClose }) => {

  return (
    <div className='bro'>
      <button onClick={onClose}>Close</button>
      <h1>Investment Portfolio</h1>
      <p>Username: {username}</p>
      <p>Total Balance: ${balance}</p>
      <h2>Your Stocks:</h2>
      {userBuyingStocks && userBuyingStocks.length > 0 ? (
        <ul>
          {userBuyingStocks.map((stock, index) => (
            <li key={index}>
              {stock.stockName}: {stock.quantity} shares
            </li>
          ))}
        </ul>
      ) : (
        <p>No stocks in your portfolio.</p>
      )}
    </div>
  );
};

export default ExchangeHoldings;