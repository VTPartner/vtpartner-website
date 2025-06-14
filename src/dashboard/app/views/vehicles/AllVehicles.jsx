/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import AllVehiclesTable from "./AllVehiclesTable";
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

const AllVehicles = () => {
  const { category_id, category_name } = useParams();
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

      <SimpleCard title={`Vehicles for [ ${category_name} ] Service`}>
        <AllVehiclesTable />
      </SimpleCard>
    </Container>
  );
};

export default AllVehicles;
