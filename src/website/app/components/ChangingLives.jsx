// import React from "react";

const ChangingLives = () => {
  const testimonials = [
    {
      name: "Krishna",
      location: "Hyderabad",
      description:
        "Getting business at vehicle stand has become very tough today due to intense competition. But with KASP's partner driver app, transparent fare structure and standard pricing, my life has become easier. Now I don't worry about finding customers and getting payments.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/testimonial_1_8da683159d.png",
    },
    {
      name: "Umesh",
      location: "Bangalore",
      description:
        "Earlier there were many restrictions on earnings because I got limited trips in market which were only from my known customers and to nearby places. I gave my truck on rent with KASP there are no such restrictions, there are a lot of orders throughout the city. I enjoy being a part of the KASP family.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/testimonial_2_48f5b79f50.png",
    },
    {
      name: "Birju",
      location: "Chennai",
      description:
        "I was new to Chennai and went ahead to attach my tata ace with KASP. KASP app's inbuilt map and navigational capability never made me feel new to the city. Payment is done on time and their vendor helpdesk provides immediate solutions to all my issues.",
      imgSrc:
        "https://dom-website-prod-cdn-cms.porter.in/testimonial_3_c0bfc6bc11.png",
    },
  ];

  return (
    <div className="py-16 bg-primary">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-titillium text-white">
          CHANGING LIFE OF PEOPLE
        </h1>
      </div>
      <div className="overflow-hidden">
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-tertiary rounded-lg shadow-md overflow-hidden w-80"
            >
              <div className="flex p-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={testimonial.imgSrc}
                    alt={testimonial.name}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-lg font-semibold text-secondary">
                    {testimonial.name}
                  </div>
                  <div className="text-white">{testimonial.location}</div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-secondary">{testimonial.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChangingLives;
