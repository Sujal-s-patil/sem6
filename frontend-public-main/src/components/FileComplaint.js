import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import '../css/FileComplaint.css';

const FileComplaint = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [complaintData, setComplaintData] = useState({
    complainant_name: '',
    crime_type: '',
    crime_description: '',
    crime_location: '',
    city: '',
    state: '',
    crime_date: '',
  });

  // Effect to handle theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Function to toggle theme
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

  const [file, setFile] = useState(null); // State to hold the uploaded file
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!complaintData.complainant_name.trim()) {
      errors.complainant_name = 'Complainant name is required';
    }
    
    if (!complaintData.crime_type.trim()) {
      errors.crime_type = 'Crime type is required';
    }
    
    if (!complaintData.crime_description.trim()) {
      errors.crime_description = 'Crime description is required';
    } else if (complaintData.crime_description.length < 20) {
      errors.crime_description = 'Description must be at least 20 characters';
    }
    
    if (!complaintData.crime_location.trim()) {
      errors.crime_location = 'Crime location is required';
    }
    
    if (!complaintData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!complaintData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!complaintData.crime_date) {
      errors.crime_date = 'Crime date is required';
    } else {
      const selectedDate = new Date(complaintData.crime_date);
      const today = new Date();
      
      if (selectedDate > today) {
        errors.crime_date = 'Crime date cannot be in the future';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFile(files[0]); // Set the uploaded file
      setFileName(files[0] ? files[0].name : ''); // Set the file name
      
      // Clear file-related validation errors
      if (validationErrors.file) {
        setValidationErrors({
          ...validationErrors,
          file: null
        });
      }
    } else {
      setComplaintData({
        ...complaintData,
        [name]: value,
      });
      
      // Clear validation error for this field when user types
      if (validationErrors[name]) {
        setValidationErrors({
          ...validationErrors,
          [name]: null
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please correct the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Step 1: Get `complaint_id` from the server
      const idResponse = await fetch(`${process.env.REACT_APP_API_URL}/ticket/last`, {
        method: 'GET',
      });
      if (!idResponse.ok) {
        throw new Error('Failed to get complaint ID.');
      }

      // Step 2: Get `public_id` from session cookies
      const storedUserData = sessionStorage.getItem('userData');
      const userData = JSON.parse(storedUserData);

      // Step 3: Get the current date and time for `date_filed` and `last_updated`
      const currentDate = new Date();
      const date_filed = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

      // Step 4: Construct the payload
      const payload = {
        ...complaintData,
        public_id: Number(userData.id), // Ensure public_id is sent as a number
        status: 'Pending',
        date_filed,
        last_updated: date_filed,
      };

      // If a file is uploaded, encode it as Base64
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const fileBase64 = fileReader.result.split(',')[1]; // Base64 string
          payload.file = fileBase64; // Add the Base64-encoded file to the payload

          // Step 5: Send the payload to the server
          const response = await fetch(`${process.env.REACT_APP_API_URL}/ticket/create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error('Failed to file complaint. Please try again.');
          }

          const result = await response.json();
          console.log('Complaint filed successfully:', result);
          setSuccessMessage('Your complaint has been successfully filed!');
          
          // Reset form after successful submission
          setTimeout(() => {
            navigate('/home'); // Navigate to home page after showing success message
          }, 2000);
        };
        fileReader.readAsDataURL(file);
      } else {
        // If no file, directly send the payload
        const response = await fetch(`${process.env.REACT_APP_API_URL}/ticket/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to file complaint. Please try again.');
        }

        const result = await response.json();
        console.log('Complaint filed successfully:', result);
        setSuccessMessage('Your complaint has been successfully filed!');
        
        // Reset form after successful submission
        setTimeout(() => {
          navigate('/home'); // Navigate to home page after showing success message
        }, 2000);
      }
    } catch (err) {
      console.error('Error filing complaint:', err);
      setError('An error occurred while filing the complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formInputs = [
    { 
      label: 'Complainant Name', 
      name: 'complainant_name', 
      type: 'text',
      placeholder: 'Enter your full name'
    },
    { 
      label: 'Crime Type', 
      name: 'crime_type', 
      type: 'text',
      placeholder: 'e.g., Theft, Assault, Fraud'
    },
    { 
      label: 'Crime Description', 
      name: 'crime_description', 
      type: 'textarea',
      placeholder: 'Provide detailed information about the crime (minimum 20 characters)'
    },
    { 
      label: 'Crime Location', 
      name: 'crime_location', 
      type: 'text',
      placeholder: 'Specific location where the crime occurred'
    },
    { 
      label: 'City', 
      name: 'city', 
      type: 'text',
      placeholder: 'Enter city name'
    },
    { 
      label: 'State', 
      name: 'state', 
      type: 'text',
      placeholder: 'Enter state name'
    },
    { 
      label: 'Crime Date', 
      name: 'crime_date', 
      type: 'date',
      placeholder: 'Select the date when the crime occurred'
    },
  ];

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

      <UserNav />
      <div className="form-container">
        <h2>File a Complaint</h2>
        <p className="form-description">
          Please fill out the form below to file your complaint. All fields marked with an asterisk (*) are required.
        </p>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="complaint-form">
            {formInputs.map((input) => (
              <div key={input.name} className="form-group">
                <label htmlFor={input.name}>
                  {input.label} <span className="required">*</span>
                </label>
                <div className="input-cell">
                  {input.type === 'textarea' ? (
                    <textarea
                      name={input.name}
                      value={complaintData[input.name] || ''}
                      onChange={handleChange}
                      required
                      id={input.name}
                      placeholder={input.placeholder}
                      className={validationErrors[input.name] ? 'error' : ''}
                    />
                  ) : (
                    <input
                      type={input.type}
                      name={input.name}
                      value={complaintData[input.name] || ''}
                      onChange={handleChange}
                      required
                      id={input.name}
                      placeholder={input.placeholder}
                      className={validationErrors[input.name] ? 'error' : ''}
                    />
                  )}
                  {validationErrors[input.name] && (
                    <div className="field-error">{validationErrors[input.name]}</div>
                  )}
                </div>
              </div>
            ))}

            {/* File Upload Section */}
            <div className="form-group">
              <label htmlFor="file">
                Upload Proof (optional)
              </label>
              <div className="input-cell">
                <div className="file-upload-container">
                  <label className="file-upload-label" htmlFor="file">
                    <span>📁</span> Choose a file
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    id="file"
                  />
                  {fileName && <div className="file-name">Selected: {fileName}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="button-container">
            <button 
              type="button" 
              className="back-dashboard-button"
              onClick={() => navigate('/home')}
            >
              Back to Dashboard
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FileComplaint;
