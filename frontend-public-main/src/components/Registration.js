import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Registration.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    aadharcardno: '',
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
  const navigate = useNavigate();

  // Ensure password and confirm password match
  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle photo upload
    if (name === 'photo') {
      setFormData({ ...formData, photo: files?.[0] || null });
    } else if (name === 'aadharcardno' || name === 'phoneno') {
      // Convert aadharcardno and phoneno to numbers
      setFormData({ ...formData, [name]: value.replace(/\D/g, '') }); // Allow only numeric characters
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Convert file to Base64
  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // Base64 string
      reader.onerror = (error) => reject(error);
    });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert('Passwords do not match!');
      return;
    }

    // Validate Aadhar Card and Phone Number length
    if (formData.aadharcardno.length !== 12) {
      alert('Aadhar Card Number must be exactly 12 digits.');
      return;
    }

    if (formData.phoneno.length !== 10) {
      alert('Phone Number must be exactly 10 digits.');
      return;
    }

    try {
      let photoBase64 = null;

      // If photo is provided, convert it to Base64
      if (formData.photo) {
        photoBase64 = await convertFileToBase64(formData.photo);
      }

      // Prepare JSON data to send
      const dataToSend = {
        fullName: formData.fullName,
        aadharcardno: Number(formData.aadharcardno), // Ensure number
        email: formData.email,
        phoneno: Number(formData.phoneno), // Ensure number
        address: formData.address,
        city: formData.city,
        state: formData.state,
        password: formData.password,
        photo: photoBase64, // Include Base64 photo if available
      };

      // Send JSON data to the server
      const response = await fetch(`${process.env.REACT_APP_API_URL}/public/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Convert data to JSON string
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message === 'success') {
          alert('Registration successful!');
          navigate('/'); // Redirect to login page after successful registration
        } else {
          alert(result.message || 'Failed to register.');
        }
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        {[ 
          { label: 'Full Name', name: 'fullName', type: 'text' },
          { label: 'Aadhar Card No', name: 'aadharcardno', type: 'text' },
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
        <button type="submit" className="submit-button">Register</button>
      </form>
      <button onClick={() => navigate('/')} className="back-button">Back to Login</button>
    </div>
  );
};

export default Registration;
