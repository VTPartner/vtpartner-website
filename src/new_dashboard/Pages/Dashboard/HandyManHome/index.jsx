/* eslint-disable no-unused-vars */
import React, { Suspense } from "react";
import AdminHandyManCard from "../../../Components/HandyManDashboard/AdminHandyManCard";
import AdminHandyManCardMore from "../../../Components/HandyManDashboard/AdminHandyManCardMore";
import OrdersHandyManCards from "../../../Components/HandyManDashboard/OrdersHandyManCards";
import AllOnlineHandyMans from "../../../Components/HandyManDashboard/AllOnlineHandyMans";

const HandyManAdminPanel = () => {
  return (
    <Suspense fallback="">
      <div className="container-fluid">
        <div className="row mt-10">
          <AllOnlineHandyMans />
          <AdminHandyManCard />
          <AdminHandyManCardMore />
          {/* <ActiveUser /> */}
          {/* <ProductsCards /> */}
          {/* <OrdersHandyManCards /> */}
          {/* <CustomersCards /> */}
        </div>
      </div>
    </Suspense>
  );
};

export default HandyManAdminPanel;
