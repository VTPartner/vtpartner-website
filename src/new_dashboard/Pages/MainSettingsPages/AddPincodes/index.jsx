/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";


import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Cookies from "js-cookie";

import {
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPinCodesPage = () => {
  const { city_id, city_name } = useParams();
  const [pinCodes, setPinCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState({
    pincode: "",
    pincode_id: "",
    status: 1,
  });
  const [errorPincode, setErrorPincode] = useState({ pincode: false });
  const [btnLoading, setBtnLoading] = useState(false);

  // Fetch all the allowed Pincodes for a particular City
  const fetchAllPinCodes = async (page = 1) => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/all_allowed_pincodes`,
        { city_id, page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPinCodes(response.data.pincodes);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  useEffect(() => {
    fetchAllPinCodes();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } else {
      toast.error("Failed to fetch data. Please check your connection.");
    }
  };

  // Filter pincodes based on search
  const filteredPinCodes = pinCodes.filter((pincode) =>
    pincode.pincode.toString().includes(searchQuery.toLowerCase())
  );

  // Pincode validation
  const pincodeRegex = /^[0-9]{6}$/;
  const validatePincode = (pincode) => pincodeRegex.test(pincode);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPincode({ ...selectedPincode, [name]: value });

    if (name === "pincode") {
      setErrorPincode({ ...errorPincode, [name]: !validatePincode(value) });
    }
  };

  // Save pincode details
  const savePincodeDetails = async () => {
    setBtnLoading(true);

    const newErrors = { pincode: !validatePincode(selectedPincode.pincode) };
    setErrorPincode(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_pincode`
        : `${serverEndPoint}/add_new_pincode`;

      const requestData = {
        city_id,
        pincode: selectedPincode.pincode,
        pincode_status: selectedPincode.status,
        pincode_id: isEditMode ? selectedPincode.pincode_id : 0,
      };

      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Pincode updated successfully!"
            : "Pincode added successfully!"
        );
        setShowPincodeModal(false);
        fetchAllPinCodes(currentPage);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Pincode already exists.");
      } else {
        toast.error("An error occurred while saving the pincode.");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Manage Pincodes</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-map-pin f-s-16"></i> Pincodes
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  {city_name}
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                {/* Add New Pincode Button */}
                <button
                  className="btn btn-primary mb-3"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedPincode({
                      pincode: "",
                      pincode_id: "",
                      status: 1,
                    });
                    setShowPincodeModal(true);
                  }}
                >
                  Add New Pincode
                </button>

                {/* Search Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search pincode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Pincodes Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Pincode</th>
                        <th>Last Updated</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPinCodes.map((pincode, index) => (
                        <tr key={index}>
                          <td>{pincode.pincode}</td>
                          <td>{formatEpoch(pincode.creation_time)}</td>
                          <td>
                            <span
                              className={`badge ${
                                pincode.status == 1 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {pincode.status == 1 ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedPincode({
                                  pincode: pincode.pincode,
                                  status: pincode.status,
                                  pincode_id: pincode.pincode_id,
                                });
                                setIsEditMode(true);
                                setShowPincodeModal(true);
                              }}
                            >
                              <i className="ti ti-edit"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add/Edit Pincode Modal */}
      {showPincodeModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Pincode" : "Add New Pincode"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPincodeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errorPincode.pincode ? "is-invalid" : ""
                    }`}
                    name="pincode"
                    value={selectedPincode.pincode}
                    onChange={handleInputChange}
                  />
                  {errorPincode.pincode && (
                    <div className="invalid-feedback">
                      Pincode must be 6 digits
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={selectedPincode.status}
                    onChange={handleInputChange}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPincodeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={savePincodeDetails}
                  disabled={btnLoading}
                >
                  {btnLoading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPinCodesPage;
