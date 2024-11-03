// import React from "react";
/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import { useParams } from "react-router-dom";
import AllEstimationsTable from "./AllEstimationsTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllEstimations = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Estimations" },
          ]}
        />
      </Box>

      <SimpleCard title={`Estimations`}>
        <AllEstimationsTable />
      </SimpleCard>
    </Container>
  );
};

export default AllEstimations;
