// TaskCard.js
import React, { useState, useEffect } from "react";

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
          const availableOfficers = data.filter(officer => officer.occupied !== 1);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          police_id,
          complaint_id: task.complaint_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Officer assigned:", data);

          // Update userData if the assigned officer matches userData.police_id
          const userData = JSON.parse(sessionStorage.getItem("userData"));
          if (userData?.police_id === police_id) {
            sessionStorage.setItem(
              "userData",
              JSON.stringify({
                ...userData,
                complaint_id: task.complaint_id,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaint_id: task.complaint_id,
          comment: comment,
        }),
      });
      const result = await response.json();
      console.log("Comment added:", result);
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
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          cursor: "pointer"
        }}
        onClick={onClose}
      />
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 1001,
        maxWidth: "500px",
        width: "90%",
        display: 'flex',
        flexDirection: 'column',
        position: "relative"
      }}>
        <h2 style={{ marginBottom: "16px" }}>Complaint Details</h2>
        {Object.entries(task).map(([key, value]) => (
          <p key={key} style={{ margin: "8px 0" }}>
            <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
          </p>
        ))}

        {/* Comment Section */}
        <div style={{ marginTop: "20px" }}>
          {!showCommentInput ? (
            <button
              onClick={() => setShowCommentInput(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6b7280",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Add Comment
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <input
                type="text"
                placeholder="Enter your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <button
                onClick={handleCommentSubmit}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#10b981",
                  color: "#fff",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginTop: '16px'
        }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#34d399",
              color: "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
            onClick={handleAssignClick}
          >
            Assign
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer"
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {showAssignPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1100,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onClick={handleCloseAssignPopup}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                zIndex: 1101,
                maxWidth: "500px",
                width: "90%",
                maxHeight: "80vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Assign Task</h3>
              <input
                type="text"
                placeholder="Search by name or speciality"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px",
                  marginBottom: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "95%",
                }}
              />
              {policeTeam.length > 0 ? (
                <div
                  style={{
                    overflowY: "auto",
                    flex: 1,
                    maxHeight: "300px",
                    marginBottom: "16px",
                    border: "1px solid #eee",
                    borderRadius: "5px",
                  }}
                >
                  {filteredPoliceTeam.map((officer) => (
                    <div
                      key={officer.police_id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <img
                        src={officer.photo || "placeholder.jpg"}
                        alt={officer.full_name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          marginRight: "30px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "bold", margin: 0 }}>{officer.full_name}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                          {officer.speciality}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedOfficers.includes(officer.police_id)}
                        onChange={() => handleOfficerSelect(officer.police_id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>Loading officers...</p>
              )}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}>
                <button
                  onClick={handleConfirmAssignment}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#34d399",
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Confirm Assignment
                </button>
                <button
                  onClick={handleCloseAssignPopup}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, isDraggingOver }) => {
  const [showModal, setShowModal] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ id: task.id })
    );
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Determine the background color based on userData
  const isHighlighted =
    task.complaint_id === userData?.complaint_id && task.status !== "Closed";

  const cardBackgroundColor = isHighlighted
    ? "lightblue"
    : isDraggingOver
    ? "rgba(0, 0, 0, 0.1)"
    : "white";

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleCardClick}
        style={{
          padding: "8px",
          marginBottom: "8px",
          cursor: "grab",
          backgroundColor: cardBackgroundColor,
          boxShadow: isDraggingOver
            ? "0 4px 8px rgba(0,0,0,0.2)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          border: "1px solid #ccc",
          borderRadius: "4px",
          transition: "transform 0.2s, box-shadow 0.2s",
          transform: isDraggingOver ? "scale(1.02)" : "none",
          position: "relative",
        }}
      >
        <p>
          <strong>{task.crime_type}</strong>
        </p>
        <p style={{ fontSize: "12px", color: "gray" }}>
          {task.complainant_name}
        </p>
      </div>
      {showModal && <TaskModal task={task} onClose={handleCloseModal} />}
    </>
  );
};

export { TaskCard, TaskModal };
