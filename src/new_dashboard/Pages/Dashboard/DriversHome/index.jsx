/* eslint-disable no-unused-vars */
import React, { Suspense } from "react";
import AdminDriversCard from "../../../Components/DriversAdminDashboard/AdminDriversCard";
import AdminDriversCardMore from "../../../Components/DriversAdminDashboard/AdminDriversCardMore";
import OrdersDriversCards from "../../../Components/DriversAdminDashboard/OrdersDriversCards";
import AllOnlineOtherDrivers from "../../../Components/DriversAdminDashboard/AllOnlineOtherDrivers";

const DriversAdminPanel = () => {
  return (
    <Suspense fallback="">
      <div className="container-fluid">
        <div className="row mt-10">
          <AllOnlineOtherDrivers />
          <AdminDriversCard />
          <AdminDriversCardMore />
          {/* <ActiveUser /> */}
          {/* <ProductsCards /> */}
          {/* <OrdersDriversCards /> */}
          {/* <CustomersCards /> */}
        </div>
      </div>
    </Suspense>
  );
};

export default DriversAdminPanel;
