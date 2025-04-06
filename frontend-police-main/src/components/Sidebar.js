import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed
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
            <p><strong>Name:</strong> {selectedPerson.name}</p>
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

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
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
            setSelectedItem("Police");
            setSelectedPerson(null); // Reset selected person
          }}
        />
        {selectedItem === "Police" && (
          <div>
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
            {selectedPerson ? renderPersonDetails() : renderDetails(policeTeam)}
          </div>
        )}
        <SidebarItem
          icon="🦹‍♂️"
          label="Criminals"
          collapsed={collapsed}
          onClick={() => {
            setSelectedItem("Criminals");
            setSelectedPerson(null); // Reset selected person
          }}
        />
        {selectedItem === "Criminals" && (
          <div>
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
            {selectedPerson ? renderPersonDetails() : renderDetails(criminals)}
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