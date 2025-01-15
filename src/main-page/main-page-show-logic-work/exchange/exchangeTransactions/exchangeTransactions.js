import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Транзакції користувача</h2>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        <p>name: {transaction.stock_name}</p>
                        <p>amount: {transaction.quantity}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExchangeTransactions;