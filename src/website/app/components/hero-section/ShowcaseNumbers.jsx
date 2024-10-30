/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const ShowcaseNumbers = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  return (
    <section className=" mt-[8rem] box-showcase">
      <div className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-8 lg:space-y-0 lg:space-x-8">
            <motion.div
              className="lg:w-6/12"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="sm:text-4xl text-xl text-white font-medium">
                Showcase some impressive numbers.
              </h2>
            </motion.div>
            <motion.div
              className="lg:w-6/12 flex flex-wrap items-center justify-between"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                className="w-1/3 text-center mb-8"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="box-number">
                  <h2 className="sm:text-4xl text-xl text-white font-medium">
                    285
                  </h2>
                  <p className="sm:text-xl text-white">Vehicles</p>
                </div>
              </motion.div>
              <motion.div
                className="w-1/3 text-center mb-8"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="box-number">
                  <h2 className="sm:text-4xl text-xl text-white font-medium">
                    97
                  </h2>
                  <p className="sm:text-xl text-white">Awards</p>
                </div>
              </motion.div>
              <motion.div
                className="w-1/3 text-center mb-8"
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="box-number">
                  <h2 className="sm:text-4xl text-xl text-white font-medium">
                    13K
                  </h2>
                  <p className="sm:text-xl text-white">Happy Customers</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseNumbers;
