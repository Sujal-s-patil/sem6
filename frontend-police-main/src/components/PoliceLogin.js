import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PoliceLogin.css';

const PoliceLogin = () => {
  const [policeId, setPoliceId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      police_id: policeId,
      password: password,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/police/login`, {
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
        setPassword('');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred while trying to log in.');
      setPassword('');
    }
  };

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? (
          <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
        ) : (
          <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
        )}
      </button>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
      }}>
        <div className="police-login-container">
          <h2>Police Login</h2>
          <form onSubmit={handleLogin} autoComplete="off">
            <div>
              <input
                type="text"
                value={policeId}
                onChange={(e) => setPoliceId(e.target.value)}
                placeholder="Police ID"
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
      </div>
    </>
  );
};

export default PoliceLogin;
