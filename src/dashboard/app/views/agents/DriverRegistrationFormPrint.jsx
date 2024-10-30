/* eslint-disable react/prop-types */
// import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const PrintDriverRegistration = ({ service }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${service.category_name} Registration Form</title>
                    <style>
                        @media print {
                            @page {
                                size: A4;
                                margin: 20mm;
                            }
                            body {
                                -webkit-print-color-adjust: exact;
                            }
                        }
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            text-align: center;
                            font-weight: bold;
                        }
                        .driver-details {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 20px;
                        }
                        .driver-details img {
                            border-radius: 10%;
                            width: 100px;
                            height: 100px;
                        }
                        .label-container {
                            border-bottom: 1px solid #ccc;
                            padding: 1px;
                            display: flex;
                            gap: 1rem;
                            align-items: center;
                            margin-bottom: 5px;
                        }
                        label {
                            font-size: 12px;
                            display: block;
                            margin-bottom: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>${service.category_name} REGISTRATION FORM</h1>
                        <div class="driver-details">
                            <img src="${
                              service.profile_pic
                            }" alt="Profile Picture">
                        </div>
                        <div class="label-container">
                            <label>Driver ID:</label>
                            <span>${service.goods_driver_id || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Name:</label>
                            <span>${service.name || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Father's Name:</label>
                            <span>${service.fathersName || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Mother's Name:</label>
                            <span>${service.mothersName || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Aadhar Card No.:</label>
                            <span>${service.aadharCardNo || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Date of Birth:</label>
                            <span>${service.dateOfBirth || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Phone:</label>
                            <span>${service.phone || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Place of Birth:</label>
                            <span>${service.placeOfBirth || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>City:</label>
                            <span>${service.city_name || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>State:</label>
                            <span>${service.state || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Physical Problems/Disability (if any):</label>
                            <span>${service.physicalProblems || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>Name of School:</label>
                            <span>${service.schoolName || ""}</span>
                        </div>
                        <div class="label-container">
                            <label>UNDERTAKING:</label>
                            <span>${service.undertaking || ""}</span>
                        </div>
                    </div>
                </body>
                </html>
            `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Box sx={{ padding: 3, border: "1px solid #ccc", boxShadow: 2 }}>
      <Typography variant="h4" align="center">
        {service.category_name} REGISTRATION FORM
      </Typography>
      <Box display="flex" justifyContent="center" mb={2}>
        <img
          src={service.profile_pic}
          alt="Profile"
          style={{ borderRadius: "10%", width: "100px", height: "100px" }}
        />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Driver ID:</label>
            <span>{service.goods_driver_id || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Name:</label>
            <span>{service.name || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Fathers Name:</label>
            <span>{service.fathersName || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Mothers Name:</label>
            <span>{service.mothersName || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Aadhar Card No.:</label>
            <span>{service.aadharCardNo || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Date of Birth:</label>
            <span>{service.dateOfBirth || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Phone:</label>
            <span>{service.phone || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Place of Birth:</label>
            <span>{service.placeOfBirth || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>City:</label>
            <span>{service.city_name || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>State:</label>
            <span>{service.state || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Physical Problems/Disability (if any):</label>
            <span>{service.physicalProblems || ""}</span>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="label-container">
            <label>Name of School:</label>
            <span>{service.schoolName || ""}</span>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className="label-container">
            <label>UNDERTAKING:</label>
            <span>{service.undertaking || ""}</span>
          </div>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ marginTop: 2 }}
      >
        Print
      </Button>
    </Box>
  );
};

export default PrintDriverRegistration;
