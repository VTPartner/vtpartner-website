/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

import { useParams } from "react-router-dom";
import AllCraneDriversTable from "./AllCraneDriversTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllCraneDrivers = () => {
  return (
    <Container>
      <SimpleCard title={`JCB & Crane Drivers`}>
        <AllCraneDriversTable />
      </SimpleCard>
    </Container>
  );
};
export default AllCraneDrivers;
