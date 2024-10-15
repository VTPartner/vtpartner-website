import { MatxSuspense } from "/src/dashboard/app/components";
import useSettings from "/src/dashboard/app/hooks/useSettings";
import { MatxLayouts } from "./index";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MatxLayout(props) {
  const { settings } = useSettings();
  const Layout = MatxLayouts[settings.activeLayout];

  useEffect(() => {
    // Remove body padding when this layout is rendered
    document.body.style.paddingTop = "0px";

    // Cleanup to reset padding when component is unmounted
    return () => {
      document.body.style.paddingTop = ""; // Reset to default or any other padding set globally
    };
  }, []);

  return (
    <MatxSuspense>
      <ToastContainer />
      <Layout {...props} />
    </MatxSuspense>
  );
}
