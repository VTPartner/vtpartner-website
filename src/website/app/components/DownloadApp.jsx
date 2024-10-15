import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Assuming you want to use MUI icons

const DownloadApp = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false); // Hide the component when the close button is clicked
  };

  if (!isVisible) return null;

  return (
    <div className=" sm:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-10">
            <img
              src="public/logo_new.png"
              alt="App Icon"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          {/* Title and Subtitle */}
          <div>
            <div className="sm:text-lg text-xs font-semibold">
              VT Partner App
            </div>
            <div className="sm:text-sm text-xs text-gray-600">
              We are coming soon
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex space-x-2 items-center">
          <button className="bg-primary sm:text-sm text-xs text-white px-4 py-2 rounded-md hover:bg-primary-dark hidden">
            <a
              id="download-button-link"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[8px]"
            >
              OPEN APP
            </a>
          </button>
          {/* Close Button */}
          <button
            className="bg-transparent p-1 hover:bg-gray-200 rounded-full"
            onClick={handleClose}
          >
            <CloseIcon className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
