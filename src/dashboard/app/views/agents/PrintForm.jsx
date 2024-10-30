/* eslint-disable react/prop-types */
// import React from "react";
import { Box, Typography, Button } from "@mui/material";

const PrintForm = ({ driverDetails }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ padding: 2, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Driver Details
      </Typography>

      {/* Profile Picture with Watermark */}
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          width: "200px",
          height: "200px",
          overflow: "hidden",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <img
          src={driverDetails.profile_pic}
          alt={driverDetails.driver_first_name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <img
          src="/path/to/your/logo.png" // Replace with your logo path
          alt="Watermark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.2, // Adjust opacity for watermark effect
            pointerEvents: "none", // Prevent interaction with watermark
          }}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        Driver Name: {driverDetails.driver_first_name}
      </Typography>
      <Typography variant="body1">
        Driver ID: #{driverDetails.goods_driver_id}
      </Typography>
      <Typography variant="body1">
        Vehicle ID: #{driverDetails.vehicle_id}
      </Typography>
      <Typography variant="body1">
        Mobile No: {driverDetails.mobile_no}
      </Typography>
      <Typography variant="body1">
        Address: {driverDetails.full_address}
      </Typography>
      <Typography variant="h6">Vehicle Details</Typography>
      <Typography variant="body1">
        Vehicle Name: {driverDetails.vehicle_name}
      </Typography>
      <Typography variant="body1">
        Status: {driverDetails.status === 1 ? "Verified" : "Not Verified"}
      </Typography>
      <Typography variant="body1">
        Last Updated: {new Date(driverDetails.time * 1000).toLocaleString()}
      </Typography>

      <Button variant="contained" onClick={handlePrint} sx={{ marginTop: 2 }}>
        Print
      </Button>
    </Box>
  );
};

export default PrintForm;
