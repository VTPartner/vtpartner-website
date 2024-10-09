import { useContext } from "react";
import AuthContext from "/src/dashboard/app/contexts/JWTAuthContext";

const useAuth = () => useContext(AuthContext);
export default useAuth;
