import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State for the selected complaint
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const storedUserData = sessionStorage.getItem('userData');
      const userData = JSON.parse(storedUserData);
      const dataToSend = { public_id: userData.id };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/ticket/specific`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      if (response.ok) {
        setComplaints(data);
      } else {
        setError(data.message || 'Failed to fetch complaints.');
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('An error occurred while fetching complaints.');
    }
  };

  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint); // Set the selected complaint
  };

  const closePopup = () => {
    setSelectedComplaint(null); // Close the popup
  };

  return (
    <div className="complaints-container">
      <h2>Your Complaints</h2>
      {error && <p className="error-message">{error}</p>}
      {complaints.length > 0 ? (
        <>
          <div className="table-scrollable">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Crime Type</th>
                  <th>Crime Location</th>
                  <th>Date Filed</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.complaint_id} onClick={() => handleRowClick(complaint)}>
                    <td>
                      <span className="table-icon status-icon">
                        {complaint.status.toLowerCase() === 'resolved' && <span className="tick"></span>}
                        {complaint.status.toLowerCase() === 'in progress' && (
                          <span className="spinner"></span>
                        )}
                        {complaint.status.toLowerCase() === 'pending' && (
                          <span className="pending-icon"></span>
                        )}
                        {complaint.status.toLowerCase() === 'closed' && <span className="dash-circle"></span>}
                      </span>
                      {complaint.status}
                    </td>
                    <td>{complaint.crime_type}</td>
                    <td>{complaint.crime_location}</td>
                    <td>{new Date(complaint.date_filed).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="button-container">
            <button className="back-btn" onClick={() => navigate('/home')}>
              Back to Dashboard
            </button>
          </div>
        </>
      ) : (
        <p className="no-complaints">No complaints found.</p>
      )}

      {/* Popup for complaint details */}
      {selectedComplaint && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Complaint Details</h3>
              <button className="modern-close-btn" onClick={closePopup}>
                ✖
              </button>
            </div>
            <div className="popup-content">
              <table className="popup-table">
                <tbody>
                  <tr>
                    <th>Complainant</th>
                    <td>{selectedComplaint.complainant_name}</td>
                    <th>Status</th>
                    <td>{selectedComplaint.status}</td>
                  </tr>
                  <tr>
                    <th>Crime Type</th>
                    <td>{selectedComplaint.crime_type}</td>
                    <th>Crime Date</th>
                    <td>{new Date(selectedComplaint.crime_date).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Crime Location</th>
                    <td>{selectedComplaint.crime_location}</td>
                    <th>City</th>
                    <td>{selectedComplaint.city}</td>
                  </tr>
                  <tr>
                    <th>State</th>
                    <td>{selectedComplaint.state}</td>
                    <th>Date Filed</th>
                    <td>{new Date(selectedComplaint.date_filed).toLocaleString()}</td>
                  </tr>
                  <tr className="full-width-row">
                    <th>Crime Description</th>
                    <td colSpan="3">{selectedComplaint.crime_description || 'No description provided.'}</td>
                  </tr>
                </tbody>
              </table>
              {selectedComplaint.file && (
                <div className="proof-section">
                  <p><strong>Uploaded Proof:</strong></p>
                  <a
                    href={`data:application/octet-stream;base64,${selectedComplaint.file}`}
                    download="complaint_proof"
                    className="download-link"
                  >
                    Download Proof
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;