/* eslint-disable no-unused-vars */
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Span } from "../../../components/Typography";
import { Breadcrumb, SimpleCard } from "../../../components";
import { useLocation, useParams } from "react-router-dom";
import { PhotoCamera } from "@mui/icons-material";

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const NewRegistration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState({ date: new Date() });
  const [errorNewCity, setAddNewCityErrors] = useState({
    agent_name: false,
    mobile_no: false,
  });
  const [editedData, setEditedData] = useState({
    agent_name: "",
    mobile_no: "",
  });

  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const [aadharCardFront, setAadharCardFront] = useState(null);
  const [aadharCardBack, setAadharCardBack] = useState(null);
  const [panCardFront, setPanCardFront] = useState(null);
  const [panCardBack, setPanCardBack] = useState(null);
  const [agentPhoto, setAgentPhoto] = useState(null);
  const [ownerPhoto, setOwnerPhoto] = useState(null);

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event) => {
    // console.log("submitted");
    // console.log(event);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => {
      const newData = {
        ...prevData,
        [name]: value,
      };
      console.log("Updated State:", newData); // Check updated state
      return newData;
    });
  };

  // STYLED COMPONENTS
  const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
      marginBottom: "30px",
      [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
  }));
  const { enquiry_id, category_id, category_name } = useParams();
  const location = useLocation();
  const { category } = location.state || {};
  const handleFileChange = (event) => {
    // Your existing handleChange logic
    console.log(event.target.name, event.target.files[0]);
  };

  const stepsService = ["Agent Details", "Documents", "Address Details"];
  const stepsDelivery = [
    "Agent Details",
    "Documents",
    "Address Details",
    "Owner Details",
    "Vehicle Details",
  ];

  return (
    <>
      <Container>
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: "Home", path: "/dashboard/home" },
              {
                name: `Enquiry for [ ${category.category_name} ] Service `,
              },
            ]}
          />
        </Box>
        <SimpleCard
          title={`Add New [ ${category.category_name} ] ${
            category.category_type === "Delivery"
              ? "Driver Agent"
              : "Service Agent"
          }`}
        >
          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Box margin={5}>
              <Stepper activeStep={activeStep}>
                {(category.category_type === "Delivery"
                  ? stepsDelivery
                  : stepsService
                ).map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === 0 && (
                <Grid container spacing={6} padding={5}>
                  <Grid item xs={12}>
                    {/* Agent Photo */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="agentPhoto"
                        type="file"
                        onChange={(e) => handleImageChange(e, setAgentPhoto)}
                      />
                      <label htmlFor="agentPhoto">
                        {" "}
                        {/* Changed from licenseBack to agentPhoto */}
                        <Avatar
                          src={agentPhoto || ""}
                          alt="Agent Photo"
                          sx={{
                            width: 100,
                            height: 100,
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                          }}
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption" textAlign={"center"}>
                          Agent Photo
                        </Typography>
                      </label>
                    </Box>

                    {/* Agent Name TextField */}
                    <TextField
                      label="Agent Name"
                      fullWidth
                      margin="normal"
                      name="agent_name"
                      value={editedData.agent_name}
                      onChange={handleChange} // Ensure this is connected correctly
                      required
                      error={errorNewCity.agent_name}
                      helperText={
                        errorNewCity.agent_name ? "Agent name is required." : ""
                      }
                      inputProps={{
                        autoComplete: "off",
                      }}
                    />
                    <TextField
                      type="text"
                      name="mobile_no"
                      label="Mobile Number"
                      value={editedData.mobile_no || ""}
                      required
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <RadioGroup
                      row
                      name="gender"
                      sx={{ mb: 2 }}
                      value={""}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Male"
                        label="Male"
                        labelPlacement="end"
                        control={<Radio color="secondary" />}
                      />

                      <FormControlLabel
                        value="Female"
                        label="Female"
                        labelPlacement="end"
                        control={<Radio color="secondary" />}
                      />

                      <FormControlLabel
                        value="Others"
                        label="Others"
                        labelPlacement="end"
                        control={<Radio color="secondary" />}
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container spacing={6} padding={5}>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="aadharNo"
                      label="Aadhar Card No"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <TextField
                      type="text"
                      name="panCardNo"
                      label="PAN Card No"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <Box display={"flex"} justifyContent={"space-between"}>
                      {/* Aadhar Card Front Photo */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding={4}
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          type="file"
                          onChange={(e) =>
                            handleImageChange(e, setAadharCardFront)
                          }
                        />
                        <label htmlFor="licenseBack">
                          <Avatar
                            src={aadharCardFront || ""}
                            alt="Driving License Back"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("licenseBack").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Aadhar Card Front
                          </Typography>
                        </label>
                      </Box>
                      {/* Aadhar Card Back Photo */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding={4}
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="licenseBack"
                          type="file"
                          onChange={(e) =>
                            handleImageChange(e, setAadharCardBack)
                          }
                        />
                        <label htmlFor="licenseBack">
                          <Avatar
                            src={aadharCardBack || ""}
                            alt="Driving License Back"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("licenseBack").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Aadhar Card Back
                          </Typography>
                        </label>
                      </Box>
                      {/* Pan  Card Front Photo */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding={4}
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="licenseBack"
                          type="file"
                          onChange={(e) =>
                            handleImageChange(e, setPanCardFront)
                          }
                        />
                        <label htmlFor="licenseBack">
                          <Avatar
                            src={panCardFront || ""}
                            alt="Driving License Back"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("licenseBack").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Pan Card Card Front
                          </Typography>
                        </label>
                      </Box>
                      {/* Pan  Card Back Photo */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding={4}
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="licenseBack"
                          type="file"
                          onChange={(e) => handleImageChange(e, setPanCardBack)}
                        />
                        <label htmlFor="licenseBack">
                          <Avatar
                            src={panCardBack || ""}
                            alt="Driving License Back"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("licenseBack").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Pan Card Card Back
                          </Typography>
                        </label>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
                <Grid container spacing={6} padding={5}>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="fullAddress"
                      label="Agents Full Address"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </Grid>
                </Grid>
              )}

              {category.category_type === "Delivery" && activeStep === 3 && (
                <Grid container spacing={6} padding={5}>
                  <Grid item xs={12}>
                    {/* Owner Photo */}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      padding={4}
                    >
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="licenseBack"
                        type="file"
                        onChange={(e) => handleImageChange(e, setOwnerPhoto)}
                      />
                      <label htmlFor="licenseBack">
                        <Avatar
                          src={ownerPhoto || ""}
                          alt="Driving License Back"
                          sx={{
                            width: 100,
                            height: 100,
                            mb: 2,
                            border: "2px solid #ccc",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            document.getElementById("licenseBack").click()
                          }
                        >
                          <PhotoCamera />
                        </Avatar>
                        <Typography variant="caption">Owner Photo</Typography>
                      </label>
                    </Box>
                    <TextField
                      type="text"
                      name="ownerName"
                      label="Owner Name"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />

                    <TextField
                      type="text"
                      name="ownerAddress"
                      label="Owner Full Address"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                  </Grid>
                </Grid>
              )}

              {category.category_type === "Delivery" && activeStep === 4 && (
                <Grid container spacing={6} padding={5}>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="drivingLicense"
                      label="Driving License No"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <TextField
                      type="text"
                      name="vehicleNumber"
                      label="Vehicle Number"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <TextField
                      type="text"
                      name="rcNo"
                      label="RC No"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <TextField
                      type="text"
                      name="insuranceNo"
                      label="Insurance No"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <TextField
                      type="text"
                      name="noc"
                      label="NOC"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: 4,
                      }}
                    >
                      {/* <TextField
                        type="file"
                        name="licenseFront"
                        onChange={handleChange}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                      <TextField
                        type="file"
                        name="licenseBack"
                        label="Driving License Back Image"
                        onChange={handleChange}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      /> */}
                      {/* Driving License Back Image */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="licenseBack"
                          type="file"
                          onChange={(e) => handleImageChange(e, setLicenseBack)}
                        />
                        <label htmlFor="licenseBack">
                          <Avatar
                            src={licenseBack || ""}
                            alt="Driving License Back"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("licenseBack").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Driving License Back
                          </Typography>
                        </label>
                      </Box>

                      {/* Vehicle Image */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="vehicleImage"
                          type="file"
                          onChange={(e) =>
                            handleImageChange(e, setVehicleImage)
                          }
                        />
                        <label htmlFor="vehicleImage">
                          <Avatar
                            src={vehicleImage || ""}
                            alt="Vehicle Image"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("vehicleImage").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Upload Vehicle Image
                          </Typography>
                        </label>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="licenseFront"
                          type="file"
                          onChange={(e) =>
                            handleImageChange(e, setLicenseFront)
                          }
                        />
                        <label htmlFor="licenseFront">
                          <Avatar
                            src={licenseFront || ""}
                            alt="Driving License Front"
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 2,
                              border: "2px solid #ccc",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              document.getElementById("licenseFront").click()
                            }
                          >
                            <PhotoCamera />
                          </Avatar>
                          <Typography variant="caption">
                            Driving License Front
                          </Typography>
                        </label>
                      </Box>
                    </Box>
                    {/* <TextField
                      type="file"
                      name="vehicleImage"
                      label="Upload Vehicle Image"
                      onChange={handleChange}
                      validators={["required"]}
                      errorMessages={["this field is required"]}
                    /> */}
                  </Grid>
                </Grid>
              )}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    activeStep ===
                    (category.category_type === "Delivery" ? 4 : 2)
                      ? handleSubmit
                      : handleNext
                  }
                >
                  {activeStep ===
                  (category.category_type === "Delivery" ? 4 : 2)
                    ? "Submit"
                    : "Next"}
                </Button>
              </Box>
            </Box>
          </ValidatorForm>
        </SimpleCard>
      </Container>
    </>
  );
};

export default NewRegistration;
