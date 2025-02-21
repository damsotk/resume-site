import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './exchange.css'
import './responsive-styles-exchange.css'
import ExchangeModal from './exchangeModal/exchangeModal';
import BuySellSection from './exchangeBuySellSection/exchangeBuySellSection';
import { useNavigate } from 'react-router-dom';
import ExchangeMenu from './exchangeMenu/exchangeMenu';


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Exchange = () => {

    const [stocks, setStocks] = useState({});
    const [showModal, setShowModal] = useState(false);


    const [balance, setBalance] = useState(0);
    const [username, setUsername] = useState(`error`)



    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/allInfoAboutUserExchange', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setBalance(response.data.balance);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance();
    }, []);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'initial') {
                const initialStocks = {};
                message.stocks.forEach(stock => {
                    initialStocks[stock.id] = stock;
                });
                setStocks(initialStocks);
            } else {
                const updatedStock = message;
                setStocks(prevStocks => {
                    const updatedStocks = { ...prevStocks };
                    updatedStocks[updatedStock.id] = updatedStock;
                    return updatedStocks;
                });
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const stockList = Object.values(stocks);

    const visibleStocks = stockList.slice(0, 4);
    const hiddenStocks = stockList.slice(4);




    return (
        <div className="exchangeBackground">
            <div className="exchangeFlex">
                <ExchangeMenu />
                <div className="exchangeDisplay">
                    <div className="exchangeForMainInfo">
                        <div className="infoAboutStocks">
                            <div className="exchangeForMoneyInfo">
                                <div className='exchangeContainerFlexUsernameAndBalance'>
                                    <div className="exchangeMoneyText">TOTAL BALANCE</div>
                                    <div className='exchangeUsernameDisplay'>Hello, {username}</div>
                                </div>
                                <div className="exchangeMainBalance">${balance}</div>
                            </div>
                            <div className="exchangeInfoBlock">
                                <div className="exchangeStocksInfo">
                                    <div className="exchangeTextF">Best stocks</div>
                                    <div className="exchangeButtonSee" onClick={handleShowModal}>
                                        See all
                                    </div>
                                </div>
                            </div>
                            <div className="exchangeBestStocks">
                                {visibleStocks.map((stock, index) => {
                                    const isPriceUp = stock.percentageChange > 0;
                                    const backgroundColor =
                                        index === 1
                                            ? '#e4ae5f'
                                            : index === 2
                                                ? '#e1815e'
                                                : index === 3
                                                    ? '#010101'
                                                    : '#5447df';

                                    return (
                                        <div
                                            className="stockCard"
                                            key={stock.id}
                                            style={{ backgroundColor }}
                                        >
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
                                            <Line
                                                data={{
                                                    labels: ['w', 'w', 'w', 'w', 'w', 'w', 'w'],
                                                    datasets: [
                                                        {
                                                            label: ``,
                                                            data: stock.priceHistory,
                                                            borderColor: 'white',
                                                            backgroundColor: 'white',
                                                            fill: true,
                                                            tension: 0.5,
                                                        },
                                                    ],
                                                }}
                                                options={{
                                                    scales: {
                                                        x: {
                                                            ticks: { display: false },
                                                            grid: { display: false },
                                                            border: { display: false },
                                                        },
                                                        y: {
                                                            ticks: { display: false },
                                                            grid: { display: false },
                                                            border: { display: false },
                                                        },
                                                    },
                                                    plugins: { legend: { display: false } },
                                                }}
                                            />
                                            <div className="stockCurrentPrice">${stock.price}</div>
                                            <div
                                                className={`exchangeBalanceStatus ${isPriceUp ? 'exchangeBackUp' : 'exchangeBackDown'
                                                    }`}
                                            >
                                                <div
                                                    className={isPriceUp ? 'exchangeLineStatusUp' : 'exchangeLineStatusDown'}
                                                ></div>
                                                <div className="exchangePercentBalance">
                                                    {isPriceUp ? '+' : ''}
                                                    {stock.percentageChange}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <BuySellSection stockList={stockList} />
                    </div>
                </div>
            </div>
            {showModal && (
                <ExchangeModal onClose={handleCloseModal}>
                    <div className="allStocksContainer">
                        {hiddenStocks.map((stock) => (
                            <div className="stockCard" key={stock.id}>
                                <div className="stockNameBox">
                                    <div
                                        className="stockLogo"
                                        style={{
                                            backgroundImage: `url(http://localhost:3000/images/googleStock.png)`,
                                        }}
                                    ></div>
                                    <div className="stockNameText">
                                        {stock.stockName}
                                        <div className="ident">GGL</div>
                                    </div>
                                </div>
                                <div className="stockCurrentPrice">${stock.price}</div>
                            </div>
                        ))}
                    </div>
                </ExchangeModal>
            )}

        </div>
    );
};

export default Exchange;