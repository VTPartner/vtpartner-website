// import { useRoutes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
// import CssBaseline from "@mui/material/CssBaseline";
// import { MatxTheme } from "./dashboard/app/components";
// import { AuthProvider } from "./dashboard/app/contexts/JWTAuthContext";
// import SettingsProvider from "./dashboard/app/contexts/SettingsContext";
// import routes from "./routes";
import Routes from "./new_dashboard/Route";
import { Suspense } from "react";

// FAKE SERVER
// import "./fake-db";
// import Layout from "./website/app/components/Layout";
import Loader from "./new_dashboard/Components/Loader";

function App() {
  //  const location = useLocation();

  // Conditional check for dashboard routes
  // const isDashboard = location.pathname.startsWith("/dashboard");
  // const isDashboard = true;
  // const content = useRoutes(routes);

  // return (
  //   <>
  //     {isDashboard ? (
  //       // Dashboard Layout
  //       // <SettingsProvider>
  //       //   <AuthProvider>
  //       //     <MatxTheme>
  //       //       <CssBaseline />
  //       //       {content}
  //       //     </MatxTheme>
  //       //   </AuthProvider>
  //       // </SettingsProvider>
  //       <Suspense fallback={<Loader />}>
  //         <BrowserRouter basename="/">
  //           <Routes />
  //         </BrowserRouter>
  //       </Suspense>
  //     ) : (
  //       // <Suspense fallback={<Loader />}>
  //       //   <BrowserRouter basename="/">
  //       //     <Routes />
  //       //   </BrowserRouter>
  //       // </Suspense>
  //       // Website Layout
  //       <Layout></Layout>
  //     )}
  //   </>
  // );

  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
