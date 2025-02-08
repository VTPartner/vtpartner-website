// import React from "react";
import {
  visitsChartData,
  orderChartData,
  salesChartData,
} from "../../Data/Charts/EcommerceChart";
import Chart from "react-apexcharts";
// import { Link } from "react-router-dom";

const AdminHandyManCard = () => {
  return (
    <>
      <div className="col-lg-7 col-xxl-6">
        <div className="row">
          <div className="col-sm-6">
            <div className="card eshop-cards">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="bg-primary h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-bold  ph-car"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Total HandyMan Agents</p>
                    <h5>
                      25,220k <span className="f-s-12 text-danger">-45%</span>
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
            <div className="card eshop-cards">
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
                      45,782k <span className="f-s-12 text-success">+65%</span>
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
            <div className="card eshop-cards">
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
                  <span className=" bg-purple-700 h-40 w-40 d-flex-center b-r-15 f-s-18">
                    <i className="ph-fill  ph-calendar text-white"></i>
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-shrink-0 align-self-end">
                    <p className="f-s-16 mb-0">Monthly Earnings</p>
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
        </div>
      </div>
    </>
  );
};

export default AdminHandyManCard;
