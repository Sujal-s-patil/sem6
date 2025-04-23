import React, { useEffect, useState } from "react";
import "../css/PoliceTeamCard.css";

const PoliceTeamCard = ({ complaintId }) => {
  const [officers, setOfficers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await fetch("http://localhost:5555/police/specific", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complaint_id: complaintId }),
        });

        const data = await response.json();
        setOfficers(data || []);
      } catch (error) {
        console.error("Error loading officers:", error);
        setOfficers([]);
      }
    };

    fetchOfficers();
  }, [complaintId]);

  const handleCardClick = () => {
    if (officers.length > 0) {
      setIsModalOpen(true);
    } 
  };

  return (
    <>
      <div className="card" style={{ maxWidth: "180px", margin: "0 auto" }} onClick={handleCardClick}>
        <div className="title">Assigned Police Team</div>
        <div className="image-stack">
          {officers.length > 0 ? (
            officers.map((officer, index) => (
              <img
                key={officer.full_name}
                src={officer.photo}
                alt={officer.full_name}
                style={{ zIndex: 100 - index }}
              />
            ))
          ) : (
            <div className="no-officers">
              No officers assigned to this complaint.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("modal-overlay")) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="modal">
            <h2>Police Officers</h2>
            <div id="officerList">
              {officers.map((officer) => (
                <div key={officer.full_name} className="officer">
                  <img src={officer.photo} alt={officer.full_name} />
                  <div className="officer-info">
                    <div className="officer-name">{officer.full_name}</div>
                    <div className="officer-speciality">{officer.speciality}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PoliceTeamCard;
