import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";

const MainLayout = () => {
  return (
    <>
      <Sidebar />

      <Navbar />

      <Dashboard>
        <Outlet />
      </Dashboard>
    </>
  );
};

export default MainLayout;