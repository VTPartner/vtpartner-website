/* eslint-disable react/prop-types */
import Scrollbar from "simplebar-react";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";
import { sidebarConfig } from "../../Data/Sidebar/sidebar";

const Sidebar = ({ sidebarOpen, setIsSidebarOpen }) => {
  return (
    <nav className={`vertical-sidebar ${sidebarOpen ? "semi-nav" : ""}`}>
      <style>
        {`
         

          .app-logo {
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bs-sidebar-bg, #fff);
            position: sticky;
            top: 0;
            z-index: 2;
          }

          .app-nav {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 100px !important; /* Extra space at bottom */
          }

          /* Custom scrollbar styles */
          .simplebar-scrollbar::before {
            background-color: rgba(0, 0, 0, 0.2);
          }

          .simplebar-track.simplebar-vertical {
            width: 8px;
          }

          /* Main navigation styles */
          .main-nav {
            list-style: none;
            margin: 0;
            padding: 0;
            min-height: calc(100vh - 150px); /* Ensure minimum height */
          }

          /* Menu items container */
          .menu-items-container {
            padding-bottom: 100px; /* Additional padding at the bottom */
          }

          /* Navigation arrows container */
          .menu-navs {
            position: sticky;
            bottom: 0;
            padding: 10px;
            background: var(--bs-sidebar-bg, #fff);
            display: flex;
            justify-content: space-between;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 2;
          }

          .menu-previous,
          .menu-next {
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background-color 0.3s;
          }

          .menu-previous:hover,
          .menu-next:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }

          /* Logo styles */
          .logo {
            max-width: 150px;
            height: auto;
          }

          .dark-logo {
            max-width: 100%;
            height: auto;
          }

          /* Toggle button styles */
          .toggle-semi-nav {
            cursor: pointer;
            padding: 5px 8px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
          }

          .toggle-semi-nav:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            .vertical-sidebar {
              transform: translateX(-100%);
              transition: transform 0.3s ease;
            }

            .vertical-sidebar.semi-nav {
              transform: translateX(0);
            }

            .app-nav {
              padding-bottom: 120px !important; /* Extra padding for mobile */
            }
          }

          /* Custom SimpleBar styles */
          .simplebar-content-wrapper {
            min-height: 100%;
          }

          .simplebar-content {
            display: flex;
            flex-direction: column;
            min-height: 100%;
          }

          /* Ensure last items are visible */
          .main-nav > :last-child {
            margin-bottom: 100px;
          }
        `}
      </style>
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
