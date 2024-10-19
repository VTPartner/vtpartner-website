/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const JCbDriverEnquiry = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "JCB Driver Enquiries" },
          ]}
        />
      </Box>

      <SimpleCard title="All JCB Drivers"></SimpleCard>
    </Container>
  );
};

export default JCbDriverEnquiry;
