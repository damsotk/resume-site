import React, { useState } from 'react';
import './login.css';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        } else {
            alert(data.message);
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
                        />
                    </div>

                    <div className='boxForLogin'>
                        <div className='infoForLogin'>your password</div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className='buttonForLogin'>LOGIN</button>
                </form>
                <div className='textWhereAccount'>The website does not have the option to create an account. If you have somehow arrived here, it means the website owner must have given you a username and password for the account! Have fun!</div>

            </div>
        </div>


    );
};

export default Login;
