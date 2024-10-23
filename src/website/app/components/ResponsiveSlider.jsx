/* eslint-disable react-hooks/rules-of-hooks */
// import React from 'react';
import { Box, Typography } from "@mui/material";
import "swiper/css";

import { Swiper, SwiperSlide } from "swiper/react";

const sliderData = [
  {
    id: 1,
    label: "Responsive & Retina Ready",
    image: "https://via.placeholder.com/150",
  },
  { id: 2, label: "SEO Optimized", image: "https://via.placeholder.com/150" },
  { id: 3, label: "eCommerce Ready", image: "https://via.placeholder.com/150" },
  {
    id: 4,
    label: "Zoom Integration",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    label: "Instructor Dashboard",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 6,
    label: "Student Dashboard",
    image: "https://via.placeholder.com/150",
  },
];

const ResponsiveSlider = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        margin: "5px auto",
        padding: "40px",
      }}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        autoplay={{ delay: 100 }}
        loop={true}
        breakpoints={{
          // When window width is >= 320px
          320: { slidesPerView: 1, spaceBetween: 10 },
          // When window width is >= 768px
          768: { slidesPerView: 2, spaceBetween: 15 },
          // When window width is >= 1200px
          1200: { slidesPerView: 3, spaceBetween: 20 },
        }}
      >
        {sliderData.map((item) => (
          <SwiperSlide key={item.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={item.image}
                alt={item.label}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "16px 16px 0 0",
                }}
              />
              <Box sx={{ padding: "16px", textAlign: "center" }}>
                <Typography variant="h6">{item.label}</Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ResponsiveSlider;
