/* eslint-disable no-unused-vars */
// import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./dashboard/app/auth/AuthGuard";
import { authRoles } from "./dashboard/app/auth/authRoles";
import Login from "./dashboard/app/views/sessions/Login";
import Dashboard from "./dashboard/app/views/dashboard/Dashboard";
import MatxLayout from "./dashboard/app/components/MatxLayout/MatxLayout";

import { element } from "prop-types";
import AllCustomers from "./dashboard/app/views/customers/AllCustomers";
import Branches from "./dashboard/app/views/branches/Branches";
import Layout from "./website/app/components/Layout";
import { Home, About, Estimation } from "./website/app/views";
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
        path: "/get-estimation",
        element: <Estimation />,
      },
    ],
  },
  { path: "/dashboard", element: <Login /> },
  { path: "/dashboard/branches", element: <Branches /> },
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
        auth: authRoles.admin,
      },

      {
        path: "/customer/all-customers",
        element: <AllCustomers />,
        auth: authRoles.admin,
      },
      // e-chart route
      // { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ],
  },
];

export default routes;
