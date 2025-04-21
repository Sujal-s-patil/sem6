import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import '../css/FileComplaint.css';

const FileComplaint = () => {
  const navigate = useNavigate();
  const [complaintData, setComplaintData] = useState({
    complainant_name: '',
    crime_type: '',
    crime_description: '',
    crime_location: '',
    city: '',
    state: '',
    crime_date: '',
  });

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
