// import React from "react";
import { useLocation } from "react-router-dom";
import { JcbCraneRegistrationHeroBanner } from "../../components";

const JcbCraneRegistration = () => {
  const location = useLocation();
  const { service } = location.state || {};

  return (
    <>
      <JcbCraneRegistrationHeroBanner
        attach_image={service?.attach_vehicle_background_image}
      />
    </>
  );
};

export default JcbCraneRegistration;
