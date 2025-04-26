import React, { useState, useEffect } from "react";
import Proof from "./Proof"; // Assuming Proof is a component you have created
import "../css/TaskCard.css";

// TaskModal component
const TaskModal = ({ task, onClose }) => {
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [policeTeam, setPoliceTeam] = useState([]);
  const [selectedOfficers, setSelectedOfficers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (showAssignPopup) {
      fetch(`${process.env.REACT_APP_API_URL}/police/team`)
        .then((response) => response.json())
        .then((data) => {
          const availableOfficers = data.filter((officer) => officer.occupied !== 1);
          setPoliceTeam(availableOfficers);
        })
        .catch((error) => console.error("Error fetching police team:", error));
    }
  }, [showAssignPopup]);

  const handleAssignClick = () => setShowAssignPopup(true);
  const handleCloseAssignPopup = () => {
    setShowAssignPopup(false);
    setSelectedOfficers([]);
    setSearchTerm("");
  };

  const handleOfficerSelect = (police_id) => {
    setSelectedOfficers((prevSelected) =>
      prevSelected.includes(police_id)
        ? prevSelected.filter((id) => id !== police_id)
        : [...prevSelected, police_id]
    );
  };

  const handleConfirmAssignment = () => {
    selectedOfficers.forEach((police_id) => {
      fetch(`${process.env.REACT_APP_API_URL}/police/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          police_id,
          complaint_id: task.complaint_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const userData = JSON.parse(sessionStorage.getItem("userData"));
          if (userData?.police_id === police_id) {
            sessionStorage.setItem(
              "userData",
              JSON.stringify({
                ...userData,
                complaint_id: task.complaint_id,
                occupied: 1,
              })
            );
          }
        })
        .catch((error) => console.error("Error assigning officer:", error));
    });
    handleCloseAssignPopup();
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/ticket/comment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_id: task.complaint_id,
          comment,
        }),
      });
      const result = await response.json();
      console.log(result);
      setComment("");
      setShowCommentInput(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    }
  };

  const filteredPoliceTeam = policeTeam.filter((officer) =>
    officer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!task) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
      <div
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <div style={{
        backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 1001, maxWidth: "500px", width: "95%", maxHeight: "90vh", overflowY: "auto", position: "relative"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Complaint Details</h2>

        <div style={{ marginBottom: "20px" }}>

          <div
            style={{
              display: "flex", // Use flexbox to align tables side by side
              maxHeight: "400px", // Limit the height of the container
              overflowY: "auto", // Make the container scrollable if content is too long
            }}
          >
            {/* First Table */}

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td className="vertical-table-header">Status</td>
                  <td className="vertical-table-cell">{task.status}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Complainant Name</td>
                  <td className="vertical-table-cell">{task.complainant_name}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Crime Type</td>
                  <td className="vertical-table-cell">{task.crime_type}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Crime Location</td>
                  <td className="vertical-table-cell">{task.crime_location}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Crime Description</td>
                  <td className="vertical-table-cell">{task.crime_description}</td>
                </tr>
              </tbody>
            </table>


            {/* Second Table */}

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td className="vertical-table-header">City</td>
                  <td className="vertical-table-cell">{task.city}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">State</td>
                  <td className="vertical-table-cell">{task.state}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Crime Date</td>
                  <td className="vertical-table-cell">{new Date(task.crime_date).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Date Filed</td>
                  <td className="vertical-table-cell">{new Date(task.date_filed).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Last Updated</td>
                  <td className="vertical-table-cell">{new Date(task.last_updated).toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="vertical-table-header">Comment</td>
                  <td className="vertical-table-cell">{task.comment || "No comment added yet"}</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          {!showCommentInput ? (
            <button onClick={() => setShowCommentInput(true)} className="btn-secondary ">Add Comment</button>
          ) : (
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Enter your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <button onClick={handleCommentSubmit} className="btn-primary">Submit</button>
            </div>
          )}
        </div>

        {/* Bottom Section: PoliceTeamCard on left, Buttons on right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
          <div style={{ flex: 1, display: "flex", justifyContent: "left", alignItems: "center" }}>
            <Proof  complaintId={task.complaint_id}/>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleAssignClick}  className="btn-primary">Assign</button>
            <button onClick={onClose}  className="btn-close">Close</button>
          </div>
        </div>


        {showAssignPopup && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100, backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={handleCloseAssignPopup}>
            <div style={{
              backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              zIndex: 1101, maxWidth: "500px", width: "90%", maxHeight: "75vh", overflow: "hidden", display: "flex", flexDirection: "column"
            }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Assign Task</h3>
              <input
                type="text"
                placeholder="Search by name or speciality"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "8px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "4px", width: "95%" }}
              />
              <div style={{ overflowY: "auto", flex: 1, maxHeight: "60vh", marginBottom: "16px", border: "1px solid #eee", borderRadius: "5px" }}>
                {filteredPoliceTeam.map((officer) => (
                  <label
                    key={officer.police_id}
                    style={{ display: "flex", alignItems: "center", padding: "10px", borderBottom: "1px solid #ddd", cursor: "pointer", gap: "10px" }}
                  >
                    <img
                      src={officer.photo || "placeholder.jpg"}
                      alt={officer.full_name}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "bold", margin: 0 }}>{officer.full_name}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>{officer.speciality}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedOfficers.includes(officer.police_id)}
                      onChange={() => handleOfficerSelect(officer.police_id)}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={handleConfirmAssignment} className="btn-primary">Confirm Assignment</button>
                <button onClick={handleCloseAssignPopup} className="btn-close">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// TaskCard component
function getDaysAgo(dateString) {
  const now = new Date();
  const created = new Date(dateString);
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function getTagColorClass(days, status) {
  if (status === 'Pending' || status === 'In Progress') {
    if (days <= 1) return 'green';
    if (days <= 4) return 'yellow';
    return 'red';
  } else if (status === 'Resolved') {
    if (days <= 1) return 'red';
    if (days <= 4) return 'yellow';
    return 'green';
  } else if (status === 'Closed') {
    return 'green';
  } else {
    if (days <= 2) return 'green';
    if (days <= 5) return 'yellow';
    return 'red';
  }
}


const TaskCard = ({ task }) => {
  const [showModal, setShowModal] = useState(false);
  const [assignedOfficers, setAssignedOfficers] = useState([]);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    // Fetch assigned officers when component mounts
    fetch(`${process.env.REACT_APP_API_URL}/police/specific`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaint_id: task.complaint_id }),
    })
      .then((response) => response.json())
      .then((data) => setAssignedOfficers(data || []))
      .catch((error) => console.error("Error loading officers:", error));
  }, [task.complaint_id]);

  const handleCardClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const isHighlighted = task.complaint_id === userData?.complaint_id && task.status !== "Closed";

  return (
    <>
      <div
        draggable
        onDragStart={(e) => {
          try {
            // Ensure task.id is available and stringified
            if (task && task.id !== undefined) {
                 e.dataTransfer.setData("application/json", JSON.stringify({ id: task.id }));
                 e.target.style.opacity = "0.5"; // Visual feedback for dragging
            } else {
                console.error("Task ID is undefined during drag start:", task);
                 e.preventDefault(); // Prevent dragging if ID is missing
            }
          } catch (error) {
            console.error("Error setting drag data:", error);
          }
        }}
        onDragEnd={(e) => (e.target.style.opacity = "1")} // Restore opacity
        onClick={handleCardClick}
        className={`task-card ${isHighlighted ? 'highlighted' : ''}`} // Removed dragging-over class here
        data-task-id={task.id} // IMPORTANT: Add data attribute
      >
        <p className="task-card-title">{task.crime_type}</p>
        <div className={`task-card-location${task.status === 'Closed' ? ' closed-address' : ''}`}>{task.crime_location}</div>
        <span className={`ticket-age-tag ${getTagColorClass(getDaysAgo(task.date_filed), task.status)}`}>{getDaysAgo(task.date_filed)} days</span>
        <div className="task-card-footer">
          <div className="assigned-officers">
            {assignedOfficers.map((officer, index) => (
              <img
                key={officer.police_id}
                src={officer.photo}
                alt={officer.full_name}
                className="officer-avatar"
                style={{ zIndex: assignedOfficers.length - index }}
                title={officer.full_name} // Add tooltip
              />
            ))}
          </div>
          {/* You could add task ID or other icons here */}
        </div>
      </div>
      {showModal && <TaskModal task={task} onClose={handleCloseModal} />}
    </>
  );
};

export { TaskCard, TaskModal };
