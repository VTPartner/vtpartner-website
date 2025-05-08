/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

import Loader from "../Loader";
import {
  visitsChartData,
  orderChartData,
  salesChartData,
} from "../../Data/Charts/EcommerceChart";
import { serverEndPoint } from "../../../dashboard/app/constants";

const AdminDriversCard = () => {
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [waitingApproval, setWaitingApproval] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [percentageIncrease, setPercentageIncrease] = useState({
    drivers: 0,
    approval: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
  });
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      // Create an array of API calls with their corresponding names
      const apiCalls = [
        {
          name: "totalDrivers",
          call: axios.post(
            `${serverEndPoint}/get_total_other_drivers_verified_with_count`,
            {},
            config
          ),
        },
        {
          name: "waitingApproval",
          call: axios.post(
            `${serverEndPoint}/get_total_other_drivers_un_verified_with_count`,
            {},
            config
          ),
        },
        {
          name: "totalEarnings",
          call: axios.post(
            `${serverEndPoint}/get_total_other_drivers_orders_and_earnings`,
            {},
            config
          ),
        },
        {
          name: "monthlyEarnings",
          call: axios.post(
            `${serverEndPoint}/get_other_drivers_current_month_earnings`,
            {},
            config
          ),
        },
      ];

      // Execute all API calls and handle individual failures
      const results = await Promise.allSettled(apiCalls.map((api) => api.call));

      // Initialize variables with default values
      let totalDrivers = 0;
      let waitingApproval = 0;
      let totalEarnings = 0;
      let monthlyEarnings = 0;

      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          switch (apiCalls[index].name) {
            case "totalDrivers":
              // The API returns total_count directly
              totalDrivers = result.value.data.total_count || 0;
              break;
            case "waitingApproval":
              // The API returns total_count directly
              waitingApproval = result.value.data.total_count || 0;
              break;
            case "totalEarnings":
              totalEarnings = result.value.data.total_earnings || 0;
              break;
            case "monthlyEarnings":
              monthlyEarnings = result.value.data.current_month_earnings || 0;
              break;
          }
        } else {
          console.error(`Error in ${apiCalls[index].name}:`, result.reason);
        }
      });

      // Update state with available data
      setTotalDrivers(totalDrivers);
      setWaitingApproval(waitingApproval);
      setTotalEarnings(totalEarnings);
      setMonthlyEarnings(monthlyEarnings);

      // Update percentage increase with available data
      setPercentageIncrease({
        drivers: totalDrivers,
        approval: waitingApproval,
        totalEarnings: totalEarnings,
        monthlyEarnings: monthlyEarnings,
      });

      // Update chart data with available data
      setChartData({
        drivers: {
          series: [{ data: [totalDrivers - 10, totalDrivers] }],
          options: {
            chart: { type: "line" },
            xaxis: { categories: ["Last Month", "Current"] },
          },
        },
        approval: {
          series: [{ data: [waitingApproval - 5, waitingApproval] }],
          options: {
            chart: { type: "line" },
            xaxis: { categories: ["Last Month", "Current"] },
          },
        },
        totalEarnings: {
          series: [{ data: [totalEarnings - 5000, totalEarnings] }],
          options: {
            chart: { type: "bar" },
            xaxis: { categories: ["Last Month", "Current"] },
          },
        },
        monthlyEarnings: {
          series: [{ data: [monthlyEarnings - 2000, monthlyEarnings] }],
          options: {
            chart: { type: "bar" },
            xaxis: { categories: ["Last Month", "Current"] },
          },
        },
      });
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/dashboard/all-other-drivers");
  };
  const handleOrderClick = () => {
    navigate("/dashboard/other-drivers/orders");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="col-lg-7 col-xxl-6">
        <div className="row">
          <div className="col-sm-6">
            <div
              className="card eshop-cards shadow-lg border-0 rounded"
              onClick={handleCardClick}
              style={{ cursor: "pointer" }}
              role="button"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-primary h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold ph-van"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Other Drivers</p>
                    <h5>{totalDrivers}</h5>
                  </div>
                  <div className="visits-chart">
                    <Chart
                      options={visitsChartData}
                      series={visitsChartData.series}
                      type="line"
                      width={140}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div
              className="card eshop-cards shadow-lg border-0 rounded"
              onClick={handleCardClick}
              style={{ cursor: "pointer" }}
              role="button"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-secondary h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold ph-clock-countdown"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center position-relative">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Waiting for Approval</p>
                    <h5>{waitingApproval}</h5>
                  </div>
                  <div className="order-chart">
                    <Chart
                      options={orderChartData}
                      series={orderChartData.series}
                      type="line"
                      width={140}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div
              className="card eshop-cards shadow-lg border-0 rounded"
              onClick={handleOrderClick}
              style={{ cursor: "pointer" }}
              role="button"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-green-700 h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold ph-money text-white"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Total Earnings</p>
                    <h5>₹ {totalEarnings.toFixed(2)}/-</h5>
                  </div>
                  <div className="sales-chart">
                    <Chart
                      options={salesChartData}
                      series={salesChartData.series}
                      type="bar"
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div
              className="card eshop-cards shadow-lg border-0 rounded"
              onClick={handleOrderClick}
              style={{ cursor: "pointer" }}
              role="button"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-purple-700 h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-fill ph-calendar text-white"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Monthly Earnings</p>
                    <h5>₹ {monthlyEarnings.toFixed(2)}/-</h5>
                  </div>
                  <div className="sales-chart">
                    <Chart
                      options={salesChartData}
                      series={salesChartData.series}
                      type="bar"
                      width={120}
                      height={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDriversCard;
