/* eslint-disable no-unused-vars */

// Define the variables
let serverEndPoint, serverWebsiteEndPoint, serverEndPointImage;
const devMode = 0; // Change this to 1 for development mode

if (devMode === 1) {
  serverEndPoint = "http://77.37.47.156:3786/api/v1/dashboard";
  serverWebsiteEndPoint = "http://77.37.47.156:3786/api/v1/website";
  serverEndPointImage = "http://77.37.47.156:3786";
} else {
  serverEndPoint = "https://vtpartner.org/api/v1/dashboard";
  serverWebsiteEndPoint = "https://vtpartner.org/api/v1/website";
  serverEndPointImage = "https://vtpartner.org";
}

const mapKey = "AIzaSyAAlmEtjJOpSaJ7YVkMKwdSuMTbTx39l_o";

// Export the variables
export {
  serverEndPoint,
  serverWebsiteEndPoint,
  serverEndPointImage,
  mapKey,
  devMode,
};
