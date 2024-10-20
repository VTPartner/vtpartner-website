// import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Box,
} from "@mui/material";

const Gallery = () => {
  const galleryItems = [
    {
      title: "1 Lakh+",
      description: "Families impacted in FY 2020-21",
      imgSrc:
        "https://s3-ap-southeast-1.amazonaws.com/ola-prod-website/womens.png",
    },
    {
      title: "93 Lakh+",
      description: "Meals enabled across India in FY 2020-21",
      imgSrc:
        "https://s3-ap-southeast-1.amazonaws.com/ola-prod-website/donating.png",
    },
    {
      title: "Empowering Women",
      description: "Supporting women empowerment programs",
      imgSrc:
        "https://s3-ap-southeast-1.amazonaws.com/ola-prod-website/mother-son.png",
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* Title */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h5">Making a Difference</Typography>
      </Box>

      {/* Gallery Grid */}
      <Grid container spacing={4}>
        {galleryItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="200"
                image={item.imgSrc}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Button
          variant="contained"
          color="primary"
          href="https://ola.foundation/"
          target="_blank"
        >
          More about Ola Foundation
        </Button>
      </Box>
    </Container>
  );
};

export default Gallery;
