// import React from "react";
/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import { useParams } from "react-router-dom";
import FullAllEnquiriesTable from "./FullAllEnquiriesTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const FullAllEnquiries = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Enquiries" },
          ]}
        />
      </Box>

      <SimpleCard title={`Enquiries`}>
        <FullAllEnquiriesTable />
      </SimpleCard>
    </Container>
  );
};

export default FullAllEnquiries;
