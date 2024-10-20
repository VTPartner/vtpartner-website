/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import OtherServicesTable from "./OtherServicesTable";
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

const OtherServices = () => {
  const { sub_cat_name } = useParams();
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Other Services" },
          ]}
        />
      </Box>

      <SimpleCard title={`Other Services for [ ${sub_cat_name} ]`}>
        <OtherServicesTable />
      </SimpleCard>
    </Container>
  );
};
export default OtherServices;
