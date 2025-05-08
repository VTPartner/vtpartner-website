/* eslint-disable no-unused-vars */
import React, { Suspense } from "react";

import AdminCabDriverCard from "../../../Components/CabAdminDashboard/AdminCabDriverCard";
import AdminCabDriverCardMore from "../../../Components/CabAdminDashboard/AdminCabDriverCardMore";
import OrdersCabDriverCards from "../../../Components/CabAdminDashboard/OrdersCabDriverCards";
import AllOnlineCabDrivers from "../../../Components/CabAdminDashboard/AllCabOnlineDrivers";

const CabAdminPanel = () => {
  return (
    <Suspense fallback="">
      <div className="container-fluid">
        <div className="row mt-10">
          <AllOnlineCabDrivers />
          <AdminCabDriverCard />
          <AdminCabDriverCardMore />
          {/* <ActiveUser /> */}
          {/* <ProductsCards /> */}
          {/* <OrdersCabDriverCards /> */}
          {/* <CustomersCards /> */}
        </div>
      </div>
    </Suspense>
  );
};

export default CabAdminPanel;
