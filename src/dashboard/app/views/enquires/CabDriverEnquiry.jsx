// import React from "react";

/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";


// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const CabDriverEnquiry = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "Cab Driver Enquiries" },
          ]}
        />
      </Box>

      <SimpleCard title="All Cab Drivers"></SimpleCard>
    </Container>
  );
};

export default CabDriverEnquiry;
