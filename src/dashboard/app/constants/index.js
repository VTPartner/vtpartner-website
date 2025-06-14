/* eslint-disable no-unused-vars */

// Define the variables
let serverEndPoint, serverWebsiteEndPoint, serverEndPointImage;
const devMode = 0; // Change this to 1 for development mode

if (devMode === 1) {
  serverEndPoint = "http://100.24.44.74:8000/api/dashboard";
  serverWebsiteEndPoint = "http://100.24.44.74:8000/api/website";
  serverEndPointImage = "http://100.24.44.74:8000/api/dashboard";
} else {
  serverEndPoint = "https://www.kaps9.in/api/dashboard";
  serverWebsiteEndPoint = "https://www.kaps9.in/api/website";
  serverEndPointImage = "https://www.kaps9.in/api/dashboard";
}

// if (devMode === 1) {
//   serverEndPoint = "http://77.37.47.156:8000/api/dashboard";
//   serverWebsiteEndPoint = "http://77.37.47.156:8000/api/website";
//   serverEndPointImage = "http://77.37.47.156:8000/api/dashboard";
// } else {
//   serverEndPoint = "https://vtpartner.org/api/dashboard";
//   serverWebsiteEndPoint = "https://vtpartner.org/api/website";
//   serverEndPointImage = "https://vtpartner.org/api/dashboard";
// }

const mapKey = "AIzaSyAAlmEtjJOpSaJ7YVkMKwdSuMTbTx39l_o";
export const RAZORPAY_KEY_ID = "rzp_test_61op4YoSkMBW6u";
export const RAZORPAY_KEY_SECRET = "rzp_test_61op4YoSkMBW6u";

function formatEpoch(epoch) {
  if (!epoch) return "N/A"; // Handle cases where epoch is null or undefined

  const date = new Date(epoch * 1000); // Convert epoch to milliseconds

  // Extract and format time (AM/PM)
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;

  // Extract and format date (DD/MM/YYYY)
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return `${formattedTime} on ${formattedDate}`;
}

// Export the variables
export {
  serverEndPoint,
  serverWebsiteEndPoint,
  serverEndPointImage,
  mapKey,
  devMode,
  formatEpoch,
};

