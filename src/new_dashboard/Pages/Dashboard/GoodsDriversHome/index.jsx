/* eslint-disable no-unused-vars */
import React, { Suspense, useRef } from "react";
import AdminCard from "../../../Components/Admindashboard/AdminCard";
import AdminCardMore from "../../../Components/Admindashboard/AdminCardMore";
import AllOnlineGoodsDrivers from "../../../Components/Admindashboard/AllOnlineDrivers";

const OrdersCards = React.lazy(() =>
  import("../../../Components/Admindashboard/OrdersCards")
);

const GoodsAdminPanel = () => {
  return (
    <Suspense fallback="">
      <div className="container-fluid">
        <div className="row mt-10">
          <AllOnlineGoodsDrivers />
          <AdminCard />
          <AdminCardMore />
          {/* <OrdersCards /> */}
        </div>
      </div>
    </Suspense>
  );
};

export default GoodsAdminPanel;
