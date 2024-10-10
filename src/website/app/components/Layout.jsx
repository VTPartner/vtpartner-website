// import React from "react";

import { Outlet } from "react-router-dom";
import { Footer, Navbar, ScrollToTop } from "../components";

const Layout = () => {
  return (
    <div className="relative z-0 bg-primary">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
