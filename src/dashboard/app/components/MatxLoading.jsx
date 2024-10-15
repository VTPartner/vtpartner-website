import { LinearProgress, Box, styled } from "@mui/material";

// STYLED COMPONENT
const StyledLoading = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column", // Ensures vertical stacking of image and progress bar
  "& img": {
    width: "auto",
    height: "auto",
    objectFit: "contain",
  },
  "& .linearProgress": {
    width: "100%", // Full width progress bar
    marginTop: "10px", // Add some space between the image and progress bar
  },
});

export default function Loading() {
  return (
    <StyledLoading>
      <Box position="relative" width="200px">
        <img src="/logo_new.png" alt="Logo" />
        <LinearProgress className="linearProgress" />
      </Box>
    </StyledLoading>
  );
}
