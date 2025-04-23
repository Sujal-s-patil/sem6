import React, { useState, useEffect, useRef } from "react";
import "../css/Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item (Police or Criminals)
  const [policeTeam, setPoliceTeam] = useState([]); // Dynamic police data
  const [criminals, setCriminals] = useState([]); // Dynamic criminal data
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person for full details

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

  // Collapse sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true); // Collapse the sidebar
        setSelectedItem(null); // Reset the selected item
        setSelectedPerson(null); // Reset the selected person
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            ←
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
              ←
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
              {collapsed ? "☰" : "✖"}
            </button>
          )}
        </div>
        <nav className={`sidebar-nav ${!collapsed ? 'expanded' : ''}`}>
          <SidebarItem
            icon="👮‍♂️"
            label="Police"
            collapsed={collapsed}
            onClick={() => {
              setCollapsed(false); // Ensure the sidebar expands
              setSelectedItem(selectedItem === "Police" ? null : "Police"); // Toggle Police list
              setSearchQuery("");
              setSelectedPerson(null);
            }}
          />
          {selectedItem === "Police" && !selectedPerson && renderDetails(policeTeam)}

          <SidebarItem
            icon="🦹‍♂️"
            label="Criminals"
            collapsed={collapsed}
            onClick={() => {
              setCollapsed(false); // Ensure the sidebar expands
              setSelectedItem(selectedItem === "Criminals" ? null : "Criminals"); // Toggle Criminals list
              setSearchQuery("");
              setSelectedPerson(null);
            }}
          />
          {selectedItem === "Criminals" && !selectedPerson && renderDetails(criminals)}

          {selectedPerson && renderPersonDetails()}
        </nav>
      </div>

      <div className="user-profile">
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

