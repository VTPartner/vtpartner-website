/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import AllServicesTable from "./AllServicesTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllServices = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Services" },
          ]}
        />
      </Box>

      <SimpleCard title="Services">
        <AllServicesTable />
      </SimpleCard>
    </Container>
  );
};
export default AllServices;
