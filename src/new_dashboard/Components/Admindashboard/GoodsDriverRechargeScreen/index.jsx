/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  Badge,
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";

import {
  serverEndPoint,
  formatEpoch,
  serverWebsiteEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";

const GoodsDriverRechargeScreen = () => {
  const { driverId, driverName } = useParams();
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [rechargeForm, setRechargeForm] = useState({
    amount: "",
    payment_mode: "UPI",
    reference_id: "",
    remarks: "",
  });

  const fetchRechargeHistory = async () => {
    try {
      const [walletRes, historyRes] = await Promise.all([
        axios.post(`${serverEndPoint}/get_driver_wallet_balance`, {
          driver_id: driverId,
        }),
        axios.post(`${serverEndPoint}/get_driver_recharge_history`, {
          driver_id: driverId,
        }),
      ]);

      setWallet(walletRes.data.wallet);
      setRechargeHistory(historyRes.data.recharge_history || []);
    } catch (error) {
      console.error("Error fetching recharge history:", error);
      toast.error("Failed to fetch recharge history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRechargeHistory();
  }, [driverId]);

  const handleRecharge = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${serverEndPoint}/add_driver_recharge`, {
        driver_id: driverId,
        ...rechargeForm,
      });

      toast.success("Recharge completed successfully");
      setModal(false);
      fetchRechargeHistory();
      setRechargeForm({
        amount: "",
        payment_mode: "UPI",
        reference_id: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Recharge error:", error);
      toast.error("Recharge failed");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rechargeHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rechargeHistory.length / itemsPerPage);

  if (loading) return <Loader />;

  return (
    <div>
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Recharge History</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-wallet f-s-16"></i> Wallet
                  </span>
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Recharge History
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="text-primary mb-3">{driverName}</h3>
                    <h5 className="text-muted">Current Wallet Balance</h5>
                    <h2 className="text-success">
                      ₹ {wallet?.current_balance || 0}
                    </h2>
                  </div>
                  {/* <Button
                    color="primary"
                    className="d-flex align-items-center"
                    onClick={() => setModal(true)}
                  >
                    <i className="ti ti-plus me-2"></i>
                    Add Recharge
                  </Button> */}
                </div>

                <div className="table-responsive">
                  <Table className="table-hover">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Amount</th>
                        <th>Payment Mode</th>
                        <th>Reference ID</th>
                        <th>Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((recharge) => (
                        <tr key={recharge.recharge_id}>
                          <td>{formatEpoch(recharge.recharge_time)}</td>
                          <td>
                            <span className="badge bg-success">
                              ₹ {recharge.amount}
                            </span>
                          </td>
                          <td>{recharge.payment_mode}</td>
                          <td>{recharge.reference_id}</td>
                          <td>
                            <Badge
                              color={
                                recharge.status === "COMPLETED"
                                  ? "success"
                                  : recharge.status === "PENDING"
                                  ? "warning"
                                  : "danger"
                              }
                            >
                              {recharge.status}
                            </Badge>
                          </td>
                          <td>{recharge.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls d-flex justify-content-end align-items-center mt-3">
                  <Button
                    color="outline-primary"
                    className="me-2"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    color="outline-primary"
                    className="ms-2"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Recharge Modal */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          Add New Recharge
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleRecharge}>
            <FormGroup>
              <Label>Amount</Label>
              <Input
                type="number"
                value={rechargeForm.amount}
                onChange={(e) =>
                  setRechargeForm({
                    ...rechargeForm,
                    amount: e.target.value,
                  })
                }
                required
                placeholder="Enter amount"
              />
            </FormGroup>

            <FormGroup>
              <Label>Payment Mode</Label>
              <Input
                type="select"
                value={rechargeForm.payment_mode}
                onChange={(e) =>
                  setRechargeForm({
                    ...rechargeForm,
                    payment_mode: e.target.value,
                  })
                }
              >
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Reference ID</Label>
              <Input
                type="text"
                value={rechargeForm.reference_id}
                onChange={(e) =>
                  setRechargeForm({
                    ...rechargeForm,
                    reference_id: e.target.value,
                  })
                }
                placeholder="Enter reference ID"
              />
            </FormGroup>

            <FormGroup>
              <Label>Remarks</Label>
              <Input
                type="textarea"
                value={rechargeForm.remarks}
                onChange={(e) =>
                  setRechargeForm({
                    ...rechargeForm,
                    remarks: e.target.value,
                  })
                }
                placeholder="Enter remarks"
              />
            </FormGroup>

            <div className="d-flex justify-content-end">
              <Button
                color="secondary"
                className="me-2"
                onClick={() => setModal(false)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default GoodsDriverRechargeScreen;
