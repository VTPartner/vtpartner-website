// import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white p-6 mt-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* VT Partner Links Section */}
          <div className="flex flex-col">
            {/* <h4 className="text-lg font-bold mb-2">VT Partner</h4> */}
            <img
              src="/logo_new.png"
              alt="logo"
              className="sm:w-[12rem] mt-[-1rem]  w-[8rem] sm:ml-0 ml-[-15px]"
            />
            {/* <a
              href=""
              className="hover:text-white text-gray-400"
              target="_self"
              aria-label="Visit VT Partner's Help Center"
            >
              Visit Help Center
            </a> */}
          </div>

          {/* Company Links Section */}
          {/* <div className="flex flex-col">
            <h4 className="text-lg font-bold mb-2">Company</h4>
            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Visit About us"
            >
              About us
            </a>

            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Visit Investors"
            >
              Investors
            </a>
            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Visit Blog"
            >
              Blog
            </a>
            <a
              href=""
              className="hover:text-white text-gray-400"
              target="_self"
              aria-label="Vist Careers"
            >
              Careers
            </a>
          </div> */}

          {/* Products Links Section */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold mb-2">Products</h4>
            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Ride with VT Partner"
            >
              Cab Ride
            </a>
            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Drive with VT Partner"
            >
              Goods Delivery
            </a>
            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Deliver with VT Partner"
            >
              Drivers
            </a>

            <a
              href=""
              className="mb-2 hover:text-white text-gray-400"
              target="_self"
              aria-label="Visit VT Partner for Business"
            >
              VT Partner for Business
            </a>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/VT Partner"
                className="hover:text-white text-gray-400"
                target="_blank"
                aria-label="Visit VT Partner's Facebook"
              >
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.79 1H2.21C1.54 1 1 1.54 1 2.21v19.57c0 .68.54 1.22 1.21 1.22h10.54v-8.51H9.9v-3.33h2.86V8.71c0-2.84 1.74-4.39 4.27-4.39.85 0 1.71.04 2.56.13v2.97h-1.75c-1.38 0-1.65.65-1.65 1.62v2.12h3.3l-.43 3.33h-2.89V23h5.61c.67 0 1.21-.54 1.21-1.21V2.21C23 1.54 22.46 1 21.79 1Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
              <a
                href="https://twitter.com/VT Partner"
                className="hover:text-white text-gray-400"
                target="_blank"
                aria-label="Visit VT Partner's Twitter"
              >
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14.094 10.317 22.28 1H20.34l-7.11 8.088L7.557 1H1.01l8.583 12.231L1.01 23H2.95l7.503-8.543L16.446 23h6.546M3.649 2.432h2.978L20.34 21.639h-2.98"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/"
                className="hover:text-white text-gray-400"
                target="_blank"
                aria-label="Visit VT Partner's YouTube"
              >
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23 12s0-3.85-.46-5.58c-.25-.95-1-1.7-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46c-.95.25-1.69 1.01-1.94 1.96C1 8.15 1 12 1 12s.04 3.85.5 5.58c.25.95 1 1.7 1.95 1.96 1.71.46 8.59.46 8.59.46s6.88 0 8.6-.46c.95-.25 1.69-1.01 1.94-1.96.46-1.73.42-5.58.42-5.58Zm-13 3.27V8.73L15.5 12 10 15.27Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/1815218"
                className="hover:text-white text-gray-400"
                target="_blank"
                aria-label="Visit VT Partner's LinkedIn"
              >
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4.5 3c-1.44 0-2.5 1.06-2.5 2.5S3.06 8 4.5 8c1.44 0 2.5-1.06 2.5-2.5S5.94 3 4.5 3Zm1.88 7.5H2V21h3.38V10.5Zm7.88-1.87c-.63 0-1.13.07-1.54.2V9.5h-3c.04.87 0 9 0 9h3v1.51c.82.51 1.88.73 3 .73 3.22 0 4.5-2.39 4.5-5.35 0-3-1.28-5.35-4.5-5.35Zm-3.1-1.56c.65-.03 1.29.24 1.66.73.38.49.5 1.14.38 1.77-.16.82-.63 1.36-1.39 1.45-.75.09-1.32-.14-1.67-.63-.36-.49-.5-1.11-.38-1.77.16-.82.64-1.35 1.39-1.45Zm1.43 6.24c-.77 0-1.5-.25-2.04-.73 0-.05-.04-.08-.05-.13h3.64c.01.03.01.07 0 .1-.15.4-.5.76-.92.76Zm6.89 1.25c.55 0 1.09-.07 1.57-.21V18h3V9h-3.38v2.47c-1.05-1.42-3.11-2.47-4.78-2.47-2.21 0-4.5 1.02-4.5 5.36 0 3.07 1.46 5.29 4.5 5.29ZM15 9h3v1.5h-3V9Zm-7.43 1H11V21H4.5V10.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
            </div>
            <div className="grid  gap-10 mt-10 hidden">
              <img
                src="https://d1a3f4spazzrp4.cloudfront.net/uber-com/1.3.8/d1a3f4spazzrp4.cloudfront.net/illustrations/app-store-google-4d63c31a3e.svg"
                alt=""
                className=" sm:w-[200px]  w-[150px] cursor-pointer"
              />
              <img
                src="https://d1a3f4spazzrp4.cloudfront.net/uber-com/1.3.8/d1a3f4spazzrp4.cloudfront.net/illustrations/app-store-apple-f1f919205b.svg"
                alt=""
                className=" sm:w-[200px] w-[150px] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center sm:flex justify-between items-center m-10">
        <p className="sm:text-sm text-xs font-semibold">
          © {new Date().getFullYear()} VT Partner Trans Pvt Ltd, Inc. All rights
          reserved.
        </p>
        <div className="flex items-center sm:text-sm text-xs justify-center gap-4 sm:mt-0 mt-4 sm:mb-0 mb-4">
          <a
            href=""
            className="hover:text-white text-gray-400"
            target="_self"
            aria-label="Learn more about VT Partner gift cards"
          >
            Privacy Policy
          </a>
          <a
            href=""
            className="hover:text-white text-gray-400"
            target="_self"
            aria-label="Learn more about VT Partner gift cards"
          >
            Terms
          </a>
          <a
            href=""
            className="hover:text-white text-gray-400"
            target="_self"
            aria-label="Learn more about VT Partner gift cards"
          >
            Notices
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
