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
import RechargePlans from "../Pages/MainSettingsPages/AddRechargePlans";
import GoodsTypes from "../Pages/MainSettingsPages/AddGoodsType";
import GoodsDriverWallet from "../Components/Admindashboard/AllGoodsDrivers/GoodsDriverWallet";
import CustomerWallet from "../Components/Admindashboard/AllGoodsDrivers/CustomerWallet";
import AllCabDrivers from "../Components/CabAdminDashboard/AllCabDriversTab";
import CabDriverProfileDetails from "../Components/CabAdminDashboard/CabDriverDetails";
import CabDriverWallet from "../Components/CabAdminDashboard/CabDriverWallet";
import AllCabBookings from "../Components/CabAdminDashboard/AllCabBookings";
import CabBookingDetails from "../Components/CabAdminDashboard/CabBookingDetails";
import AllCabOrders from "../Components/CabAdminDashboard/AllCabOrders";
import CabOrderDetails from "../Components/CabAdminDashboard/CabOrderDetails";
import CabInvoiceDetails from "../Components/CabAdminDashboard/CabOrderInvoiceDetails";
import GoodsDriverRechargeScreen from "../Components/Admindashboard/GoodsDriverRechargeScreen";
import CabDriverRechargeScreen from "../Components/CabAdminDashboard/CabDriverRechargeHistory";
import AllJCBCraneDrivers from "../Components/JCBCraneAdminDashboard/AllJcbCraneDrivers";
import AllOtherDrivers from "../Components/DriversAdminDashboard/AllDrivers";
import JCBCraneDriverProfileDetails from "../Components/JCBCraneAdminDashboard/JcbCraneDriverProfileDetails";
import OtherDriverProfileDetails from "../Components/DriversAdminDashboard/DriverProfileDetails";
import HandyManAgentProfileDetails from "../Components/HandyManDashboard/HandymanProfileDetails";
import AllHandyman from "../Components/HandyManDashboard/AllHandyMans";
import MapPincodeSelector from "../Pages/MainSettingsPages/AddPincodesOnMap";
import AllDriversBookings from "../Components/DriversAdminDashboard/AllDriversBookings";
import AllHandyManBookings from "../Components/HandyManDashboard/AllHandyManBookings";
import AllJcbCraneBookings from "../Components/JCBCraneAdminDashboard/AllJcbCraneBookings";
import AllJcbCraneOrders from "../Components/JCBCraneAdminDashboard/AllJcbCraneOrders";
import AllHandymansOrders from "../Components/HandyManDashboard/AllHandyManOrders";
import AllDriversOrders from "../Components/DriversAdminDashboard/AllDriversOrders";
import JcbCraneDriverRechargeScreen from "../Components/JCBCraneAdminDashboard/JcbCraneDriverRechargeScreen";
import OtherDriverRechargeScreen from "../Components/DriversAdminDashboard/DriverRechargeScreen";
import HandymanRechargeScreen from "../Components/HandyManDashboard/HandymanRechargeScreen";
import JcbCraneDriverWallet from "../Components/JCBCraneAdminDashboard/JcbCraneDriverWallet";
import OtherDriverWallet from "../Components/DriversAdminDashboard/OtherDriverWallet";
import HandymanWallet from "../Components/HandyManDashboard/HandymanWallet";
import HandymanOrderDetails from "../Components/HandyManDashboard/HandymanOrderDetails";
import HandymanInvoiceDetails from "../Components/HandyManDashboard/HandymanInvoiceDetails";
import HandymanBookingDetails from "../Components/HandyManDashboard/HandymanBookingDetails";
import JcbCraneBookingDetails from "../Components/JCBCraneAdminDashboard/JcbCraneBookingDetails";
import JcbCraneInvoiceDetails from "../Components/JCBCraneAdminDashboard/JcbCraneInvoiceDetails";
import JcbCraneOrderDetails from "../Components/JCBCraneAdminDashboard/JcbCraneOrderDetails";
import OtherDriverBookingDetails from "../Components/DriversAdminDashboard/OtherDriverBookingDetails";
import OtherDriverInvoiceDetails from "../Components/DriversAdminDashboard/OtherDriverInvoiceDetails";
import OtherDriverOrderDetails from "../Components/DriversAdminDashboard/OtherDriverOrderDetails";
import CabOrdersReport from "../Components/CabAdminDashboard/CabOrdersReports";
import OtherDriverOrdersReport from "../Components/DriversAdminDashboard/DriversOrdersReport";
import JcbCraneOrdersReport from "../Components/JCBCraneAdminDashboard/JcbCraneOrdersReports";
import HandymanOrdersReport from "../Components/HandyManDashboard/HandyManOrdersReport";
import MobileGoodsDriverLocationDetails from "../Components/Admindashboard/BookingsDetails/ShareBookingDetails";
import MobileCabDriverLocationDetails from "../Components/CabAdminDashboard/ShareCabBookingDetails";
import MobileOtherDriverLocationDetails from "../Components/DriversAdminDashboard/ShareDriverDetails";
import MobileHandymanLocationDetails from "../Components/HandyManDashboard/ShareHandymanBookingDetails";
import MobileJcbCraneLocationDetails from "../Components/JCBCraneAdminDashboard/ShareJcbCraneBookingDetail";
import CancelReasons from "../Pages/MainSettingsPages/AddCancelReasons";
import ControlSettings from "../Pages/MainSettingsPages/ControlsSettingsForApp";
import AllCityBranches from "../Pages/MainSettingsPages/AddNewBranches";
import BranchAdmins from "../Pages/MainSettingsPages/AdminManagement";
import VehicleUpgradePrices from "../Pages/MainSettingsPages/AllAddUpgradePrices";
import ServicePlanUpgrades from "../Pages/MainSettingsPages/ServicePriceUpgrade";
import EstimationRequests from "../Pages/EstimationsRequest/AllEstimationRequest";
import Enquiries from "../Pages/EstimationsRequest/AllAgentsRequest";
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
        { path: "/dashboard/cab/orders", element: <AllCabOrders /> },
        { path: "/dashboard/jcb-crane/orders", element: <AllJcbCraneOrders /> },
        {
          path: "/dashboard/other-drivers/orders",
          element: <AllDriversOrders />,
        },
        { path: "/dashboard/handyman/orders", element: <AllHandymansOrders /> },
        {
          path: "/dashboard/goods/bookings",
          element: <AllGoodsDriverBookings />,
        },
        {
          path: "/dashboard/cab/bookings",
          element: <AllCabBookings />,
        },
        {
          path: "/dashboard/other-drivers/bookings",
          element: <AllDriversBookings />,
        },
        {
          path: "/dashboard/jcb-crane/bookings",
          element: <AllJcbCraneBookings />,
        },
        {
          path: "/dashboard/handyman/bookings",
          element: <AllHandyManBookings />,
        },
        {
          path: "/dashboard/all-goods-drivers",
          element: <AllGoodsDrivers />,
        },
        {
          path: "/dashboard/all-cab-drivers",
          element: <AllCabDrivers />,
        },
        {
          path: "/dashboard/all-jcb-crane-drivers",
          element: <AllJCBCraneDrivers />,
        },
        {
          path: "/dashboard/all-other-drivers",
          element: <AllOtherDrivers />,
        },
        {
          path: "/dashboard/all-handyman",
          element: <AllHandyman />,
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
          path: "/dashboard/all-cab-orders-report",
          element: <CabOrdersReport />,
        },
        {
          path: "/dashboard/all-other-drivers-orders-report",
          element: <OtherDriverOrdersReport />,
        },
        {
          path: "/dashboard/all-jcb-crane-drivers-orders-report",
          element: <JcbCraneOrdersReport />,
        },
        {
          path: "/dashboard/all-handyman-orders-report",
          element: <HandymanOrdersReport />,
        },
        {
          path: "/dashboard/all-enquiries",
          element: <EstimationRequests />,
        },
        {
          path: "/dashboard/all-agents-enquiries",
          element: <Enquiries />,
        },
        {
          path: "/dashboard/all-regions",
          element: <AllRegionsCovered />,
        },
        {
          path: "/dashboard/all-city-branches/:cityId/:cityName",
          element: <AllCityBranches />,
        },
        {
          path: "/dashboard/branch-admins/:cityId/:branchId/:branchName",
          element: <BranchAdmins />,
        },
        {
          path: "/dashboard/all-recharge-plans",
          element: <RechargePlans />,
        },
        {
          path: "/dashboard/cancel-reasons",
          element: <CancelReasons />,
        },
        {
          path: "/dashboard/app-controls",
          element: <ControlSettings />,
        },
        {
          path: "/dashboard/all-goods_types",
          element: <GoodsTypes />,
        },
        {
          path: "/dashboard/all-allowed-pincodes/:city_id/:city_name",
          element: <AddPinCodesPage />,
        },
        {
          path: "/dashboard/map-pincode-selector/:city_id/:city_name",
          element: <MapPincodeSelector />,
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
          path: "/dashboard/vehicle-upgrade-prices/:vehicleId/:vehicleName",
          element: <VehicleUpgradePrices />,
        },
        {
          path: "/dashboard/service-plan-upgrades/:serviceId/:subCatId/:serviceName/:subCatName",
          element: <ServicePlanUpgrades />,
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
      path: "/dashboard/cab-order-details/:booking_id/:order_id",
      element: <CabOrderDetails />,
    },
    {
      path: "/dashboard/jcb-crane-order-details/:booking_id/:order_id",
      element: <JcbCraneOrderDetails />,
    },
    {
      path: "/dashboard/other-driver-order-details/:booking_id/:order_id",
      element: <OtherDriverOrderDetails />,
    },
    {
      path: "/dashboard/handyman-order-details/:booking_id/:order_id",
      element: <HandymanOrderDetails />,
    },
    {
      path: "/goods-invoice/:order_id",
      element: <GoodsDriverInvoiceDetails />,
    },
    {
      path: "/cab-invoice/:order_id",
      element: <CabInvoiceDetails />,
    },
    {
      path: "/jcb-crane-invoice/:order_id",
      element: <JcbCraneInvoiceDetails />,
    },
    {
      path: "/other-driver-invoice/:order_id",
      element: <OtherDriverInvoiceDetails />,
    },
    {
      path: "/handyman-invoice/:order_id",
      element: <HandymanInvoiceDetails />,
    },
    {
      path: "/dashboard/booking-details/:booking_id",
      element: <GoodsBookingDetails />,
    },
    {
      path: "/dashboard/cab-booking-details/:booking_id",
      element: <CabBookingDetails />,
    },
    {
      path: "/dashboard/jcb-crane-booking-details/:booking_id",
      element: <JcbCraneBookingDetails />,
    },
    {
      path: "/dashboard/other-driver-booking-details/:booking_id",
      element: <OtherDriverBookingDetails />,
    },
    {
      path: "/dashboard/handyman-booking-details/:booking_id",
      element: <HandymanBookingDetails />,
    },
    {
      path: "/dashboard/goods-driver-profile-details/:agent_id",
      element: <GoodsDriverProfileDetails />,
    },
    {
      path: "/dashboard/cab-driver-profile-details/:agent_id",
      element: <CabDriverProfileDetails />,
    },
    {
      path: "/dashboard/jcb-crane-driver-profile-details/:agent_id",
      element: <JCBCraneDriverProfileDetails />,
    },
    {
      path: "/dashboard/handyman-profile-details/:agent_id",
      element: <HandyManAgentProfileDetails />,
    },
    {
      path: "/dashboard/other-driver-profile-details/:agent_id",
      element: <OtherDriverProfileDetails />,
    },
    {
      path: "/dashboard/goods-driver-wallet-details/:driverId/:driverName",
      element: <GoodsDriverWallet />,
    },
    {
      path: "/dashboard/goods-driver-recharge/:driverId/:driverName",
      element: <GoodsDriverRechargeScreen />,
    },
    {
      path: "/dashboard/cab-driver-recharge/:driverId/:driverName",
      element: <CabDriverRechargeScreen />,
    },
    {
      path: "/dashboard/jcb-crane-driver-recharge/:driverId/:driverName",
      element: <JcbCraneDriverRechargeScreen />,
    },
    {
      path: "/dashboard/other-driver-recharge/:driverId/:driverName",
      element: <OtherDriverRechargeScreen />,
    },
    {
      path: "/dashboard/handyman-recharge/:driverId/:driverName",
      element: <HandymanRechargeScreen />,
    },
    {
      path: "/dashboard/cab-driver-wallet-details/:driverId/:driverName",
      element: <CabDriverWallet />,
    },
    {
      path: "/dashboard/jcb-crane-driver-wallet-details/:driverId/:driverName",
      element: <JcbCraneDriverWallet />,
    },
    {
      path: "/dashboard/other-driver-wallet-details/:driverId/:driverName",
      element: <OtherDriverWallet />,
    },
    {
      path: "/dashboard/handyman-wallet-details/:driverId/:driverName",
      element: <HandymanWallet />,
    },
    {
      path: "/dashboard/customer-wallet-details/:customerID/:customerName",
      element: <CustomerWallet />,
    },
    {
      path: "/goods-booking-details/:booking_id",
      element: <MobileGoodsDriverLocationDetails />,
    },
    {
      path: "/cab-booking-details/:booking_id",
      element: <MobileCabDriverLocationDetails />,
    },
    {
      path: "/driver-booking-details/:booking_id",
      element: <MobileOtherDriverLocationDetails />,
    },
    {
      path: "/jcb-crane-booking-details/:booking_id",
      element: <MobileJcbCraneLocationDetails />,
    },
    {
      path: "/handyman-booking-details/:booking_id",
      element: <MobileHandymanLocationDetails />,
    },
  ];
  return useRoutes(element);
};

export default Routes;
