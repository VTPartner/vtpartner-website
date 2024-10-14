import { MatxSuspense } from "/src/dashboard/app/components";
import useSettings from "/src/dashboard/app/hooks/useSettings";
import { MatxLayouts } from "./index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MatxLayout(props) {
  const { settings } = useSettings();
  const Layout = MatxLayouts[settings.activeLayout];

  return (
    <MatxSuspense>
      <ToastContainer />
      <Layout {...props} />
    </MatxSuspense>
  );
}
