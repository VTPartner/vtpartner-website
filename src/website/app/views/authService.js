// import axios from "axios";
import { saveAuthToken } from "./auth";
// import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";

// export const authenticateLogin = async (credentials) => {
//   try {
//     const response = await axios.post(
//       `${serverWebsiteEndPoint}/login_in`,
//       credentials
//     ); // Replace with your login API endpoint
//     if (response.status === 200 && response.data.token) {
//       saveAuthToken(response.data.token); // Save token to cookies
//       return { success: true, message: "Login successful" };
//     } else {
//       return { success: false, message: "Invalid credentials" };
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.message || "Something went wrong",
//     };
//   }
// };

export const authenticateLogin = async (credentials) => {
  const validEmail = "vtp@vtpartner.org";
  const validPassword = "VTPartner@987";

  // Simulate authentication logic
  if (
    credentials.email === validEmail &&
    credentials.password === validPassword
  ) {
    // Simulate saving a token (can be replaced with actual logic if needed)
    const fakeToken = "fake-jwt-token";
    saveAuthToken(fakeToken); // Save token to cookies or localStorage
    return { success: true, message: "Login successful" };
  } else {
    return { success: false, message: "Invalid email or password" };
  }
};
