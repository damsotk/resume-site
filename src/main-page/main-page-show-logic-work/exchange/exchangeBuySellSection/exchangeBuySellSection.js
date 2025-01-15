import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './exchangeBuySellSection.css';

const BuySellSection = ({ stockList }) => {
    const [mode, setMode] = useState('buy');

    // all for buy
    const [showStocks, setShowStocks] = useState(false);
    const [selectedStock, setSelectedStock] = useState(stockList[0] || {});
    const [amountInDollars, setAmountInDollars] = useState('');

    // all for sell
    const [userStocks, setUserStocks] = useState([]);
    const [userStocksShow, setUserStocksShow] = useState(false);
    const [selectedStockSell, setSelectedStockSell] = useState(null);
    const [sellQuantity, setSellQuantity] = useState('');
    const [calculatedValue, setCalculatedValue] = useState('');

    // all for buy function

    const handleExchange = async () => {
        if (!amountInDollars || !selectedStock.id) return alert("Please enter an amount and select a stock.");

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/exchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    stockId: selectedStock.id,
                    amountInDollars: parseFloat(amountInDollars),
                    stockPrice: selectedStock.price,
                    stockName: selectedStock.stockName
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Successfully purchased ${calculateShares()} shares of ${selectedStock.stockName}`);
            } else {
                alert(data.message || "Purchase failed");
            }
        } catch (error) {
            console.error("Error during exchange:", error);
        }
    };

    const calculateShares = () => {
        if (selectedStock.price && amountInDollars) {
            const shares = parseFloat(amountInDollars) / parseFloat(selectedStock.price);
            return shares.toFixed(5);
        }
        return '';
    };

    const handleSelectStock = (stock) => {
        setSelectedStock(stock);
        setShowStocks(false);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmountInDollars(value);
        }
    };

    // all for sell function

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/allInfoAboutUserExchange', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserStocks(response.data.user_portfolio);

            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
    }, []);

    const handleStockSelect = (stock) => {
        setSelectedStockSell(stock);
        setUserStocksShow(false);
        setSellQuantity('');
        setCalculatedValue('');
    };

    const handleQuantityChange = (e) => {
        const quantity = parseFloat(e.target.value);
        if (!isNaN(quantity) && selectedStockSell) {
            setSellQuantity(quantity);
            const value = quantity * selectedStockSell.currentPrice;
            setCalculatedValue(value.toFixed(2));
        } else {
            setSellQuantity('');
            setCalculatedValue('');
        }
    };

    const handleSell = async () => {
        if (!selectedStockSell || !sellQuantity) {
            alert('Please select a stock and enter a valid quantity!');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/sell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stockId: selectedStockSell.stockId,
                    stockName: selectedStockSell.stockName,
                    sellQuantity: parseFloat(sellQuantity),
                    stockPrice: selectedStockSell.currentPrice,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Successfully sold ${sellQuantity} shares of ${selectedStockSell.stockName}`);
            } else {
                alert(data.message || 'Sale failed');
            }
        } catch (error) {
            console.error('Error during sell:', error);
            alert('Something went wrong. Please try again.');
        }
    };
    console.log(userStocks);




    return (
        <div className='exchangeBuyPlace'>
            <div className='buyingOrSale'>
                <div
                    className={`buySection ${mode === 'buy' ? 'active' : ''}`}
                    onClick={() => setMode('buy')}
                >
                    BUY
                </div>
                <div
                    className={`saleSection ${mode === 'sell' ? 'active' : ''}`}
                    onClick={() => setMode('sell')}
                >
                    SELL
                </div>
            </div>
            {mode === 'buy' ? (
                <div className='buyContent'>
                    <div className='howMuchMoneyYouSend'>
                        <div className='numberOfStocks'>
                            <div>$</div>
                            <input
                                type='text'
                                placeholder='00.00'
                                value={amountInDollars}
                                onChange={handleAmountChange}
                            />
                        </div>
                        <div>You send</div>
                    </div>
                    <div className='choosenStock'>
                        <div className='choosenStockDisp' onClick={() => setShowStocks(!showStocks)}>
                            <div className="stockNameBox">
                                {selectedStock.stockName && (
                                    <div
                                        className="stockLogo"
                                        style={{
                                            backgroundImage: `url(http://localhost:3000${selectedStock.stockLogo})`,
                                        }}
                                    ></div>
                                )}
                                <div className="stockNameText">
                                    {selectedStock.stockName || 'Select Stock'}
                                    <div className="ident">{selectedStock.symbol || 'SYM'}</div>
                                </div>
                            </div>
                            <div>You get</div>
                        </div>
                        <div className='numberOfStocks'>
                            <input
                                type='text'
                                placeholder='00.00'
                                value={calculateShares()}
                                readOnly
                                style={{ pointerEvents: "none" }}
                            />
                        </div>

                        {showStocks && (
                            <div className='stockListDropdown'>
                                {stockList.map((stock) => (
                                    <div
                                        key={stock.id}
                                        className='stockItem'
                                        onClick={() => handleSelectStock(stock)}
                                    >
                                        {stock.stockName} - ${stock.price}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='buttonFlexExchange'>
                        <div className='exchangeButton' onClick={handleExchange}>EXCHANGE</div>
                    </div>
                </div>

            ) : (
                <div className="sellContent">
                    <div className="choosenStock">
                        <div className="choosenStockDisp">
                            <div
                                className="stockNameBox"
                                onClick={() => setUserStocksShow(!userStocksShow)}
                            >
                                <div
                                    className="stockLogo"
                                    style={{
                                        backgroundImage: selectedStockSell
                                            ? `url(http://localhost:3000${selectedStockSell.stockLogo})`
                                            : `url(http://localhost:3000/images/googleStock.png)`,
                                    }}
                                ></div>
                                <div className="stockNameText">
                                    {selectedStockSell ? selectedStockSell.stockName : 'Select'}
                                    <div className="ident">{selectedStockSell ? selectedStockSell.quantity : 'NON'}</div>
                                </div>
                            </div>

                            {userStocksShow && (
                                <div className="stockDropdown">
                                    {userStocks.map((stock, index) => (
                                        <div
                                            key={index}
                                            className="stockOption"
                                            onClick={() => handleStockSelect(stock)}
                                        >
                                            {stock.stockName}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div>You send</div>
                        </div>
                        <div className="numberOfStocks">
                            <div></div>
                            <input
                                type="text"
                                placeholder="00.00"
                                value={sellQuantity}
                                onChange={handleQuantityChange}
                            />
                        </div>
                    </div>
                    <div className="howMuchMoneyYouGet">
                        <div className="numberOfStocks">
                            <div>$</div>
                            <input
                                type="text"
                                placeholder="00.00"
                                value={calculatedValue}
                                readOnly
                            />
                        </div>
                        <div>You get</div>
                    </div>
                    <div className="buttonFlexExchange">
                        <div className="exchangeButton" onClick={handleSell}>
                            SELL
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuySellSection;


