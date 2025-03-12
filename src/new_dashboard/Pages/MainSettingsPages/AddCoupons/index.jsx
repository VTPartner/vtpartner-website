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
  InputLabel,
  Pagination,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

import Loader from "../../../Components/Loader";
import { serverEndPoint } from "../../../../dashboard/app/constants";

const CouponsPage = () => {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCoupon, setSelectedCoupon] = useState({
    coupon_id: "",
    coupon_code: "",
    coupon_title: "",
    coupon_description: "",
    category_id: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_value: "0",
    max_discount: "0",
    usage_limit: "0",
    start_date: "",
    end_date: "",
    status: 1,
  });

  const [errors, setErrors] = useState({
    coupon_code: false,
    coupon_title: false,
    category_id: false,
    discount_type: false,
    discount_value: false,
    start_date: false,
    end_date: false,
  });

  useEffect(() => {
    fetchServices();
    fetchCoupons();
  }, [page, searchQuery]);

  const fetchServices = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/all_services`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(response.data.services_details);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/get_all_coupons`,
        {
          page,
          limit: 10,
          search: searchQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCoupons(response.data.coupons);
      setTotalPages(response.data.total_pages);
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
    setSelectedCoupon({
      coupon_id: "",
      coupon_code: "",
      coupon_title: "",
      coupon_description: "",
      category_id: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_value: "0",
      max_discount: "0",
      usage_limit: "0",
      start_date: "",
      end_date: "",
      status: 1,
    });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEditClick = (coupon) => {
    setSelectedCoupon({
      ...coupon,
      start_date: coupon.start_date.split("T")[0],
      end_date: coupon.end_date.split("T")[0],
    });
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (coupon) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        const token = Cookies.get("authToken");
        const response = await axios.post(
          `${serverEndPoint}/delete_coupon`,
          { coupon_id: coupon.coupon_id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Coupon deleted successfully");
          fetchCoupons();
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCoupon((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveCouponDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      coupon_code: !selectedCoupon.coupon_code,
      coupon_title: !selectedCoupon.coupon_title,
      category_id: !selectedCoupon.category_id,
      discount_type: !selectedCoupon.discount_type,
      discount_value: !selectedCoupon.discount_value,
      start_date: !selectedCoupon.start_date,
      end_date: !selectedCoupon.end_date,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fill all required fields");
      setBtnLoading(false);
      return;
    }

    try {
      const token = Cookies.get("authToken");
      const endpoint = isEditMode
        ? `${serverEndPoint}/edit_coupon`
        : `${serverEndPoint}/add_coupon`;

      const response = await axios.post(endpoint, selectedCoupon, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? "Coupon updated successfully!"
            : "Coupon added successfully!"
        );
        fetchCoupons();
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
          <h4 className="main-title">Coupons Management</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <TextField
                  placeholder="Search coupons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenDialog}
                >
                  Add New Coupon
                </Button>
              </Box>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Title</th>
                      <th>Service</th>
                      <th>Discount</th>
                      <th>Duration</th>
                      <th>Usage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.coupon_id}>
                        <td>{coupon.coupon_code}</td>
                        <td>
                          <div>
                            <h6 className="mb-0">{coupon.coupon_title}</h6>
                            <small>{coupon.coupon_description}</small>
                          </div>
                        </td>
                        <td>{coupon.category_name}</td>
                        <td>
                          {coupon.discount_type === "percentage"
                            ? `${coupon.discount_value}%`
                            : `₹${coupon.discount_value}`}
                        </td>
                        <td>
                          {format(new Date(coupon.start_date), "dd MMM yyyy")} -
                          <br />
                          {format(new Date(coupon.end_date), "dd MMM yyyy")}
                        </td>
                        <td>
                          {coupon.used_count}/{coupon.usage_limit || "∞"}
                        </td>
                        <td>
                          <IconButton onClick={() => handleEditClick(coupon)}>
                            <Icon color="primary">edit</Icon>
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(coupon)}>
                            <Icon color="error">delete</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box> */}
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
            {isEditMode ? "Edit Coupon" : "Add New Coupon"}
          </Typography>

          <TextField
            label="Coupon Code"
            fullWidth
            margin="normal"
            name="coupon_code"
            value={selectedCoupon.coupon_code}
            onChange={handleInputChange}
            error={errors.coupon_code}
            helperText={errors.coupon_code ? "Coupon code is required" : ""}
          />

          <TextField
            label="Coupon Title"
            fullWidth
            margin="normal"
            name="coupon_title"
            value={selectedCoupon.coupon_title}
            onChange={handleInputChange}
            error={errors.coupon_title}
            helperText={errors.coupon_title ? "Coupon title is required" : ""}
          />

          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            name="coupon_description"
            value={selectedCoupon.coupon_description}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal" error={errors.category_id}>
            <InputLabel>Service Category</InputLabel>
            <Select
              name="category_id"
              value={selectedCoupon.category_id}
              onChange={handleInputChange}
              label="Service Category"
            >
              {services.map((service) => (
                <MenuItem key={service.category_id} value={service.category_id}>
                  {service.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" error={errors.discount_type}>
            <InputLabel>Discount Type</InputLabel>
            <Select
              name="discount_type"
              value={selectedCoupon.discount_type}
              onChange={handleInputChange}
              label="Discount Type"
            >
              <MenuItem value="percentage">Percentage</MenuItem>
              <MenuItem value="fixed">Fixed Amount</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Discount Value"
            fullWidth
            margin="normal"
            type="number"
            name="discount_value"
            value={selectedCoupon.discount_value}
            onChange={handleInputChange}
            error={errors.discount_value}
            helperText={
              errors.discount_value ? "Discount value is required" : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {selectedCoupon.discount_type === "percentage" ? "%" : "₹"}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Minimum Order Value"
            fullWidth
            margin="normal"
            type="number"
            name="min_order_value"
            value={selectedCoupon.min_order_value}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />

          <TextField
            label="Maximum Discount"
            fullWidth
            margin="normal"
            type="number"
            name="max_discount"
            value={selectedCoupon.max_discount}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />

          <TextField
            label="Usage Limit"
            fullWidth
            margin="normal"
            type="number"
            name="usage_limit"
            value={selectedCoupon.usage_limit}
            onChange={handleInputChange}
          />

          <TextField
            type="date"
            label="Start Date"
            fullWidth
            margin="normal"
            name="start_date"
            value={selectedCoupon.start_date}
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
            value={selectedCoupon.end_date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={errors.end_date}
            helperText={errors.end_date ? "End date is required" : ""}
          />

          {isEditMode && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={selectedCoupon.status}
                onChange={handleInputChange}
                label="Status"
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
              onClick={saveCouponDetails}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default CouponsPage;
