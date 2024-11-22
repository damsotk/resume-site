import React, { useState } from 'react';
import './exchangeBuySellSection.css';

const BuySellSection = ({ stockList }) => {
    const [mode, setMode] = useState('buy');

    const [showStocks, setShowStocks] = useState(false);

    const [selectedStock, setSelectedStock] = useState(stockList[0] || {});
    const [amountInDollars, setAmountInDollars] = useState('');

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
                    amountInDollars: parseFloat(amountInDollars)
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
                <div className='sellContent'>
                    <div className='choosenStock'>
                        <div className='choosenStockDisp'>
                            <div className="stockNameBox">
                                <div
                                    className="stockLogo"
                                    style={{
                                        backgroundImage: `url(http://localhost:3000/images/googleStock.png)`,
                                    }}
                                ></div>
                                <div className="stockNameText">
                                    Google
                                    <div className="ident">GGL</div>
                                </div>
                            </div>
                            <div>You send</div>
                        </div>
                        <div className='numberOfStocks'>
                            <div>$</div>
                            <input type='text' placeholder='00.00'></input>
                        </div>
                    </div>
                    <div className='howMuchMoneyYouGet'>
                        <div className='numberOfStocks'>
                            <div>$</div>
                            <input type='text' placeholder='00.00'></input>
                        </div>
                        <div>You get</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuySellSection;
