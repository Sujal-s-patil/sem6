import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFile(files[0]); // Set the uploaded file
    } else {
      setComplaintData({
        ...complaintData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

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

          // Navigate to a success page or show success message
          navigate('/dashboard'); // Adjust the route as per your app
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

        // Navigate to a success page or show success message
        navigate('/dashboard'); // Adjust the route as per your app
      }
    } catch (err) {
      console.error('Error filing complaint:', err);
      setError('An error occurred while filing the complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formInputs = [
    { label: 'Complainant Name', name: 'complainant_name', type: 'text' },
    { label: 'Crime Type', name: 'crime_type', type: 'text' },
    { label: 'Crime Description', name: 'crime_description', type: 'textarea' },
    { label: 'Crime Location', name: 'crime_location', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'State', name: 'state', type: 'text' },
    { label: 'Crime Date', name: 'crime_date', type: 'date' },
  ];

  return (
    <div className="form-container">
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit} className="complaint-form">
        {formInputs.map((input) => (
          <div key={input.name} className="form-group">
            <label htmlFor={input.name}>{input.label}:</label>
            {input.type === 'textarea' ? (
              <textarea
                name={input.name}
                value={complaintData[input.name] || ''}
                onChange={handleChange}
                required
                id={input.name}
              />
            ) : (
              <input
                type={input.type}
                name={input.name}
                value={complaintData[input.name] || ''}
                onChange={handleChange}
                required
                id={input.name}
              />
            )}
          </div>
        ))}

        {/* File Upload Section */}
        <div className="form-group">
          <label htmlFor="file">Upload Proof (optional):</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            id="file"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileComplaint;
