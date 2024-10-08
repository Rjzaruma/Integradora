import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaHome, FaBars } from "react-icons/fa";
import "./navbar.css";

const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
      <FaBars className="menu-toggle" onClick={toggleSidebar} />
      <div className="menu-content">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <FaHome className="icon" /> Inicio
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
