/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";
import { useParams } from "react-router-dom";
import AllFAQsTable from "./AllFAQsTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AllFAQs = () => {
  const { category_id, category_name } = useParams();
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "All FAQ's" },
          ]}
        />
      </Box>

      <SimpleCard title={`FAQ's for [ ${category_name} ] Service`}>
        <AllFAQsTable />
      </SimpleCard>
    </Container>
  );
};
export default AllFAQs;
