/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  RadioGroup,
  Radio,
  Typography,
  List,
  ListItem,
  styled,
  ListItemText,
} from "@mui/material";

const FareEstimateForm = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [contact, setContact] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [requirement, setRequirement] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleSubmit = () => {
    // Handle the fare estimate request submission
    console.log({
      name,
      city,
      pickupLocation,
      dropLocation,
      contact,
      vehicle,
      requirement,
    });
  };

  // Update button enabled state based on form completion
  React.useEffect(() => {
    const isFormComplete =
      name &&
      city &&
      pickupLocation &&
      dropLocation &&
      contact &&
      vehicle &&
      requirement;
    setIsButtonDisabled(!isFormComplete);
  }, [name, city, pickupLocation, dropLocation, contact, vehicle, requirement]);

  const listItems = [
    "0% Delivery Commission",
    "You Can Add Labor As Per Your Requirement",
    "You can mention the dimension of goods",
    "Payment Settlement On Same Day",
    "Transparent Billing System",
    "Lowest Cost Possible",
  ];

  return (
    <Box id="home_form" sx={{ py: 15 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item md={6}>
            <Typography variant="h2">
              <span>Goods &amp; Courier Transport Within The City</span>
            </Typography>
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <TextField
                    fullWidth
                    label="Enter name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select City</InputLabel>
                    <Select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      label="Select City"
                    >
                      <MenuItem value="">Select City</MenuItem>
                      {/* Add city options here */}
                      {[
                        "Bikaner",
                        "Delhi NCR",
                        "Ahmedabad",
                        "Surat",
                        "Indore",
                      ].map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="Enter pickup location"
                    variant="outlined"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    label="Enter drop location"
                    variant="outlined"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    fullWidth
                    label="+91 xxxxx"
                    variant="outlined"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Select Vehicle</InputLabel>
                    <Select
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      label="Select Vehicle"
                    >
                      <MenuItem value="">Select Vehicle</MenuItem>
                      {[
                        "Two Wheeler",
                        "Three Wheeler",
                        "Trucks (mini)",
                        "Packers & Movers",
                        "Enterprise",
                      ].map((vehicle) => (
                        <MenuItem key={vehicle} value={vehicle}>
                          {vehicle}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6}>
                  <RadioGroup
                    row
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                  >
                    <FormControlLabel
                      value="Personal"
                      control={<Radio />}
                      label="Personal"
                    />
                    <FormControlLabel
                      value="Business"
                      control={<Radio />}
                      label="Business"
                    />
                  </RadioGroup>
                </Grid>
                <Grid item md={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                  >
                    Request Fare Estimate
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          {/* <Grid item md={6}>
            <Typography variant="h2">Why To Choose imTransporter</Typography>
            <List>
              {listItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={<span>{`0${index + 1}. ${item}`}</span>}
                  />
                </ListItem>
              ))}
            </List>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};

export default FareEstimateForm;
