/* eslint-disable no-unused-vars */
// import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./dashboard/app/auth/AuthGuard";
import { authRoles } from "./dashboard/app/auth/authRoles";

import MatxLayout from "./dashboard/app/components/MatxLayout/MatxLayout";

import { element } from "prop-types";
import {
  AllCustomers,
  Dashboard,
  GoodsDriverEnquiry,
  Login,
  CabDriverEnquiry,
  JCbDriverEnquiry,
  CraneDriverEnquiry,
  AllowedCities,
  AllVehicles,
  AllAllowedPincodes,
  AllServices,
  VehiclePrices,
  AllSubServices,
  OtherServices,
  AllEnquiries,
  Gallery,
  NewRegistration,
  FullAllEnquiries,
  AllGoodsDrivers,
  AllCabAgents,
  AllCraneDrivers,
  AllVendors,
  DriverApplicationForm,
  DriverQRCodeIdCard,
  AllFAQs,
  AllEstimations,
  AllDrivers,
} from "./dashboard/app/views";
import Branches from "./dashboard/app/views/branches/Branches";
import Layout from "./website/app/components/Layout";
import {
  Home,
  About,
  Estimation,
  FareResults,
  Registration,
  JcbCraneEstimation,
  HandyManEstimation,
  DriversEstimation,
  JcbCraneRegistration,
  DriversRegistration,
  HandyManRegistration,
  DriverEstimationResult,
  JcbCraneEstimationResult,
  HandyManEstimationResult,
  TermsAndConditions,
} from "./website/app/views";
import Error404 from "./website/app/components/Error404";

const routes = [
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "/",
    element: <Layout />,
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
    path: "/dashboard",
    element: <Login />,
  },
  {
    path: "/dashboard/branches",
    element: (
      <AuthGuard>
        <Branches />{" "}
      </AuthGuard>
    ),
  },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      // dashboard route
      {
        path: "/dashboard/home",
        element: <Dashboard />,
        auth: authRoles.sa,
      },
      {
        path: "/all_enquiries/:category_id/:category_name",
        element: <AllEnquiries />,
      },
      {
        path: "/all_estimations",
        element: <AllEstimations />,
      },
      {
        path: "/new_registration/:enquiry_id/:category_id",
        element: <AllEnquiries />,
      },
      {
        path: "all-allowed-pincodes/:city_id/:city_name", // This will resolve to /dashboard/add-pincodes/:cityId
        element: <AllAllowedPincodes />,
        auth: authRoles.sa, // Specify the required authentication role
      },

      {
        path: "/customer/all-customers",
        element: <AllCustomers />,
      },

      {
        path: "/goods-driver/all-enquires",
        element: <GoodsDriverEnquiry />,
      },

      {
        path: "/cab-driver/all-enquires",
        element: <CabDriverEnquiry />,
      },

      {
        path: "/jcb-driver/all-enquires",
        element: <JCbDriverEnquiry />,
      },

      {
        path: "/crane-driver/all-enquires",
        element: <CraneDriverEnquiry />,
      },
      {
        path: "/location_configuration/all_allow_cities",
        element: <AllowedCities />,
      },
      {
        path: "/all_vehicles/:category_id/:category_name",
        element: <AllVehicles />,
      },
      {
        path: "/all_sub_categories/:category_id/:category_name",
        element: <AllSubServices />,
      },
      {
        path: "/all_other_services/:sub_cat_id/:sub_cat_name",
        element: <OtherServices />,
      },
      {
        path: "/vehicle-price/:vehicle_id/:vehicle_name",
        element: <VehiclePrices />,
      },
      {
        path: "/all_services",
        element: <AllServices />,
      },
      {
        path: "/all_full_enquiries",
        element: <FullAllEnquiries />,
      },
      {
        path: "/new_registration/:enquiry_id/:category_id/:category_name",
        element: <NewRegistration />,
      },
      {
        path: "/gallery/:category_id/:category_name/:category_type_id",
        element: <Gallery />,
      },
      {
        path: "/all_goods_drivers",
        element: <AllGoodsDrivers />,
      },
      {
        path: "/all_cab_drivers",
        element: <AllCabAgents />,
      },
      {
        path: "/all_jcb_crane_drivers",
        element: <AllCraneDrivers />,
      },
      {
        path: "/all_vendors",
        element: <AllVendors />,
      },
      {
        path: "/all_drivers",
        element: <AllDrivers />,
      },
      {
        path: "/all_faqs/:category_id/:category_name",
        element: <AllFAQs />,
      },
      // e-chart route
      // { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ],
  },
];

export default routes;
