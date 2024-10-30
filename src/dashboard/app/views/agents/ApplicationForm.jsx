/* eslint-disable react/prop-types */
// ApplicationForm.js
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const ApplicationForm = ({ driver }) => {
  return (
    <Box
      sx={{
        border: "2px solid #ccc",
        borderRadius: 2,
        width: "500px",
        padding: "20px",
        margin: "auto",
        backgroundColor: "#fff",
      }}
    >
      <Box display="flex" justifyContent="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Driver Application Form
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar
          src={driver.profile_pic}
          alt={driver.driver_first_name}
          sx={{ width: 80, height: 80 }}
        />
      </Box>

      <Box mb={2}>
        <Typography variant="body1">
          <strong>Driver Name:</strong> {driver.driver_first_name}
        </Typography>
        <Typography variant="body1">
          <strong>Driver ID:</strong> #{driver.goods_driver_id}
        </Typography>
        <Typography variant="body1">
          <strong>Mobile No:</strong> {driver.mobile_no}
        </Typography>
        <Typography variant="body1">
          <strong>Address:</strong> {driver.full_address}
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="body1">
          <strong>Vehicle Name:</strong> {driver.vehicle_name}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong>{" "}
          {driver.status === 1
            ? "Verified"
            : driver.status === 2
            ? "Blocked"
            : driver.status === 3
            ? "Rejected"
            : "Not Verified"}
        </Typography>
      </Box>

      <Box
        mt={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="textSecondary">
          Date: {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Signature: ___________________
        </Typography>
      </Box>
    </Box>
  );
};

export default ApplicationForm;
