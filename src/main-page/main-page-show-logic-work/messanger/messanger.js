import React, { useEffect, useState } from 'react';
import './messanger.css';

function Messanger() {
    const [users, setUsers] = useState([]);
    const [conferences, setConferences] = useState([]);
    const [selectedConferenceId, setSelectedConferenceId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/api/conferences', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setConferences(data))
            .catch(error => console.error('Error fetching conferences:', error));
    }, []);

    const viewMessages = (conferenceId) => {
        setSelectedConferenceId(conferenceId);

        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/messages?conferenceId=${conferenceId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(error => console.error('Error fetching messages:', error));
    };

    const checkConferenceExistence = (targetUserId) => {
        const token = localStorage.getItem('token');

        return fetch(`http://localhost:3000/api/conferences/check?targetUserId=${targetUserId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json());
    };

    const startConference = (targetUserId) => {
        checkConferenceExistence(targetUserId)
            .then(response => {
                if (response.exists) {
                    alert('Діалог вже існує!');
                } else {
                    const token = localStorage.getItem('token');
                    fetch('http://localhost:3000/api/conference', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ targetUserId }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.message === 'Діалог створено') {
                                alert('Діалог створено!');
                                setConferences([...conferences, { id: data.dialogId, otherUserId: targetUserId }]);
                            } else {
                                alert('Помилка при створенні діалогу');
                            }
                        })
                        .catch(error => console.error('Error creating conference:', error));
                }
            })
            .catch(error => console.error('Error checking conference existence:', error));
    };

    const sendMessage = () => {
        if (messageText.trim()) {
            const token = localStorage.getItem('token');
            const currentTime = new Date().toISOString();

            fetch('http://localhost:3000/api/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conferenceId: selectedConferenceId,
                    message: messageText,
                    created_at: currentTime,
                }),
            })
                .then(response => response.json())
                .then(() => {
                    setMessages(prevMessages => [...prevMessages, { sender_id: userId, message: messageText, sender_type: 'You', created_at: currentTime }]);
                    setMessageText('');
                })
                .catch(error => console.error('Error sending message:', error));
        }
    };

    return (
        <div>
            <h1>Список користувачів</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.username}
                        <button onClick={() => startConference(user.id)}>Створити діалог</button>
                    </li>
                ))}
            </ul>

            <h2>Ваші діалоги</h2>
            <ul>
                {conferences.map(conference => (
                    <li key={conference.id}>
                        <button onClick={() => viewMessages(conference.id)}>
                            Діалог з користувачем ID {conference.otherUserId}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedConferenceId && (
                <div>
                    <h3>Повідомлення</h3>
                    <ul>
                        {messages.map((message, index) => (
                            <li key={index}>
                                <strong>{message.sender_type}:</strong> {message.message}
                                <span> ({new Date(message.created_at).toLocaleString()})</span>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <input
                            type="text"
                            placeholder="Напишіть повідомлення"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                        />
                        <button onClick={sendMessage}>Надіслати</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Messanger;
