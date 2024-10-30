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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";
import { serverEndPoint, serverEndPointImage } from "../../../constants";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const FullAllEnquiriesTable = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllEnquiries = async () => {
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
        `${serverEndPoint}/enquiries_all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setEnquiries(response.data.all_enquiries_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllEnquiries();
  }, []);

  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  //   const filteredEnquiries = enquiries.filter((enquiry) => {
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

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      enquiry.name.toLowerCase().includes(search) ||
      enquiry.category_name.toLowerCase().includes(search) ||
      enquiry.mobile_no.toLowerCase().includes(search);

    if (selectedDate) {
      const enquiryDate = new Date(enquiry.time_at * 1000).toDateString();
      const isDateMatch =
        enquiryDate === selectedDate.format("ddd MMM DD YYYY");
      // Show result if it matches the search term or the selected date
      return matchesSearch || isDateMatch;
    }

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
            <DatePicker
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
            />
          </Box>
        </LocalizationProvider>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Mobile No</TableCell>
              <TableCell align="left">City</TableCell>
              <TableCell align="left">Service Type</TableCell>
              <TableCell align="left">Vehicle Details</TableCell>
              <TableCell align="left">Registration Done</TableCell>
              <TableCell align="left">Source Type</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEnquiries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.enquiry_id}>
                  <TableCell align="left">{service.name}</TableCell>
                  <TableCell align="left">{service.mobile_no}</TableCell>
                  <TableCell align="left">{service.city_name}</TableCell>
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
                    {service.vehicle_name ? service.vehicle_name : "N/A"}
                  </TableCell>
                  <TableCell align="left">
                    {format(
                      new Date(service.time_at * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>
                  <TableCell align="left">{service.source_type}</TableCell>
                  <TableCell align="left">
                    {service.status === 0 ? "Pending" : "Rejected"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Add New Entry" arrow>
                      <IconButton onClick={() => goToRegistrationPage(service)}>
                        <Icon>arrow_forward</Icon>
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
          count={enquiries.length}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Box>
    </>
  );
};

export default FullAllEnquiriesTable;
