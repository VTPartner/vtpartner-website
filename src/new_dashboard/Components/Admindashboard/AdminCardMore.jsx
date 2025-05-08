/* eslint-disable no-unused-vars */
// import React from "react";
import {
  activityChartData,
  salesChartData,
} from "../../Data/Charts/EcommerceChart";
import Chart from "react-apexcharts";
import { serverEndPoint } from "../../../dashboard/app/constants";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

const AdminCardMore = () => {
  const [totalRides, setTotalRides] = useState(null);

  const [todaysEarnings, setTodaysEarnings] = useState(null);

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
          name: "todaysEarnings",
          call: axios.post(
            `${serverEndPoint}/get_goods_drivers_today_earnings`,
            {},
            config
          ),
        },
        {
          name: "totalRides",
          call: axios.post(
            `${serverEndPoint}/get_total_goods_drivers_orders_and_earnings`,
            {},
            config
          ),
        },
      ];

      // Execute all API calls and handle individual failures
      const results = await Promise.allSettled(apiCalls.map((api) => api.call));

      // Initialize variables with default values
      let totalRides = 0;
      let todayEarn = 0;

      // Process results
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const data = result.value.data;
          switch (apiCalls[index].name) {
            case "todaysEarnings":
              todayEarn = data.today_earnings || 0;
              break;
            case "totalRides":
              totalRides = data.total_orders || 0;
              break;
          }
        } else {
          console.error(`Error in ${apiCalls[index].name}:`, result.reason);
        }
      });

      // Update state with available data
      setTotalRides(totalRides);
      setTodaysEarnings(todayEarn);
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate(); // Add this hook

  const handleCardClick = () => {
    navigate("/dashboard/all-orders-report");
  };
  const handleOrderClick = () => {
    navigate("/dashboard/goods/orders");
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
              className="card eshop-cards shadow-lg border-0 rounded shadow-lg border-0 rounded shadow-lg border-0 rounded shadow-lg border-0 rounded"
              onClick={handleOrderClick}
              style={{ cursor: "pointer" }} // Add cursor pointer to indicate clickable
              role="button"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-success h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold  ph-pulse"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Total Orders Completed</p>
                    <h5>{totalRides}</h5>
                  </div>
                  <div className="activity-chart">
                    <Chart
                      options={activityChartData}
                      series={activityChartData.series}
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
              className="card eshop-cards shadow-lg border-0 rounded shadow-lg border-0 rounded shadow-lg border-0 rounded shadow-lg border-0 rounded"
              onClick={handleCardClick}
              style={{ cursor: "pointer" }} // Add cursor pointer to indicate clickable
              role="button"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-warning h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-fill  ph-coins"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Todays Earnings</p>
                    <h5>
                      ₹ {todaysEarnings.toFixed(2)}/-
                      {/* <span className="f-s-12 text-success">+68%</span> */}
                    </h5>
                  </div>
                  <div className="sales-chart">
                    <Chart
                      options={salesChartData}
                      series={salesChartData.series}
                      type="bar"
                      width={120}
                      height={120}
                    />
                    {/*<div id="salesChart"></div>*/}
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

export default AdminCardMore;
