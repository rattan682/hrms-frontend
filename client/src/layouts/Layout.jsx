import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <div id="wrapper">
        <Sidebar />
        <main className="main-content">
          <Navbar />
          <div className="page-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
