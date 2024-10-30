/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import { serverEndPoint } from "../../constants";
import {
  Box,
  Icon,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import axios from "axios";
import useAuth from "/src/dashboard/app/hooks/useAuth";

// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const BranchTable = () => {
  const [branches, setBranches] = useState([]); // State to store fetched branches
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for handling errors
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user } = useAuth();

  // Fetch branches when the component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Read the token from cookies
        const token = Cookies.get("authToken");

        const endPoint = serverEndPoint + "/all_branches";
        console.log("endPoint::", endPoint);

        const response = await axios.post(
          endPoint,
          {
            admin_id: user.id, // Replace with dynamic admin_id or fetch from context if needed
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        const data = response.data.branches;
        console.log("data::", data[0]);
        setBranches(data); // Store branches data
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        setError("Failed to fetch branches");
        setLoading(false); // Stop loading on error
      }
    };

    fetchBranches();
  }, []);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBranchSelect = (branchId,city_id) => {
    Cookies.set("selectedBranchId", branchId, { expires: 1 }); // Save selected branch ID in cookies for 1 day
    Cookies.set("city_id",city_id)
  };

  // Render loading spinner
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Render error message
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">Branch Name</TableCell>
            <TableCell align="left">Location</TableCell>
            <TableCell align="center">Creation Date</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {branches
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((branch, index) => (
              <TableRow key={index}>
                <TableCell align="left">{branch.branch_name}</TableCell>
                <TableCell align="left">{branch.location}</TableCell>
                <TableCell align="center">
                  {format(
                    new Date(branch.creation_time * 1000),
                    "MM/dd/yyyy, hh:mm:ss a"
                  )}
                </TableCell>

                <TableCell align="center">
                  {branch.branch_status || "Open"}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleBranchSelect(branch.branch_id,branch.city_id)} // Save branch ID before navigating
                  >
                    <NavLink to={`/dashboard/home/`}>
                      <Icon color="primary">arrow_forward</Icon>
                    </NavLink>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={branches.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
};

export default BranchTable;
