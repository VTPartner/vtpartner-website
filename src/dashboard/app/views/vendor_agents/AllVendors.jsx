/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

import { useParams } from "react-router-dom";
import AllVendorsTable from "./AllVendorsTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllVendors = () => {
  return (
    <Container>
      <SimpleCard title={`All Handy Mans`}>
        <AllVendorsTable />
      </SimpleCard>
    </Container>
  );
};
export default AllVendors;
