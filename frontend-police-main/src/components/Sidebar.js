import React, { useState, useEffect, useRef } from "react";
<<<<<<< Updated upstream
// new comment
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Sidebar starts collapsed
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item (Police or Criminals)
  const [policeTeam, setPoliceTeam] = useState([]); // Dynamic police data
  const [criminals, setCriminals] = useState([]); // Dynamic criminal data
  const [searchQuery, setSearchQuery] = useState(""); // Track search input
  const [selectedPerson, setSelectedPerson] = useState(null); // Track selected person for full details
  const sidebarRef = useRef(null); // Ref for the sidebar
=======
>>>>>>> Stashed changes

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [policeTeam, setPoliceTeam] = useState([]);
  const [criminals, setCriminals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const sidebarRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCollapsed(true);
        setSelectedItem(null);
        setSelectedPerson(null);
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

  const handleBackClick = () => {
    setSelectedItem(null);
    setSearchQuery("");
  };

  const renderDetails = (data) => {
    const filteredData = data.filter((item) =>
      (item.full_name || item.name).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height: "100%", width: "100%", overflowY: "auto", padding: "10px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", width: "100%", height: "40px", boxSizing: "border-box" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
<<<<<<< Updated upstream
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#333333",
              color: "white",
              marginRight: "10px",
              height: "100%",
              boxSizing: "border-box",
            }}
=======
            onFocus={(e) => (e.target.style.border = "1px solid #ccc")}
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid red", backgroundColor: "#333333", color: "white", marginRight: "10px", height: "100%", boxSizing: "border-box" }}
>>>>>>> Stashed changes
          />
          <button onClick={handleBackClick} style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#555555", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "40px", boxSizing: "border-box" }}>
            ←
          </button>
        </div>

<<<<<<< Updated upstream
        {/* List of Cards */}
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 200px)",
            overflowY: "scroll",
            boxSizing: "border-box",
          }}
        >
