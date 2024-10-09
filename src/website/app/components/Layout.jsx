// import React from "react";

import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components";

const Layout = () => {
  return (
    <div className="relative z-0 bg-primary">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
