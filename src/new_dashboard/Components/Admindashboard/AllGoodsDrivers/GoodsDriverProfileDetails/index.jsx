import GLightbox from "glightbox";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import GoodsDriverDocumentsDetails from "../GoodsDriverDocumentsDetails";

import GoodsDriverAboutMeCard from "../GoodsDriverAboutMeCard";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../../dashboard/app/constants";
import Loader from "../../../Loader";

const GoodsDriverProfileDetails = () => {
  const { agent_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [driverData, setDriverData] = useState(null);
  useEffect(() => {
    GLightbox({
      selector: ".glightbox",
    });
  }, []);

  //   const [data, setData] = useState("tab1");

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

      const [ordersResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_driver_details`,
          {
            goods_driver_id: agent_id,
          },
          config
        ),
      ]);

      const data = ordersResponse.data.result || [];
      setDriverData(data);
      console.log("Data::", data);
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
      <Row className=" m-1">
        <Col xs={12}>
          <h4 className="main-title">Driver Profile</h4>
          <ul className="app-line-breadcrumbs mb-3">
            <li className="">
              <a href="#" className="f-s-14 f-w-500">
                <span>
                  <i className="ph-duotone  ph-stack f-s-16"></i> Goods
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
        {/* <Col lg={2} md={6} sm={12}>
          <GoodsDriverProfileTab data={data} setData={setData} />
        </Col> */}
        <Col lg={8} md={6} sm={12}>
          <GoodsDriverDocumentsDetails driverData={driverData} />
        </Col>
        <Col lg={4} md={6} sm={12}>
          {/* <GoodsDriverProfileCard driverData={driverData} /> */}
          <GoodsDriverAboutMeCard driverData={driverData} />
          {/* <ProfileCard />
    <AboutMe /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default GoodsDriverProfileDetails;
