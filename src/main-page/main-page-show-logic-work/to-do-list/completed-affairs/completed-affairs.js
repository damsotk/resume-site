import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './completed-affairs.css';
import ToDoListHeader from '../to-do-list-header/to-do-list-header';
import useBallsAnimation from '../../../hooks/useBallsAnimation';

function CompletedAffairs() {
    const balls = useBallsAnimation();
    const [completeAffairs, setCompleteAffairs] = useState([]);

    useEffect(() => {
        const fetchAffairs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/api/user-completed-affairs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Помилка отримання завдань');
                }

                const data = await response.json();
                setCompleteAffairs(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAffairs();
    }, []);
    return (
        <div className='background'>
            <ToDoListHeader />
            <div className='containerForBalls'></div>
            <div className='cardsContainerDaily'>
                {(
                    completeAffairs.map((affair) => (
                        <div className='cardDailyAffair' key={affair.id}>
                            <div className='headCardForDailyAffair'>
                                <div className='affairName'>{affair.affair_name}</div>
                                <div>
                                    {(() => {
                                        const date = new Date(affair.affair_end_date);
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const year = date.getFullYear();
                                        return `${day}.${month}.${year}`;
                                    })()}
                                </div>
                            </div>
                            <div className='descDailyAffairCard'>{affair.affair_description}</div>
                            <div className='tagsDailyAffairCard'>{Array.isArray(affair.affair_tags) ? affair.affair_tags.join(', ') : ''}</div>
                            <div className='completionTime'>
                                Completed on: {(() => {
                                    const date = new Date(affair.affair_finish_date);
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    const hours = String(date.getHours()).padStart(2, '0');
                                    const minutes = String(date.getMinutes()).padStart(2, '0');
                                    return `${day}.${month}.${year}, ${hours}:${minutes}`;
                                })()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CompletedAffairs;