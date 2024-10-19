/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import { useParams } from "react-router-dom";
import AllAllowedPincodesTable from "./AllAllowedPincodesTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllAllowedPincodes = () => {
  const { cityId } = useParams(); // Get the city ID from the URL
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            {
              name: "All Cities",
              path: "/location_configuration/all_allow_cities",
            },
            { name: "All Allowed PinCodes" },
          ]}
        />
      </Box>

      <SimpleCard title="All PinCodes">
        <AllAllowedPincodesTable cityId />
      </SimpleCard>
    </Container>
  );
};

export default AllAllowedPincodes;
