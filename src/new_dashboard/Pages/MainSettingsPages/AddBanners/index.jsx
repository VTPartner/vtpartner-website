import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import {
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  Icon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

import Loader from "../../../Components/Loader";
import {
  serverEndPoint,
  serverEndPointImage,
} from "../../../../dashboard/app/constants";

const BannersPage = () => {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [selectedBanner, setSelectedBanner] = useState({
    banner_id: "",
    banner_title: "",
    banner_description: "",
    banner_image: "",
    banner_type: "banner", // default value
    start_date: "",
    end_date: "",
    status: 1,
  });

  const [errors, setErrors] = useState({
    banner_title: false,
    banner_image: false,
    banner_type: false,
    start_date: false,
    end_date: false,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_all_banners`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBanners(response.data.banners);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      toast.error(error.response.data.message || "An error occurred");
    } else {
      toast.error("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setSelectedBanner({
      banner_id: "",
      banner_title: "",
      banner_description: "",
      banner_image: "",
      banner_type: "banner",
      start_date: "",
      end_date: "",
      status: 1,
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (banner) => {
    setSelectedBanner({
      ...banner,
      start_date: banner.start_date.split("T")[0],
      end_date: banner.end_date.split("T")[0],
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (banner) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          `${serverEndPoint}/delete_banner`,
          { banner_id: banner.banner_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Banner deleted successfully");
          fetchBanners();
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBanner((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      setImageFile(file);
    }
  };

  const saveBannerDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      banner_title: !selectedBanner.banner_title,
      banner_type: !selectedBanner.banner_type,
      start_date: !selectedBanner.start_date,
      end_date: !selectedBanner.end_date,
      banner_image: !imageFile && !selectedBanner.banner_image,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill all required fields");
      setBtnLoading(false);
      return;
    }

    try {
      let bannerImageUrl = selectedBanner.banner_image;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResponse = await axios.post(
          `${serverEndPointImage}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        bannerImageUrl = uploadResponse.data.image_url;
      }

      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_banner`
        : `${serverEndPoint}/add_banner`;

      const response = await axios.post(
        endpoint,
        {
          ...selectedBanner,
          banner_image: bannerImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Banner updated successfully!"
            : "Banner added successfully!"
        );
        fetchBanners();
        setOpenDialog(false);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container fluid>
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Banners & Offers</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <Box display="flex" justifyContent="flex-end" mb={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                >
                  Add New Banner
                </Button>
              </Box>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((banner) => (
                      <tr key={banner.banner_id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={banner.banner_image}
                              alt={banner.banner_title}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                marginRight: 10,
                                borderRadius: 8,
                              }}
                            />
                            <div>
                              <h6 className="mb-0">{banner.banner_title}</h6>
                              <small>{banner.banner_description}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              banner.banner_type === "offer"
                                ? "warning"
                                : "info"
                            }`}
                          >
                            {banner.banner_type}
                          </span>
                        </td>
                        <td>
                          {format(new Date(banner.start_date), "dd MMM yyyy")} -
                          <br />
                          {format(new Date(banner.end_date), "dd MMM yyyy")}
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              banner.status === 1 ? "success" : "danger"
                            }`}
                          >
                            {banner.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <IconButton onClick={() => handleEditClick(banner)}>
                            <Icon color="primary">edit</Icon>
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(banner)}>
                            <Icon color="error">delete</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Banner" : "Add New Banner"}
          </Typography>

          {selectedBanner.banner_image && (
            <Box mb={2}>
              <img
                src={selectedBanner.banner_image}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 200,
                  objectFit: "contain",
                }}
              />
            </Box>
          )}

          <TextField
            label="Banner Title"
            fullWidth
            margin="normal"
            name="banner_title"
            value={selectedBanner.banner_title}
            onChange={handleInputChange}
            error={errors.banner_title}
            helperText={errors.banner_title ? "Title is required" : ""}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            name="banner_description"
            value={selectedBanner.banner_description}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <Select
              name="banner_type"
              value={selectedBanner.banner_type}
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem value="banner">Banner</MenuItem>
              <MenuItem value="offer">Offer</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="date"
            label="Start Date"
            fullWidth
            margin="normal"
            name="start_date"
            value={selectedBanner.start_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={errors.start_date}
            helperText={errors.start_date ? "Start date is required" : ""}
          />

          <TextField
            type="date"
            label="End Date"
            fullWidth
            margin="normal"
            name="end_date"
            value={selectedBanner.end_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={errors.end_date}
            helperText={errors.end_date ? "End date is required" : ""}
          />

          <TextField
            type="file"
            fullWidth
            margin="normal"
            onChange={handleImageChange}
            error={errors.banner_image}
            helperText={errors.banner_image ? "Image is required" : ""}
          />

          {isEditMode && (
            <FormControl fullWidth margin="normal">
              <Select
                name="status"
                value={selectedBanner.status}
                onChange={handleInputChange}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </Select>
            </FormControl>
          )}

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setOpenDialog(false)}
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={btnLoading}
              variant="contained"
              color="primary"
              onClick={saveBannerDetails}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default BannersPage;
