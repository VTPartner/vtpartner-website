/* eslint-disable react/no-unescaped-entities */
// import React from "react";
import { textVariant } from "../utils/motion";
import { styles } from "../../../styles";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
const Error404 = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This goes back to the previous page in history
  };
  return (
    <div className="w-screen h-screen bg-primary text-white">
      <div className="flex items-center justify-center flex-col h-full w-full">
        <motion.div
          variants={textVariant()}
          className="flex flex-col justify-center items-center"
        >
          <p className={`${styles.sectionHeadText} text-center mb-8`}>
            404 : (
          </p>
          <p className={`${styles.sectionSubText} text-center mb-8`}>
            The Page you're looking for was not found / Might Be Under
            Maintenance
          </p>
          <Link
            onClick={handleGoBack}
            className="bg-blue-600  rounded-md sm:p-4 p-2"
          >
            Go Back
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404;
