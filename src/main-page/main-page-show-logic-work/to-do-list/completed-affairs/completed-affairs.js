import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './completed-affairs.css';
import ToDoListHeader from '../to-do-list-header/to-do-list-header';
import useBallsAnimation from '../../../hooks/useBallsAnimation';

function CompletedAffairs() {
    const [completedAffairs, setCompletedAffairs] = useState([]);
    const balls = useBallsAnimation();

    useEffect(() => {
        axios.get('http://localhost:5000/completed_affairs')
            .then(response => setCompletedAffairs(response.data))
            .catch(error => console.error('Error fetching completed affairs:', error));
    }, []);

    const handleDeleteCompletedAffair = (id) => {
        axios.delete(`http://localhost:5000/completed_affairs/${id}`)
            .then(() => {
                setCompletedAffairs(completedAffairs.filter(affair => affair.id !== id));
            })
            .catch(error => console.error('Error deleting completed affair:', error));
    };

    return (
        <div className='background'>
            <ToDoListHeader />
            <div className='containerForBalls'></div>
            <div className='cardsContainerDaily'>
                {completedAffairs.map(affair => (
                    <div key={affair.id} className='cardDailyAffair'>
                        <div className='headCardForDailyAffair'>
                            <div className='affairName'>{affair.name}</div>
                            <div>{affair.end_time}</div>
                        </div>
                        <div className='descDailyAffairCard'>{affair.description}</div>
                        <div className='tagsDailyAffairCard'>{Array.isArray(affair.tags) ? affair.tags.join(', ') : affair.tags}</div>
                        <div className='completionTime'>Completed on: {affair.completion_time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompletedAffairs;