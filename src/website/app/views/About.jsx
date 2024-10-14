// import React from 'react'
import {
  Banner,
  LeftSideImage,
  RightSideImage,
  OurMission,
  BannerMoreDetails,
  AboutServices,
  KeepInTouch,
} from "../components";

const About = () => {
  return (
    <>
      <Banner
        backgroundImage="https://images.unsplash.com/photo-1492892132812-a00a8b245c45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        heading="About Us"
      />
      <RightSideImage
        title="More than Just Transportation"
        description="At VT Partner, we redefine mobility by offering a comprehensive suite of services designed to meet your diverse needs. Beyond traditional ride-hailing, our platform facilitates goods delivery, cab services, JCB and crane bookings, and reliable vendor solutions. Whether you need to transport goods swiftly, book a cab for a seamless journey, or find a skilled professional for home services, we are here to ensure a smooth and efficient experience every step of the way. Your journey matters to us, and we’re committed to making movement accessible and convenient for everyone."
        imgSrc="https://images.unsplash.com/photo-1717126476861-25a064d81996?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <LeftSideImage
        title="Pioneering Sustainable Mobility"
        description="At VT Partner, we are committed to fostering a sustainable transportation ecosystem. Our mission is to lead the way in reducing our environmental footprint while ensuring that our services remain efficient and accessible. We recognize the urgent need to address climate change and are dedicated to implementing practices that minimize our impact on the planet. This includes promoting responsible travel options, enhancing operational efficiencies, and collaborating with environmental organizations to support sustainable initiatives. Together, we can build a brighter, more sustainable future for generations to come."
        imgSrc="https://images.unsplash.com/photo-1717616171263-de4808015831?q=80&w=1987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <OurMission />
      <BannerMoreDetails />
      <AboutServices />
      <KeepInTouch />
    </>
  );
};

export default About;
