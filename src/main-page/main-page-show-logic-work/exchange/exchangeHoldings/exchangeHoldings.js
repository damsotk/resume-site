import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './exchangeHoldings.css';
import ExchangeMenu from '../exchangeMenu/exchangeMenu';

const ExchangeHoldings = () => {

  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState(`error`)
  const [userPortfolio, setUserPortfolio] = useState([]);
  const [userBalanceInStocks, setUserBalanceInStocks] = useState(0);
  const [percentChange, setBalanceChangePercent] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/allInfoAboutUserExchange', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setBalance(response.data.balance);
        setUsername(response.data.username);
        setUserPortfolio(response.data.user_portfolio);

        const totalInvestmentSum = response.data.user_portfolio.reduce((acc, stock) => acc + stock.totalInvestment, 0);
        const totalCurrentValueSum = response.data.user_portfolio.reduce((acc, stock) => acc + stock.totalCurrentValue, 0);

        setUserBalanceInStocks(totalCurrentValueSum);

        const percentChange = ((totalCurrentValueSum - totalInvestmentSum) / totalInvestmentSum) * 100;
        setBalanceChangePercent(percentChange.toFixed(0));

        console.log("Загальний відсоток зміни:", percentChange);

      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);


  return (
    <div className='exchangeBackground'>
      <div className='exchangeFlex'>
        <ExchangeMenu />
        <div className='exchangeDisplay'>
          <div className='exchangeForMainInfo'>
            <div className='infoAboutUserStocks'>
              <div className="exchangeForMoneyInfoHolding">
                <div className='exchangeHoldingTotalBalance'>
                  <div className="exchangeMoneyText">TOTAL BALANCE</div>
                  <div className="exchangeMainBalance">${balance}</div>
                </div>
                <div className="userAllMoneyInExchange">
                  <div className='exchangeMoneyText'>YOUR BALANCE IN STOCKS</div>
                  <div className='totalInvestmentBalanceFlex'>
                    <div className={`percHoldings exchangeBalanceStatus ${percentChange < 0 ? 'exchangeBackDown' : 'exchangeBackUp'}`}>
                      <div className={percentChange < 0 ? 'exchangeLineStatusDown' : 'exchangeLineStatusUp'}></div>
                      <div className="exchangePercentBalance">{percentChange}%</div>
                    </div>
                    <div className="totalInvestmentBalance">${userBalanceInStocks.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <div className='displayBuyingStocks'>
                {userPortfolio && userPortfolio.length > 0 ? (
                  <div className='exchangeBestStocks'>
                    {userPortfolio.map((stock, index) => {
                      const colors = ['#e4ae5f', '#e1815e', '#010101', '#5447df'];
                      const backgroundColor = colors[index % colors.length];

                      return (
                        <div className='stockCard' key={index} style={{ backgroundColor }}>
                          <div className="stockNameBox">
                            <div
                              className="stockLogo"
                              style={{
                                backgroundImage: `url(http://localhost:3000${stock.stockLogo})`,
                              }}
                            ></div>
                            <div className="stockNameText">
                              {stock.stockName}
                              <div className="ident">GGL</div>
                            </div>
                          </div>
                          <div
                            className="stockCurrentPrice"
                            title={stock.quantity}
                          >
                            {Number(stock.quantity).toFixed(5)}
                          </div>
                          <div>Your money in this stock {stock.totalInvestment}</div>
                          <div>Your money if you sell  {stock.totalCurrentValue}</div>
                          <div>{stock.percentChange}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No stocks in your portfolio.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default ExchangeHoldings;