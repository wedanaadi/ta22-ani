import React from "react";
import { useRoutes, Outlet } from "react-router-dom";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/404";
import Sample from "./components/pages/Sample";
import Home from "./components/pages/Home"
import {RequiredAuth} from './hook/PrivateAuth'
import Pegawai from './components/pages/Pegawai'

const Routes = () => {
  const routes = useRoutes([
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/",
      element: (
        <>
          <Outlet></Outlet>
        </>
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/",
          element: <RequiredAuth><Home /></RequiredAuth>,
          children: [
            {
              index: true,
              element: <Sample />,
              // errorElement: <NotFound />,
            },
            {
              path: "pegawai",
              element: <RequiredAuth><Pegawai /></RequiredAuth>
            }
          ],
        },
      ],
    },
  ]);
  return routes;
};

export default Routes;
