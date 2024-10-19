/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import VehiclePricesTable from "./VehiclePricesTable";
import { useParams } from "react-router-dom";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const VehiclePrices = () => {
  const { vehicle_id, vehicle_name } = useParams();
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "Vehicle Prices" },
          ]}
        />
      </Box>

      <SimpleCard title={`Price as per City for [ ${vehicle_name} ]`}>
        <VehiclePricesTable />
      </SimpleCard>
    </Container>
  );
};

export default VehiclePrices;
