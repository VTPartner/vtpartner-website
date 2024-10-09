import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { MatxTheme } from "./dashboard/app/components";
import { AuthProvider } from "./dashboard/app/contexts/JWTAuthContext";
import SettingsProvider from "./dashboard/app/contexts/SettingsContext";
import routes from "./routes";

// FAKE SERVER
import "./fake-db";
import Layout from "./website/app/components/Layout";

function App() {
  //  const location = useLocation();

  // Conditional check for dashboard routes
  // const isDashboard = location.pathname.startsWith("/dashboard");
  const isDashboard = true;
  const content = useRoutes(routes);

  return (
    <>
      {isDashboard ? (
        // Dashboard Layout
        <SettingsProvider>
          <AuthProvider>
            <MatxTheme>
              <CssBaseline />
              {content}
            </MatxTheme>
          </AuthProvider>
        </SettingsProvider>
      ) : (
        // Website Layout
        <Layout></Layout>
      )}
    </>
  );
}

export default App;
