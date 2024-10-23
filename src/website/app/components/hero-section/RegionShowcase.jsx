/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const RegionShowcase = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  return (
    <section className="p-20  pb-30 bg-primary text-white!">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center">
          {/* Left Image Section */}
          <motion.div
            className="lg:w-6/12 flex justify-center lg:justify-start mb-8 lg:mb-0"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <motion.div
                className="gallery-1"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <img
                  className="rounded-lg shadow-lg"
                  src="assets/images/illustrations/business_deal.svg"
                  alt="vtpartner"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Text Section */}
          <motion.div
            className="lg:w-6/12 ml-20"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-medium text-white mb-6">
                From the region, for the region
              </h2>
              <p className="text-lg text-secondary mb-6">
                We operate in more than 2 cities in India for now.
              </p>
              <a
                href="#"
                className="btn-primary inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View All Cities
                <svg
                  className="ml-2 h-5 w-5"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RegionShowcase;
