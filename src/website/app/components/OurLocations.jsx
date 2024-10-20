/* eslint-disable react-refresh/only-export-components */
// import React from "react";

import { GoDotFill } from "react-icons/go";
import { SectionWrapper } from "../hoc";
import { areas } from "../constants";
import { textVariant } from "../utils/motion";
// import { styles } from "../../../styles";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";

const OurLocations = () => {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={textVariant()}
        className="mt-10"
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.primary",
            fontSize: { xs: "16px", md: "24px" },
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
          }}
        >
          We proudly extend our services across the{" "}
          <span style={{ color: "#4087e1" }}>following areas</span>
        </Typography>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-center gap-1">
        {areas.map((area) => (
          <div className="h-8" key={area.name}>
            <span className="flex items-center justify-center text-black flex-wrap">
              <GoDotFill className="w-2 h-2  m-1 text-black" />
              {`${area.name}`}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(OurLocations, "/");
