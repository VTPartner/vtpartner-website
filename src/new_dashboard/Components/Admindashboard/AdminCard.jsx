/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Chart from "react-apexcharts";
import Loader from "../Loader";
import { serverEndPoint } from "../../../dashboard/app/constants";
import {
  visitsChartData,
  orderChartData,
  salesChartData,
} from "../../Data/Charts/EcommerceChart";

const AdminCard = () => {
  const [totalDrivers, setTotalDrivers] = useState(null);
  const [waitingApproval, setWaitingApproval] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(null);
  const [monthlyEarnings, setMonthlyEarnings] = useState(null);
  //   const [todaysEarnings, setTodaysEarnings] = useState(null);
  const [percentageIncrease, setPercentageIncrease] = useState({
    drivers: 0,
    approval: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    // todaysEarnings: 0,
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

      const [
        totalDriversRes,
        waitingApprovalRes,
        totalEarningsRes,
        monthlyEarningsRes,
      ] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_verified_with_count`,
          {},
          config
        ),
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_un_verified_with_count`,
          {},
          config
        ),
        axios.post(
          `${serverEndPoint}/get_total_goods_drivers_orders_and_earnings`,
          {},
          config
        ),
        axios.post(
          `${serverEndPoint}/get_goods_drivers_current_month_earnings`,
          {},
          config
        ),
      ]);
      console.log(
        "totalDriversRes.data.total_count::" +
          totalDriversRes.data["total_count"]
      );
      const totalDrivers = totalDriversRes.data["total_count"] || 0;
      const waitingApproval =
        waitingApprovalRes.data["drivers"][0]["total_count"] || 0;
      const totalEarnings = totalEarningsRes.data.total_earnings || 0;
      //   const todaysEarnings = todaysEarningRes.data.today_earnings || 0;
      const monthlyEarnings =
        monthlyEarningsRes.data.current_month_earnings || 0;

      setTotalDrivers(totalDrivers);
      setWaitingApproval(waitingApproval);
      setTotalEarnings(totalEarnings);
      setMonthlyEarnings(monthlyEarnings);
      //   setTodaysEarnings(todaysEarnings);

      // Mock calculation for percentage increases (replace with actual values if available)
      setPercentageIncrease({
        drivers: totalDrivers, // Example 15% increase
        approval: waitingApproval,
        totalEarnings: totalEarnings,
        monthlyEarnings: monthlyEarnings,
      });

      // Generate chart data dynamically based on API response
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="col-lg-7 col-xxl-6">
        <div className="row">
          <div className="col-sm-6">
            <div className="card eshop-cards shadow-lg border-0 rounded">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-primary h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold  ph-car"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Drivers</p>
                    <h5>
                      {totalDrivers}
                      {/* <span className="f-s-12 text-danger">
                        +{percentageIncrease.drivers}%
                      </span> */}
                    </h5>
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
            <div className="card eshop-cards shadow-lg border-0 rounded">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-secondary h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold  ph-clock-countdown"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center position-relative">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Waiting for Approval</p>
                    <h5>
                      {waitingApproval}
                      {/* 45,782k <span className="f-s-12 text-success">+65%</span> */}
                    </h5>
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
            <div className="card eshop-cards shadow-lg border-0 rounded">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className=" bg-green-700 h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold  ph-money text-white"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Total Earnings</p>
                    <h5>
                      ₹ {totalEarnings}/-
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
          <div className="col-sm-6">
            <div className="card eshop-cards shadow-lg border-0 rounded">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className=" bg-purple-700 h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-fill  ph-calendar text-white"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Monthly Earnings</p>
                    <h5>
                      {/* $63,987<span className="f-s-12 text-success">+68%</span> */}
                      ₹ {monthlyEarnings}/-
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

export default AdminCard;
