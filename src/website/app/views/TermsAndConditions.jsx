/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Banner, TermsAndConditionsCard } from "../components";
// Import Shimmer component
import { MatxLoading } from "../../../dashboard/app/components";

const TermsAndConditions = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time for all components
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        // Show shimmer effect while loading
        <div className="h-screen bg-gray flex flex-col items-center justify-center">
          <MatxLoading />
        </div>
      ) : (
        // Show actual content when loading is complete
        <>
          <Banner
            backgroundImage="/assets/about_us.jpeg"
            heading="Terms And Conditions"
          />
          <TermsAndConditionsCard />
        </>
      )}
    </>
  );
};

export default TermsAndConditions;
