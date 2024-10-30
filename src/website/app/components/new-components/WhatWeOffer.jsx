// import React from 'react';
import { Container, Grid, Paper, Typography } from "@mui/material";
import { FcSafe } from "react-icons/fc";
import { SpatialTracking } from "@mui/icons-material";
import { CiDeliveryTruck } from "react-icons/ci";

import { MdPriceCheck } from "react-icons/md";

const services = [
  {
    title: "Trusted and Secure Truck",
    image: FcSafe,
    description:
      "Choose our trusted and secure truck services for your relocation needs. With our reliable packers and movers, your belongings are handled with the utmost care, ensuring a safe and smooth move.",
  },
  {
    title: "Live Tracking",
    image: SpatialTracking,
    description:
      "Stay informed with our live tracking feature. Our packers and movers provide real-time updates on your truck's location, ensuring transparency and peace of mind throughout your move.",
  },
  {
    title: "Easy Truck Rental",
    image: CiDeliveryTruck,
    description:
      "Experience hassle-free truck rental with our easy booking process. Our packers and movers offer convenient solutions to meet your relocation needs, making the entire process seamless and efficient.",
  },
  {
    title: "Affordable and Transparent Pricing",
    image: MdPriceCheck,
    description:
      "Benefit from our affordable and transparent pricing for all your moving needs. Our packers and movers provide clear, upfront costs with no hidden fees, ensuring a budget-friendly and honest service.",
  },
];

const WhatWeOffer = () => {
  return (
    <section id="feature">
      <Container>
        <Grid container spacing={5} marginTop={2}>
          <Grid item xs={12} textAlign="center">
            <Typography
              variant="h2"
              gutterBottom
              mb={5}
              style={{ color: "#0072ce" }}
              sx={{ fontWeight: "bold" }}
            >
              What We Offer
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid
              item
              lg={3}
              md={6}
              sm={6}
              xs={12}
              key={index}
              textAlign="center"
            >
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">{service.title}</Typography>
                <div>
                  <img
                    src={service.image}
                    alt={service.title}
                    style={{ width: "60px", height: "60px" }}
                  />
                </div>
                <Typography variant="body1">{service.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default WhatWeOffer;
