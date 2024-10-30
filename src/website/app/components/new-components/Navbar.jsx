import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const NavbarNew = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navItems = [
    { title: "Home", link: "/home" },
    { title: "Packers & Movers", link: "/packers-movers" },
    { title: "Join Driver", link: "/joinDriver" },
    { title: "For Enterprise", link: "/enterprise" },
    { title: "Track Order", link: "/enterPackageID" },
    { title: "Support", link: "/support" },
    { title: "Delete Account", link: "/delete-user" },
  ];

  return (
    <AppBar position="fixed" color="primary" sx={{ backgroundColor: "#FFF" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src="../../assets/images/logo.png" alt="logo" height="40" />
          </Typography>

          {/* Mobile Menu Icon */}
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            sx={{ display: { xs: "flex", md: "none" }, color: "black" }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Menu */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/home"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img src="../../assets/images/logo.png" alt="logo" height="40" />
          </Typography>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {navItems.map((item) => (
              <MenuItem key={item.title} onClick={handleCloseNavMenu}>
                <Typography
                  component={Link}
                  to={item.link}
                  sx={{ textDecoration: "none", color: "black" }}
                >
                  {item.title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>

          {/* Desktop Links */}
          <div style={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => (
              <Button
                key={item.title}
                component={Link}
                to={item.link}
                onClick={handleCloseNavMenu}
                sx={{
                  color: "black",
                  display: "block",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "16px",
                }}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavbarNew;
