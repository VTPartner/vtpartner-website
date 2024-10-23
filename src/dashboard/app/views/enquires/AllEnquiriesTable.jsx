// import React from "react";
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
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
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";
import { serverEndPoint, serverEndPointImage } from "../../constants";
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

const AllEnquiriesTable = () => {
  const { category_id, category_name } = useParams();
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

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_enquiries`,
        {
          category_id: category_id,
        }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  // Handle error responses
  const handleError = (error) => {
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
            </TableRow>
          </TableHead>
          <TableBody>
            {enquiries
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
                    {service.status === 0 ? "Not Assigned" : "Assigned"}
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

export default AllEnquiriesTable;
