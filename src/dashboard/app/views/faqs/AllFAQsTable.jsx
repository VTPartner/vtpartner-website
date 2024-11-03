/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Icon,
  Avatar,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { styled } from "@mui/system";

import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { serverEndPoint } from "../../constants";

const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const AllFAQsTable = () => {
  const { category_id } = useParams();
  const [allFaqs, setFAQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFAQDialog, setOpenFAQDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedFAQ, setSelectedFAQ] = useState({
    faq_id: "",
    question: "",
    answer: "",
    epoch_time: "",
  });

  const [errorFAQ, setFaqErrors] = useState({
    faq_id: false,
    question: false,
    answer: false,
    epoch_time: false,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all vehicles and vehicle types
  const fetchAllFAQs = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return; // Exit if no internet connection
    }

    const token = Cookies.get("authToken");

    try {
      const response = await axios.post(
        `${serverEndPoint}/all_faqs`,
        {
          category_id: category_id,
        }, // Send an empty object as the body if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update state with vehicle details
      setFAQs(response.data.all_faqs_details);
    } catch (error) {
      handleError(error); // Handle errors using your existing error handling function
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    fetchAllFAQs();
  }, []);

  // Handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 409) {
        toast.error("Sub Service Name already assigned.");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error("Failed to fetch all FAQ's. Please check your connection.");
      setError("Network Error");
    }
    setLoading(false);
  };

  const handleOpenDialog = () => {
    setSelectedFAQ({
      faq_id: "",
      question: "",
      answer: "",
      epoch_time: "",
    });
    setIsEditMode(false);
    setOpenFAQDialog(true);
  };

  const navigate = useNavigate();

  const handleEditClick = (service) => {
    setSelectedFAQ(service);
    setIsEditMode(true);
    setOpenFAQDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenFAQDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedFAQ((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the selected field
    }));
  };

  const saveFaqDetails = async () => {
    setBtnLoading(true);

    const newErrors = {
      question: !selectedFAQ.question,
      answer: !selectedFAQ.answer,
    };
    setFaqErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      setBtnLoading(false);
      return;
    }
    let serviceImageUrl = selectedFAQ.image;

    const token = Cookies.get("authToken");
    const endpoint = isEditMode
      ? `${serverEndPoint}/edit_new_faq`
      : `${serverEndPoint}/add_new_faq`;

    try {
      const formData = new FormData();

      // Append vehicle details to formData
      for (const key in selectedFAQ) {
        formData.append(key, selectedFAQ[key]);
      }

      const response = await axios.post(
        endpoint,
        {
          faq_id: isEditMode ? selectedFAQ.faq_id : "0",
          category_id: category_id,
          question: selectedFAQ.question,
          answer: selectedFAQ.answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          isEditMode
            ? selectedFAQ.sub_cat_name + " FAQ updated successfully!"
            : selectedFAQ.sub_cat_name + " FAQ added successfully!"
        );
        fetchAllFAQs();
        handleCloseDialog();
      } else {
        toast.error("Failed to save Category.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box width="100%" overflow="auto">
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleOpenDialog}
        >
          Add New FAQ
        </Button>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">Question</TableCell>
              <TableCell align="left">Last Updated</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFaqs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow key={service.faq_id}>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      {service.question}
                    </Box>
                  </TableCell>

                  <TableCell align="left">
                    {format(
                      new Date(service.time_at * 1000),
                      "dd/MM/yyyy, hh:mm:ss a"
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit Details" arrow>
                      <IconButton onClick={() => handleEditClick(service)}>
                        <Icon color="primary">edit</Icon>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </StyledTable>

        <TablePagination
          sx={{ px: 2 }}
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={allFaqs.length}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
        />
      </Box>

      {/* Modal for Adding or Editing Vehicle */}
      <Dialog
        open={openFAQDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit FAQ" : "Add New FAQ"}
          </Typography>

          <TextField
            label="Question"
            fullWidth
            margin="normal"
            name="question"
            value={selectedFAQ.question}
            onChange={handleInputChange}
            required
            error={errorFAQ.question}
            helperText={errorFAQ.question ? "Question is required." : ""}
          />
          <TextField
            label="Answer"
            fullWidth
            multiline
            rows={4} // You can change the number of rows based on your preference
            margin="normal"
            name="answer"
            value={selectedFAQ.answer}
            onChange={handleInputChange}
            required
            error={errorFAQ.answer}
            helperText={errorFAQ.answer ? "Answer is required." : ""}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDialog} sx={{ marginRight: 1 }}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              color="primary"
              loading={btnLoading}
              variant="contained"
              onClick={saveFaqDetails}
            >
              {isEditMode ? "Update" : "Create"}
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default AllFAQsTable;
