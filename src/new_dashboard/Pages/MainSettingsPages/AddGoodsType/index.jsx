import { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  TextField,
  Typography,
  Icon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";
import { serverEndPoint } from "../../../../dashboard/app/constants";
import Loader from "../../../Components/Loader";

const GoodsTypes = () => {
  const [loading, setLoading] = useState(true);
  const [goodsTypes, setGoodsTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedType, setSelectedType] = useState({
    goods_type_id: "",
    goods_type_name: "",
  });

  const fetchGoodsTypes = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverEndPoint}/get_all_goods_types`,
        {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
        config
      );

      setGoodsTypes(response.data.goods_types);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching goods types:", error);
      toast.error("Failed to fetch goods types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoodsTypes();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(searchQuery);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddNew = () => {
    setSelectedType({ goods_type_id: "", goods_type_name: "" });
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!selectedType.goods_type_name.trim()) {
      toast.error("Please enter a goods type name");
      return;
    }

    setBtnLoading(true);
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const endpoint = isEditMode
        ? `${serverEndPoint}/update_goods_type`
        : `${serverEndPoint}/add_goods_type`;

      await axios.post(endpoint, selectedType, config);

      toast.success(
        isEditMode
          ? "Goods type updated successfully"
          : "Goods type added successfully"
      );
      setOpenDialog(false);
      fetchGoodsTypes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid>
      <ToastContainer position="top-right" />
      <Row className="m-1">
        <Col xs={12}>
          <h4 className="main-title">Goods Types</h4>
          <Card className="shadow-lg border-0 rounded-lg">
            <CardBody>
              <div className="mb-3 d-flex justify-content-between">
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search goods types..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-primary ms-2"
                    onClick={handleSearchSubmit}
                  >
                    Search
                  </button>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddNew}
                >
                  Add New Type
                </Button>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goodsTypes.map((type) => (
                      <tr key={type.goods_type_id}>
                        <td>#{type.goods_type_id}</td>
                        <td>{type.goods_type_name}</td>
                        <td>
                          <IconButton onClick={() => handleEdit(type)}>
                            <Icon>edit</Icon>
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination-controls d-flex justify-content-end align-items-center mt-3">
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
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
            {isEditMode ? "Edit Goods Type" : "Add New Goods Type"}
          </Typography>

          <TextField
            label="Goods Type Name"
            fullWidth
            margin="normal"
            value={selectedType.goods_type_name}
            onChange={(e) =>
              setSelectedType({
                ...selectedType,
                goods_type_name: e.target.value,
              })
            }
          />

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
              onClick={handleSave}
            >
              {isEditMode ? "Update" : "Save"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </Container>
  );
};

export default GoodsTypes;
