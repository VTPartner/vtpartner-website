/* eslint-disable no-unused-vars */
// import React from "react";

import { Outlet } from "react-router-dom";
import { Footer, Navbar, ScrollToTop, TransparentNavBar } from "../components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div>
      <ScrollToTop />

      <Navbar />
      {/* <TransparentNavBar /> */}
      <ToastContainer />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
