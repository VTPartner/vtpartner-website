import { Box, styled, Button } from "@mui/material";
import PaginationTable from "./PaginationTable";
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

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const AllCustomers = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "Customer Settings" },
          ]}
        />
      </Box>
      <StyledButton variant="contained" color="primary">
        Add New Customer
      </StyledButton>
      <SimpleCard title="All Customers">
        <PaginationTable />
      </SimpleCard>
    </Container>
  );
};

export default AllCustomers;
