import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import Preload from "../layout/Preload";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../../hook/Token";
import jwt_decode from "jwt-decode";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const [sidebarOpen, setSidebar] = useState(false);
  const [preloading, setPreload] = useState(true);
  const navigasi = useNavigate();
  const { setToken, setExp } = useToken();
  const [fotoLogin, setFotoLogin] = useState();

  const refreshToken = async () => {
    // const localAuth = localStorage.getItem("isLogin");
    // const act = localAuth === null ? false : true;
    // if(!act) {
    //   navigasi("/login");
    // }
    try {
      const { data: response } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/refresh`
      );
      setToken(response.access_token);
      const decoder = jwt_decode(response.access_token);
      setExp(decoder.exp);
    } catch (error) {
      if (error.response.status===401) {
        localStorage.clear("isLogin");
        localStorage.clear("auth_user");
        navigasi("/login");
      }
    }
  };

  const awalFetch = async () => {
    refreshToken();

    setTimeout(() => {
      setPreload(false);
    }, 150);
  };

  const setFoto = () => {
    const dataLokal = JSON.parse(atob(localStorage.getItem("userLocal")));
    setFotoLogin(dataLokal.foto);
  };

  useEffect(() => {
    awalFetch();
    setFoto();
  }, []);

  return (
    <>
      {preloading ? (
        <Preload />
      ) : (
        <div className={sidebarOpen ? "d-flex toggled" : "d-flex"} id="wrapper">
          <ToastContainer />
          <Sidebar />
          <div id="page-content-wrapper">
            <Header
              sidebarOpen={sidebarOpen}
              setSidebar={setSidebar}
              fotoLogin={fotoLogin}
            />
            <main className="container-fluid px-4 py-4 min-vh-100">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
