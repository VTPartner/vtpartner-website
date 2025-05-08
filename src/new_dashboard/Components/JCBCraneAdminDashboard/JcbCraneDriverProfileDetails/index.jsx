import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import GLightbox from "glightbox";

import Loader from "../../Loader";
import JCBCraneDriverDocumentsDetails from "./JcbCraneDriverDocumentsDetails";
import JCBCraneDriverAboutMeCard from "./JcbCraneDriverAboutMe";
import { serverEndPoint } from "../../../../dashboard/app/constants";

const JCBCraneDriverProfileDetails = () => {
  const { agent_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState(null);

  useEffect(() => {
    GLightbox({
      selector: ".glightbox",
    });
  }, []);

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
        `${serverEndPoint}/get_jcb_crane_driver_details`,
        {
          jcb_crane_driver_id: agent_id,
        },
        config
      );

      const data = response.data.result || [];
      setDriverData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentDetails();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid className="m-5">
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">JCB/Crane Driver Profile</h4>
          <ul className="app-line-breadcrumbs mb-3">
            <li className="">
              <a href="#" className="f-s-14 f-w-500">
                <span>
                  <i className="ph-duotone ph-truck f-s-16"></i> JCB/Crane
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
          <JCBCraneDriverDocumentsDetails driverData={driverData} />
        </Col>
        <Col lg={4} md={6} sm={12}>
          <JCBCraneDriverAboutMeCard driverData={driverData} />
        </Col>
      </Row>
    </Container>
  );
};

export default JCBCraneDriverProfileDetails;
