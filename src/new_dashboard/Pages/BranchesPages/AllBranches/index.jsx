/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../../Components/Loader";
import { serverEndPoint } from "../../../../dashboard/app/constants";

const AllAdminBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = Cookies.get("authToken");
        const adminID = Cookies.get("adminID");
        const response = await axios.post(
          `${serverEndPoint}/all_branches`,
          {
            admin_id: adminID, // Replace with dynamic admin_id or fetch from context if needed
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBranches(response.data.branches || []);
      } catch (error) {
        setError("Failed to fetch branches");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchSelect = (branchId, cityId) => {
    Cookies.set("branchId", branchId);
    Cookies.set("cityId", cityId);
    navigate("/dashboard/home");
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  return (
    <div className="m-5">
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4>All Branches</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li>
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-table f-s-16"></i> Branches
                  </span>
                </a>
              </li>
              <li className="active">
                <a href="#" className="f-s-14 f-w-500">
                  All Branches
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardHeader>
                <h5>All Branches</h5>
              </CardHeader>
              <CardBody className="p-0">
                <Table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name</th>
                      <th>City</th>
                      <th>Registration Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch) => (
                      <tr key={branch.branch_id}>
                        <td>{branch.branch_id}</td>
                        <td>{branch.branch_name}</td>
                        <td>{branch.location}</td>
                        <td>{branch.reg_date}</td>
                        <td>
                          <Button
                            color="primary"
                            onClick={() =>
                              handleBranchSelect(branch.id, branch.city_id)
                            }
                          >
                            Proceeding forward
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllAdminBranches;
