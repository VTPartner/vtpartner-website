/* eslint-disable react/prop-types */
import { useState } from "react";
import { Card, CardBody } from "reactstrap";

const GoodsDriverProfileCard = ({ driverData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true); // Open modal on image click
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <Card className="shadow-sm border-0 rounded">
      <CardBody className="card-body">
        <div className="profile-container">
          <div className="image-details">
            <div className="profile-image"></div>
            <div className="profile-pic">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <div
                    id="imgPreview"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "100%",
                      border: "4px dashed rgb(var(--dark), 1)",
                      backgroundColor: "rgb(var(--warning), 1)",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  >
                    {driverData.profile_pic ? (
                      <img
                        src={driverData.profile_pic}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>No Profile Pic</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Modal to display the image in full screen */}
          {isModalOpen && (
            <ImageModal
              imageSrc={driverData.profile_pic}
              onClose={handleCloseModal}
            />
          )}
          <div className="person-details">
            <h5 className="f-w-600">{driverData.driver_first_name}</h5>
            <p>Goods Driver</p>

            <div className="my-2">
              <button
                type="button"
                className={`btn b-r-22 ${
                  driverData.status === 1
                    ? "btn-success" // Verified
                    : driverData.status === 0
                    ? "btn-warning" // Unverified
                    : driverData.status === 2
                    ? "btn-danger" // Blocked
                    : driverData.status === 3
                    ? "btn-secondary" // Rejected
                    : "btn-primary" // Default (use another state if needed)
                }`}
                // onClick={handleUpdateStatus}
              >
                <i
                  className={`ti ${
                    driverData.status === 1
                      ? "ti-check"
                      : driverData.status === 0
                      ? "ti-warning"
                      : driverData.status === 2
                      ? "ti-lock"
                      : driverData.status === 3
                      ? "ti-close"
                      : "ti-user"
                  }`}
                ></i>
                {driverData.status === 1
                  ? "Verified"
                  : driverData.status === 0
                  ? "Unverified"
                  : driverData.status === 2
                  ? "Blocked"
                  : driverData.status === 3
                  ? "Rejected"
                  : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// Modal Component
const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={imageSrc}
          alt="Zoomed Profile"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: "10px",
            objectFit: "contain", // Keeps aspect ratio intact
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "none",
            borderRadius: "50%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default GoodsDriverProfileCard;
