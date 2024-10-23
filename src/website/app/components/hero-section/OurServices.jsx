import { motion } from "framer-motion";

const tickAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};
const OurServices = () => {
  return (
    <section className="section pt-28 pb-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side content */}
          <motion.div
            className="wow fadeInUp"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-semibold text-gray-800 mb-8">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We offer variety of services
            </p>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              className="space-y-4"
            >
              {[
                "Goods Delivery",
                "Cab Booking",
                "JCB & Crane Service",
                "Drivers",
                "HandMans",
              ].map((service, index) => (
                <motion.li
                  key={index}
                  variants={tickAnimation}
                  className="relative pl-10 text-lg text-gray-700 flex items-center"
                >
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white shadow shadow-lg rounded-full flex items-center justify-center">
                    <img src="assets/tick.svg" alt="tick" className="h-2 w-2" />
                  </div>
                  {service}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div whileHover={{ scale: 1.05 }} className="mt-8">
              <a
                href="#"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition duration-300"
              >
                Learn More
                <svg
                  className="inline-block w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  ></path>
                </svg>
              </a>
            </motion.div>
          </motion.div>

          {/* Right side image grid */}
          <motion.div
            className="wow fadeInUp"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid gap-4">
              {/* Top large image */}
              <div className="w-full">
                <img
                  src="https://creativelayers.net/themes/luxride-html/assets/imgs/page/homepage4/img1.png"
                  alt="vtpartner"
                  className="w-[25rem] h-[15rem] rounded-lg shadow-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Two small images on the left */}
                <div className="space-y-4">
                  <img
                    src="https://creativelayers.net/themes/luxride-html/assets/imgs/page/homepage4/img4.png"
                    alt="vtpartner"
                    className="w-[25rem] h-[15rem] rounded-lg shadow-lg"
                  />
                  <img
                    src="https://creativelayers.net/themes/luxride-html/assets/imgs/page/homepage4/img2.png"
                    alt="vtpartner"
                    className="w-[25rem] h-auto rounded-lg shadow-lg"
                  />
                </div>
                {/* One large image on the right */}
                <div>
                  <img
                    src="https://creativelayers.net/themes/luxride-html/assets/imgs/page/homepage4/img4.png"
                    alt="vtpartner"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
