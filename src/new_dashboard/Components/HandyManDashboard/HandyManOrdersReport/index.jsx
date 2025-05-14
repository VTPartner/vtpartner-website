/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, Form, Toast } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import { Button } from "@mui/material";
import axios from "axios";
import * as XLSX from "xlsx";

import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../Loader";

const HandymanOrdersReport = () => {
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState([]);
  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    if (range.length !== 2) {
      Toast.error("Please select date range");
      return;
    }

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
        `${serverEndPoint}/get_handyman_orders_report`,
        {
          start_date: format(range[0], "yyyy-MM-dd"),
          end_date: format(range[1], "yyyy-MM-dd"),
        },
        config
      );
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      Toast.error(error.response?.data?.message || "Error fetching report");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!reportData?.results?.length) {
      Toast.error("No data to export");
      return;
    }

    // Prepare data for export
    const exportData = reportData.results.map((order) => ({
      "Order ID": order.order_id,
      "Booking Date": order.booking_date,
      "Customer Name": order.customer_name,
      "Customer Mobile": order.customer_mobile_no,
      "Handyman Name": order.handyman_name,
      "Handyman Mobile": order.handyman_mobile_no,
      "Service Category": order.sub_cat_name,
      "Service Name": order.service_name,
      "Work Location": order.pickup_address,
      "Distance (km)": order.distance,
      "Base Price": order.base_price,
      GST: order.gst_amount,
      IGST: order.igst_amount,
      "Total Amount": order.total_price,
      "Payment Method": order.payment_method,
      Status: order.booking_status,
    }));

    // Add totals row
    exportData.push({
      "Order ID": "TOTAL",
      "Total Amount": reportData.total_amount,
      "Total Orders": reportData.total_orders,
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Handyman Orders Report");

    // Save the file
    XLSX.writeFile(
      wb,
      `Handyman_Orders_Report_${format(range[0], "yyyy-MM-dd")}_to_${format(
        range[1],
        "yyyy-MM-dd"
      )}.xlsx`
    );
  };

  return (
    <Container fluid>
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Handyman Orders Report</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <Row className="mb-4">
                <Col md={6}>
                  <Form className="app-form">
                    <Flatpickr
                      className="form-control picker-range"
                      value={range}
                      onChange={(dates) => setRange(dates)}
                      options={{
                        mode: "range",
                        dateFormat: "Y-m-d",
                      }}
                      placeholder="YYYY-MM-DD to YYYY-MM-DD"
                    />
                  </Form>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchReport}
                    disabled={loading || range.length !== 2}
                    className="me-2"
                  >
                    Generate Report
                  </Button>
                  {reportData && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={exportToExcel}
                      disabled={loading}
                    >
                      Export to Excel
                    </Button>
                  )}
                </Col>
              </Row>

              {loading ? (
                <Loader />
              ) : reportData?.results?.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Booking Date</th>
                          <th>Customer</th>
                          <th>Handyman</th>
                          <th>Service</th>
                          <th>Work Location</th>
                          <th>Distance</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.results.map((order) => (
                          <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.booking_date}</td>
                            <td>
                              <div>{order.customer_name}</div>
                              <small className="text-muted">
                                {order.customer_mobile_no}
                              </small>
                            </td>
                            <td>
                              <div>{order.handyman_name}</div>
                              <small className="text-muted">
                                {order.handyman_mobile_no}
                              </small>
                            </td>
                            <td>
                              <div>{order.sub_cat_name}</div>
                              <small className="text-muted">
                                {order.service_name}
                              </small>
                            </td>
                            <td>{order.pickup_address}</td>
                            <td>{order.distance} km</td>
                            <td>₹{order.total_price}</td>
                            <td>
                              <span
                                className={`badge bg-${
                                  order.booking_status === "Completed"
                                    ? "success"
                                    : order.booking_status === "Cancelled"
                                    ? "danger"
                                    : "warning"
                                }`}
                              >
                                {order.booking_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-end">
                    <h5>Total Orders: {reportData.total_orders}</h5>
                    <h5>Total Amount: ₹{reportData.total_amount.toFixed(2)}</h5>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p>No data available for selected date range</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HandymanOrdersReport;
