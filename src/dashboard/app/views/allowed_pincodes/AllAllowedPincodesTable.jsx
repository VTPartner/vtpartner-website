/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { format } from "date-fns";
import {
  Box,
  Icon,
  Table,
  Dialog,
  Button,
  TextField,
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
import { useParams } from "react-router-dom";

// Styled Table Component
import { styled } from "@mui/system";
import { serverEndPoint } from "../../constants";
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const AllAllowedPincodesTable = () => {
  const { city_id, city_name } = useParams();
  const [pinCodes, setPinCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all the allowed Pincodes for a particular City
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

  useEffect(() => {
    fetchAllPinCodes();
  }, [currentPage]);

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
      toast.error("Failed to fetch data. Please check your connection.");
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

  // ADD & EDIT PINCODE STATES
  const [openPincodeDialog, setOpenPincodeDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Differentiate between add and edit
  const [selectedPincode, setSelectedPincode] = useState({
    pincode: "",
    pincode_id: "",
    status: 1,
  });
  const [errorPincode, setErrorPincode] = useState({ pincode: false });
  const [btnLoading, setBtnLoading] = useState(false);

  // Open Add New Pincode Dialog
  const showAddNewPinCode = () => {
    setSelectedPincode({ pincode: "", pincode_id: "", status: 1 }); // Reset fields for adding
    setIsEditMode(false);
    setOpenPincodeDialog(true);
  };

  // Open Edit Pincode Dialog
  const handleEditClick = (pincode) => {
    setSelectedPincode({
      pincode: pincode.pincode,
      status: pincode.status,
      pincode_id: pincode.pincode_id,
    });
    setIsEditMode(true);
    setOpenPincodeDialog(true);
  };

  // Close Dialog
  const handleCloseDialog = () => {
    setOpenPincodeDialog(false);
  };

  // Validation Regex for pincode (6 digits only)
  const pincodeRegex = /^[0-9]{6}$/;

  const validatePincode = (pincode) => {
    return pincodeRegex.test(pincode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPincode({ ...selectedPincode, [name]: value });

    if (name === "pincode") {
      const isValid = validatePincode(value);
      setErrorPincode({ ...errorPincode, [name]: !isValid });
    }
  };

  const savePincodeDetails = async () => {
    setBtnLoading(true);

    // Validate pincode
    const newErrors = { pincode: !validatePincode(selectedPincode.pincode) };
    setErrorPincode(newErrors);

    // If validation fails, do not proceed
    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      // Determine if we are in Edit mode or Add mode
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_pincode`
        : `${serverEndPoint}/add_new_pincode`;

      // Prepare request data for both add and edit
      const requestData = {
        city_id, // Pass city_id for both add and edit
        pincode: selectedPincode.pincode,
        pincode_status: selectedPincode.status,
        pincode_id: isEditMode ? selectedPincode.pincode_id : 0, // Pass pincode_id only in edit mode
      };

      // Make the API call
      const response = await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle successful response
      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Pincode updated successfully!"
            : "Pincode added successfully!"
        );
        setOpenPincodeDialog(false); // Close the dialog after success
        setError(null);
        fetchAllPinCodes(currentPage); // Refresh the table with the current page's data
      } else if (response.status === 409) {
        // Handle case where pincode already exists
        toast.error("Pincode already exists.");
      } else {
        toast.error("Failed to save pincode.");
      }
    } catch (error) {
      if (error.status === 409) {
        // Handle case where pincode already exists
        toast.error("Pincode already exists.");
        return;
      }
      toast.error(
        "An error occurred while saving the pincode. Please try again.\n" +
          error
      );
      console.error(error);
    } finally {
      setBtnLoading(false); // Stop loading indicator
    }
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

  return (
    <>
      <Box width="100%" overflow="auto">
        {/* Add PinCode Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={showAddNewPinCode}
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
                    {pincode.status == 0 ? "De-Activated" : "Activated"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditClick(pincode)}>
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

      {/* Modal for Adding or Editing Pincode */}
      <Dialog
        open={openPincodeDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode
              ? `Edit PinCode for ${city_name} City`
              : `Add New PinCode for ${city_name} City`}
          </Typography>

          <TextField
            label="PinCode"
            fullWidth
            margin="normal"
            type="tel"
            name="pincode"
            value={selectedPincode.pincode}
            onChange={handleInputChange}
            required
            error={errorPincode.pincode}
            helperText={
              errorPincode.pincode ? "PinCode must be a 6-digit number." : ""
            }
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={selectedPincode.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value={1}>Activate</MenuItem>
              <MenuItem value={0}>De-Activated</MenuItem>
            </Select>
          </FormControl>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDialog} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              color="primary"
              loading={btnLoading}
              variant="contained"
              onClick={savePincodeDetails}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AllAllowedPincodesTable;
