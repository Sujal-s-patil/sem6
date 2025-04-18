import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Dashboard.css';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]); // State to store fetched data
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [error, setError] = useState(null); // State for error handling

  const navigate = useNavigate(); // Initialize navigate using useNavigate

  // Function to handle fetching complaints and showing the popup
  const handleCheckComplaints = () => {
    navigate('/complaints'); // Navigate to the complaints page
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false); // Close the popup
    setComplaints([]); // Clear fetched data
  };

  // Remove complaint_id and public_id fields from data
  const cleanComplaintData = (complaint) => {
    const { complaint_id, public_id, ...cleanedData } = complaint;
    return cleanedData;
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <p>Welcome to the Dashboard. Please select an action:</p>
      <div className="button-container">
        <button className="check-complaint-btn" onClick={handleCheckComplaints}>
          Check Complaint
        </button>
        <button
          className="file-complaint-btn"
          onClick={() => navigate('/file-complaint')}
        >
          File a Complaint
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Dashboard;
