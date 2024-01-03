import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Menu from "./Menu";

const AuthRoute = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth ? (
    <>
      <Outlet />
      <Menu/>
    </>
  ) : (
    <Navigate to={"/start/signin"} replace state={{ path: location.pathname }} />
  );
};

export default AuthRoute;
