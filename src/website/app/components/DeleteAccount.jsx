/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Stack,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import PhoneIcon from "@mui/icons-material/Phone";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: "0 auto",
  marginTop: theme.spacing(4),
}));

const DeleteAccount = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState({
    deleteText: "",
    phoneNumber: "",
  });
  const [requestSent, setRequestSent] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setDeleteText("");
    setPhoneNumber("");
    setError({ deleteText: "", phoneNumber: "" });
  };

  // Validate Indian phone number
  const isValidIndianPhoneNumber = (phone) => {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (value && !isValidIndianPhoneNumber(value)) {
      setError((prev) => ({
        ...prev,
        phoneNumber: "Please enter a valid Indian phone number (+91XXXXXXXXXX)",
      }));
    } else {
      setError((prev) => ({
        ...prev,
        phoneNumber: "",
      }));
    }
  };

  const handleConfirmDelete = () => {
    let newErrors = {
      deleteText: "",
      phoneNumber: "",
    };
    let hasError = false;

    if (deleteText.toLowerCase() !== "delete") {
      newErrors.deleteText = 'Please type "delete" to confirm';
      hasError = true;
    }

    if (!phoneNumber || !isValidIndianPhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid Indian phone number";
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      return;
    }

    // Here you would make your API call to delete the account
    setRequestSent(true);
    setOpenDialog(false);
    setError({ deleteText: "", phoneNumber: "" });
  };

  if (requestSent) {
    return (
      <Container maxWidth="sm" sx={{ mt: "80px" }}>
        <StyledPaper elevation={3}>
          <Stack spacing={3} alignItems="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Delete Request Sent
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Your account deletion request has been received.
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              This process will take 24-48 hours to complete.
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              You will receive a confirmation email once the deletion is
              complete.
            </Typography>
          </Stack>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Stack spacing={3}>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Delete Account
          </Typography>

          <Alert severity="warning" icon={<WarningIcon />}>
            <AlertTitle>Warning</AlertTitle>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Alert>

          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleClickOpen}
              size="large"
            >
              Delete My Account
            </Button>
          </Box>

          <Dialog
            open={openDialog}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Are you sure you want to delete your account?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This action is permanent and cannot be undone. All your data
                will be deleted. Please complete the following steps to confirm:
              </DialogContentText>

              {/* Phone Number Field */}
              <TextField
                margin="dense"
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter your phone number"
                label="Phone Number"
                error={!!error.phoneNumber}
                helperText={error.phoneNumber}
                sx={{ mt: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Delete Confirmation Field */}
              <TextField
                margin="dense"
                fullWidth
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder='Type "delete"'
                label="Confirmation"
                error={!!error.deleteText}
                helperText={error.deleteText}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Yes, Delete My Account
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </StyledPaper>
    </Container>
  );
};

export default DeleteAccount;
