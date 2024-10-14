/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Menu, Close } from "@mui/icons-material";
import { Drawer, IconButton, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="bg-primary text-white fixed w-full z-50 top-0">
      <nav className="flex justify-between items-center gap-4 sm:p-5 p-2">
        <img src="/vite.svg" alt="logo" className="sm:col-span-2 ml-4" />

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-9 justify-between items-center text-sm">
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-white font-bold"
                  : "hover:text-white text-secondary"
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-white font-bold"
                  : "hover:text-white text-secondary"
              }
              to="/about"
            >
              About us
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-white font-bold"
                  : "hover:text-white text-secondary"
              }
              to="/business"
            >
              Business
            </NavLink>
          </li> */}
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "text-white font-bold"
                  : "hover:text-white text-secondary"
              }
              to="/agents"
            >
              Registrations
            </NavLink>
          </li>
        </ul>

        {/* Desktop Contact Button */}
        <a href="#contact" className="lg:block mr-4 hidden">
          Contact
        </a>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            className="block lg:hidden" // Show only on small screens
          >
            <Menu />
          </IconButton>
        </div>

        {/* Drawer for Mobile Menu */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <div className="p-4 w-64 bg-primary text-white h-screen flex flex-col justify-between">
            <div>
              {/* Close Icon */}
              <div className="flex justify-end">
                <IconButton onClick={toggleDrawer}>
                  <Close style={{ color: "white" }} />
                </IconButton>
              </div>

              {/* Drawer Navigation */}
              <ul className="flex flex-col gap-4 mt-4">
                <li>
                  <NavLink
                    onClick={toggleDrawer}
                    className={({ isActive }) =>
                      isActive ? "text-white font-bold" : "text-secondary"
                    }
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={toggleDrawer}
                    className={({ isActive }) =>
                      isActive ? "text-white font-bold" : "text-secondary"
                    }
                    to="/about"
                  >
                    About us
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    onClick={toggleDrawer}
                    className={({ isActive }) =>
                      isActive ? "text-white font-bold" : "text-secondary"
                    }
                    to="/business"
                  >
                    Business
                  </NavLink>
                </li> */}
                <li>
                  <NavLink
                    onClick={toggleDrawer}
                    className={({ isActive }) =>
                      isActive ? "text-white font-bold" : "text-secondary"
                    }
                    to="/agents"
                  >
                    Registrations
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Download App Button at Bottom */}
            {/* <div className="mt-auto">
              <Button variant="contained" fullWidth>
                Download App
              </Button>
            </div> */}
          </div>
        </Drawer>
      </nav>
    </div>
  );
};

export default Navbar;
