import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [formData, setFormData] = useState({
    police_id: '',
    full_name: '',
    aadhar_card: '',
    email: '',
    phone_no: '',
    address: '',
    city: '',
    state: '',
    post: '',
    speciality: '',
    description: '',
    blood_group: '',
    password: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify password match
    if (formData.password && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, photo: file });

      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      let photoBase64 = null;
  
      if (formData.photo) {
        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(formData.photo);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
  
      const { confirmPassword, ...dataToSend } = {
        ...formData,
        aadhar_card: Number(formData.aadhar_card),
        phone_no: Number(formData.phone_no),
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
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', backgroundColor: '#f0f4f8', padding: '20px'
    }}>
      <div style={{
        maxWidth: '450px', width: '100%', backgroundColor: '#ffffff',
        padding: '30px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#003366', marginBottom: '20px' }}>Register</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          {[
            { label: 'Police Id', name: 'police_id', type: 'text' },
            { label: 'Full Name', name: 'full_name', type: 'text' },
            { label: 'Aadhar Card No', name: 'aadhar_card', type: 'number' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone No', name: 'phone_no', type: 'number' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'City', name: 'city', type: 'text' },
            { label: 'State', name: 'state', type: 'text' },
            { label: 'Post', name: 'post', type: 'text' },
            { label: 'Speciality', name: 'speciality', type: 'text' },
            { label: 'Description', name: 'description', type: 'text' },
          ].map((input) => (
            <div key={input.name} style={{ marginBottom: '15px' }}>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                value={formData[input.name] || ''}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #003366',
                  boxSizing: 'border-box', fontSize: '14px', color: '#003366'
                }}
              />
            </div>
          ))}

          {/* Blood Group Dropdown */}
          <div style={{ marginBottom: '15px' }}>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #003366',
                boxSizing: 'border-box', fontSize: '14px', color: '#003366'
              }}
            >
              <option value="">Select Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {/* Password Fields */}
          {[
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Re-enter Password', name: 'confirmPassword', type: 'password' }
          ].map((input) => (
            <div key={input.name} style={{ marginBottom: '15px' }}>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                value={formData[input.name] || ''}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #003366',
                  boxSizing: 'border-box', fontSize: '14px', color: '#003366'
                }}
              />
              {input.name === 'confirmPassword' && !passwordMatch && (
                <div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>Passwords do not match!</div>
              )}
            </div>
          ))}

          {/* File Upload */}
          <div style={{ marginBottom: '15px' }}>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #003366',
                boxSizing: 'border-box', fontSize: '14px', color: '#003366'
              }}
            />
          </div>

          {/* Image Preview */}
          {photoPreview && (
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <img src={photoPreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
            </div>
          )}

          {/* Buttons */}
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#003366', color: 'white', borderRadius: '10px', fontSize: '16px' }}>
            Register
          </button>
          <button type="button" onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', backgroundColor: '#28A745', color: 'white', borderRadius: '10px', fontSize: '16px', marginTop: '10px' }}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
