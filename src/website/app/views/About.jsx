/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Banner,
  LeftSideImage,
  RightSideImage,
  OurMission,
  BannerMoreDetails,
  AboutServices,
  KeepInTouch,
} from "../components";
// Import Shimmer component
import { MatxLoading } from "../../../dashboard/app/components";

const About = () => {
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
          <Banner backgroundImage="/assets/about_us.jpeg" heading="About Us" />
          <AboutServices />
          <OurMission />
          <RightSideImage
            title="More than Just Transportation"
            description="At KASP, we redefine mobility by offering a comprehensive suite of services designed to meet your diverse needs..."
            imgSrc="https://images.unsplash.com/photo-1717126476861-25a064d81996?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
          <LeftSideImage
            title="Pioneering Sustainable Mobility"
            description="At KASP, we are committed to fostering a sustainable transportation ecosystem..."
            imgSrc="https://images.unsplash.com/photo-1717616171263-de4808015831?q=80&w=1987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />

          <BannerMoreDetails />
          {/* <KeepInTouch /> */}
        </>
      )}
    </>
  );
};

export default About;
