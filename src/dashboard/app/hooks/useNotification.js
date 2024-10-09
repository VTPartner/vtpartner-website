import { useContext } from "react";
import NotificationContext from "/src/dashboard/app/contexts/NotificationContext";

const useNotification = () => useContext(NotificationContext);
export default useNotification;
