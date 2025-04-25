import React, { useState, useEffect, useRef } from "react";
import "../css/Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);
  const profilePopupRef = useRef(null);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item (Police or Criminals)
  const [policeTeam, setPoliceTeam] = useState([]); // Dynamic police data
  const [criminals, setCriminals] = useState([]); // Dynamic criminal data
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person for full details
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeProfilePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowProfilePopup(false);
      setIsClosing(false);
    }, 300); // Match this with CSS animation duration
  };

  const toggleProfilePopup = () => {
    if (showProfilePopup) {
      closeProfilePopup();
    } else {
      setShowProfilePopup(true);
      setIsClosing(false);
    }
  }; // Track profile popup visibility

  // Fetch data from APIs
  useEffect(() => {
    fetch("http://localhost:5555/police/team")
      .then((response) => response.json())
      .then((data) => setPoliceTeam(data))
      .catch((error) => console.error("Error fetching police team data:", error));

    fetch("http://localhost:5555/criminal/records")
      .then((response) => response.json())
      .then((data) => setCriminals(data))
      .catch((error) => console.error("Error fetching criminal records:", error));
  }, []);

  // Handle clicks outside sidebar and popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle sidebar clicks
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
        setSelectedItem(null);
        setSelectedPerson(null);
      }

      // Handle popup clicks - close when clicking outside popup and profile toggle
      const isClickInPopup = profilePopupRef.current && profilePopupRef.current.contains(event.target);
      const isClickInProfileToggle = event.target.closest('.user-profile');
      
      if (showProfilePopup && !isClickInPopup && !isClickInProfileToggle) {
        closeProfilePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup]);

  // Close popup when sidebar expands
  useEffect(() => {
    if (!collapsed) {
      closeProfilePopup();
    }
  }, [collapsed]);

  // Cancel person details when sidebar is collapsed
  useEffect(() => {
    if (collapsed) {
      setSelectedPerson(null); // Reset the selected person when the sidebar is collapsed
    }
  }, [collapsed]);

  // Dispatch event when sidebar state changes
  useEffect(() => {
    const event = new CustomEvent('sidebarStateChange', {
      detail: { expanded: !collapsed }
    });
    window.dispatchEvent(event);
  }, [collapsed]);

  const handleBackClick = () => {
    setSelectedItem(null); // Reset the selected item
    setSearchQuery(""); // Clear the search query
  };

  const renderDetails = (data) => {
    const filteredData = data.filter((item) =>
      (item.full_name || item.name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="details-container">
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            onClick={handleBackClick}
            className="back-button-small"
          >
            <span className="material-icons">arrow_back</span>
          </button>
        </div>

        {/* List of Cards */}
        <div className="cards-container">
          {filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedPerson(item)}
              className="person-card"
            >
              <img
                src={item.photo}
                alt={item.full_name || item.name}
                className="person-photo"
              />
              {!collapsed && (
                <div className="person-info">
                  <h3 className="person-name">{item.full_name || item.name}</h3>
                  <p className="person-details">
                    {selectedItem === "Police" ? item.post : `Crime: ${item.crime}`}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPersonDetails = () => {
    if (!selectedPerson) return null;

    return (
      <div className="person-details-container">
        <div className="person-header">
          <img
            src={selectedPerson.photo}
            alt={selectedPerson.full_name || selectedPerson.name}
            className="person-header-photo"
          />
          <h2 className="person-header-name">
            {selectedPerson.full_name || selectedPerson.name}
          </h2>
        </div>
        <div className="person-details-list">
          {selectedItem === "Police" ? (
            <>
              <p><strong>Police ID:</strong> {selectedPerson.police_id}</p>
              <p><strong>Aadhar Card:</strong> {selectedPerson.aadhar_card}</p>
              <p><strong>Email:</strong> {selectedPerson.email}</p>
              <p><strong>Phone No:</strong> {selectedPerson.phone_no}</p>
              <p><strong>Address:</strong> {selectedPerson.address}</p>
              <p><strong>City:</strong> {selectedPerson.city}</p>
              <p><strong>State:</strong> {selectedPerson.state}</p>
              <p><strong>Blood Group:</strong> {selectedPerson.blood_group}</p>
              <p><strong>Post:</strong> {selectedPerson.post}</p>
              <p><strong>Speciality:</strong> {selectedPerson.speciality}</p>
              <p><strong>Description:</strong> {selectedPerson.description}</p>
            </>
          ) : (
            <>
              <p><strong>Crime:</strong> {selectedPerson.crime}</p>
              <p><strong>Date of Arrest:</strong> {new Date(selectedPerson.date_of_arrest).toISOString().split("T")[0]}</p>
              <p><strong>Status:</strong> {selectedPerson.status}</p>
              <p><strong>Aadhar Card:</strong> {selectedPerson.aadhar_card}</p>
              <p><strong>Address:</strong> {selectedPerson.address}</p>
              <p><strong>City:</strong> {selectedPerson.city}</p>
              <p><strong>State:</strong> {selectedPerson.state}</p>
              <p><strong>Date of Birth:</strong> {new Date(selectedPerson.date_of_birth).toISOString().split("T")[0]}</p>
              <p><strong>Jail Address:</strong> {selectedPerson.jail_address}</p>
              <p><strong>Jail City:</strong> {selectedPerson.jail_city}</p>
              <p><strong>Jail State:</strong> {selectedPerson.jail_state}</p>
              <p><strong>Phone No:</strong> {selectedPerson.phone_no}</p>
              <p><strong>Sentence Duration:</strong> {selectedPerson.sentence_duration} months</p>
              <p><strong>Description:</strong> {selectedPerson.description}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${!collapsed ? 'expanded' : ''}`}
    >
      <div>
        <div className="sidebar-header">
          {selectedPerson && (
            <button
              onClick={() => setSelectedPerson(null)}
              className="back-button"
            >
              <span className="material-icons">arrow_back</span>
            </button>
          )}

          {!selectedPerson && (
            <button
              onClick={() => {
                setCollapsed(!collapsed); // Toggle the collapsed state
                if (!collapsed) {
                  setSelectedPerson(null); // Cancel person details
                  setSelectedItem(null);   // Cancel the person details list page
                }
              }}
              className={`sidebar-toggle-button ${!collapsed ? 'expanded' : ''}`}
            >
              <span className="material-icons">
                {collapsed ? "menu" : "close"}
              </span>
            </button>
          )}
        </div>
        <nav className={`sidebar-nav ${!collapsed ? 'expanded' : ''}`}>
          {!selectedPerson && (
            <>
              <SidebarItem
                icon={<svg className="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10c-1.4 0-2.5-1.1-2.5-2.5S10.6 6 12 6s2.5 1.1 2.5 2.5S13.4 11 12 11zm6 6H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z"/>
                </svg>}
                label="Police"
                collapsed={collapsed}
                isActive={selectedItem === "Police"}
                onClick={() => {
                  setCollapsed(false); // Ensure the sidebar expands
                  setSelectedItem(selectedItem === "Police" ? null : "Police"); // Toggle Police list
                  setSearchQuery("");
                  setSelectedPerson(null);
                }}
              />
              {selectedItem === "Police" && renderDetails(policeTeam)}

              <SidebarItem
                icon={<svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" className="sidebar-icon" viewBox="0 0 128 128"><path fill="#fff" d="M108,63.66V49.98c0-5.5-4.48-9.98-9.98-9.98H92v-9.97C92,20.09,83.91,12,73.97,12H54.03C44.09,12,36,20.09,36,30.03V40h-6.02c-5.5,0-9.98,4.48-9.98,9.98v13.68C13.62,69.34,10,77.37,10,86c0,16.54,13.46,30,30,30s30-13.46,30-30c0-8.63-3.63-16.66-10-22.34V49.98c0-5.5-4.48-9.98-9.98-9.98H44v-9.97C44,24.5,48.5,20,54.03,20h19.94C79.5,20,84,24.5,84,30.03V40h-6.02c-5.5,0-9.98,4.48-9.98,9.98v15.54c0,1.53,0.87,2.93,2.25,3.6s3.02,0.5,4.22-0.45C78.36,65.61,83.04,64,88,64s9.64,1.61,13.53,4.67c0,0,0,0,0.01,0c0,0,0,0,0,0C106.92,72.87,110,79.18,110,86c0,12.13-9.87,22-22,22c-4.96,0-9.64-1.61-13.54-4.66c-1.74-1.36-4.25-1.05-5.62,0.69c-1.36,1.74-1.05,4.25,0.69,5.62C74.85,113.8,81.24,116,88,116c16.54,0,30-13.46,30-30C118,77.37,114.38,69.34,108,63.66z M62,86c0,12.13-9.87,22-22,22s-22-9.87-22-22c0-6.82,3.08-13.13,8.47-17.33C30.36,65.61,35.04,64,40,64c0.62,0,1.24,0.03,1.85,0.08c4.27,0.35,8.28,1.92,11.69,4.6C58.92,72.87,62,79.18,62,86z"/></svg>}
                label="Criminals"
                collapsed={collapsed}
                isActive={selectedItem === "Criminals"}
                onClick={() => {
                  setCollapsed(false); // Ensure the sidebar expands
                  setSelectedItem(selectedItem === "Criminals" ? null : "Criminals"); // Toggle Criminals list
                  setSearchQuery("");
                  setSelectedPerson(null);
                }}
              />
              {selectedItem === "Criminals" && renderDetails(criminals)}
            </>
          )}

          {selectedPerson && renderPersonDetails()}
        </nav>
      </div>

      <div className="user-profile-container">
        <div 
          className="user-profile"
          onClick={(e) => {
            e.stopPropagation();
            toggleProfilePopup();
          }}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={userData.photo}
            alt={userData.full_name}
            className="user-photo"
          />
          {!collapsed && (
            <div className="user-info">
              <p className="user-name">{userData.full_name}</p>
              <p className="user-id">
                {userData.police_id}
              </p>
            </div>
          )}
        </div>

        {showProfilePopup && (
          <div 
            className={`profile-popup ${isClosing ? 'closing' : ''}`}
            ref={profilePopupRef}
            style={{
              left: collapsed ? '70px' : '250px',
              animation: isClosing ? 'slideDown 0.3s ease-in forwards' : 'slideUp 0.3s ease-out forwards'
            }}
          >
            <div className="profile-popup-header">
              <div className="profile-header-content">
                <div className="profile-header-photo">
                  <img src={userData.photo} alt={userData.full_name} />
                </div>
                <div className="profile-header-info">
                  <h3>{userData.full_name}</h3>
                  <span className="profile-header-id">{userData.police_id}</span>
                </div>
              </div>
              <button 
                className="profile-close-btn"
                onClick={() => closeProfilePopup()}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="profile-popup-content">
              <table className="profile-details">
                <tbody>
                  <tr>
                    <td className="detail-label">Post</td>
                    <td className="detail-value">{userData.post}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Aadhar Card</td>
                    <td className="detail-value">{userData.aadhar_card}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Email</td>
                    <td className="detail-value">{userData.email}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Phone</td>
                    <td className="detail-value">{userData.phone_no}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">City</td>
                    <td className="detail-value">{userData.city}</td>
                  </tr>
                  <tr>
                    <td className="detail-label">Address</td>
                    <td className="detail-value">{userData.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, collapsed, onClick, isActive }) => {
  return (
    <div
      onClick={onClick}
      className={`sidebar-item ${isActive ? 'active' : ''}`}
    >
      <span className="sidebar-item-icon">{icon}</span>
      {!collapsed && (
        <span
          className={`sidebar-item-label ${!collapsed ? 'visible' : ''}`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;

