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
                            {transactions.map(transaction => (
                                <div key={transaction.id}>
                                    <p>назва: {transaction.stock_name}</p>
                                    <p>кількість: {transaction.quantity}</p>
                                    <p>дата: {transaction.transaction_date}</p>
                                    <p>тип: {transaction.transaction_type}</p>
                                    <p>за яку суму куплено: {transaction.purchase_price}</p>
                                    <p>-------------------</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ExchangeTransactions;