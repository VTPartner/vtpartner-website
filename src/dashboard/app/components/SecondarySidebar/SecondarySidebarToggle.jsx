/* eslint-disable no-unused-vars */
import { Fab, styled, IconButton } from "@mui/material";
import { Close, Settings } from "@mui/icons-material";
import clsx from "clsx";

import useSettings from "/src/dashboard/app/hooks/useSettings";

// STYLED COMPONENT
const Toggle = styled("div")(() => ({
  zIndex: 99,
  right: "30px",
  bottom: "50px",
  position: "fixed",
  transition: "all 0.15s ease",
  "&.open": { right: "10px" },
}));

export default function SecondarySidebarToggle() {
  const { settings, updateSettings } = useSettings();

  const toggle = () => {
    updateSettings({
      secondarySidebar: { open: !settings.secondarySidebar.open },
    });
  };

  return <></>;
}
