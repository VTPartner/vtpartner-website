/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaArrowsToDot } from "react-icons/fa6";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { styles } from "../../../styles";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { serverWebsiteEndPoint } from "../../../dashboard/app/constants";
import axios from "axios";

const FrequentlyAskedQuestions = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [allFaqs, setFaqs] = useState([]);
  const { service } = location.state || {};

  const fetchAllFAQs = async () => {
    try {
      const endPoint = `${serverWebsiteEndPoint}/all_faqs`;
      const response = await axios.post(
        endPoint,
        {
          category_id: service.category_id,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data && response.data.all_faqs_details) {
        setFaqs(response.data.all_faqs_details);
      }
    } catch (error) {
      console.log("Error fetching FAQs:", error);
    }
  };

  const togglePanel = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Fetch FAQs when component mounts
  useEffect(() => {
    // console.log("service.categiry_id::", service.category_id);
    fetchAllFAQs();
  }, []);
  // If there are no FAQs, render nothing
  if (!allFaqs || allFaqs.length === 0) return null;

  return (
    <div className="sm:p-8 p-2">
      <div className="text-center mb-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          variants={textVariant()}
        >
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              fontSize: { xs: "26px", md: "34px" },
              fontWeight: "bold",
              textAlign: "center",
              mb: 4,
            }}
          >
            Frequently Ask <span style={{ color: "#4087e1" }}>Questions</span>
          </Typography>
        </motion.div>
      </div>
      <div className="space-y-4">
        {allFaqs.map((item, index) => (
          <div key={index} className="border-0">
            <button
              className="w-full text-left sm:p-2 p-2 focus:outline-none flex justify-between items-center text-gray"
              onClick={() => togglePanel(index)}
            >
              <span className="sm:text-[16px] text-[14px] flex items-center">
                <FaArrowsToDot className="w-3 h-3 m-2 text-gray" />
                {item.question}
              </span>
              <span>
                {expandedIndex === index ? (
                  <svg
                    className="w-4 h-4 text-gray"
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
                    className="w-4 h-4 text-gray"
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
                <p className="text-gray sm:text-[16px] text-[12px] ml-7">
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
