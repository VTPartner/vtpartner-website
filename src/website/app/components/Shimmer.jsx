// import React from "react";

const Shimmer = () => {
  const shimmerStyle = {
    width: "100%",
    height: "100%",
    background: "#f6f7f8",
    backgroundImage: `linear-gradient(
      to right,
      #f6f7f8 0%,
      #eaeaea 20%,
      #f6f7f8 40%,
      #f6f7f8 100%
    )`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  return (
    <div style={shimmerStyle}>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Shimmer;
