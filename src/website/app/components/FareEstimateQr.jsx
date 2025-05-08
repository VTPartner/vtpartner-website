import { Box, Button, Grid } from "@mui/material";

const FareEstimateQr = () => {
  return (
    <div className="flex flex-col items-center p-4 bg-white text-black m-4 rounded-md shadow-md mt-10">
      {/* Heading */}
      <h3 className="text-2xl font-semibold mb-4 font-titillium">
        For more details
      </h3>

      {/* QR Wrapper */}
      <div className="flex flex-col items-center">
        {/* QR Code Container */}
        {/* <div className="relative w-24 h-24 mb-2"> */}
        {/* Text and QR Section */}
        <Grid item xs={12} md={5} spacing={2}>
          <img src="/logo_new.png" alt="logo" loading="lazy" />

          <Box display="flex" mt={3}>
            <Button
              component="a"
              href="https://play.google.com/store/apps/details?id=com.kapstranspvtltd.kaps&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/images/play_store.png"
                alt="Play Store"
                loading="lazy"
              />
            </Button>
            <Button component="a" href="" target="_blank" sx={{ ml: 2 }}>
              <img
                src="/assets/images/app_store.png"
                alt="App Store"
                loading="lazy"
              />
            </Button>
          </Box>
        </Grid>
        {/* Image Placeholder */}
        {/* <img
            alt="Download Porter QR Image"
            src="/assets/website_qr.png"
            className="absolute inset-0 w-full h-full object-cover"
          /> */}
        {/* </div> */}
        {/* Sub-heading */}
        <p className="text-sm text-black-100 mt-10 font-titillium">
          For more details download our app
        </p>
      </div>
    </div>
  );
};

export default FareEstimateQr;
