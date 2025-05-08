/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, Table, Spinner } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  formatEpoch,
  serverEndPoint,
} from "../../../../../dashboard/app/constants";

const GoodsDriverRechargeHistory = ({
  isOpen,
  toggle,
  driverId,
  driverName,
}) => {
  const [loading, setLoading] = useState(true);
  const [rechargeHistory, setRechargeHistory] = useState([]);

  useEffect(() => {
    if (isOpen && driverId) {
      fetchRechargeHistory();
    }
  }, [isOpen, driverId]);

  const fetchRechargeHistory = async () => {
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
        `${serverEndPoint}/get_driver_recharge_history`,
        { driver_id: driverId },
        config
      );

      if (response.data.status === "success") {
        setRechargeHistory(response.data.history);
      }
    } catch (error) {
      console.error("Error fetching recharge history:", error);
      toast.error("Failed to fetch recharge history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>Recharge History - {driverName}</ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center p-4">
            <Spinner color="primary" />
          </div>
        ) : rechargeHistory.length === 0 ? (
          <div className="text-center p-4">
            <p>No recharge history found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table className="table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plan Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Plan Days</th>
                  <th>Recharge Time</th>
                  <th>Expiry Date</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {rechargeHistory.map((record) => (
                  <tr key={record.recharge_history_id}>
                    <td>{record.recharge_date}</td>
                    <td>{record.plan_title}</td>
                    <td>
                      <span className="text-muted">
                        {record.plan_description}
                      </span>
                    </td>
                    <td>₹{record.plan_price}</td>
                    <td>{record.plan_days}</td>
                    <td>{formatEpoch(record.recharge_time)}</td>
                    <td>{record.plan_expiry_time}</td>
                    <td>
                      <span className="text-muted">
                        {record.razorpay_payment_id}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default GoodsDriverRechargeHistory;
