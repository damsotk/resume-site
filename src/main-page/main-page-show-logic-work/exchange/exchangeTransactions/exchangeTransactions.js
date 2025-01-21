import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExchangeMenu from '../exchangeMenu/exchangeMenu';
import './exchangeTransactions.css'

const ExchangeTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/get_user_transactions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactions(response.data);
                console.log(response.data);

            } catch (err) {
                setError('No transactions');
                console.error('Error fetching transactions:', err);
            }
        };

        fetchTransactions();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    function formatDate(isoDateStr) {
        const date = new Date(isoDateStr);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    return (
        <div className='exchangeBackground'>
            <div className='exchangeFlex'>
                <ExchangeMenu />
                <div className='exchangeDisplay'>
                    <div className='exchangeForMainInfo'>
                        <div className='userInfoTrans'>
                            <div className='exchangeTextForTrans'>
                                YOUR TRANSACTION
                            </div>
                            <div className='allTransactionCards'>
                                {transactions.map(transaction => (
                                    <div className='transactionCard' key={transaction.id}>
                                        <div className='transactionCardNameDate'>
                                            <div className='transactionNameStock'>{transaction.stock_name}</div>
                                            <div className='transactionDate'>{formatDate(transaction.transaction_date)}</div>
                                        </div>
                                        <div className='transactionStockQuantity'>{transaction.quantity}</div>
                                        <div className='transactionCardTypePurchase'>
                                            <div className='transactionType'>{transaction.transaction_type}</div>
                                            <div className='transactionPurchase'>purchase price {transaction.purchase_price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExchangeTransactions;