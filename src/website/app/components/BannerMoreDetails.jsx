import { NavLink } from "react-router-dom";

const BannerMoreDetails = () => {
  return (
    <div
      className="relative bg-cover bg-center block pt-20 pb-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1717126476861-25a064d81996?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Replace with your image URL
      }}
    >
      <section className="py-8 bg-white bg-opacity-75">
        <div className="container mx-auto">
          <div className="block">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Welcome to VT Partner</h1>
              <p className="text-gray-700 mb-6">
                At VT Partner, we are dedicated to delivering exceptional
                service across all our offerings, ensuring a hassle-free
                experience for our customers in goods delivery, transportation,
                and essential vendor services.
              </p>
            </div>
            <div className="flex justify-center">
              <NavLink
                to="/"
                aria-label="Dara's letter"
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              >
                Get Started
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BannerMoreDetails;
