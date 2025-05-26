/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
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
import { useParams } from "react-router-dom";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../dashboard/app/constants";

const HandymanWallet = () => {
  const { driverId, driverName } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    amount: "",
    transaction_type: "DEPOSIT",
    payment_mode: "UPI",
    reference_id: "",
    remarks: "",
  });

  const fetchWalletDetails = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        axios.post(`${serverEndPoint}/get_handyman_wallet_balance`, {
          handyman_id: driverId,
        }),
        axios.post(`${serverEndPoint}/get_handyman_wallet_transactions`, {
          handyman_id: driverId,
        }),
      ]);

      setWallet(walletRes.data.wallet);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      toast.error("Failed to fetch wallet details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [driverId]);

  const handleTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverEndPoint}/add_handyman_wallet_transaction`, {
        handyman_id: driverId,
        ...transactionForm,
      });

      toast.success("Transaction completed successfully");
      setModal(false);
      fetchWalletDetails();
    } catch (error) {
      toast.error("Transaction failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Card className="m-4">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1>Handyman Name - {driverName}</h1>
              <h4>Wallet Balance</h4>
              <h2>₹ {wallet?.current_balance || 0}</h2>
            </div>
            <Button color="primary" onClick={() => setModal(true)}>
              Add Transaction
            </Button>
          </div>

          <h5>Transaction History</h5>
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Mode</th>
                <th>Reference</th>
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
                  <td>{transaction.payment_mode}</td>
                  <td>{transaction.reference_id}</td>
                  <td>{transaction.remarks}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          Add Transaction
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleTransaction}>
            <FormGroup>
              <Label>Transaction Type</Label>
              <Input
                type="select"
                value={transactionForm.transaction_type}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
                    transaction_type: e.target.value,
                  })
                }
              >
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label>Amount</Label>
              <Input
                type="number"
                value={transactionForm.amount}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
                    amount: e.target.value,
                  })
                }
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Payment Mode</Label>
              <Input
                type="select"
                value={transactionForm.payment_mode}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
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
                value={transactionForm.reference_id}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
                    reference_id: e.target.value,
                  })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>Remarks</Label>
              <Input
                type="textarea"
                value={transactionForm.remarks}
                onChange={(e) =>
                  setTransactionForm({
                    ...transactionForm,
                    remarks: e.target.value,
                  })
                }
              />
            </FormGroup>

            <Button color="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default HandymanWallet;
