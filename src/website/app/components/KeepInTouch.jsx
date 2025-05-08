const KeepInTouch = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto">
        <div className=" mb-6">
          <h2 className="text-3xl font-semibold">Keep up with the latest</h2>
        </div>

        <div className="flex flex-wrap justify-between mt-20">
          {/* Newsroom Section */}
          <div className="flex items-start mb-6 w-full md:w-1/3">
            <img
              src="https://www.uber-assets.com/image/upload/q_auto:eco,c_fill,h_48,w_48/v1542255691/assets/85/aa54ca-6b5b-48d7-82ac-20657ec53f51/original/megaphone-outlined.svg"
              alt="Newsroom Icon"
              className="w-12 h-12 mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">Newsroom</h3>
              <p className="text-gray-600 mb-2">
                Get announcements about partnerships, app updates, initiatives,
                and more near you and around the world.
              </p>
              <a
                href="https://www.uber.com/newsroom/"
                target="_self"
                aria-label="Learn more about newsroom"
                className="text-blue-600 hover:underline hidden"
              >
                Go to Newsroom
              </a>
            </div>
          </div>

          {/* Blog Section */}
          <div className="flex items-start mb-6 w-full md:w-1/3">
            <img
              src="https://www.uber-assets.com/image/upload/q_auto:eco,c_fill,h_48,w_48/v1542250072/assets/b8/ea1bfc-215a-4246-97f2-a7ac03cd67bd/original/person_group-filled.svg"
              alt="Blog Icon"
              className="w-12 h-12 mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">Blog</h3>
              <p className="text-gray-600 mb-2">
                Find new places to explore and learn about KASP products,
                partnerships, and more.
              </p>
              <a
                href=""
                target="_self"
                aria-label="Learn more about the blog"
                className="text-blue-600 hover:underline hidden"
              >
                Read our posts
              </a>
            </div>
          </div>

          {/* Investor Relations Section */}
          <div className="flex items-start mb-6 w-full md:w-1/3">
            <img
              src="https://www.uber-assets.com/image/upload/q_auto:eco,c_fill,h_48,w_48/v1542249793/assets/34/131a8c-392f-44a9-9745-3b8c110502f5/original/network-filled.svg"
              alt="Investor Relations Icon"
              className="w-12 h-12 mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">Investor relations</h3>
              <p className="text-gray-600 mb-2">
                Download financial reports, see next-quarter plans, and read
                about our corporate responsibility initiatives.
              </p>
              <a
                href=""
                target="_self"
                aria-label="Learn about Uber investor relations"
                className="text-blue-600 hover:underline hidden"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeepInTouch;
