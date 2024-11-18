import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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
    const [data, setData] = useState({
        labels: [], 
        datasets: [
            {
                label: 'Cost', 
                data: [], 
                borderColor: 'rgba(75, 192, 192, 1)', 
                backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                fill: true, 
                tension: 0.1 
            }
        ]
    });

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stocks');
                const data = await response.json();
                const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

                data[0].price_history.push(parseFloat(data[0].price));

                setData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Cost',
                            data: data[0].price_history,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                            tension: 0.1
                        }
                    ]
                });
            } catch (error) {
                console.error('Error -  ', error);
            }
        };

        fetchStocks();
    }, []);
    return (
        <div>
            <Line data={data} />
        </div>
    );
};

export default Exchange;