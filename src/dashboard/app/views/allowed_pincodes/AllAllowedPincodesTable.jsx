/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import {
  serverEndPoint,
  serverEndPointImage,
  serverImageEndPoint,
} from "../../constants";
import {
  Box,
  Icon,
  Table,
  Avatar,
  Dialog,
  Button,
  TextField,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TablePagination,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
import { useParams } from "react-router-dom";

const AllAllowedPincodesTable = () => {
  const { city_id, city_name } = useParams();
  const [pinCodes, setPinCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  //Fetching all the allowed Pincodes for particular City
  const fetchAllPinCodes = async (page = 1) => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endPoint = `${serverEndPoint}/all_allowed_pincodes`;

      const response = await axios.post(
        endPoint,
        { city_id, page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPinCodes(response.data.pincodes);
      setCurrentPage(page); // Update the current page
    } catch (error) {
      setLoading(false);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  //Initializing it here
  useEffect(() => {
    fetchAllPinCodes();
  }, []);

  //ADD NEW PINCODE
  const showAddNewPinCode = () => {
    // setEditedCity({
    //   pincode: "",
    // });
    //setOpenNewPinCodeDialog(true); // Open add city dialog
  };

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      setError("Network Error");
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="auto"
      >
        {/* Check if the error is "No Data Found." */}
        {error === "No Data Found" && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={showAddNewPinCode}
          >
            Add New PinCode
          </Button>
        )}
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }
  return (
    <>
      <Box width="100%" overflow="auto">
        {/* Add PinCode Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          // onClick={showAddNewPinCode}
        >
          Add New PinCode
        </Button>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Pincode</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pinCodes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((pincode, index) => (
                <TableRow key={index}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      {pincode.pincode}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    {format(
                      new Date(pincode.creation_time * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>
                  <TableCell
                    align="left"
                    color={pincode.status == 0 ? "red" : "black"}
                  >
                    {pincode.status == 0 ? "Not Active" : "Active"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <Icon color="primary">edit</Icon>
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
          count={pinCodes.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default AllAllowedPincodesTable;