=======
        <div style={{ width: "100%", height: "calc(100vh - 200px)", overflowY: "scroll", boxSizing: "border-box", scrollbarWidth: "none" }}>
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
>>>>>>> Stashed changes
          {filteredData.map((item, index) => (
            <div key={index} onClick={() => setSelectedPerson(item)} style={{ display: "flex", alignItems: "center", backgroundColor: "#2a2a2a", color: "white", padding: "30px", borderRadius: "8px", marginBottom: "16px", cursor: "pointer", height: "110px", width: "100%", boxSizing: "border-box" }}>
              <img src={item.photo} alt={item.full_name || item.name} style={{ width: "90px", height: "90px", borderRadius: "50%", marginRight: "16px" }} />
              {!collapsed && (
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>{item.full_name || item.name}</h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>{selectedItem === "Police" ? item.post : `Crime: ${item.crime}`}</p>
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
<<<<<<< Updated upstream
      <div
        style={{
          padding: "10px",
          textAlign: "left",
          width: "100%",
          height: "calc(100vh - 60px)", // Adjust height to fit within the viewport
          overflowY: "auto", // Enable vertical scrolling
          boxSizing: "border-box", // Ensure padding is included in the width/height
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center", // Align items vertically
            gap: "12px", // Reduce spacing between the photo and the name
            marginBottom: "1px", // Reduce bottom margin
          }}
        >
          <img
            src={selectedPerson.photo}
            alt={selectedPerson.full_name || selectedPerson.name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
          />
          <h2 style={{ margin: 0 }}>
            {selectedPerson.full_name || selectedPerson.name}
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px", // Reduce spacing between details
          }}
        >
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
=======
      <div style={{ padding: "10px", textAlign: "left", width: "100%" }}>
        <img src={selectedPerson.photo} alt={selectedPerson.full_name || selectedPerson.name} style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "16px" }} />
        <h2 style={{ margin: "0 0 10px 0" }}>{selectedPerson.full_name || selectedPerson.name}</h2>
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
>>>>>>> Stashed changes
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      style={{
<<<<<<< Updated upstream
        height: "100vh",
=======
        position: "sticky", // Makes the sidebar fixed within its parent container
        top: 0, // Ensures it sticks to the top of the viewport
        height: "100vh", // Full viewport height
>>>>>>> Stashed changes
        backgroundColor: "#1a1a1a",
        color: "white",
        padding: "7px",
        transition: "width 0.4s",
        width: collapsed ? "60px" : "250px",
        overflow: "hidden",
        boxSizing: "border-box",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column", // Ensure content stacks vertically
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "25px",
          marginTop: "10px",
          height: "40px",
        }}
      >
        {selectedPerson && (
          <button
            onClick={() => setSelectedPerson(null)}
            style={{
              background: collapsed ? "none" : "rgb(51, 51, 51)",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
        )}
<<<<<<< Updated upstream

        {!selectedPerson && (
          <button
            onClick={() => {
              setCollapsed(!collapsed); // Toggle the collapsed state
              if (!collapsed) {
                setSelectedPerson(null); // Cancel person details
                setSelectedItem(null);   // Cancel the person details list page
=======
        {!selectedPerson && (
          <button
            onClick={() => {
              if (collapsed) {
                setCollapsed(false);
              } else {
                setCollapsed(true);
                setTimeout(() => {
                  setSelectedItem(null);
                }, 100);
>>>>>>> Stashed changes
              }
            }}
            style={{
              background: collapsed ? "none" : "rgb(51, 51, 51)",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "20px",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
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
          flex: 1, // Allow the nav to take up remaining space
          overflowY: "auto", // Enable scrolling for long content
        }}
      >
        <SidebarItem
          icon="👮‍♂️"
          label="Police"
          collapsed={collapsed}
          onClick={() => {
<<<<<<< Updated upstream
            setCollapsed(false); // Ensure the sidebar expands
            setSelectedItem(selectedItem === "Police" ? null : "Police"); // Toggle Police list
            setSearchQuery("");
            setSelectedPerson(null);
          }}
        />
        {selectedItem === "Police" && !selectedPerson && renderDetails(policeTeam)}

=======
            if (selectedItem === "Police") {
              setSelectedItem(null);
              setSearchQuery("");
              setSelectedPerson(null);
            } else {
              setCollapsed(false);
              setSelectedItem("Police");
              setSearchQuery("");
              setSelectedPerson(null);
            }
          }}
        />
        {selectedItem === "Police" && !selectedPerson && renderDetails(policeTeam)}
>>>>>>> Stashed changes
        <SidebarItem
          icon="🦹‍♂️"
          label="Criminals"
          collapsed={collapsed}
          onClick={() => {
<<<<<<< Updated upstream
            setCollapsed(false); // Ensure the sidebar expands
            setSelectedItem(selectedItem === "Criminals" ? null : "Criminals"); // Toggle Criminals list
            setSearchQuery("");
            setSelectedPerson(null);
          }}
        />
        {selectedItem === "Criminals" && !selectedPerson && renderDetails(criminals)}

        {selectedPerson && renderPersonDetails()}
=======
            if (selectedItem === "Criminals") {
              setSelectedItem(null);
              setSearchQuery("");
              setSelectedPerson(null);
            } else {
              setCollapsed(false);
              setSelectedItem("Criminals");
              setSearchQuery("");
              setSelectedPerson(null);
            }
          }}
        />
        {selectedItem === "Criminals" && !selectedPerson && renderDetails(criminals)}
        {selectedPerson && (
          <div style={{ marginLeft: collapsed ? "0" : "16px" }}>
            {renderPersonDetails()}
          </div>
        )}
>>>>>>> Stashed changes
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, collapsed, onClick }) => {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "8px", borderRadius: "8px", cursor: "pointer", backgroundColor: "#333333", transition: "opacity 0.4s" }}>
      <span style={{ fontSize: "20px" }}>{icon}</span>
      {!collapsed && (
        <span style={{ fontSize: "16px", opacity: collapsed ? 0 : 1, transition: "opacity 0.4s" }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default function App() {
  return (
<<<<<<< Updated upstream
    <div style={{ height: "100%" }}>
=======
    <div style={{ display: "flex", height: "100vh" }}>
>>>>>>> Stashed changes
      <Sidebar />
    </div>
  );
}
