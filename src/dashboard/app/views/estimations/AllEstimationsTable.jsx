// import React from "react";
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import * as React from "react";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Icon,
  Avatar,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";

import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
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

const AllEstimationsTable = () => {
  const [allEstimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllEstimations = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");
    console.log("token::", token);
    try {
      const response = await axios.post(
        `${serverEndPoint}/all_estimations`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setEstimations(response.data.all_estimations_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllEstimations();
  }, []);

  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  //   const filteredAllEstimations = allEstimations.filter((enquiry) => {
  //     const search = searchTerm.toLowerCase();

  //     // Create a JavaScript Date object from the enquiry's time_at
  //     const enquiryDate = new Date(enquiry.time_at * 1000);

  //     // Check if the date matches the selected date (if a date is selected)
  //     const isDateMatch = selectedDate
  //       ? enquiryDate.toDateString() === selectedDate.format("ddd MMM DD YYYY") // Adjust the format accordingly
  //       : true;

  //     return (
  //       // isDateMatch &&
  //       enquiry.name.toLowerCase().includes(search) ||
  //       enquiry.category_name.toLowerCase().includes(search) ||
  //       enquiry.mobile_no.toLowerCase().includes(search)
  //     );
  //   });

  const filteredAllEstimations = allEstimations.filter((enquiry) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      enquiry.name.toLowerCase().includes(search) ||
      enquiry.category_name.toLowerCase().includes(search) ||
      enquiry.mobile_no.toLowerCase().includes(search);

    // If no date is selected, show results that match the search term
    return matchesSearch;
  });

  // Handle error responses
  const handleError = (error) => {
    console.log(error);
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Other Service Name already assigned.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all Sub Services. Please check your connection."
      );
      setError("Network Error");
    }
    setLoading(false);
  };
  const navigate = useNavigate();

  const goToRegistrationPage = (category) => {
    navigate(
      `/new_registration/${category.enquiry_id}/${category.category_id}/${category.category_name}`,
      { state: { category } }
    );
  };

  const handleDateChange = (date) => setSelectedDate({ ...selectedDate, date });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEstimation, setSelectedEstimation] = useState({
    request_id: "",
    name: "",
  });

  const handleDeleteClick = (enquiry) => {
    setSelectedEstimation(enquiry);
    setOpenDialog(true); // Open confirmation dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEstimation({
      request_id: "",
      name: "",
    });
  };

  const deleteEnquiry = async () => {
    try {
      const response = await axios.post(
        `${serverEndPoint}/delete_estimation`,
        {
          request_id: selectedEstimation.request_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // Reload the table after successful deletion
        toast.success(`${selectedEstimation.name} deleted successfully!`);
        fetchAllEstimations();
      }
    } catch (error) {
      console.error("Error deleting estimation:", error);
      toast.error(`Error deleting ${selectedEstimation.name} `);
    } finally {
      handleCloseDialog(); // Close the dialog
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding={2}
          >
            {/* Search Box */}
            <Box>
              {isSearchOpen ? (
                <TextField
                  label="Search by Name, Mobile No, Service Type"
                  variant="outlined"
                  margin="normal"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    width: "800px",
                    transition: "width 0.3s", // Smooth transition when textfield appears
                  }}
                  InputProps={{
                    startAdornment: (
                      <Icon
                        position="start"
                        sx={{ cursor: "pointer" }}
                        onClick={() => setIsSearchOpen(false)}
                      >
                        search
                      </Icon>
                    ),
                  }}
                />
              ) : (
                <IconButton
                  sx={{ mb: 2 }}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Icon>search</Icon>
                </IconButton>
              )}
            </Box>
            {/* Date Picker */}
            {/* <DatePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 2, width: "100%", height: "100%", mt: 4 }}
                />
              )}
            /> */}
          </Box>
        </LocalizationProvider>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Start Location</TableCell>
              <TableCell align="left">End Location</TableCell>
              <TableCell align="left">Work Description</TableCell>
              {/* <TableCell align="left">City</TableCell> */}
              <TableCell align="left">Service Type</TableCell>
              {/* <TableCell align="left">Vehicle Details</TableCell> */}
              <TableCell align="left">Estimation Done</TableCell>
              <TableCell align="left">Request Type</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAllEstimations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.enquiry_id}>
                  <TableCell align="left">
                    <p>{service.name} </p>
                    <p>{service.mobile_no}</p>
                  </TableCell>
                  <TableCell align="left">{service.start_address}</TableCell>
                  <TableCell align="left">{service.end_address}</TableCell>
                  <TableCell align="left">{service.work_description}</TableCell>
                  {/* <TableCell align="left">{service.city_name}</TableCell> */}
                  <TableCell align="left">
                    {[
                      service.category_name,
                      service.sub_cat_name,
                      service.service_name,
                    ]
                      .filter(Boolean)
                      .join(" / ") || "N/A"}
                  </TableCell>

                  <TableCell align="left">
                    {format(
                      new Date(service.request_time * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>
                  <TableCell align="left">{service.request_type}</TableCell>

                  <TableCell align="center">
                    <Tooltip title="Delete" arrow>
                      <IconButton onClick={() => handleDeleteClick(service)}>
                        <Icon color="error">delete</Icon>
                      </IconButton>
                    </Tooltip>
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
          count={allEstimations.length}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />

        {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Delete Enquiry? From ${selectedEstimation.name}`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this enquiry? This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={deleteEnquiry} color="error" autoFocus>
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default AllEstimationsTable;
