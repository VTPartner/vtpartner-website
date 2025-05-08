/* eslint-disable no-unused-vars */
// CustomerWalletDetails.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
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
import Cookies from "js-cookie";
import {
  serverEndPoint,
  RAZORPAY_KEY_ID,
  formatEpoch,
} from "../../../../../dashboard/app/constants";
import Loader from "../../../Loader";
// import {
//   serverEndPoint,
//   RAZORPAY_KEY_ID,
//   formatEpoch,
// } from "../../../dashboard/app/constants";
// import Loader from "../Loader";

const CustomerWalletDetails = () => {
  const { customerId, customerName } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const token = Cookies.get("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchWalletDetails = async () => {
    try {
      const response = await axios.post(
        `${serverEndPoint}/get_customer_wallet_balance`,
        { customer_id: customerId },
        config
      );
      setWallet(response.data.wallet);
    } catch (error) {
      toast.error("Failed to fetch wallet details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [customerId]);

  const handlePayment = async () => {
    setBtnLoading(true);
    try {
      // Create order on your backend
      const orderResponse = await axios.post(
        `${serverEndPoint}/create_razorpay_order`,
        {
          amount: parseFloat(amount) * 100, // Convert to paise
          customer_id: customerId,
        },
        config
      );

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "KASP",
        description: "Wallet Recharge",
        order_id: orderResponse.data.order_id,
        handler: async function (response) {
          try {
            // Verify payment on your backend
            await axios.post(
              `${serverEndPoint}/verify_razorpay_payment`,
              {
                customer_id: customerId,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
                amount: amount,
              },
              config
            );

            toast.success("Payment successful!");
            setModal(false);
            fetchWalletDetails();
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: customerName,
          email: wallet?.email || "",
          contact: wallet?.mobile_no || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment initialization failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container fluid className="mt-4">
      <Row className="m-1">
        <Col xs={12}>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4>Wallet Balance - {customerName}</h4>
                  <h2>₹ {wallet?.current_balance || 0}</h2>
                </div>
                <Button color="primary" onClick={() => setModal(true)}>
                  Add Money
                </Button>
              </div>

              <div className="table-responsive">
                <Table className="table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment ID</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.transaction_id}>
                        <td>{formatEpoch(transaction.transaction_time)}</td>
                        <td>
                          <Badge
                            color={
                              transaction.transaction_type === "DEPOSIT"
                                ? "success"
                                : "danger"
                            }
                          >
                            {transaction.transaction_type}
                          </Badge>
                        </td>
                        <td>₹ {transaction.amount}</td>
                        <td>
                          <Badge
                            color={
                              transaction.status === "COMPLETED"
                                ? "success"
                                : transaction.status === "PENDING"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </td>
                        <td>{transaction.razorpay_payment_id}</td>
                        <td>{transaction.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          Add Money to Wallet
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                required
              />
            </FormGroup>

            <Button
              color="primary"
              onClick={handlePayment}
              disabled={!amount || parseFloat(amount) <= 0 || btnLoading}
            >
              {btnLoading ? "Processing..." : "Proceed to Pay"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default CustomerWalletDetails;
