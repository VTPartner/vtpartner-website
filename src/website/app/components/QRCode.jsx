/* eslint-disable react-refresh/only-export-components */
// import React from "react";
import { SectionWrapper } from "../hoc";

const QRCode = () => {
  return (
    <div className="container mx-auto py-12 bg-tertiary rounded-lg mb-5 mt-10">
      {/* Section Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Streamline Your Transport Needs with KASP
        </h2>
        <p className="text-secondary mt-2">
          Download the KASP app for seamless booking of delivery, cab, and
          vendor services at your fingertips!
        </p>
      </div>

      {/* QR Codes Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        {/* Play Store QR Code */}
        <div className="text-center">
          <div className="w-40 h-40 mx-auto">
            <img
              src="https://dom-website-prod-cdn-cms.porter.in/download_qr_code_9ab171d2d6.png"
              alt="Play Store QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-white mt-4">Scan to download from Play Store</p>
          <div className="mt-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.porter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://dom-website-prod-cdn-web.porter.in/public/images/common/googleplay.png"
                alt="Download from Play Store"
                className="w-36 mx-auto"
              />
            </a>
          </div>
        </div>

        {/* App Store QR Code */}
        <div className="text-center">
          <div className="w-40 h-40 mx-auto">
            <img
              src="https://dom-website-prod-cdn-cms.porter.in/download_qr_code_9ab171d2d6.png"
              alt="App Store QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-white mt-4">Scan to download from App Store</p>
          <div className="mt-4">
            <a
              href="https://apps.apple.com/app/apple-store/id375380948"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://dom-website-prod-cdn-web.porter.in/public/images/common/appstore.png"
                alt="Download from App Store"
                className="w-36 mx-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(QRCode, "");
