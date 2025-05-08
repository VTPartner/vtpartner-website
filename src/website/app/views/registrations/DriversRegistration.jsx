// import React from "react";
import { useLocation } from "react-router-dom";
import { DriversRegistrationHeroBanner } from "../../components";

const DriversRegistration = () => {
  const location = useLocation();
  const { service } = location.state || {};

  return (
    <>
      <DriversRegistrationHeroBanner
        attach_image={service?.attach_vehicle_background_image}
      />
    </>
  );
};

export default DriversRegistration;
