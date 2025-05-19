import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Check if email or phone already exists
            const existingUser = await axios.post('/auth/check-user', { email, phone });

            if (existingUser.data.exists) {
                console.log('User already exists');
                navigate('/login'); // Redirect to login if user exists
            } else {
                // Proceed with registration
                const response = await axios.post('/auth/register', { name, email, phone, password });

                console.log(response); // Debug the response

                if (response?.data?.token) {
                    localStorage.setItem('token', response.data.token);
                    console.log('Registration successful, navigating to dashboard');
                    navigate('/dashboard');
                } else {
                    setError('Registration failed, no token received');
                }
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response ? err.response.data.message : 'Registration failed');
        }
    };

    return (
        <div className="register-form" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Register</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%' }}
                    />
                </div>

                <button type="submit" style={{ width: '100%', height: '30px' }}>Register</button>
            </form>

            <div className="login-link" style={{ marginTop: '10px' }}>
                <p>
                    Already have an account?{' '}
                    <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
