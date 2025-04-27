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
                  {proofLinks
                    .sort((a, b) => {
                      const getTypePriority = (file) => {
                        const extension = file.link.split('.').pop().toLowerCase();
                        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 1; // Images
                        if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(extension)) return 2; // Videos
                        return 3; // Other files
                      };
                      return getTypePriority(a) - getTypePriority(b);
                    })
                    .reduce((acc, file) => {
                      const fileExtension = file.link.split('.').pop().toLowerCase();
                      let type = '';
                      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
                        type = 'Image File';
                      } else if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(fileExtension)) {
                        type = 'Video File';
                      } else if (fileExtension === 'pdf') {
                        type = 'PDF File';
                      } else if (['doc', 'docx'].includes(fileExtension)) {
                        type = 'Word File';
                      } else {
                        type = `${fileExtension.toUpperCase()} File`; // Generic fallback for other file types
                      }
                      acc.push({ ...file, type });
                      return acc;
                    }, [])
                    .map((file, index, array) => {
                      const typeCount = array.filter((f) => f.type === file.type).indexOf(file) + 1;
                      if (file.type === 'Image File') {
                        // Render image without count
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
                      } else if (file.type === 'Video File') {
                        // Render video with count
                        return (
                          <div key={index} className="proof-item">
                            <a href={file.link} target="_blank" rel="noopener noreferrer" download>
                              {`${file.type} ${typeCount}`}
                            </a>
                          </div>
                        );
                      } else {
                        // Render as a downloadable link with count for other files
                        return (
                          <div key={index} className="proof-item">
                            <a href={file.link} target="_blank" rel="noopener noreferrer" download>
                              {`${file.type} ${typeCount}`}
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