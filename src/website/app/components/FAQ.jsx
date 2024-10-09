// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { faqData } from "../constants";

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const togglePanel = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="text-sm mt-2 mb-4">
          Your questions matter to us—reach out anytime, and let’s make your
          experience exceptional!
        </p>
      </div>
      <div className="space-y-4 sm:ml-20 sm:mr-20">
        {faqData.map((item, index) => (
          <div key={index} className=" border-b-2">
            <button
              className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
              onClick={() => togglePanel(index)}
            >
              <span className="">{item.question}</span>
              <span>
                {expandedIndex === index ? (
                  <svg
                    className="w-6 h-6 text-gray-500"
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
                    className="w-6 h-6 text-gray-500"
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
              <div className="p-4 border-t border-gray-300">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
