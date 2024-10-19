/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import AllVehiclesTable from "./AllVehiclesTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllVehicles = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Vehicles" },
          ]}
        />
      </Box>

      <SimpleCard title="Vehicles">
        <AllVehiclesTable />
      </SimpleCard>
    </Container>
  );
};

export default AllVehicles;
