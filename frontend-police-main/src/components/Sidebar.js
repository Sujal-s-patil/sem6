import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // Track sidebar state (collapsed or expanded)
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item (Police or Criminals)
  const [policeTeam, setPoliceTeam] = useState([]); // Dynamic police data
  const [criminals, setCriminals] = useState([]); // Dynamic criminal data
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
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

  const sidebarWidth = collapsed ? "60px" : "250px"; // Dynamically calculate sidebar width

  const renderDetails = (data) => {
    const filteredData = data.filter((item) =>
      (item.full_name || item.name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div style={{ padding: "10px" }}>
        {filteredData.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedPerson(item)} // Set the selected person on card click
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2a2a2a",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
              cursor: "pointer", // Indicate the card is clickable
            }}
          >
            <img
              src={item.photo}
              alt={item.full_name || item.name}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "16px",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "16px" }}>{item.full_name || item.name}</h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                {selectedItem === "Police" ? item.post : `Crime: ${item.crime}`}
              </p>
            </div>
          </div>
        ))}
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
            <p>
              <strong>Police ID:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.police_id}</span>
            </p>
            <p><strong>Aadhar Card:</strong> {selectedPerson.aadhar_card}</p>
            <p><strong>Phone Number:</strong> {selectedPerson.phone_no}</p>
            <p><strong>Email:</strong> {selectedPerson.email}</p>
            <p><strong>Address:</strong> {selectedPerson.address}</p>
            <p><strong>City:</strong> {selectedPerson.city}</p>
            <p><strong>State:</strong> {selectedPerson.state}</p>
            <p><strong>Blood Group:</strong> {selectedPerson.blood_group}</p>
            <p>
              <strong>Post:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.post}</span>
            </p>
            <p>
              <strong>Speciality:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.speciality}</span>
            </p>
            <p><strong>Description:</strong> {selectedPerson.description}</p>
            <p><strong>Gender:</strong> {selectedPerson.gender}</p>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {selectedPerson.name}</p>
            <p><strong>Gender:</strong> {selectedPerson.gender}</p>
            <p><strong>Aadhar Card:</strong> {selectedPerson.aadhar_card}</p>
            <p>
              <strong>Address:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.address}</span>
            </p>
            <p><strong>City:</strong> {selectedPerson.city}</p>
            <p><strong>State:</strong> {selectedPerson.state}</p>
            <p><strong>Date of Birth:</strong> {new Date(selectedPerson.date_of_birth).toISOString().split("T")[0]}</p>
            <p><strong>Jail Address:</strong> {selectedPerson.jail_address}</p>
            <p><strong>Jail City:</strong> {selectedPerson.jail_city}</p>
            <p><strong>Jail State:</strong> {selectedPerson.jail_state}</p>
            <p><strong>Phone Number:</strong> {selectedPerson.phone_no}</p>
            <p>
              <strong>Crime:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.crime}</span>
            </p>
            <p><strong>Date of Arrest:</strong> {new Date(selectedPerson.date_of_arrest).toISOString().split("T")[0]}</p>
            <p>
              <strong>Sentence Duration:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.sentence_duration} months</span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.status}</span>
            </p>
            <p>
              <strong>Description:</strong>{" "}
              <span style={{ color: "red" }}>{selectedPerson.description}</span>
            </p>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "7px",
        transition: "width 0.4s",
        width: sidebarWidth, // Use dynamic width
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          marginTop: "10px",
        }}
      >
        {!collapsed && (
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "white",
              margin: 0,
            }}
          >
            Dashboard
          </h1>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column", // Align items vertically
            justifyContent: "center", // Center vertically
            alignItems: "center", // Center horizontally
            height: "100%", // Ensure the container takes full height
            gap: "16px", // Add spacing between the button and other elements
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              width: "40px",
              height: "40px",
            }}
          >
            {collapsed ? "☰" : "✖"}
          </button>
        </div>
      </div>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: collapsed ? "center" : "normal",
        }}
      >
        <SidebarItem
          icon="👮‍♂️"
          label="Police"
          collapsed={collapsed}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false); // Automatically expand the sidebar if collapsed
              setTimeout(() => {
                setSelectedItem("Police");
                setIsModalOpen(true);
              }, 500); // Delay opening the modal to match the transition
            } else {
              setSelectedItem("Police");
              setIsModalOpen(true);
            }
          }}
        />
        <SidebarItem
          icon="🦹‍♂️"
          label="Criminals"
          collapsed={collapsed}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false); // Automatically expand the sidebar if collapsed
              setTimeout(() => {
                setSelectedItem("Criminals");
                setIsModalOpen(true);
              }, 500); // Delay opening the modal to match the transition
            } else {
              setSelectedItem("Criminals");
              setIsModalOpen(true);
            }
          }}
        />
      </nav>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: collapsed ? "40px" : "15%", // Match the sidebar's width
            height: "100vh",
            backgroundColor: "#1a1a1a",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            zIndex: 1000,
            overflow: "hidden", // Hide the scrollbar
            padding: collapsed ? "5px" : "20px", // Adjust padding based on collapsed state
            transition: "width 0.4s", // Smooth transition for width
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "18px", margin: 0 }}>
              {selectedItem === "Police" ? "Police Details" : "Criminal Details"}
            </h2>
            <div style={{ display: "flex", gap: "10px" }}>
              {/* Conditional Back Button */}
              <button
                onClick={() => {
                  if (selectedPerson) {
                    setSelectedPerson(null); // Go back to the list view
                  } else {
                    setIsModalOpen(false); // Close the popup
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                ⬅ {/* Arrow icon for the back button */}
              </button>
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPerson(null); // Reset selected person when closing the modal
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
          </div>
          <div
            className="popup-container"
            style={{
              width: "100%",
              height: "calc(100vh - 60px)", // Adjust height to fit within the popup
              overflowY: "auto", // Enable scrolling
              paddingRight: "15px", // Add padding to prevent content from being cut off
            }}
          >
            {selectedPerson ? renderPersonDetails() : (
              <>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "calc(100% - 20px)",
                    padding: "10px",
                    marginBottom: "20px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: "#333333",
                    color: "white",
                  }}
                />
                {renderDetails(selectedItem === "Police" ? policeTeam : criminals)}
              </>
            )}
          </div>
        </div>
      )}
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