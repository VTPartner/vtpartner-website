// import React from 'react';

const AboutServices = () => {
  // const servicesData = [
  //   {
  //     imgSrc: "https://www.olacabs.com/mediaimage/wysiwyg/book-ride.svg",
  //     title: "1 bn+",
  //     description: "Rides served every year",
  //   },
  //   {
  //     imgSrc: "https://www.olacabs.com/mediaimage/wysiwyg/city.svg",
  //     title: "250+",
  //     description:
  //       "Cities serviced by KASP to get you to your destination on time, every time",
  //   },
  //   {
  //     imgSrc: "https://www.olacabs.com/mediaimage/wysiwyg/partner.svg",
  //     title: "1.5 mn",
  //     description: "Empowered entrepreneurs as driver-partners on the platform",
  //   },
  //   {
  //     imgSrc: "https://www.olacabs.com/mediaimage/wysiwyg/employee.svg",
  //     title: "7,000+",
  //     description:
  //       "Employees work tirelessly to provide you with the best in technology and service",
  //   },
  // ];

  const servicesData = [
    {
      imgSrc: "/assets/tie.svg",
      title: "Ms. Tejaswi V Gundewadi",
      description: "Founder & CEO",
    },
  ];
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="sm:text-3xl text-lg font-titillium text-gray-800">
            Our Board Members
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <div className="mb-4">
                <img
                  className="w-16 h-16"
                  src={service.imgSrc}
                  alt={service.title}
                />
              </div>
              <h3 className="text-2xl font-titillium text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutServices;
