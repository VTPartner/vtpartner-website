// import React from "react";

const VTPartnerAdvantages = () => {
  const advantages = [
    {
      title: "Regular Trips",
      description:
        "With our growing presence across multiple cities, we always have our hands full! This means you will never run out of trips.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/feature_1_f7b50fede5.png",
    },
    {
      title: "Better Earning",
      description:
        "Earn more by partnering with the best! Regular trips and efficient service can grow your earnings!",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/feature_2_adc812619d.png",
    },
    {
      title: "On-Time Payment",
      description:
        "Be assured to receive all payments on time & get the best in class support when you attach a mini truck with VT Partner.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/feature_3_e6d1e49e25.png",
    },
  ];

  return (
    <div className="py-10 bg-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">VT Partner Advantages</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-5">
        {advantages.map((advantage, index) => (
          <div key={index} className="  overflow-hidden w-80 text-center">
            <img
              className="w-full h-40 object-contain"
              src={advantage.imgSrc}
              alt={advantage.title}
            />
            <div className="p-4 mt-5">
              <h3 className="text-xl font-semibold">{advantage.title}</h3>
              <p className="text-gray-600 text-xs mt-4">
                {advantage.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VTPartnerAdvantages;
