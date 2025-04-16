import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Dashboard.css';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]); // State to store fetched data
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [error, setError] = useState(null); // State for error handling

  const navigate = useNavigate(); // Initialize navigate using useNavigate

  // Function to handle fetching complaints and showing the popup
  const handleCheckComplaints = async () => {
    try {
      const storedUserData = sessionStorage.getItem('userData');
      const userData = JSON.parse(storedUserData);
      const dataToSend = {
        public_id: userData.id,
      };
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ticket/specific`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Convert the data to JSON string
      });

      const data = await response.json();
      if (response.ok) {
        setComplaints(data); // Save the fetched data
        setShowPopup(true); // Show the popup
      } else {
        setError(data.message || 'Failed to fetch complaints.');
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('An error occurred while fetching complaints.');
    }
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
      {showPopup && (
        <div className="popup-container">
          <h3>Complaints</h3>
          <button className="close-btn" onClick={closePopup}>
            ❌
          </button>
          {complaints.length > 0 ? (
            <div className="table-scrollable">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Complainant Name</th>
                    <th>Crime Type</th>
                    <th>Crime Description</th>
                    <th>Crime Location</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Crime Date</th>
                    <th>Date Filed</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => {
                    const cleanedComplaint = cleanComplaintData(complaint);
                    return (
                      <tr key={complaint.complaint_id}>
                        <td>{cleanedComplaint.status}</td>
                        <td>{cleanedComplaint.complainant_name}</td>
                        <td>{cleanedComplaint.crime_type}</td>
                        <td>{cleanedComplaint.crime_description}</td>
                        <td>{cleanedComplaint.crime_location}</td>
                        <td>{cleanedComplaint.city}</td>
                        <td>{cleanedComplaint.state}</td>
                        <td>
                          {new Date(cleanedComplaint.crime_date).toLocaleString()}
                        </td>
                        <td>
                          {new Date(cleanedComplaint.date_filed).toLocaleString()}
                        </td>
                        <td>
                          {new Date(
                            cleanedComplaint.last_updated
                          ).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No complaints found.</p>
          )}
        </div>
      )}
      {showPopup && <div className="popup-overlay" onClick={closePopup}></div>}
    </div>
  );
};

export default Dashboard;
