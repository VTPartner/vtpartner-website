/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import { useParams } from "react-router-dom";
import AllEnquiriesTable from "./AllEnquiriesTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllEnquiries = () => {
  const { category_id, category_name } = useParams();
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All Enquiries" },
          ]}
        />
      </Box>

      <SimpleCard title={`Enquiry for [ ${category_name} ] Service`}>
        <AllEnquiriesTable />
      </SimpleCard>
    </Container>
  );
};

export default AllEnquiries;
