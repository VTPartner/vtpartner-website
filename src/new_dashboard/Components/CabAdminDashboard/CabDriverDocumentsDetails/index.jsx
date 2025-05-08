/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { Card, CardBody, Row, Col } from "reactstrap";
import Glightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { useEffect } from "react";

const CabDriverDocumentsDetails = ({ driverData }) => {
  useEffect(() => {
    const lightbox = Glightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      closeButton: true,
    });

    return () => {
      lightbox.destroy();
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
                  if (driverData.is_online === 1) return "success";
                  if (driverData.is_online === 2) return "danger";
                  return "light";
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
              "vehicle_image",
              "vehicle_plate_image",
            ].map((imageKey) => {
              const imageUrl = driverData[imageKey];
              if (imageUrl && imageUrl !== "NA") {
                return (
                  <Col xs="4" key={imageKey}>
                    <div className="image-container">
                      <p className="image-title">
                        {imageKey.replace(/_/g, " ").toUpperCase()}
                      </p>
                      <a
                        href={imageUrl}
                        className="glightbox"
                        data-glightbox="type: image; zoomable: true;"
                        data-title={imageKey.replace(/_/g, " ").toUpperCase()}
                      >
                        <img
                          src={imageUrl}
                          className="w-100 h-200 rounded"
                          alt={imageKey}
                          style={{ objectFit: "cover" }}
                        />
                      </a>
                    </div>
                  </Col>
                );
              }
              return null;
            })}
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default CabDriverDocumentsDetails;