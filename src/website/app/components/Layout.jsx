// import React from "react";

import { Outlet } from "react-router-dom";
import { Footer, Navbar, ScrollToTop } from "../components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div className="relative z-0 bg-primary">
      <ScrollToTop />

      <Navbar />
      <ToastContainer />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
