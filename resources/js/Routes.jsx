import React from "react";
import { useRoutes, Outlet } from "react-router-dom";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/404";
import Sample from "./components/pages/Sample";
import Home from "./components/pages/Home"
import {RequiredAuth} from './hook/PrivateAuth'
import Jabatan from "./components/pages/jabatan/Jabatan";
import Add from "./components/pages/jabatan/Add";
import Edit from "./components/pages/jabatan/Edit";
import Pegawai from "./components/pages/pegawai/Pegawai"
import PegawaiAdd from "./components/pages/pegawai/Add"
import PegawaiEdit from "./components/pages/pegawai/Edit"

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
              path: "jabatan",
              element: <RequiredAuth><Jabatan /></RequiredAuth>
            },
            {
              path: "jabatan/add",
              element: <RequiredAuth><Add /></RequiredAuth>
            },
            {
              path: "jabatan/edit",
              element: <RequiredAuth> <Edit/> </RequiredAuth>
            },
            {
              path: "pegawai",
              element: <RequiredAuth> <Pegawai/> </RequiredAuth>
            },
            {
              path: "pegawai/add",
              element: <RequiredAuth><PegawaiAdd /></RequiredAuth>
            },
            {
              path: "pegawai/edit",
              element: <RequiredAuth> <PegawaiEdit/> </RequiredAuth>
            }
          ],
        },
      ],
    },
  ]);
  return routes;
};

export default Routes;
