/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import AllSubServicesTable from "./AllSubServicesTable";
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

const AllSubServices = () => {
  const { category_id, category_name } = useParams();
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Sub Services" },
          ]}
        />
      </Box>

      <SimpleCard title={`Sub Service for [ ${category_name} ] Service`}>
        <AllSubServicesTable />
      </SimpleCard>
    </Container>
  );
};
export default AllSubServices;
