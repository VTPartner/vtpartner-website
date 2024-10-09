/* eslint-disable react/prop-types */
import { CssBaseline, ThemeProvider } from "@mui/material";
import useSettings from "../../../app/hooks/useSettings";
// import useSettings from "dashboard/app/hooks/useSettings";

const MatxTheme = ({ children }) => {
  const { settings } = useSettings();
  let activeTheme = { ...settings.themes[settings.activeTheme] };

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MatxTheme;
