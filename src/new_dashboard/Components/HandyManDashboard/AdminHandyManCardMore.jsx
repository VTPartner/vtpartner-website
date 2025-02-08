// import React from "react";
import {
  activityChartData,
  salesChartData,
} from "../../Data/Charts/EcommerceChart";
import Chart from "react-apexcharts";
// import { Link } from "react-router-dom";

const AdminHandyManCardMore = () => {
  return (
    <>
      <div className="col-lg-7 col-xxl-6">
        <div className="row">
          <div className="col-sm-6">
            <div className="card eshop-cards">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-success h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold  ph-pulse"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Total Rides</p>
                    <h5>45k</h5>
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
            <div className="card eshop-cards">
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
                      $63,987<span className="f-s-12 text-success">+68%</span>
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
            <div className="card eshop-cards">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-black h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-fill  ph-desktop text-white"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Complaints</p>
                    <h5>
                      63,987<span className="f-s-12 text-success">+68%</span>
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

export default AdminHandyManCardMore;
