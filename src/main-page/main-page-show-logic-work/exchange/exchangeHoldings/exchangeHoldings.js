
import React, {useEffect} from 'react';
import './exchangeHoldings.css';

const ExchangeHoldings = ({ balance, username, userPortfolio }) => {


  console.log(userPortfolio);
  
  
  return (
    <div className='exchangeDisplay'>
      <div className='exchangeForMainInfo'>
        <div className='infoAboutUserStocks'>
          <div className="exchangeForMoneyInfo">
            <div className='exchangeContainerFlexUsernameAndBalance'>
              <div className="exchangeMoneyText">TOTAL BALANCE</div>
              <div className='exchangeUsernameDisplay'>Hello, {username}</div>
            </div>
            <div className="exchangeMainBalance">${balance}</div>
            <div className="exchangeBalanceStatus exchangeBackUp">
              <div className="exchangeLineStatusUp"></div>
              <div className="exchangePercentBalance">+10%</div>
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
                      <div className="stockCurrentPrice">{stock.quantity}</div>
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
        <div>
          123
        </div>
      </div>

    </div>

  );
};

export default ExchangeHoldings;