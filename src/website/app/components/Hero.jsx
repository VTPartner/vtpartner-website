/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { styles } from "../../../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto overflow-y-auto">
      <div
        className={`${styles.paddingX} absolute insert-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915eff]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Discover <span className="text-[#915eff]">VTP</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            Reliable and Fast Transport Solutions
            <br className="sm:block hidden" /> for Goods, Cabs, JCB, and Vendors
          </p>
        </div>
      </div>
      <ComputersCanvas />

      <div className="absolute xs:bottom-10 w-full flex justify-center items-center ">
        <a href="#all-services">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
