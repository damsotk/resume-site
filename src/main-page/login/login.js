import React, { useState } from 'react';
import './login.css';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setError(''); // очищаємо попередні помилки
            } else {
                setError(data.message || 'Не вдалося увійти. Перевірте ваші дані.');
            }
        } catch (err) {
            setError('Помилка підключення до сервера.');
            console.error('Помилка:', err);
        }
    };

    return (
        <div className='backgroundLogin'>
            <div className='loginPlace'>
                <form className='loginPlaceForm' onSubmit={handleSubmit}>
                    <div className='logoForLogin'>DAMSOT</div>
                    <div className='loginPlaceFormDesign'></div>
                    <div className='loginPlaceFormDesignT'></div>
                    <div className='boxForLogin'>
                        <div className='infoForLogin'>your login</div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className='boxForLogin'>
                        <div className='infoForLogin'>your password</div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className='buttonForLogin' type="submit">LOGIN</button>
                </form>
                {error && <div className='error-message'>{error}</div>}
                <div className='textWhereAccount'>The website does not have the option to create an account. If you have somehow arrived here, it means the website owner must have given you a username and password for the account! Have fun!</div>
            </div>
        </div>
    );
};

export default Login;