/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

import { useParams } from "react-router-dom";
import AllGoodsDriversTable from "./AllGoodsDriversTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllGoodsDrivers = () => {
  return (
    <Container>
      <SimpleCard title={`Goods Drivers`}>
        <AllGoodsDriversTable />
      </SimpleCard>
    </Container>
  );
};
export default AllGoodsDrivers;
