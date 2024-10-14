// import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Box } from "@mui/system";

const Registration = () => {
  return (
    <div className="relative w-full h-[70%] sm:mt-5 p-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://dom-website-prod-cdn-cms.porter.in/partner_hero_banner_e5e2c538a5.jpeg"
          alt="Background"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Registration Form Card */}
      <div className="relative z-10 flex items-center justify-end h-full w-full sm:pr-10">
        <Box className="bg-white p-8 shadow-lg rounded-sm w-full max-w-[30rem] max-h-[38rem]">
          <h2 className="text-2xl font-bold mb-4">Registration</h2>

          <form>
            {/* Full Name */}
            <TextField
              fullWidth
              id="name"
              label="Full Name"
              margin="dense"
              variant="outlined"
              className="mb-4"
            />

            {/* Mobile Number */}
            <TextField
              fullWidth
              id="mobile"
              label="Mobile Number"
              type="tel"
              margin="dense"
              variant="outlined"
              className="mb-4"
            />

            {/* City and Vehicle Dropdowns */}
            <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
              <FormControl fullWidth>
                <InputLabel id="city-label">City</InputLabel>
                <Select labelId="city-label" id="city" label="City">
                  <MenuItem value="bangalore">BELAGAVI</MenuItem>
                  <MenuItem value="bangalore">PUNE</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="vehicle-label">Vehicle</InputLabel>
                <Select labelId="vehicle-label" id="vehicle" label="Vehicle">
                  <MenuItem value="2-wheeler">
                    DOST/ PICKUP / SUPER ACE / 8FT
                  </MenuItem>
                  <MenuItem value="2-wheeler">TATA 407 14FT</MenuItem>
                  <MenuItem value="2-wheeler">TATA 407</MenuItem>
                  <MenuItem value="2-wheeler">3 WHEELER</MenuItem>
                  <MenuItem value="2-wheeler">3 WHEELER ELECTRIC</MenuItem>
                  <MenuItem value="4-wheeler">PICKUP 1.7 TON</MenuItem>
                  <MenuItem value="3-wheeler">TATA ACE</MenuItem>
                  <MenuItem value="4-wheeler">E LOADER</MenuItem>
                  <MenuItem value="4-wheeler">OTHERS</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Source Dropdown */}
            <div className="flex mb-4">
              <FormControl fullWidth>
                <InputLabel id="register-label">Register As ?</InputLabel>
                <Select labelId="register-label" id="register" label="Source">
                  <MenuItem value="customer_referral">Goods Driver</MenuItem>
                  <MenuItem value="social_media">Cab Driver</MenuItem>
                  <MenuItem value="social_media">JCB Driver</MenuItem>
                  <MenuItem value="social_media">Crane Driver</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Source Dropdown */}
            <FormControl fullWidth className="mb-6">
              <InputLabel id="source-label">Source</InputLabel>
              <Select labelId="source-label" id="source" label="Source">
                <MenuItem value="customer_referral">Customer Referral</MenuItem>
                <MenuItem value="social_media">Social Media</MenuItem>
              </Select>
            </FormControl>

            {/* Register Button */}
            <div className="flex mt-4">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                Register
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </div>
  );
};

export default Registration;
