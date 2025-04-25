import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Registration.css';

const PoliceRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    police_id: '',
    email: '',
    phoneno: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
    photo: null, // Photo field
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const backConfirmationRef = useRef(null);
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

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (backConfirmationRef.current && !backConfirmationRef.current.contains(event.target) && 
          !event.target.closest('.back-button')) {
        setShowBackConfirmation(false);
      }
    };

    if (showBackConfirmation) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBackConfirmation]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      setFormData({ ...formData, photo: files?.[0] || null });
    } else if (name === 'police_id' || name === 'phoneno') {
      setFormData({ ...formData, [name]: value.replace(/\D/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const showBackConfirmationPopup = () => {
    setShowBackConfirmation(true);
  };

  const cancelBack = () => {
    setShowBackConfirmation(false);
  };

  const confirmBack = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.police_id.length !== 6) {
      alert('Police ID must be exactly 6 digits.');
      return;
    }

    if (formData.phoneno.length !== 10) {
      alert('Phone Number must be exactly 10 digits.');
      return;
    }

    try {
      let photoBase64 = null;
      if (formData.photo) {
        photoBase64 = await convertFileToBase64(formData.photo);
      }
      const dataToSend = {
        fullName: formData.fullName,
        police_id: formData.police_id,
        email: formData.email,
        phoneno: formData.phoneno,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        password: formData.password,
        photo: photoBase64,
      };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/police/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (response.ok) {
        alert('Registration successful!');
        navigate('/');
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while submitting the form.');
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
      <div className="registration-container">
        <h2>Police Registration</h2>
        <form onSubmit={handleSubmit}>
          {[ 
            { label: 'Full Name', name: 'fullName', type: 'text' },
            { label: 'Police ID', name: 'police_id', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone No', name: 'phoneno', type: 'text' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'City', name: 'city', type: 'text' },
            { label: 'State', name: 'state', type: 'text' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Re-enter Password', name: 'confirmPassword', type: 'password' },
          ].map((input) => (
            <div key={input.name} className="input-field">
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                value={formData[input.name] || ''}
                onChange={handleChange}
              />
              {input.name === 'confirmPassword' && !passwordMatch && (
                <div className="error-message">Passwords do not match!</div>
              )}
            </div>
          ))}
          <div className="input-field">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="register-button">Register</button>
            <button 
              type="button"
              onClick={showBackConfirmationPopup} 
              className="back-button"
            >
              Back to Login
            </button>
          </div>
        </form>

        {/* Back Confirmation Popup */}
        {showBackConfirmation && (
          <div className="registration-back-overlay">
            <div className="registration-back-popup" ref={backConfirmationRef}>
              <div className="registration-back-header">
                <h3>Confirm Navigation</h3>
              </div>
              <div className="registration-back-content">
                <p className="registration-back-message">Your changes will not be saved. Are you sure you want to go back?</p>
                <div className="registration-back-buttons">
                  <button className="registration-back-btn cancel" onClick={cancelBack}>Cancel</button>
                  <button className="registration-back-btn confirm" onClick={confirmBack}>Go Back</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PoliceRegistration;
