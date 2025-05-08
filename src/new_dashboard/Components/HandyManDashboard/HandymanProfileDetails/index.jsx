import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import GLightbox from "glightbox";

import Loader from "../../Loader";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import HandymanDocumentsDetails from "./HandymanDocumentsDetails";
import HandyManAboutMeCard from "./HandymanAboutMeDetails";

const HandyManAgentProfileDetails = () => {
  const { agent_id } = useParams(); // Assuming agent_id corresponds to handyman_id
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    // Initialize GLightbox after component mounts
    const lightbox = GLightbox({
      selector: ".glightbox",
    });
    // Cleanup function to destroy lightbox instance
    return () => {
      lightbox.destroy();
    };
  }, []); // Empty dependency array ensures this runs only once

  const fetchAgentDetails = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/get_handyman_details`, // Updated API endpoint
        {
          handyman_id: agent_id, // Updated parameter name
        },
        config
      );

      const data = response.data.result || null; // Handle potential empty result
      if (data) {
        setDriverData(data);
      } else {
        console.error("No handyman agent data found for ID:", agent_id);
        // Handle no data found scenario, maybe show a message
      }
    } catch (error) {
      console.error("Error fetching handyman agent data:", error);
      // Handle error state, maybe show an error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agent_id) {
      fetchAgentDetails();
    }
  }, [agent_id]); // Refetch if agent_id changes

  if (loading) {
    return <Loader />;
  }

  if (!driverData) {
    return (
      <Container fluid className="m-5">
        <Row className="m-1">
          <Col>
            <p>Could not load handyman agent details.</p>
            {/* Optionally add a button to retry */}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="m-5">
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Driver Profile</h4> {/* Updated title */}
          <ul className="app-line-breadcrumbs mb-3">
            <li className="">
              <a href="#" className="f-s-14 f-w-500">
                <span>
                  {/* Update icon if needed */}
                  <i className="ph-duotone ph-steering-wheel f-s-16"></i>
                  Drivers
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="f-s-14 f-w-500">
                Agent ID #{agent_id}
              </a>
            </li>
            <li className="active">
              <a href="#" className="f-s-14 f-w-500">
                Profile
              </a>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="m-5">
        <Col lg={8} md={6} sm={12}>
          {/* Pass driverData to the updated component */}
          <HandymanDocumentsDetails driverData={driverData} />
        </Col>
        <Col lg={4} md={6} sm={12}>
          {/* Pass driverData to the updated component */}
          <HandyManAboutMeCard driverData={driverData} />
        </Col>
      </Row>
    </Container>
  );
};

export default HandyManAgentProfileDetails;
