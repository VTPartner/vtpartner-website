/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

const GrowingNetwork = () => {
  const data = [
    { count: "20+", label: "CITIES" },
    { count: "100+", label: "INTEGRATED CLIENTS" },
    { count: "500,000+", label: "DRIVER PARTNERS" },
    { count: "50,000+", label: "MONTHLY DELIVERED ORDERS" },
  ];

  // Function to increment numbers
  const useIncrementCount = (finalCount) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = parseInt(finalCount);
      const duration = 2000; // Animation duration in milliseconds
      const stepTime = Math.max(Math.floor(duration / end), 1); // Time between increments

      const timer = setInterval(() => {
        if (start < end) {
          start += 1;
          setCount(start);
        } else {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }, [finalCount]);

    return count;
  };

  return (
    <div className="p-8 bg-black text-white shadow-md">
      <div className="m-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">OUR GROWING NETWORK</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {data.map((item, index) => {
            // Use the custom hook to increment the count
            const animatedCount = useIncrementCount(item.count.slice(0, -1)); // Remove the '+' sign for counting
            return (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg shadow-md bg-gray-800 transition duration-200 hover:bg-gray-700"
              >
                <div className="text-4xl font-semibold text-white">
                  {animatedCount}
                  {item.count.endsWith("+") ? "+" : ""}
                </div>
                <div className="text-sm text-white mt-5 text-center">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GrowingNetwork;
