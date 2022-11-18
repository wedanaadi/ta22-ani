import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import Preload from "../layout/Preload";
import { Outlet } from "react-router-dom";

const Home = () => {
  const [sidebarOpen, setSidebar] = useState(false);
  const [preloading, setPreload] = useState(true);

  useEffect(()=>{
    setTimeout(() => {
      setPreload(false)
    }, 1500);
  },[])

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
