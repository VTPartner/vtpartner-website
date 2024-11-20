/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

import { useParams } from "react-router-dom";
import AllDriversTable from "./AllDriversTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllDrivers = () => {
  return (
    <Container>
      <SimpleCard title={`All Drivers`}>
        <AllDriversTable />
      </SimpleCard>
    </Container>
  );
};
export default AllDrivers;
