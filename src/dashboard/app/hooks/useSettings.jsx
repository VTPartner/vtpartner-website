import { useContext } from "react";
import { SettingsContext } from "/src/dashboard/app/contexts/SettingsContext";

const useSettings = () => useContext(SettingsContext);
export default useSettings;
