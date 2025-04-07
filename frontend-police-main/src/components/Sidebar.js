import React, { useState, useEffect, useRef } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item (Police or Criminals)
  const [policeTeam, setPoliceTeam] = useState([]); // Dynamic police data
  const [criminals, setCriminals] = useState([]); // Dynamic criminal data
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person for full details
  const sidebarRef = useRef(null); // Ref for the sidebar

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

  const handleBackClick = () => {
    setSelectedItem(null); // Reset the selected item
    setSearchQuery(""); // Clear the search query
  };

  const renderDetails = (data) => {
    const filteredData = data.filter((item) =>
      (item.full_name || item.name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100%",
          width: "100%",
          overflowY: "auto",
          padding: "10px",
          boxSizing: "border-box",
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            width: "100%",
            height: "40px",
            boxSizing: "border-box",
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => (e.target.style.border = "1px solid #ccc")} // Highlight border in default on focus
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")} // Reset border to default on blur
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid red",
              backgroundColor: "#333333",
              color: "white",
              marginRight: "10px",
              height: "100%",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleBackClick}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#555555",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "40px",
              boxSizing: "border-box",
            }}
          >
            ←
          </button>
        </div>

        {/* List of Cards */}
        <div
          style={{
            width: "100%", // Constrain to the sidebar's width
            height: "calc(100vh - 200px)", // Adjust height dynamically to fit within the sidebar
            overflowY: "scroll", // Enable vertical scrolling
            boxSizing: "border-box", // Include padding in width calculation
            scrollbarWidth: "none", // Hide scrollbar for Firefox
          }}
        >
          <style>
            {`
              /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge) */
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedPerson(item)}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#2a2a2a",
                color: "white",
                padding: "30px",
                borderRadius: "8px",
                marginBottom: "16px",
                cursor: "pointer",
                height: "110px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <img
                src={item.photo}
                alt={item.full_name || item.name}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  marginRight: "16px",
                }}
              />
              {!collapsed && (
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>{item.full_name || item.name}</h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>
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
      <div style={{ padding: "10px", textAlign: "left", width: "100%" }}>
        <img
          src={selectedPerson.photo}
          alt={selectedPerson.full_name || selectedPerson.name}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "16px",
          }}
        />
        <h2 style={{ margin: "0 0 10px 0" }}>
          {selectedPerson.full_name || selectedPerson.name}
        </h2>
        {selectedItem === "Police" ? (
          <>
            <p><strong>Police ID:</strong> {selectedPerson.police_id}</p>
            <p><strong>Aadhar Card:</strong> {selectedPerson.aadhar_card}</p>
            <p><strong>Phone Number:</strong> {selectedPerson.phone_no}</p>
            <p><strong>Email:</strong> {selectedPerson.email}</p>
            <p><strong>Address:</strong> {selectedPerson.address}</p>
            <p><strong>City:</strong> {selectedPerson.city}</p>
            <p><strong>State:</strong> {selectedPerson.state}</p>
            <p><strong>Blood Group:</strong> {selectedPerson.blood_group}</p>
            <p><strong>Post:</strong> {selectedPerson.post}</p>
            <p><strong>Speciality:</strong> {selectedPerson.speciality}</p>
            <p><strong>Description:</strong> {selectedPerson.description}</p>
            <p><strong>Gender:</strong> {selectedPerson.gender}</p>
          </>
        ) : (
          <>
            <p><strong>Gender:</strong> {selectedPerson.gender}</p>
            <p><strong>Aadhar Card:</strong> {selectedPerson.aadhar_card}</p>
            <p><strong>Address:</strong> {selectedPerson.address}</p>
            <p><strong>City:</strong> {selectedPerson.city}</p>
            <p><strong>State:</strong> {selectedPerson.state}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedPerson.date_of_birth).toISOString().split("T")[0]}</p>
            <p><strong>Jail Address:</strong> {selectedPerson.jail_address}</p>
            <p><strong>Jail City:</strong> {selectedPerson.jail_city}</p>
            <p><strong>Jail State:</strong> {selectedPerson.jail_state}</p>
            <p><strong>Phone Number:</strong> {selectedPerson.phone_no}</p>
            <p><strong>Crime:</strong> {selectedPerson.crime}</p>
            <p><strong>Date of Arrest:</strong> {new Date(selectedPerson.date_of_arrest).toISOString().split("T")[0]}</p>
            <p><strong>Sentence Duration:</strong> {selectedPerson.sentence_duration} months</p>
            <p><strong>Status:</strong> {selectedPerson.status}</p>
            <p><strong>Description:</strong> {selectedPerson.description}</p>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef} // Attach the ref to the sidebar
      style={{
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "7px",
        transition: "width 0.4s",
        width: collapsed ? "60px" : "250px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          marginBottom: "25px",
          marginTop: "10px",
          height: "40px", // Ensure consistent height for the container
        }}
      >
        {/* Back Button */}
        {selectedPerson && (
          <button
            onClick={() => setSelectedPerson(null)} // Go back to the list
            style={{
              background: collapsed ? "none" : "rgb(51, 51, 51)", // Dark gray background when expanded
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px", // Same font size as "☰"
              width: "40px", // Same width as "☰"
              height: "40px", // Same height as "☰"
              borderRadius: "10px", // Squiricircle effect
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ← {/* Back arrow icon */}
          </button>
        )}

        {/* Morphing Icon */}
        {!selectedPerson && (
          <button
            onClick={() => {
              if (collapsed) {
                setCollapsed(false); // Expand the sidebar
              } else {
                setCollapsed(true); // Collapse the sidebar
                setTimeout(() => {
                  setSelectedItem(null); // Reset the selected item 0.1s before the sidebar fully collapses
                }, 100); // Delay of 0.1s
              }
            }}
            style={{
              background: collapsed ? "none" : "rgb(51, 51, 51)", // Dark gray background when expanded
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px", // Same font size as "☰"
              width: "40px", // Same width as "☰"
              height: "40px", // Same height as "☰"
              borderRadius: "10px", // Squiricircle effect
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {collapsed ? "☰" : "✖"}
          </button>
        )}
      </div>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: collapsed ? "center" : "normal",
        }}
      >
        {/* Police Button */}
        <SidebarItem
          icon="👮‍♂️"
          label="Police"
          collapsed={collapsed}
          onClick={() => {
            if (selectedItem === "Police") {
              // If already selected, reset to main menu
              setSelectedItem(null);
              setSearchQuery(""); // Reset search query
              setSelectedPerson(null); // Reset selected person
            } else {
              // Otherwise, select Police
              setCollapsed(false); // Expand the sidebar
              setSelectedItem("Police");
              setSearchQuery(""); // Reset search query when switching sections
              setSelectedPerson(null); // Reset selected person
            }
          }}
        />

        {/* Render Police details if selected */}
        {selectedItem === "Police" && !selectedPerson && (
          <div
            style={{
              display: "flex", // Use flexbox for alignment
              flexDirection: "column", // Stack items vertically
              justifyContent: "flex-start", // Align items at the top
              alignItems: "center", // Center horizontally
              height: "100%", // Take full height of the sidebar
              width: "100%", // Constrain to the sidebar's width
              overflowY: "auto", // Allow scrolling if content overflows
              padding: "10px", // Add padding for spacing
              boxSizing: "border-box", // Include padding in width/height calculations
            }}
          >
            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                width: "100%", // Constrain to the sidebar's width
                height: "40px", // Match the height of the buttons
                boxSizing: "border-box", // Include padding in width calculation
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => (e.target.style.border = "1px solid pink")} // Highlight border in pink on focus
                onBlur={(e) => (e.target.style.border = "1px solid #ccc")} // Reset border to default on blur
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc", // Default border
                  backgroundColor: "#333333",
                  color: "white",
                  marginRight: "10px", // Add spacing between input and button
                  height: "100%", // Match the height of the container
                  boxSizing: "border-box", // Include padding in height calculation
                }}
              />
              <button
                onClick={handleBackClick}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#555555",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%", // Match the height of the container
                  width: "40px", // Keep consistent width
                  boxSizing: "border-box", // Include padding in width calculation
                }}
              >
                ← {/* Back arrow icon */}
              </button>
            </div>

            {/* List of Cards */}
            <div
              style={{
                width: "100%", // Constrain to the sidebar's width
                height: "calc(100vh - 200px)", // Adjust height dynamically to fit within the sidebar
                overflowY: "scroll", // Enable vertical scrolling
                boxSizing: "border-box", // Include padding in width calculation
                scrollbarWidth: "none", // Hide scrollbar for Firefox
              }}
            >
              <style>
                {`
                  /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge) */
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {policeTeam.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPerson(item)} // Set the selected person on card click
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#2a2a2a",
                    color: "white",
                    padding: "30px", // Keep padding consistent
                    borderRadius: "8px",
                    marginBottom: "16px",
                    cursor: "pointer", // Indicate the card is clickable
                    height: "110px", // Increased height by 30px
                    width: "100%", // Constrain to the sidebar's width
                    boxSizing: "border-box", // Include padding in width calculation
                  }}
                >
                  <img
                    src={item.photo}
                    alt={item.full_name || item.name}
                    style={{
                      width: "90px", // Slightly larger image
                      height: "90px", // Match the larger card height
                      borderRadius: "50%",
                      marginRight: "16px",
                    }}
                  />
                  {!collapsed && (
                    <div>
                      <h3 style={{ margin: 0, fontSize: "16px" }}>{item.full_name || item.name}</h3>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {item.post}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Criminals Button */}
        <SidebarItem
          icon="🦹‍♂️"
          label="Criminals"
          collapsed={collapsed}
          onClick={() => {
            if (selectedItem === "Criminals") {
              // If already selected, reset to main menu
              setSelectedItem(null);
              setSearchQuery(""); // Reset search query
              setSelectedPerson(null); // Reset selected person
            } else {
              // Otherwise, select Criminals
              setCollapsed(false); // Expand the sidebar
              setSelectedItem("Criminals");
              setSearchQuery(""); // Reset search query when switching sections
              setSelectedPerson(null); // Reset selected person
            }
          }}
        />

        {/* Render Criminals details if selected */}
        {selectedItem === "Criminals" && !selectedPerson && (
          <div
            style={{
              display: "flex", // Use flexbox for alignment
              flexDirection: "column", // Stack items vertically
              justifyContent: "flex-start", // Align items at the top
              alignItems: "center", // Center horizontally
              height: "100%", // Take full height of the sidebar
              width: "100%", // Constrain to the sidebar's width
              overflowY: "auto", // Allow scrolling if content overflows
              padding: "10px", // Add padding for spacing
              boxSizing: "border-box", // Include padding in width/height calculations
            }}
          >
            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                width: "100%", // Constrain to the sidebar's width
                height: "40px", // Match the height of the buttons
                boxSizing: "border-box", // Include padding in width calculation
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => (e.target.style.border = "1px solid pink")} // Highlight border in pink on focus
                onBlur={(e) => (e.target.style.border = "1px solid #ccc")} // Reset border to default on blur
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc", // Default border
                  backgroundColor: "#333333",
                  color: "white",
                  marginRight: "10px", // Add spacing between input and button
                  height: "100%", // Match the height of the container
                  boxSizing: "border-box", // Include padding in height calculation
                }}
              />
              <button
                onClick={handleBackClick}
                style={{
                  padding: "10px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#555555",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%", // Match the height of the container
                  width: "40px", // Keep consistent width
                  boxSizing: "border-box", // Include padding in width calculation
                }}
              >
                ← {/* Back arrow icon */}
              </button>
            </div>

            {/* List of Cards for Criminals */}
            <div
              style={{
                width: "100%", // Constrain to the sidebar's width
                height: "calc(100vh - 200px)", // Adjust height dynamically to fit within the sidebar
                overflowY: "scroll", // Enable vertical scrolling
                boxSizing: "border-box", // Include padding in width calculation
                scrollbarWidth: "none", // Hide scrollbar for Firefox
              }}
            >
              <style>
                {`
                  /* Hide scrollbar for WebKit browsers (Chrome, Safari, Edge) */
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {criminals.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPerson(item)} // Set the selected person on card click
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#2a2a2a",
                    color: "white",
                    padding: "30px", // Keep padding consistent
                    borderRadius: "8px",
                    marginBottom: "16px",
                    cursor: "pointer", // Indicate the card is clickable
                    height: "110px", // Increased height by 30px
                    width: "100%", // Constrain to the sidebar's width
                    boxSizing: "border-box", // Include padding in width calculation
                  }}
                >
                  <img
                    src={item.photo}
                    alt={item.full_name || item.name}
                    style={{
                      width: "90px", // Slightly larger image
                      height: "90px", // Match the larger card height
                      borderRadius: "50%",
                      marginRight: "16px",
                    }}
                  />
                  {!collapsed && (
                    <div>
                      <h3 style={{ margin: 0, fontSize: "16px" }}>{item.full_name || item.name}</h3>
                      <p style={{ margin: 0, fontSize: "14px" }}>
                        {item.crime}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Person Details if a person is selected */}
        {selectedPerson && (
          <div style={{ marginLeft: collapsed ? "0" : "16px" }}>
            {renderPersonDetails()}
          </div>
        )}
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, collapsed, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "8px",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#333333",
        transition: "opacity 0.4s",
      }}
    >
      <span style={{ fontSize: "20px" }}>{icon}</span>
      {!collapsed && (
        <span
          style={{
            fontSize: "16px",
            opacity: collapsed ? 0 : 1,
            transition: "opacity 0.4s",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;