/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
// HOOK
import useAuth from "/src/dashboard/app/hooks/useAuth";

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  if (isAuthenticated) return <>{children}</>;

  return <Navigate replace to="/dashboard" state={{ from: pathname }} />;
}
