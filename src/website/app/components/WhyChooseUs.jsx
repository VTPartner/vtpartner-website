/* eslint-disable react-refresh/only-export-components */
// import React from "react";
import { SectionWrapper } from "../hoc";

const WhyChooseUs = () => {
  return (
    <div className="container mx-auto py-8 mt-5">
      {/* Section Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Why Choose VT Partner Pickup & Delivery Services?
        </h2>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:mt-20 lg:mt-20 mt-10">
        <div className="bg-tertiary text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Door-to-door Services</h3>
          <p className="text-sm text-secondary">
            Enjoy on-demand pickup & delivery services at your doorstep.
          </p>
        </div>
        <div className="bg-tertiary text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Get Instant Deliveries</h3>
          <p className="text-sm text-secondary">
            Get your documents, laptops, lunch boxes, forgotten keys, or other
            small packages picked up and delivered instantly.
          </p>
        </div>
        <div className="bg-tertiary text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Get Anything Delivered</h3>
          <p className="text-sm text-secondary">
            Be it a pen or multiple documents, send anything up to 20 kg
            anywhere across the city.
          </p>
        </div>
        <div className="bg-tertiary text-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">
            Reliable Same-day Delivery
          </h3>
          <p className="text-sm text-secondary">
            Book two-wheeler delivery services online and get same-day delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(WhyChooseUs, "");
