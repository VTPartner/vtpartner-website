/* eslint-disable react/prop-types */
import Scrollbar from "simplebar-react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import { sidebarConfig } from "../../Data/Sidebar/sidebar";

const Sidebar = ({ sidebarOpen, setIsSidebarOpen }) => {
  return (
    <nav className={`vertical-sidebar ${sidebarOpen ? "semi-nav" : ""}`}>
      <div className="app-logo">
        <Link className="logo d-inline-block" to="/dashboard/home">
          {/* <img src="/assets/images/logo/ra-white.png" alt="#" className="light-logo"/> */}
          <img src="/logo_new.png" alt="#" className="dark-logo" />
        </Link>
        <span
          className="bg-light-light toggle-semi-nav"
          onClick={() => {
            setIsSidebarOpen(!sidebarOpen);
          }}
        >
          <i className="ti ti-chevrons-right f-s-20"></i>
        </span>
      </div>
      <Scrollbar className="app-nav simplebar-scrollable-y" id="app-simple-bar">
        <ul className="main-nav p-0 mt-2">
          {sidebarConfig.map((config, index) => (
            <MenuItem key={index} {...config} />
          ))}
        </ul>
      </Scrollbar>
      <div className="menu-navs">
        <span className="menu-previous">
          <i className="ti ti-chevron-left" />
        </span>
        <span className="menu-next">
          <i className="ti ti-chevron-right"></i>
        </span>
      </div>
    </nav>
  );
};

export default Sidebar;
