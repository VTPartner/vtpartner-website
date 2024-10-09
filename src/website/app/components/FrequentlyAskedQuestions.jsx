/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { faqData } from "../constants";
import { FaArrowsToDot } from "react-icons/fa6";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { styles } from "../../../styles";
import { motion } from "framer-motion";

const FrequentlyAskedQuestions = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const togglePanel = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={textVariant()}
        >
          <h3 className={`${styles.sectionSubText}`}>
            Frequently Asked Questions
          </h3>
        </motion.div>
      </div>
      <div className="space-y-4 sm:ml-20 sm:mr-20">
        {faqData.map((item, index) => (
          <div key={index} className=" border-0">
            <button
              className="w-full text-left sm:p-4 p-2 focus:outline-none flex justify-between items-center text-white"
              onClick={() => togglePanel(index)}
            >
              <span className=" sm:text-[14px] text-[12px] flex items-center">
                <FaArrowsToDot className="w-3 h-3  m-2 text-white" />
                {item.question}
              </span>
              <span>
                {expandedIndex === index ? (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                )}
              </span>
            </button>
            {expandedIndex === index && (
              <div className="sm:p-4 p-2">
                <p className="text-white-100 sm:text-[12px] text-[10px] ml-7">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(FrequentlyAskedQuestions, "");
