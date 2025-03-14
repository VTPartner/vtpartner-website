/* eslint-disable no-unused-vars */
import React from "react";

import {
  DriverApplicationForm,
  DriverQRCodeIdCard,
} from "../../dashboard/app/views";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

import { useRoutes } from "react-router-dom";
import WebsiteLayout from "../../website/app/components/Layout";
import {
  Home,
  About,
  DriverEstimationResult,
  DriversEstimation,
  DriversRegistration,
  Registration,
  JcbCraneRegistration,
  TermsAndConditions,
  HandyManRegistration,
  Estimation,
  JcbCraneEstimation,
  HandyManEstimation,
  FareResults,
  JcbCraneEstimationResult,
  HandyManEstimationResult,
} from "../../website/app/views";

import Error404 from "../../website/app/components/Error404";
import { element } from "prop-types";
import AdminLoginPage from "../Pages/AuthPages/AdminSignInWithImage";
import AllAdminBranches from "../Pages/BranchesPages/AllBranches";
import Layout from "../Layout";
import GoodsAdminPanel from "../Pages/Dashboard/GoodsDriversHome";
import Widgets from "../Pages/Widget";
import CabAdminPanel from "../Pages/Dashboard/CabDriverHome";
import JcbCraneAdminPanel from "../Pages/Dashboard/JcbCraneHome";
import DriversAdminPanel from "../Pages/Dashboard/DriversHome";
import HandyManAdminPanel from "../Pages/Dashboard/HandyManHome";
import AllGoodsDriverOrders from "../Components/Admindashboard/OrdersDetails/AllOrders";
import GoodsOrderDetails from "../Components/Admindashboard/OrdersDetails/OrderDetails";
import AllGoodsDriverBookings from "../Components/Admindashboard/BookingsDetails/AllBookings";
import GoodsBookingDetails from "../Components/Admindashboard/BookingsDetails/BookingDetails";
import GoodsDriverInvoiceDetails from "../Components/Admindashboard/OrdersDetails/OrderDetails/InvoiceDetails";
import AllGoodsDrivers from "../Components/Admindashboard/AllGoodsDrivers";
import GoodsDriverProfileDetails from "../Components/Admindashboard/AllGoodsDrivers/GoodsDriverProfileDetails";
import AllRegionsCovered from "../Pages/MainSettingsPages/AllRegions";
import AllServicesPage from "../Pages/MainSettingsPages/AllServices";
import AddGalleryImages from "../Pages/MainSettingsPages/AddImagesGallery";
import AddFAQQuestionsPage from "../Pages/MainSettingsPages/AddFAQQuestions";
import AddSubCategoryPage from "../Pages/MainSettingsPages/AddSubCategoryPage";
import AddOtherServicesPage from "../Pages/MainSettingsPages/AddOtherServicesPage";
import AddVehiclePricesPage from "../Pages/MainSettingsPages/AddVehiclesPrices";
import AddNewVehiclePage from "../Pages/MainSettingsPages/AddNewVehicle";
import AddPinCodesPage from "../Pages/MainSettingsPages/AddPincodes";
import PeakHourPricing from "../Pages/MainSettingsPages/PeakHoursTimings";
import BannersPage from "../Pages/MainSettingsPages/AddBanners";
import CouponsPage from "../Pages/MainSettingsPages/AddCoupons";
import AllCustomers from "../Components/AllCustomers";
import OrdersReport from "../Components/Admindashboard/OrdersReport";
import { DeleteAccount } from "../../website/app/components";
// DashboardRoutes
// const GoodsDriversHome = React.lazy(() =>
//   import("@/Pages/Dashboard/GoodsDriversHome")
// );
// const ProjectPage = React.lazy(() => import("@/Pages/Dashboard/ProjectsPage"));
// const Crypto = React.lazy(() => import("@/Pages/Dashboard/Crypto"));
// const Education = React.lazy(() => import("@/Pages/Dashboard/Education"));

// AuthRoutes
// const SignIn = React.lazy(() =>
//   import("@/Pages/AuthPages/AdminSignInWithImage")
// );

// const Verification = React.lazy(() => import("@/Pages/AuthPages/VerifyOTP"));

