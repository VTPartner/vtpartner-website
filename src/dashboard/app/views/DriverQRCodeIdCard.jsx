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
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import axios from "axios";
// import QRcode from "qrcode.react";
// Import QRCode
import { serverWebsiteEndPoint } from "../constants";

const DriverQRCodeIdCard = () => {
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
    documentTitle: `Driver_ID_Card_${driver?.driver_first_name}`,
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(componentRef.current, {
      callback: function (doc) {
        doc.save(`Driver_ID_Card_${driver?.driver_first_name}.pdf`);
      },
      margin: [20, 20, 20, 20],
      x: 10,
      y: 10,
      html2canvas: { scale: 0.68 },
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
              maxWidth: 400, // Adjust width to make it look more like an ID card
              border: "1px solid #ddd",
              backgroundColor: "#fdfdfd",
              borderRadius: "10px", // Add rounded corners for an ID card look
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center all content
            }}
          >
            <Typography variant="h5" gutterBottom>
              Driver ID Card
            </Typography>
            <Box display="flex" mb={2}>
              {/* Left: Company Logo */}
              <img
                src="/logo_new.png" // Path to your logo
                alt="Company Logo"
                width={200}
                height={200}
              />
            </Box>
            {/* Driver Details */}

            <Divider sx={{ width: "100%", mb: 2 }} />
            <Avatar
              src={driver.profile_pic}
              //   src={
              //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy4sWWcwWT5nhSoklq10yQVTiuROLMUeZf6RrLy_q0xOxu-LxkyWzmtg8PnSYmLkIvQPM&usqp=CAU"
              //   }
              alt={driver.driver_first_name}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6">
              {driver.driver_first_name} {driver.driver_last_name}
            </Typography>
            <Typography>Driver ID: {`#${driver.goods_driver_id}`}</Typography>
            <Typography>Mobile: {driver.mobile_no}</Typography>
            <Typography>Address: {driver.full_address}</Typography>
            <Divider sx={{ width: "100%", my: 2 }} />
            {/* QR Code */}
            {/* <QRcode
              value={`${serverWebsiteEndPoint}/driver_form_print/${driver.goods_driver_id}`} // URL to scan
              size={80} // Size of the QR code
              style={{ margin: "10px 0" }}
            /> */}
            <Typography variant="caption" align="center">
              Scan to view Driver More Details
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default DriverQRCodeIdCard;
