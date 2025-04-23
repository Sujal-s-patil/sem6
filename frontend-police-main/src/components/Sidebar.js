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
                onClick={() => {
                  setCollapsed(false); // Ensure the sidebar expands
                  setSelectedItem(selectedItem === "Police" ? null : "Police"); // Toggle Police list
                  setSearchQuery("");
                  setSelectedPerson(null);
                }}
              />
              {selectedItem === "Police" && renderDetails(policeTeam)}

              <SidebarItem
                icon={<svg className="sidebar-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 2c-2.76 0-5 2.24-5 5 0 .5.1 1 .24 1.5l-2.74 2.74c-.5-.14-1-.24-1.5-.24-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5c0-.5-.1-1-.24-1.5l2.74-2.74c.5.14 1 .24 1.5.24 2.76 0 5-2.24 5-5s-2.24-5-5-5zm-9 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm9-10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>}
                label="Criminals"
                collapsed={collapsed}
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

const SidebarItem = ({ icon, label, collapsed, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="sidebar-item"
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

