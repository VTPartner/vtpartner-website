/* eslint-disable no-unused-vars */
import React, { Suspense } from "react";

import AdminJCBCraneDriverCard from "../../../Components/JCBCraneAdminDashboard/AdminJCBCraneDriverCard";
import AdminJCBCraneDriverCardMore from "../../../Components/JCBCraneAdminDashboard/AdminJCBCraneDriverCardMore";
import OrdersJCBCraneDriverCards from "../../../Components/JCBCraneAdminDashboard/OrdersJCBCraneDriverCards";
import AllOnlineJcbCraneDrivers from "../../../Components/JCBCraneAdminDashboard/AllOnlineJcbCraneDrivers";

const JcbCraneAdminPanel = () => {
  return (
    <Suspense fallback="">
      <div className="container-fluid">
        <div className="row mt-10">
          <AllOnlineJcbCraneDrivers />
          <AdminJCBCraneDriverCard />
          <AdminJCBCraneDriverCardMore />
          {/* <ActiveUser /> */}
          {/* <ProductsCards /> */}
          {/* <OrdersJCBCraneDriverCards /> */}
          {/* <CustomersCards /> */}
        </div>
      </div>
    </Suspense>
  );
};

export default JcbCraneAdminPanel;
