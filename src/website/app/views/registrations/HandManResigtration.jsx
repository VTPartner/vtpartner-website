// import React from "react";
import { useLocation } from "react-router-dom";
import { HandyManRegistrationHeroBanner } from "../../components";

const HandyManRegistration = () => {
  const location = useLocation();
  const { service } = location.state || {};

  return (
    <>
      <HandyManRegistrationHeroBanner
        attach_image={service?.attach_vehicle_background_image}
      />
    </>
  );
};

export default HandyManRegistration;
