import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Dashboard.css';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]); // State to store fetched data
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [error, setError] = useState(null); // State for error handling
  const [showProfilePopup, setShowProfilePopup] = useState(false); // State to control profile popup visibility
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // State to control logout confirmation popup
  const profilePopupRef = useRef(null); // Ref for the profile popup container
  const logoutConfirmationRef = useRef(null); // Ref for the logout confirmation popup

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

  // Function to toggle profile popup
  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  // Function to close profile popup
  const closeProfilePopup = () => {
    // Add closing class to trigger animation
    const popupElement = profilePopupRef.current;
    if (popupElement) {
      popupElement.classList.add('closing');
      
      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setShowProfilePopup(false);
      }, 300); // Match the animation duration
    } else {
      // If element not found, just close immediately
      setShowProfilePopup(false);
    }
  };

  // Function to show logout confirmation
  const showLogoutConfirmationPopup = () => {
    setShowLogoutConfirmation(true);
  };

  // Function to cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear any stored user data or tokens
    sessionStorage.removeItem('userData');
    // Redirect to login page
    navigate('/');
  };

  // Effect to handle clicks outside the profile popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target) && 
          !event.target.closest('.profile-circle')) {
        // Add closing class to trigger animation
        const popupElement = profilePopupRef.current;
        popupElement.classList.add('closing');
        
        // Wait for animation to complete before actually closing
        setTimeout(() => {
          setShowProfilePopup(false);
        }, 300); // Match the animation duration
      }
    };

    // Add event listener when popup is shown
    if (showProfilePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener when popup is closed or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePopup]);

  // Effect to handle clicks outside the logout confirmation popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutConfirmationRef.current && !logoutConfirmationRef.current.contains(event.target) && 
          !event.target.closest('.logout-button')) {
        setShowLogoutConfirmation(false);
      }
    };

    // Add event listener when popup is shown
    if (showLogoutConfirmation) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up event listener when popup is closed or component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutConfirmation]);

  // Remove complaint_id and public_id fields from data
  const cleanComplaintData = (complaint) => {
    const { complaint_id, public_id, ...cleanedData } = complaint;
    return cleanedData;
  };

  // Mock user data (in a real app, this would come from an API or context)
  const userData = {
    name: "John Doe",
    aadharNo: "1234-5678-9012",
    phoneNo: "+91 9876543210",
    address: "123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001"
  };

  return (
    <>
      <div className="user-profile-container">
        <div className="user-profile">
          <div className="profile-circle" onClick={toggleProfilePopup}>
            <div className="profile-content">
              <svg className="profile-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className="profile-text">Profile</span>
            </div>
          </div>
          
          {/* Profile Popup - Now positioned below the profile circle */}
          {showProfilePopup && (
            <div className="profile-popup-container" ref={profilePopupRef}>
              <div className="profile-popup-header">
                <h3>User Profile</h3>
                <button className="profile-close-btn" onClick={closeProfilePopup}>✖</button>
              </div>
              <div className="profile-popup-content">
                <div className="profile-info-item">
                  <span className="profile-info-label">Name:</span>
                  <span className="profile-info-value">{userData.name}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Aadhar Card No:</span>
                  <span className="profile-info-value">{userData.aadharNo}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Phone No:</span>
                  <span className="profile-info-value">{userData.phoneNo}</span>
                </div>
                <div className="profile-info-item">
                  <span className="profile-info-label">Address:</span>
                  <span className="profile-info-value">{userData.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button className="logout-button" onClick={showLogoutConfirmationPopup}>
          <span className="logout-icon">⏻</span>
        </button>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirmation && (
        <div className="logout-confirmation-overlay">
          <div className="logout-confirmation-popup" ref={logoutConfirmationRef}>
            <div className="logout-confirmation-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-confirmation-content">
              <p className="logout-confirmation-message">Are you sure you want to log out?</p>
              <div className="logout-confirmation-buttons">
                <button className="logout-confirm-btn cancel" onClick={cancelLogout}>Cancel</button>
                <button className="logout-confirm-btn confirm" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default Dashboard;