const Routes = () => {
  let element = [
    {
      path: "*",
      element: <Error404 />,
    },
    {
      path: "/",
      element: <WebsiteLayout />,

      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/delete-account",
          element: <DeleteAccount />,
        },
        {
          path: "/terms&conditions",
          element: <TermsAndConditions />,
        },
        {
          path: "/agents/:category_id/:category_name/:category_type",
          element: <Registration />,
        },
        {
          path: "/jcb_crane_registration/:category_id/:category_name/:category_type",
          element: <JcbCraneRegistration />,
        },
        {
          path: "/drivers_registration/:category_id/:category_name/:category_type",
          element: <DriversRegistration />,
        },
        {
          path: "/handy_man_registration/:category_id/:category_name/:category_type",
          element: <HandyManRegistration />,
        },
        {
          path: "/get_estimation",
          element: <Estimation />,
        },
        {
          path: "/get_jcb_estimation",
          element: <JcbCraneEstimation />,
        },
        {
          path: "/get_handy_man_estimation",
          element: <HandyManEstimation />,
        },
        {
          path: "/get_drivers_estimation",
          element: <DriversEstimation />,
        },
        {
          path: "/application-form/:driver_id",
          element: <DriverApplicationForm />,
        },
        {
          path: "/driver-id-card/:driver_id",
          element: <DriverQRCodeIdCard />,
        },
        {
          path: "/fare_estimation_result/:city_id/:category_id/:distance/:category_name",
          element: <FareResults />,
        },
        {
          path: "/drivers_estimation_result/:city_id/:category_id/:distance/:hours/:days/:category_name",
          element: <DriverEstimationResult />,
        },
        {
          path: "/jcb_crane_estimation_result/:city_id/:category_id/:distance/:hours/:days/:category_name",
          element: <JcbCraneEstimationResult />,
        },
        {
          path: "/handy_man_estimation_result/:city_id/:category_id/:hours/:category_name/:sub_cat_name",
          element: <HandyManEstimationResult />,
        },
      ],
    },
    {
      path: "/dashboard/login",
      element: <AdminLoginPage />,
    },

    {
      path: "/dashboard/branches",
      element: Cookies.get("authToken") ? (
        <AllAdminBranches />
      ) : (
        <Navigate to="/dashboard/login" replace />
      ),
    },
    {
      path: "/dashboard",
      element: Cookies.get("authToken") ? (
        <Layout />
      ) : (
        <Navigate to="/dashboard/login" replace />
      ),
      children: [
        { path: "/dashboard/home", element: <GoodsAdminPanel /> },
        { path: "/dashboard/cab-home", element: <CabAdminPanel /> },
        { path: "/dashboard/jcb-crane-home", element: <JcbCraneAdminPanel /> },
        { path: "/dashboard/drivers-home", element: <DriversAdminPanel /> },
        { path: "/dashboard/handyman-home", element: <HandyManAdminPanel /> },
        { path: "/dashboard/goods/orders", element: <AllGoodsDriverOrders /> },
        {
          path: "/dashboard/goods/bookings",
          element: <AllGoodsDriverBookings />,
        },
        {
          path: "/dashboard/all-goods-drivers",
          element: <AllGoodsDrivers />,
        },
        {
          path: "/dashboard/all-customers",
          element: <AllCustomers />,
        },
        {
          path: "/dashboard/all-orders-report",
          element: <OrdersReport />,
        },
        {
          path: "/dashboard/all-regions",
          element: <AllRegionsCovered />,
        },
        {
          path: "/dashboard/all-allowed-pincodes/:city_id/:city_name",
          element: <AddPinCodesPage />,
        },
        {
          path: "/dashboard/all-services",
          element: <AllServicesPage />,
        },
        {
          path: "/dashboard/all-banners",
          element: <BannersPage />,
        },
        {
          path: "/dashboard/all-coupons",
          element: <CouponsPage />,
        },
        {
          path: "/dashboard/gallery/:category_id/:category_name/:category_type_id",
          element: <AddGalleryImages />,
        },
        {
          path: "/dashboard/all_faqs/:category_id/:category_name",
          element: <AddFAQQuestionsPage />,
        },
        {
          path: "/dashboard/all_sub_categories/:category_id/:category_name",
          element: <AddSubCategoryPage />,
        },
        {
          path: "/dashboard/all_other_services/:sub_cat_id/:sub_cat_name",
          element: <AddOtherServicesPage />,
        },
        {
          path: "/dashboard/all_vehicles/:category_id/:category_name",
          element: <AddNewVehiclePage />,
        },
        {
          path: "/dashboard/vehicle-price/:vehicle_id/:vehicle_name",
          element: <AddVehiclePricesPage />,
        },
        {
          path: "/dashboard/vehicle-peak-hours-price/:vehicle_id/:vehicle_name",
          element: <PeakHourPricing />,
        },
      ],
    },
    {
      path: "/dashboard/order-details/:booking_id/:order_id",
      element: <GoodsOrderDetails />,
    },
    {
      path: "/goods-invoice/:order_id",
      element: <GoodsDriverInvoiceDetails />,
    },
    {
      path: "/dashboard/booking-details/:booking_id",
      element: <GoodsBookingDetails />,
    },
    {
      path: "/dashboard/goods-driver-profile-details/:agent_id",
      element: <GoodsDriverProfileDetails />,
    },
  ];
  return useRoutes(element);
};

export default Routes;
