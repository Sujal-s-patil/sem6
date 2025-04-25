import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import '../css/Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null); // State for the selected complaint
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [proofLinks, setProofLinks] = useState([]); // State to store proof links
  const [isProofPopupVisible, setIsProofPopupVisible] = useState(false); // State to manage proof popup visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Effect to handle theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
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
  }

  const fetchProofLinks = async (complaintId) => {
    try {
      const response = await fetch(`http://localhost:5555/photo/${complaintId}`);
      if (response.ok) {
        const data = await response.json();
        setProofLinks(data); // Set the proof links
        setIsProofPopupVisible(true); // Show the proof popup
      } else {
        console.error('Failed to fetch proof links.');
      }
    } catch (err) {
      console.error('Error fetching proof links:', err);
    }
  };

  const closeProofPopup = () => {
    setIsProofPopupVisible(false); // Close the proof popup
    setProofLinks([]); // Clear the proof links
  };

  return (
    <>
      <UserNav />
      <div className="complaints-container">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
            </svg>
          ) : (
            <svg className="theme-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          )}
        </button>
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
          <>
            <p className="no-complaints">No complaints found.</p>
            <div className="button-container">
              <button className="back-btn" onClick={() => navigate('/home')}>
                Back to Dashboard
              </button>
            </div>
          </>

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

                <div className="proof-section">
                  <p><strong>Uploaded Proof:</strong></p>
                  <button
                    className="download-link"
                    onClick={() => fetchProofLinks(selectedComplaint.complaint_id)}
                  >
                    Download Proof
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popup for proof links */}
        {isProofPopupVisible && (
          <div className="popup-overlay" onClick={closeProofPopup}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h3>Proof Files</h3>
                <button className="modern-close-btn" onClick={closeProofPopup}>
                  ✖
                </button>
              </div>
              <div className="popup-content">
                {proofLinks.length > 0 ? (
                  <div className="proof-grid">
                    {proofLinks.map((file, index) => {
                      const fileExtension = file.link.split('.').pop().toLowerCase();
                      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                        // Render image
                        return (
                          <div key={index} className="proof-item">
                            <img
                              src={file.link}
                              alt={`Proof ${index + 1}`}
                              className="proof-image"
                              onClick={() => window.open(file.link, '_blank')}
                            />
                          </div>
                        );
                      } else if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension)) {
                        // Render video
                        return (
                          <div key={index} className="proof-item">
                            <video controls className="proof-video">
                              <source src={file.link} type={`video/${fileExtension}`} />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        );
                      } else {
                        // Render as a downloadable link for other file types
                        return (
                          <div key={index} className="proof-item">
                            <a href={file.link} target="_blank" rel="noopener noreferrer" download>
                              Download File {index + 1}
                            </a>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <p>No proof files available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Complaints;