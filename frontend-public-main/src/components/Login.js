import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {
  const [aadharCardNo, setAadharCardNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      aadharcardno: aadharCardNo,
      password: password,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/public/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.message === "Login successful") {
        sessionStorage.setItem('userData', JSON.stringify(data[0]));
        navigate('/home');
      } else {
        setErrorMessage(data.message || 'Login failed');
        setPassword(''); // Clear the password field for security
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred while trying to log in.');
      setPassword(''); // Clear the password field for security
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} autoComplete="off">
        <div>
          <input
            type="text"
            value={aadharCardNo}
            onChange={(e) => setAadharCardNo(e.target.value)}
            placeholder="Aadhar Card Number"
            autoComplete="off"
            maxLength="12"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="off"
          />
        </div>
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        <button type="submit">Login</button>
        <button type="button" onClick={() => navigate('/register')}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
