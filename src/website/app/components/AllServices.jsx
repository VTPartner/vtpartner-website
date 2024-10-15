/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../../../styles";
import { github } from "../../../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { Link, NavLink } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const AllServices = () => {
  const isSmUp = useMediaQuery("(min-width: 640px)");
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="show"
        variants={isSmUp ? textVariant() : {}}
      >
        <p className={`${styles.sectionSubText} `}>We Offer various</p>
        <h2 className={`${styles.sectionHeadText}`}>Our Services</h2>
      </motion.div>

      {/* sm:flex */}
      <div className="w-full  hidden">
        <motion.p
          initial="hidden"
          whileInView="show"
          variants={fadeIn("", "", 0.1, 0.25)}
          className="mt-0 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          At VT Partner, we are committed to providing a wide range of reliable
          and efficient services to meet your everyday needs. Whether you're
          looking for Goods Delivery, Cab Booking, or heavy machinery like JCB
          and Crane Booking, we’ve got you covered. Our services also extend to
          expert Vendor Services, offering skilled professionals for tasks like
          plumbing, electrical work, mechanic services, car wash, laundry, and
          more – all available right at your doorstep.
        </motion.p>
      </div>

      <div className="sm:mt-1 flex flex-wrap justify-evenly">
        {projects.map((project, index) => (
          <ServiceCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

const ServiceCard = ({
  index,
  name,
  description,
  tags,
  image,
  weight,
  price,
  source_code_link,
}) => {
  return (
    <Tilt className="max-w-[30rem] mt-4">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full  p-[1px] rounded-[20px]"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-white rounded-[20px] py-5 px-6 min-h-[70px] flex justify-evenly items-center flex-col"
        >
          <img
            src={image}
            alt={name}
            className="sm:w-20 sm:h-20 w-8 h-8 object-contain"
          />
        </div>
      </motion.div>
      <h3 className="text-gray sm:mt-4 mt-2 sm:text-[12px] text-[8px] font-bold text-center overflow-clip">
        {name}
      </h3>
    </Tilt>
  );
};

const AllServicesCard = ({
  index,
  name,
  description,
  tags,
  image,
  weight,
  price,
  source_code_link,
}) => {
  const isSmUp = useMediaQuery("(min-width: 640px)");
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={isSmUp ? fadeIn("up", "spring", index * 0.5, 0.75) : {}}
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-white shadow-xl mt-[1px] p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
          {weight ? (
            <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              >
                <p className="text-white font-bold text-[8px] text-center">
                  {weight}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-black font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-gray-500 text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex hidden flex-wrap gap-2">
          {tags.map((tag) => (
            <NavLink
              to="/get_estimation"
              state={{
                serviceName: name,
                description,
                tags,
                image,
                weight,
                price,
                source_code_link,
              }} // sending details to next screen
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color} cursor-pointer`}
            >
              {tag.name}
            </NavLink>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};
// export default AllServices;
export default SectionWrapper(AllServices, "all-services");
