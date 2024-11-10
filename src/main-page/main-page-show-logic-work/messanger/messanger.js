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
                    const existingConference = conferences.find(conference => conference.otherUserId === targetUserId);
                    if (existingConference) {
                        viewMessages(existingConference.id);
                    }
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
                            if (data.message === 'The dialog is created') {
                                const newConference = { id: data.dialogId, otherUserId: targetUserId };
                                setConferences([...conferences, newConference]);
                                viewMessages(data.dialogId);
                            } else {
                                alert('Error with creating dialog');
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
        <div className='backgroundMessanger'>

            <div className='messangerFlex'>
                <div className='allContacts'>
                    {users.map(user => (
                        <div onClick={() => startConference(user.id)} className='contactUser' key={user.id}>
                            <div className='contactUserName'>
                                {user.username}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='messangerDisplay'>
                    {selectedConferenceId && (
                        <div className='privateMessageFlex' style={{ color: "white" }}>
                            <div style={{ paddingLeft: "10px", paddingRight: "10px", paddingBottom: "10px" }}>
                                {messages.map((message, index) => {
                                    const messageDate = new Date(message.created_at);
                                    const currentDate = new Date();
                                    const isToday =
                                        messageDate.getDate() === currentDate.getDate() &&
                                        messageDate.getMonth() === currentDate.getMonth() &&
                                        messageDate.getFullYear() === currentDate.getFullYear();

                                    return (
                                        <div key={index} className={message.sender_type !== 'You' ? 'messageFromAnotherUser' : 'messageUser'}>
                                            <div className='messageDesign'>
                                                <div className='message'>
                                                    <div className='infoForMessage'>
                                                        <div className='messageTypePosition'>
                                                            {message.sender_type}
                                                        </div>
                                                        <div className='messageDateSend'>
                                                            {isToday
                                                                ? messageDate.toLocaleTimeString()
                                                                : messageDate.toLocaleDateString()} 
                                                        </div>
                                                    </div>
                                                    {message.message}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='boxForSendMessages'>
                                <input
                                    type="text"
                                    placeholder="Message"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                    className='sendMessageInput'
                                />
                                <div className='messangerSendButton' onClick={sendMessage}>Send</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messanger;
