/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const DownloadSection = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:space-x-8 space-y-8 lg:space-y-0">
          <motion.div
            className="lg:w-7/12 mb-8 lg:mb-0"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl text-white font-medium mb-6">
              VTPartner at your fingertips
            </h2>
            <p className="text-lg text-white">
              Easily book, change, or cancel rides on the go. Think of it as
              peace of mind in the palm of your hand.
            </p>
          </motion.div>
          <motion.div
            className="lg:w-5/12 flex sm:flex-row flex-col sm:gap-2 gap-4 sm:justify-center items-center sm:space-x-4"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <a
              className="btn-download bg-white text-black rounded-lg flex items-center p-4 hover:bg-gray-200 transition"
              href="#"
            >
              <div className="icon-download sm:mr-3">
                <img
                  src="assets/apple-icon-black.svg"
                  alt="Apple Store"
                  className="w-8 h-8"
                />
              </div>
              <div className="info-download">
                <span className="text-sm">Download on the</span>
                <span className="block text-base font-medium">Apple Store</span>
              </div>
            </a>
            <a
              className="btn-download bg-white text-black rounded-lg flex items-center p-4 hover:bg-gray-200 transition"
              href="#"
            >
              <div className="icon-download sm:mr-3">
                <img
                  src="assets/google-icon-black.svg"
                  alt="Google Play"
                  className="w-8 h-8"
                />
              </div>
              <div className="info-download">
                <span className="text-sm">Download on the</span>
                <span className="block text-base font-medium">Google Play</span>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
