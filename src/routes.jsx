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
} from "./dashboard/app/views";
import Branches from "./dashboard/app/views/branches/Branches";
import Layout from "./website/app/components/Layout";
import {
  Home,
  About,
  Estimation,
  FareResults,
  Registration,
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
        path: "/agents",
        element: <Registration />,
      },
      {
        path: "/get_estimation",
        element: <Estimation />,
      },
      {
        path: "/fare_estimation_result",
        element: <FareResults />,
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

      // e-chart route
      // { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ],
  },
];

export default routes;
