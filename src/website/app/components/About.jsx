// About.js
// import React from "react";

const About = () => {
  return (
    <section className="bg-black text-white mb-10 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
        <div className="text-center sm:text-left">
          <h1 className="sm:text-3xl font-bold mb-4">
            Drive when you want, make what you need
          </h1>
          <p className="sm:text-md text-sm mb-6">
            Make money on your schedule with deliveries or rides—or both. You
            can use your own car or choose a rental through Uber.
          </p>
          <div className="flex sm:flex-row flex-col sm:gap-0 gap-4  justify-center sm:justify-start space-x-4 mb-8">
            <a
              href=""
              aria-label="Sign up to drive"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Get started
            </a>
            <a
              href=""
              target="_self"
              aria-label="Already have an account? Sign in"
              className=" hidden border border-blue-500 text-blue-500 font-semibold py-2 px-4 rounded hover:bg-blue-500 hover:text-white transition duration-200"
            >
              Already have an account? Sign in
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_1036,w_1036/v1684855112/assets/96/4dd3d1-94e7-481e-b28c-08d59353b9e0/original/earner-illustra.png"
            alt="Drive when you want with Uber"
            className="max-w-full h-auto sm:max-w-xs md:max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
