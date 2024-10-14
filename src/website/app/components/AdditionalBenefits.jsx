// import React from "react";

const AdditionalBenefits = () => {
  const benefits = [
    {
      title: "Health Care Assistance",
      description:
        "Get healthcare benefits for you and your family with mini truck attachment.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/benefits_1_bc50a88fc4.png",
    },
    {
      title: "Insurance",
      description:
        "Save money with reduced annual maintenance and insurance costs on your vehicle.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/benefits_2_9b224ae237.png",
    },
    {
      title: "Fuel Card for Savings",
      description:
        "Save big on fuel costs with our smart fuel card and increase your profit margins!",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/benefits_3_b470056793.png",
    },
    {
      title: "Discount on Vehicle Purchase",
      description:
        "Get major discounts on purchase of new vehicles. Add to your fleet and grow your business!",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/benefits_4_e0e6a4209c.png",
    },
  ];

  return (
    <div className="py-10 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Additional Benefits</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-10">
        {benefits.map((benefit, index) => (
          <div key={index} className="overflow-hidden w-80 text-center">
            <img
              className="w-full h-40 object-contain"
              src={benefit.imgSrc}
              alt={benefit.title}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="text-gray-600 text-xs mt-4">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalBenefits;
