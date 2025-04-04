import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [Police_id, setPolice_id] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      police_id: Police_id,
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
        navigate('/KanbanBoard');
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
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', backgroundColor: '#f0f4f8'
    }}>
      <div style={{
        maxWidth: '400px', width: '100%', backgroundColor: '#ffffff',
        padding: '30px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#003366' }}>Police Login</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              value={Police_id}
              onChange={(e) => setPolice_id(e.target.value)}
              placeholder="Police ID"
              autoComplete="off"
              maxLength="12" 
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #003366',
                boxSizing: 'border-box', fontSize: '16px', color: '#003366'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="off"
              style={{
                width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #003366',
                boxSizing: 'border-box', fontSize: '16px', color: '#003366'
              }}
            />
          </div>
          {errorMessage && (
            <div style={{ color: 'red', marginBottom: '15px' }}>{errorMessage}</div>
          )}
          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', backgroundColor: '#003366', color: 'white',
              border: 'none', cursor: 'pointer', borderRadius: '10px', marginBottom: '15px',
              fontSize: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              width: '100%', padding: '12px', backgroundColor: '#28A745', color: 'white',
              border: 'none', cursor: 'pointer', borderRadius: '10px', fontSize: '16px'
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
