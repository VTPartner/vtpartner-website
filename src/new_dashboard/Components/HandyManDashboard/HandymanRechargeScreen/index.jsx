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
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";
import Loader from "../../Loader";

const HandymanRechargeScreen = () => {
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

  const calculateRechargeStatus = (rechargeTime, expiryTime) => {
    const currentEpoch = Math.floor(Date.now() / 1000); // Current time in seconds
    const rechargeEpoch = parseInt(rechargeTime);
    const expiryEpoch = parseInt(expiryTime);

    if (!rechargeEpoch || !expiryEpoch) {
      return {
        status: "INVALID",
        color: "danger",
      };
    }

    if (currentEpoch > expiryEpoch) {
      return {
        status: "EXPIRED",
        color: "danger",
      };
    }

    if (currentEpoch >= rechargeEpoch && currentEpoch <= expiryEpoch) {
      return {
        status: "ACTIVE",
        color: "success",
      };
    }

    return {
      status: "PENDING",
      color: "warning",
    };
  };

  const fetchRechargeHistory = async () => {
    try {
      const [walletRes, historyRes] = await Promise.all([
        axios.post(`${serverEndPoint}/get_handyman_wallet_balance`, {
          handyman_id: driverId,
        }),
        axios.post(`${serverEndPoint}/get_handyman_recharge_history`, {
          handyman_id: driverId,
        }),
      ]);

      setWallet(walletRes.data.wallet);
      setRechargeHistory(historyRes.data.history || []);
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
      await axios.post(`${serverEndPoint}/add_handyman_wallet_transaction`, {
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
            <h4 className="main-title">Handyman Recharge History</h4>
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
                  Handyman Recharge History
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
                        <th>Recharge Plan</th>
                        <th>Plan Expiry Days</th>
                        <th>Amount</th>
                        <th>Razorpay ID</th>
                        <th>Plan Expiry Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((recharge) => {
                        const status = calculateRechargeStatus(
                          recharge.recharge_time,
                          recharge.plan_expiry_time
                        );

                        return (
                          <tr key={recharge.recharge_history_id}>
                            <td>{formatEpoch(recharge.recharge_time)}</td>
                            <td>{recharge.plan_title}</td>
                            <td>{recharge.expiry_days} Day</td>
                            <td>
                              <span className="badge bg-success">
                                ₹ {recharge.plan_price}
                              </span>
                            </td>
                            <td>{recharge.razorpay_payment_id}</td>
                            <td>{recharge.plan_expiry_time}</td>
                            <td>
                              <Badge color={status.color}>
                                {status.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                      {currentItems.length === 0 && (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No recharge history found
                          </td>
                        </tr>
                      )}
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

export default HandymanRechargeScreen;
