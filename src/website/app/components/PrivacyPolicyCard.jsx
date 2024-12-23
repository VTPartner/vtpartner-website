import { useState } from "react";

const PrivacyPolicyCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="bg-white py-10" id="" data-baseweb="block">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="sm:text-3xl text-lg font-titillium text-gray-800">
            Our Mission
          </h2>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            At VT Partner, movement is at the core of our purpose. It inspires
            our dedication and shapes our vision for the future. Every day, we
            focus on improving how you connect with the world—be it through
            reliable goods delivery, convenient cab bookings, or skilled
            services right at your doorstep. Our goal is to provide effortless
            solutions for all your mobility needs, empowering you to reach your
            destinations with ease. We aim to enhance your experience by
            ensuring you have access to opportunities and services that help you
            thrive. With VT Partner, embrace the world in real time and enjoy
            the freedom of movement at your fingertips.
          </p>
        </div>
        {/* <div className="border-t border-gray-300"> */}
        <div className="">
          <ul className="accordion">
            {/* <li className="border-b border-gray-200"> */}
            <li className="">
              <div
                role="button"
                aria-expanded={isExpanded}
                onClick={toggleExpansion}
                className="flex justify-between items-center py-4 cursor-pointer transition hover:bg-gray-100"
              >
                <span className="font-semibold text-sm">
                  Learn About Our Complete Mission Commitment
                </span>
                <svg
                  viewBox="0 0 24 24"
                  title="Expand"
                  className={`transition-transform duration-200 ${
                    isExpanded ? "transform rotate-180" : ""
                  } w-6 h-6 text-gray-600`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.9394 15.5607C11.5252 16.1464 12.4749 16.1464 13.0607 15.5607L17.0607 11.5607C17.6465 10.9749 17.6465 10.0251 17.0607 9.43934C16.4749 8.85355 15.5252 8.85355 14.9394 9.43934L12 12.3787L9.06069 9.43934C8.4749 8.85355 7.52515 8.85355 6.93937 9.43934C6.35358 10.0251 6.35358 10.9749 6.93937 11.5607L10.9394 15.5607Z"
                  />
                </svg>
              </div>
              {isExpanded && (
                <div className="py-4">
                  <p className="text-gray-700 text:xs  leading-relaxed">
                    At VT Partner, we are a technology-driven company bridging
                    the gap between the physical and digital realms, enabling
                    seamless movement at the tap of a button. We envision a
                    world where mobility is not just a privilege but a
                    fundamental right—accessible, safe, and sustainable for
                    everyone. We believe in empowering individuals to move and
                    earn freely, irrespective of gender, race, religion,
                    abilities, or sexual orientation. We stand firm in our
                    commitment to champion inclusivity, ensuring that everyone
                    can navigate their journeys without fear or barriers.
                    <br />
                    <br />
                    The concept of VT Partner emerged from a desire to innovate
                    in the transportation sector. Since our inception, we have
                    embraced a spirit of reimagination and adaptation, evolving
                    into a global platform that supports flexible earning
                    opportunities while facilitating the movement of people and
                    goods. We have expanded our services from traditional
                    transportation to include diverse offerings, such as goods
                    delivery, cab services, and vendor solutions.
                    <br />
                    Our commitment to safety is unwavering; we prioritize
                    thorough background checks and real-time verification to
                    ensure a secure experience for all our users. At VT Partner,
                    our journey of innovation is ongoing, continuously evolving
                    to meet the needs of our customers, local communities, and
                    our diverse network of partners.
                  </p>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyCard;
