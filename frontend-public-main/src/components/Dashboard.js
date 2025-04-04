import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Dashboard</h2>
      <p>Welcome to the Dashboard. Please select an action:</p>
      <div style={{ margin: '20px 0' }}>
        {/* Check Complaint Button */}
        <button
          onClick={handleCheckComplaints}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Check Complaint
        </button>

        {/* File a Complaint Button */}
        <button
          onClick={() => navigate('/file-complaint')} // Correct the path here
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28A745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          File a Complaint
        </button>
      </div>

      {/* Error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Popup for displaying complaint data */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '20px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden', // Prevents overflow outside the popup area
          }}
        >
          <h3>Complaints</h3>
          {/* Close button for the popup */}
          <button
            onClick={closePopup}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            ❌
          </button>

          {/* Displaying complaints in a table */}
          {complaints.length > 0 ? (
            <div
              style={{
                maxHeight: '400px', // Limits the height of the table area
                overflowY: 'auto',  // Makes the table body scrollable if content is too long
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th> {/* Moved status to first column */}
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Complainant Name</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Crime Type</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Crime Description</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Crime Location</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>City</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>State</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Crime Date</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date Filed</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => {
                    const cleanedComplaint = cleanComplaintData(complaint);
                    return (
                      <tr key={complaint.complaint_id}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.status} {/* Moved status to first column */}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.complainant_name}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.crime_type}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.crime_description}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.crime_location}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.city}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {cleanedComplaint.state}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {new Date(cleanedComplaint.crime_date).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {new Date(cleanedComplaint.date_filed).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {new Date(cleanedComplaint.last_updated).toLocaleString()}
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

      {/* Background overlay to close the popup when clicked */}
      {showPopup && (
        <div
          onClick={closePopup}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
