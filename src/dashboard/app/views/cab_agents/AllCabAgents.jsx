/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

import { useParams } from "react-router-dom";
import AllCabAgentsTable from "./AllCabAgentsTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllCabAgents = () => {
  return (
    <Container>
      <SimpleCard title={`Cab Drivers`}>
        <AllCabAgentsTable />
      </SimpleCard>
    </Container>
  );
};
export default AllCabAgents;
