/* eslint-disable react/prop-types */
import { Card, CardBody, Row, Col } from "reactstrap";
import Glightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";
import { useEffect } from "react";

const HandymanDocumentsDetails = ({ driverData }) => {
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
              src={driverData.profile_pic || "/assets/images/avtar/16.png"}
              alt=""
              className="img-fluid"
            />
          </div>
          <div className="flex-grow-1 ps-2 pe-2">
            <div className="f-w-600">
              {driverData.name}
              {"          "}
              <span
                className={`badge bg-${
                  driverData.is_online === 1
                    ? "success"
                    : driverData.is_online === 0
                    ? "danger"
                    : "light"
                }`}
              >
                {driverData.is_online === 1
                  ? "Online"
                  : driverData.is_online === 0
                  ? "Offline"
                  : "Unknown"}
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

export default HandymanDocumentsDetails;
