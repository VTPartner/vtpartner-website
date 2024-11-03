/* eslint-disable react/no-unknown-property */
// import React from "react";
import { Box, Typography, Grid, SvgIcon } from "@mui/material";
import { styles } from "../../../styles";
import { SectionWrapper } from "../hoc";

const WhyChooseUs = () => {
  const services = [
    {
      title: "Affordable Rates",
      description:
        "Get the best deals without compromising on service quality.",
      icon: (
        <SvgIcon>
          <path d="M21.3 9.1C20.7 8.4 19.9 8 19 8H14.4V4.9C14.4 3.3 13.1 2 11.5 2C10.4 2 9.4 2.6 9 3.6L6.7 8H3C2.4 8 2 8.4 2 9V21C2 21.6 2.4 22 3 22H17.7C19.2 22 20.4 20.9 20.7 19.5L22 11.5C22.1 10.6 21.9 9.7 21.3 9.1ZM4 20V10H6.4V20H4ZM18.7 19.2C18.6 19.7 18.2 20 17.7 20H8.4V9.2L10.8 4.4C10.9 4.2 11.2 4 11.5 4C12 4 12.4 4.4 12.4 4.9V9C12.4 9.6 12.8 10 13.4 10H19C19.3 10 19.6 10.1 19.8 10.4C20 10.6 20 10.9 20 11.2L18.7 19.2Z" />
        </SvgIcon>
      ),
    },
    {
      title: "Trusted Professionals",
      description:
        "All our staff are trained and verified for a safe experience.",
      icon: (
        <SvgIcon>
          <path d="M6 11C6 9.34315 7.34315 8 9 8C10.6569 8 12 9.34315 12 11C12 11.9356 11.5717 12.7712 10.9005 13.3213C11.993 13.7278 12.763 14.4978 12.9539 15.5027C13.0054 15.774 12.7761 16 12.5 16H11.5C11.2239 16 10.9754 15.7616 10.7905 15.5564C10.5455 15.2844 10.0334 15 9 15C7.96659 15 7.4545 15.2844 7.20945 15.5564C7.02463 15.7616 6.77614 16 6.5 16H5.5C5.22386 16 4.99457 15.774 5.0461 15.5027C5.23699 14.4978 6.00703 13.7278 7.0995 13.3213C6.42829 12.7712 6 11.9356 6 11ZM9 10C8.44772 10 8 10.4477 8 11C8 11.5523 8.44772 12 9 12C9.55228 12 10 11.5523 10 11C10 10.4477 9.55228 10 9 10Z" />
          <path d="M14 10C14 10.5523 14.4477 11 15 11H17C17.5523 11 18 10.5523 18 10C18 9.44772 17.5523 9 17 9H15C14.4477 9 14 9.44772 14 10Z" />
          <path d="M18 14C18 14.5523 17.5523 15 17 15H15C14.4477 15 14 14.5523 14 14C14 13.4477 14.4477 13 15 13H17C17.5523 13 18 13.4477 18 14Z" />
        </SvgIcon>
      ),
    },
    {
      title: "Reliable Support",
      description:
        "Our dedicated customer support team is always available to assist you.",
      icon: (
        <SvgIcon>
          <path d="M16.5 3C14.0147 3 12 5.01472 12 7.5C12 9.98528 14.0147 12 16.5 12C18.9853 12 21 9.98528 21 7.5C21 5.01472 18.9853 3 16.5 3ZM14 7.5C14 6.11929 15.1193 5 16.5 5C17.8807 5 19 6.11929 19 7.5C19 8.88071 17.8807 10 16.5 10C15.1193 10 14 8.88071 14 7.5Z" />
        </SvgIcon>
      ),
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        textAlign: "center",
        py: 6,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <p className={`${styles.sectionSubText} `}>Who are we</p>
      <Typography
        variant="h2"
        sx={{
          color: "text.primary",
          fontSize: { xs: "36px", md: "64px" },
          fontWeight: "bold",
          fontFamily: "titillium",
          mb: 4,
        }}
      >
        So, why choose <span style={{ color: "#4087e1" }}>us?</span>
      </Typography>

      <Grid container spacing={6} justifyContent="center">
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              textAlign="center"
              sx={{
                backgroundColor: "#EEF2FF", // Light gray background
                borderRadius: 2,
                p: 5,

                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)", // Slight scale-up on hover
                  boxShadow: 3, // Add a soft shadow on hover
                },
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ fontFamily: "titillium" }}
              >
                {service.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontFamily: "titillium" }}
              >
                {service.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SectionWrapper(WhyChooseUs, "");
