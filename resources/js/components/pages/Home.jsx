import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import Preload from "../layout/Preload";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToken } from "../../hook/Token";
import jwt_decode from "jwt-decode";

const Home = () => {
  const [sidebarOpen, setSidebar] = useState(false);
  const [preloading, setPreload] = useState(true);
  const navigasi = useNavigate();
  const { setToken, setExp } = useToken();

  const refreshToken = async () => {
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
    await refreshToken();

    setTimeout(() => {
      setPreload(false);
    }, 1500);
  };

  useEffect(() => {
    awalFetch();
  }, []);

  return (
    <>
      {preloading ? (
        <Preload />
      ) : (
        <div className={sidebarOpen ? "d-flex toggled" : "d-flex"} id="wrapper">
          <Sidebar />
          <div id="page-content-wrapper">
            <Header sidebarOpen={sidebarOpen} setSidebar={setSidebar} />
            <main className="container-fluid px-4 py-4">
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
