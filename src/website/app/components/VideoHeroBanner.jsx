/* eslint-disable no-unused-vars */
import React from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import { styled } from "@mui/system";

const VideoHeroBanner = () => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "50vh", // Video takes 50% height of the viewport
          overflow: "hidden",
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        >
          <source src="/assets/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Content */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff", // Text color
            backgroundColor: "rgba(0, 0, 0, 0.4)", // Overlay with some transparency
          }}
        >
          {/* Centered Text */}
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" }, // Responsive text size
              fontWeight: 600,
              mb: 2,
            }}
          >
            Welcome to Our Service
          </Typography>

          {/* Offset Form */}
        </Box>
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          maxWidth: "30rem",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          backgroundColor: "white",
          mt: "-30px", // Offset the form slightly above
          width: { xs: "100%", sm: "auto" },
          px: 2,
        }}
      >
        <TextField
          label="Your Name"
          variant="outlined"
          sx={{
            backgroundColor: "white", // Ensure form elements have good contrast
            borderRadius: 1,
          }}
        />
        <TextField
          label="Your Email"
          variant="outlined"
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 4, fontWeight: "bold" }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default VideoHeroBanner;
