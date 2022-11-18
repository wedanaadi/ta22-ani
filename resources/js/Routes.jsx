import React from "react";
import { useRoutes, Outlet } from "react-router-dom";
import Login from "./components/pages/Login";
import NotFound from "./components/pages/404";
import Sample from "./components/pages/Sample";
import Preload from "./components/layout/Preload";
import Home from "./components/pages/Home"

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
          element: <Home />,
          children: [
            {
              index: true,
              element: <Sample />,
              errorElement: <NotFound />,
            },
          ],
        },
      ],
    },
  ]);
  return routes;
};

export default Routes;
