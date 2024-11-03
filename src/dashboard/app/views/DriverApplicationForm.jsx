/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../constants";
import axios from "axios";

const DriverApplicationForm = () => {
  const { driver_id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  const fetchDriverDetails = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/driver_form_print`,
        { driver_id: driver_id },
        { headers: { "Content-Type": "application/json" } }
      );
      const res = response.data.goods_drivers[0];
      console.log("response:", res);
      setDriver(res);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      toast.error(
        error.response.status === 404
          ? "No Data Found."
          : error.response.status === 409
          ? "Driver Details already assigned."
          : "Internal server error. Please try again later."
      );
    } else {
      toast.error(
        "Failed to fetch Driver Details. Please check your connection."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDriverDetails();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Driver_Application_Form_${driver?.driver_first_name}`,
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(componentRef.current, {
      callback: function (doc) {
        doc.save(`Driver_Application_Form_${driver?.driver_first_name}.pdf`);
      },
      margin: [20, 20, 20, 20],
      x: 10,
      y: 10,
      html2canvas: { scale: 0.68 }, //0.57
    });
  };

  return (
    <Box display="flex" justifyContent="center" mt="10rem">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="end"
            mb={3}
            gap={2}
            sx={{ displayPrint: "none" }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Box>

          <Paper
            ref={componentRef}
            elevation={3}
            sx={{
              position: "relative",
              padding: 4,
              maxWidth: 800,
              width: "100%",
              border: "1px solid #ddd",
              backgroundColor: "#fdfdfd",
            }}
          >
            {/* Show Company details here  with logo , Company name at center and contact no on end and on next line the address
             */}
            <Box display="flex" mb={2}>
              {/* Left: Company Logo */}
              <img
                src="/logo_new.png" // Path to your logo
                alt="Company Logo"
                width={200}
                height={100}
              />

              {/* Center: Company Name and Contact Info */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                flexGrow={1}
              >
                <Typography variant="h5" align="center">
                  VT Partner Trans Private Limited
                </Typography>{" "}
                {/* Company Name */}
                <Typography variant="body1" align="center">
                  Contact: (123) 456-7890
                </Typography>{" "}
                {/* Company Contact No */}
                <Typography variant="body2" align="center">
                  Address: 123 Main St, City, Country
                </Typography>{" "}
                {/* Company Address */}
              </Box>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" mb={3} mt={2}>
              <Box display="flex" flexDirection="column">
                <Typography variant="h4" gutterBottom>
                  Driver Details
                </Typography>
                <Typography>
                  Driver ID: {`#${driver.goods_driver_id}`}
                </Typography>
                <Typography>Name: {driver.driver_first_name}</Typography>
                <Typography>Mobile: {driver.mobile_no}</Typography>
                <Typography>Gender: {driver.gender}</Typography>
                <Typography>Address: {driver.full_address}</Typography>
              </Box>
              <Avatar
                src={driver.profile_pic}
                // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy4sWWcwWT5nhSoklq10yQVTiuROLMUeZf6RrLy_q0xOxu-LxkyWzmtg8PnSYmLkIvQPM&usqp=CAU"
                alt={driver.driver_first_name}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <Divider />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Box display="flex" flexDirection="column">
                <Typography variant="h6">Owner Information</Typography>
                <Typography>Name: {driver.owner_name}</Typography>
                <Typography>Mobile: {driver.owner_mobile_no}</Typography>
                <Typography>Gender: {driver.gender}</Typography>
                <Typography>Address: {driver.owner_address}</Typography>
              </Box>
              <Avatar
                src={driver.owner_photo}
                // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2rQqSyR1xF2AJYlijHJvqb-vhe4EyWSc5ZA&s"
                alt={driver.owner_name}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h6">Vehicle Details</Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  gap={1}
                >
                  <Typography>Vehicle ID: #{driver.vehicle_id}</Typography>
                  <Typography>Vehicle: {driver.vehicle_name}</Typography>
                  <Typography>
                    Vehicle Plate No: {driver.vehicle_plate_no}
                  </Typography>
                </Box>
                <Avatar
                  src={driver.vehicle_plate_image}
                  alt="Vehicle Image"
                  sx={{ width: 100, height: 100, mr: 1 }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="h6">Status</Typography>
              <Typography>
                {driver.status === 1
                  ? "Verified"
                  : driver.status === 2
                  ? "Blocked"
                  : "Not Verified"}
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default DriverApplicationForm;
