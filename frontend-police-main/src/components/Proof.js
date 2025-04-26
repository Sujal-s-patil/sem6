import React, { useState } from 'react';
import '../css/Proof.css'; // Import your CSS file for styling

const Proof = ({ complaintId }) => {
  const [proofLinks, setProofLinks] = useState([]);
  const [isProofPopupVisible, setIsProofPopupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProofLinks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5555/photo/${complaintId}`);
      if (response.ok) {
        const data = await response.json();
        setProofLinks(data);
        setIsProofPopupVisible(true);
      } else {
        console.error('Failed to fetch proof links.');
      }
    } catch (err) {
      console.error('Error fetching proof links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeProofPopup = () => {
    setIsProofPopupVisible(false);
    setProofLinks([]);
  };

  return (
    <>
      <button className="download-link" onClick={fetchProofLinks}>
        {isLoading ? 'Loading...' : 'Download Proof'}
      </button>

      {isProofPopupVisible && (
        <div className="popup-overlay" onClick={closeProofPopup}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Proof Files</h3>
              <button className="modern-close-btn" onClick={closeProofPopup}>
                ✖
              </button>
            </div>
            <div className="popup-content">
              {proofLinks.length > 0 ? (
                <div className="proof-grid">
                  {proofLinks.map((file, index) => {
                    const fileExtension = file.link.split('.').pop().toLowerCase();
                    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                      return (
                        <div key={index} className="proof-item">
                          <img
                            src={file.link}
                            alt={`Proof ${index + 1}`}
                            className="proof-image"
                            onClick={() => window.open(file.link, '_blank')}
                          />
                        </div>
                      );
                    } else if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(fileExtension)) {
                      return (
                        <div key={index} className="proof-item">
                          <video controls className="proof-video">
                            <source src={file.link} type={`video/${fileExtension}`} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className="proof-item">
                          <a href={file.link} target="_blank" rel="noopener noreferrer" download>
                            {`Download ${fileExtension.toUpperCase()} File`}
                          </a>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <p>No proof files available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Proof;