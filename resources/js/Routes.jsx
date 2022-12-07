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
import User from "./components/pages/user/User"
import UserAdd from "./components/pages/user/Add"
import UserEdit from "./components/pages/user/Edit"
import Cuti from "./components/pages/cuti/Cuti"
import CutiAdd from "./components/pages/cuti/Add"
import CutiEdit from "./components/pages/cuti/Edit"
import Absen from "./components/pages/absen/Absen"
import AbsenAdd from "./components/pages/absen/Add"
import AbsenEdit from "./components/pages/absen/Edit"
import Gaji from "./components/pages/gaji/Gaji"
import GajiAdd from "./components/pages/gaji/Add"
import GajiEdit from "./components/pages/gaji/Edit"
import SlipGaji from "./components/pages/gaji/slip"
import SlipGajiPegawai from "./components/pages/gaji/GajiPegawai"
import Laporan from "./components/pages/Laporan"
import Comment from "./components/pages/comment/indexComment"
import LapCuti from "./components/pages/cuti/LapCuti";
import LapAbsen from "./components/pages/absen/LapAbsen";
import LapGaji from "./components/pages/gaji/LapGaji";
import LapPeg from "./components/pages/pegawai/LapPeg";
import CommentList from "./components/pages/comment/CommentList";
import CutiPegawai from "./components/pages/cuti/CutiPegawai";
import CutiAddPegawai from "./components/pages/cuti/AddPegawai";
import CutiEditPegawai from "./components/pages/cuti/EditPegawai";
import Rekap from "./components/pages/absen/Rekap";

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
            },
            {
              path: "user",
              element: <RequiredAuth> <User/> </RequiredAuth>
            },
            {
              path: "user/add",
              element: <RequiredAuth><UserAdd /></RequiredAuth>
            },
            {
              path: "user/edit",
              element: <RequiredAuth><UserEdit/></RequiredAuth>
            },
            {
              path: "cuti",
              element: <RequiredAuth><Cuti/></RequiredAuth>
            },
            {
              path: "cuti/add",
              element: <RequiredAuth><CutiAdd /></RequiredAuth>
            },
            {
              path: "cuti/edit",
              element: <RequiredAuth><CutiEdit/></RequiredAuth>
            },
            {
              path: "cutipegawai",
              element: <RequiredAuth> <CutiPegawai/> </RequiredAuth>
            },
            {
              path: "cutipegawai/add",
              element: <RequiredAuth> <CutiAddPegawai/> </RequiredAuth>
            },
            {
              path: "cutipegawai/edit",
              element: <RequiredAuth> <CutiEditPegawai/> </RequiredAuth>
            },
            {
              path: "absen",
              element: <RequiredAuth><Absen/></RequiredAuth>
            },
            {
              path: "absen/add",
              element: <RequiredAuth><AbsenAdd /></RequiredAuth>
            },
            {
              path: "absen/edit",
              element: <RequiredAuth><AbsenEdit/></RequiredAuth>
            },
            {
              path: "gaji",
              element: <RequiredAuth><Gaji/></RequiredAuth>
            },
            {
              path: "gaji/add",
              element: <RequiredAuth><GajiAdd/></RequiredAuth>
            },
            {
              path: "gaji/edit",
              element: <RequiredAuth><GajiEdit/></RequiredAuth>
            },
            {
              path: "gaji/slip",
              element: <RequiredAuth><SlipGaji/></RequiredAuth>
            },
            {
              path: "slip",
              element: <RequiredAuth><SlipGajiPegawai/></RequiredAuth>
            },
            {
              path: "slip/comment",
              element: <RequiredAuth><Comment/></RequiredAuth>
            },
            {
              path: "cuti/laporan",
              element: <RequiredAuth><LapCuti/></RequiredAuth>
            },
            {
              path: "absen/laporan",
              element: <RequiredAuth> <LapAbsen/> </RequiredAuth>
            },
            {
              path: "gaji/laporan",
              element: <RequiredAuth> <LapGaji/> </RequiredAuth>
            },
            {
              path: "pegawai/laporan",
              element: <RequiredAuth> <LapPeg/> </RequiredAuth>
            },
            {
              path: "comment/list",
              element: <RequiredAuth> <CommentList/> </RequiredAuth>
            },
            {
              path: "rekap",
              element: <RequiredAuth> <Rekap/> </RequiredAuth>
            },
          ],
        },
      ],
    },
  ]);
  return routes;
};

export default Routes;
