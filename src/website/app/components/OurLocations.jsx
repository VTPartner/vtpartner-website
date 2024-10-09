/* eslint-disable react-refresh/only-export-components */
// import React from "react";

import { GoDotFill } from "react-icons/go";
import { SectionWrapper } from "../hoc";
import { areas } from "../constants";
import { textVariant } from "../utils/motion";
import { styles } from "../../../styles";
import { motion } from "framer-motion";

const OurLocations = () => {
  return (
    <>
      <motion.div initial="hidden" whileInView="show" variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center mb-8`}>
          We proudly extend our services across the following areas
        </p>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-center gap-1">
        {areas.map((area) => (
          <div className="h-8" key={area.name}>
            <span className="flex items-center justify-center text-white flex-wrap">
              <GoDotFill className="w-2 h-2  m-1 text-white" />
              {`${area.name}`}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(OurLocations, "");
