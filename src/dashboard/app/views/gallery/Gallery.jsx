/* eslint-disable no-unused-vars */
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "/src/dashboard/app/components";

import { useParams } from "react-router-dom";
import GalleryTable from "./GalleryTable";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const Gallery = () => {
  const { category_id, category_name } = useParams();
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Home", path: "/dashboard/home" },
            { name: "Gallery" },
          ]}
        />
      </Box>

      <SimpleCard title={`Gallery Images for [ ${category_name} ]`}>
        <GalleryTable />
      </SimpleCard>
    </Container>
  );
};
export default Gallery;
