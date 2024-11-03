/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { textVariant } from "../../utils/motion";
import { styles } from "../../../../styles";

const HowItWorks = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, type: "spring", stiffness: 50 },
    }),
  };

  return (
    <section className=" mb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={textVariant()}
          className="mt-10 mb-10 text-center font-titillium"
        >
          <p className={`${styles.sectionSubText} `}>Know us better</p>
          <Typography
            variant="h2"
            sx={{
              color: "text.primary",
              fontSize: { xs: "36px", md: "64px" },
              fontWeight: "bold",
              mb: 4,
            }}
          >
            How It{" "}
            <span style={{ color: "#4087e1", fontFamily: "titillium" }}>
              Works?
            </span>
          </Typography>
        </motion.div>

        <div className="flex flex-col items-center justify-between md:flex-row space-y-8 md:space-y-0 mt-8">
          <motion.div
            className="cardWork max-w-sm text-center p-6  hover:shadow-lg rounded-lg"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={0}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <img
                src="/assets/route.svg"
                alt="Create Your Route"
                className=" mx-auto"
              />
            </div>
            <h5 className="text-2xl font-medium mb-4 font-titillium">
              Create Your Route
            </h5>
            <p className="text-xs text-gray-600 font-titillium">
              Enter your pickup &amp; dropoff locations or the number of hours
              you wish to book a car and driver for.
            </p>
          </motion.div>

          <motion.div
            className="cardWork max-w-sm text-center p-6  hover:shadow-lg rounded-lg"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <img
                src="/assets/vehicle.svg"
                alt="Choose Vehicle"
                className="mx-auto"
              />
            </div>
            <h5 className="text-2xl font-medium mb-4 font-titillium">
              Choose Vehicle For You
            </h5>
            <p className="text-xs text-gray-600 font-titillium">
              On the day of your ride, you will receive two email and SMS
              updates one informing you that.
            </p>
          </motion.div>

          <motion.div
            className="cardWork max-w-sm text-center p-6 hover:shadow-lg rounded-lg"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            custom={2}
            viewport={{ once: true }}
          >
            <div className="mb-4">
              <img
                src="/assets/journey.svg"
                alt="Enjoy The Journey"
                className="mx-auto"
              />
            </div>
            <h5 className="text-2xl font-medium mb-4 font-titillium">
              Enjoy The Journey
            </h5>
            <p className="text-xs text-gray-600 font-titillium">
              After your ride has taken place, we would appreciate it if you
              could rate your car and driver.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
