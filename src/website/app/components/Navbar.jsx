/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Menu, Close } from "@mui/icons-material";
import { Drawer, IconButton, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { DownloadApp } from "../components";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <DownloadApp />
      <div className="bg-white text-black fixed w-full z-50 top-0 ">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0 }}
          className="flex justify-between items-center gap-4 lg:p-4 p-2"
        >
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold"
                : "hover:text-black text-secondary"
            }
            to="/"
          >
            <img
              src="/logo_new.png"
              alt="logo"
              className="sm:col-span-2 ml-4 sm:w-[5rem] sm:h-auto h-10 w-15 object-contain"
            />
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex gap-9 justify-between items-center text-sm">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-black font-bold"
                    : "hover:text-black text-secondary font-bold"
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
                    ? "text-black font-bold"
                    : "hover:text-black text-secondary font-bold"
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
                    ? "text-black font-bold"
                    : "hover:text-black text-secondary font-bold"
                }
                to="/agents"
              >
                Join Us
              </NavLink>
            </li>
          </ul>

          {/* Desktop Contact Button */}
          <a
            href="#contact"
            className="lg:block mr-4 hidden text-white bg-blue-500 rounded-md px-4 py-2 cursor-pointer"
          >
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
              <img src="/assets/menu.svg" alt="menu" className="invert" />
            </IconButton>
          </div>

          {/* Drawer for Mobile Menu */}
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
            <div className="p-4 w-64 bg-white text-black h-screen flex flex-col justify-between">
              <div>
                {/* Close Icon */}
                <div className="flex justify-end">
                  <IconButton onClick={toggleDrawer}>
                    <img
                      src="/assets/close.svg"
                      alt="menu"
                      className="invert"
                    />
                  </IconButton>
                </div>

                {/* Drawer Navigation */}
                <ul className="flex flex-col gap-4 mt-4">
                  <li>
                    <NavLink
                      onClick={toggleDrawer}
                      className={({ isActive }) =>
                        isActive ? "text-black font-bold" : "text-secondary"
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
                        isActive ? "text-black font-bold" : "text-secondary"
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
                        isActive ? "text-black font-bold" : "text-secondary"
                      }
                      to="/agents"
                    >
                      Join Us
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
        </motion.nav>
      </div>
    </>
  );
};

export default Navbar;
