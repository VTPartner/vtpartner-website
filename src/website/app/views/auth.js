import Cookies from "js-cookie";

// Save token in cookies with a 12-hour expiration
export const saveAuthToken = (token) => {
  Cookies.set("authToken", token, { expires: 0.5 }); // 12 hours
};
// export const saveAuthToken = (token) => {
//   const expiryDate = new Date(new Date().getTime() + 20000); // Current time + 5000ms (5 seconds)
//   Cookies.set("authToken", token, { expires: expiryDate });
// };

// Remove token from cookies
export const clearAuthToken = () => {
  Cookies.remove("authToken");
};

// Check if the user is authenticated
export const isLoginAuthenticatedToken = () => {
  return Cookies.get("authToken") ? true : false;
};
