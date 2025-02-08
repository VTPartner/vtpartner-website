/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { Card, CardBody, Row, Col } from "reactstrap";
import Glightbox from "glightbox"; // Import Glightbox
import "glightbox/dist/css/glightbox.min.css"; // Ensure Glightbox CSS is imported

import { useEffect } from "react";

const GoodsDriverDocumentsDetails = ({ driverData }) => {
  useEffect(() => {
    // Initialize Glightbox when the component is mounted
    const lightbox = Glightbox({
      selector: ".glightbox", // Target all elements with the glightbox class
      touchNavigation: true, // Enable touch navigation for mobile devices
      loop: true, // Enable loop when navigating images
      closeButton: true, // Ensure the close button is visible
    });

    return () => {
      lightbox.destroy(); // Cleanup lightbox instance when the component is unmounted
    };
  }, []);

  return (
    <Card className="shadow-lg border-0 rounded">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="h-45 w-45 d-flex-center b-r-50 overflow-hidden bg-danger">
            <img
              src="/assets/images/avtar/16.png"
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="flex-grow-1 ps-2 pe-2">
            <div className="f-w-600">
              {driverData.driver_first_name}
              {"          "}
              <span
                className={`badge bg-${(() => {
                  if (driverData.is_online === 1) return "success"; // Verified
                  if (driverData.is_online === 2) return "danger"; // Blocked
                  return "light"; // Default
                })()}`}
              >
                {(() => {
                  if (driverData.is_online === 1) return "Online";
                  if (driverData.is_online === 0) return "Offline";
                  return "Unknown";
                })()}
              </span>
            </div>
            <div className="text-muted f-s-12">
              Registered with us from {driverData.registration_date}
            </div>
          </div>
        </div>
        <div className="post-div">
          <Row className="g-2 my-2">
            {[
              "recent_online_pic",
              "aadhar_card_front",
              "aadhar_card_back",
              "pan_card_front",
              "pan_card_back",
              "license_front",
              "license_back",
              "insurance_image",
              "noc_image",
              "pollution_certificate_image",
              "rc_image",
              "driver_vehicle_image",
              "vehicle_plate_image",
            ].map((imageKey) => {
              const imageUrl = driverData[imageKey];
              if (imageUrl && imageUrl !== "NA") {
                return (
                  <Col xs="4" key={imageKey}>
                    <div className="image-container">
                      {/* Display the name of the image (key) on top */}
                      <p className="image-title">
                        {imageKey.replace(/_/g, " ").toUpperCase()}
                      </p>
                      <a
                        href={imageUrl} // Link to open in the lightbox
                        className="glightbox" // Ensure the class is glightbox for the lightbox to target it
                        data-glightbox="type: image; zoomable: true;" // Lightbox settings
                        data-title={imageKey.replace(/_/g, " ").toUpperCase()} // Title of the image shown in the lightbox
                      >
                        <img
                          src={imageUrl}
                          className="w-100 h-200 rounded"
                          alt={imageKey}
                          style={{ objectFit: "cover" }} // Ensures the image covers the space without distortion
                        />
                      </a>
                    </div>
                  </Col>
                );
              }
              return null; // Don't render anything if the image URL is empty or "NA"
            })}
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default GoodsDriverDocumentsDetails;
