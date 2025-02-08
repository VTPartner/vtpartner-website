/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
  Toast,
  CardFooter,
} from "reactstrap";
import html2canvas from "html2canvas";
import { mapKey, serverEndPoint } from "../../../../../dashboard/app/constants";
import axios from "axios";
import jsPDF from "jspdf";

const GoodsDriverAboutMeCard = ({ driverData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(driverData.status);
  const [reason, setReason] = useState("");

  const handleModalClick = () => {
    setIsModalOpen(true); // Open modal on image click
  };
  const handleImageProfileClick = () => {
    setIsImageModalOpen(true); // Open modal on image click
  };

  const handleImageProfileClickClose = () => {
    setIsImageModalOpen(false); // Open modal on image click
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const handleStatusChange = (e) => {
    const newStatus = parseInt(e.target.value, 10); // Ensure value is an integer
    console.log("Selected Status:", newStatus); // Log the updated status
    setSelectedStatus(newStatus); // Update the selectedStatus state
    setReason(""); // Reset reason when changing status
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      const data = {
        goods_driver_id: driverData.goods_driver_id,
        status: selectedStatus,
      };

      // Include reason if the status is Rejected or Blocked
      if (selectedStatus === 2 || selectedStatus === 3) {
        data.reason = reason;
      }

      // Call the API to update status
      await axios.post(`${serverEndPoint}/update_goods_driver_status`, data);

      Toast.fire({
        icon: "success",
        title: `${driverData.driver_first_name} Status Updated Successfully`,
      });

      // Close the modal
      handleCloseModal();

      // Reload the page to reflect the status update
      window.location.reload();

      // Optionally, refresh the data by calling the parent update function
      if (onStatusUpdate) {
        onStatusUpdate(); // Ensure parent component is notified
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: `Status Update Failed: ${error}`,
      });
      console.error("Error updating status:", error);
    }
  };

  const cardRef = useRef(null);

  const handlePrint = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, { scale: 3, useCORS: true }).then(
        (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const printWindow = window.open("", "_blank");

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Driver Details</title>
            </head>
            <body style="margin: 0; padding: 20px; text-align: center;">
              <img src="${imgData}" style="width: 100%;"/>
            </body>
            </html>
          `);

          printWindow.document.close();
          printWindow.onload = () => printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        }
      );
    }
  };

  const handleDownloadPDF = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, { scale: 2, useCORS: true }).then(
        (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const imgWidth = pdfWidth - 20;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
          pdf.save(`${driverData.driver_first_name}_Details.pdf`);
        }
      );
    }
  };

  const getBase64FromUrl = async (url) => {
    try {
      const response = await fetch(url, { mode: "no-cors" }); // Might not work on all servers
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Image fetch failed due to CORS:", error);
      return null;
    }
  };

  const handleDownloadIDCard = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [85, 85], // Standard ID card size
    });

    try {
      // Convert images to Base64 (with error handling)
      const logoBase64 = await getBase64FromUrl("/logo_new.png");
      const profileBase64 = await getBase64FromUrl(driverData.profile_pic);
      const stampBase64 = await getBase64FromUrl("/stamp.png");

      // Add VT Partner Logo (Maintain aspect ratio)
      if (logoBase64) {
        const img = new Image();
        img.src = logoBase64;

        img.onload = () => {
          const logoWidth = img.width;
          const logoHeight = img.height;

          // Calculate aspect ratio and scale image accordingly
          const maxWidth = 30; // Maximum width of the logo (in mm)
          const scale = maxWidth / logoWidth;
          const logoScaledHeight = logoHeight * scale;

          doc.addImage(logoBase64, "PNG", 27, 5, maxWidth, logoScaledHeight);
        };
      } else {
        console.error("VT Partner logo image missing or corrupt");
      }

      //   if (profileBase64) {
      //     // Add Circular Profile Picture
      //     doc.setFillColor(255, 255, 255);
      //     doc.circle(42.5, 23, 10, "F"); // X, Y, Radius
      //     doc.addImage(profileBase64, "PNG", 32.5, 13, 20, 20, "", "FAST");
      //   } else {
      //     console.error("Profile picture missing or corrupt");
      //   }

      //   if (stampBase64) {
      //     // Add Signature Stamp in Footer
      //     doc.addImage(stampBase64, "PNG", 65, 40, 15, 10); // Add Signature Stamp
      //   } else {
      //     console.error("Stamp image missing or corrupt");
      //   }

      // Driver Details (Structured Layout)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Driver ID Card", 30, 35);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`ID: ${driverData.goods_driver_id}`, 10, 40);
      doc.text(
        `Name: ${driverData.driver_first_name} ${driverData.driver_last_name}`,
        10,
        45
      );
      doc.text(
        `Status: ${driverData.status === 1 ? "Verified" : "Unverified"}`,
        10,
        50
      );
      doc.text(`License No: ${driverData.driving_license_no}`, 10, 55);
      doc.text(`Vehicle No: ${driverData.vehicle_plate_no}`, 10, 60);

      // Save the PDF
      doc.save(`${driverData.driver_first_name}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating ID Card:", error);
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    const apiKey = mapKey; // Replace with your Google API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        return response.data.results[0].formatted_address; // Get first result's address
      } else {
        console.error("Geocode API Error:", response.data.status);
        return "Address not found";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  const [address, setAddress] = useState("Fetching address...");

  useEffect(() => {
    const fetchAddress = async () => {
      if (driverData?.r_lat && driverData?.r_lng) {
        const fetchedAddress = await getAddressFromLatLng(
          driverData.r_lat,
          driverData.r_lng
        );
        setAddress(fetchedAddress || "Address not found");
      }
    };

    fetchAddress();
  }, [driverData]);

  return (
    <Card className="shadow-lg border-0 rounded">
      <CardHeader>
        <h5>About Me</h5>
      </CardHeader>
      <div ref={cardRef}>
        <CardBody>
          <div className="profile-container">
            <div className="image-details">
              <div className="profile-image"></div>
              <div className="profile-pic">
                <div className="avatar-upload">
                  <div className="avatar-preview">
                    <div
                      id="imgPreview"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "100%",
                        border: "4px dashed rgb(var(--dark), 1)",
                        backgroundColor: "rgb(var(--warning), 1)",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={handleImageProfileClick}
                    >
                      {driverData.profile_pic ? (
                        <img
                          src={driverData.profile_pic}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span>No Profile Pic</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal to change status */}
            <Modal
              isOpen={isModalOpen}
              toggle={handleCloseModal}
              className="modal-dialog-centered" // Centers the modal
            >
              <ModalHeader toggle={handleCloseModal}>Change Status</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="statusSelect">Select Status</Label>
                  <Input
                    type="select"
                    id="statusSelect"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value={1}>Verified</option>
                    <option value={0}>Unverified</option>
                    <option value={2}>Blocked</option>
                    <option value={3}>Rejected</option>
                  </Input>
                </FormGroup>

                {(selectedStatus === 2 || selectedStatus === 3) && (
                  <FormGroup>
                    <Label for="reasonTextarea">Reason</Label>
                    <Input
                      type="textarea"
                      id="reasonTextarea"
                      value={
                        reason ||
                        (driverData.reason && driverData.reason !== "NA"
                          ? driverData.reason
                          : "")
                      }
                      onChange={handleReasonChange}
                      placeholder="Please provide a reason"
                      rows={3}
                    />
                  </FormGroup>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={handleUpdateStatus}
                  disabled={
                    !(reason || selectedStatus === 1 || selectedStatus === 0)
                  } // Disable the button if reason is empty for Blocked/Rejected
                >
                  Update Status
                </Button>
              </ModalFooter>
            </Modal>

            {/* Modal to display the image in full screen */}
            {isImageModalOpen && (
              <ImageModal
                imageSrc={driverData.profile_pic}
                onClose={handleImageProfileClickClose}
              />
            )}
            <div className="person-details">
              <h5 className="f-w-600">{driverData.driver_first_name}</h5>
              <p>Goods Driver</p>
              <p className="font-bold">
                {driverData.vehicle_name} {" [ "} {driverData.vehicle_type_name}{" "}
                {" ]"}
              </p>

              <div className="my-2">
                <button
                  type="button"
                  className={`btn b-r-22 ${
                    driverData.status === 1
                      ? "btn-success" // Verified
                      : driverData.status === 0
                      ? "btn-warning" // Unverified
                      : driverData.status === 2
                      ? "btn-danger" // Blocked
                      : driverData.status === 3
                      ? "btn-secondary" // Rejected
                      : "btn-primary" // Default
                  }`}
                  onClick={handleModalClick}
                >
                  <i
                    className={`ti ${
                      driverData.status === 1
                        ? "ti-check"
                        : driverData.status === 0
                        ? "ti-warning"
                        : driverData.status === 2
                        ? "ti-lock"
                        : driverData.status === 3
                        ? "ti-close"
                        : "ti-user"
                    }`}
                  ></i>
                  {driverData.status === 1
                    ? "Verified"
                    : driverData.status === 0
                    ? "Unverified"
                    : driverData.status === 2
                    ? "Blocked"
                    : driverData.status === 3
                    ? "Rejected"
                    : "Update Status"}
                </button>
              </div>
            </div>
          </div>
          <p className="text-muted f-s-13 text-center mb-2">
            Hello! I am {driverData.driver_first_name}, a devoted driver with
            extensive experience.
          </p>
          <div className="about-list">
            <div>
              <span className="fw-medium">
                <i className="ti ti-phone"></i> Contact
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.mobile_no}
              </span>
            </div>
            <div>
              <span className="fw-medium">
                <i className="ti ti-cake"></i> Birth of Date
              </span>
              <span className="float-end f-s-13 text-secondary">N/A</span>{" "}
              {/* Replace with birth date if available */}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                <i className="ti ti-map-pin"></i> Location (Registration)
              </span>
              <span
                className="float-end f-s-12 text-secondary text-truncate"
                style={{
                  maxWidth: "60%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={address} // Show full address on hover
              >
                {address}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                <i className="ti ti-map-pin"></i> Permanent Address
              </span>
              <span className="float-end f-s-12 text-secondary text-truncate">
                {driverData.full_address}
              </span>
            </div>

            <div>
              <span className="fw-semibold">
                <i className="ti ti-device-laptop"></i> Gender
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.gender}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-device-laptop"></i> Vehicle Registered
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.vehicle_name}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-device-laptop"></i> License No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.driving_license_no}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-brand-github"></i> Vehicle Plate No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.vehicle_plate_no}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-map-pin"></i> RC No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.rc_no}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-brand-github"></i> Insurance No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.insurance_no}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-device-laptop"></i> NOC No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.noc_no}
              </span>
            </div>
            <div>
              <span className="fw-semibold">
                <i className="ti ti-cake"></i> Vehicle Fuel Type
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.vehicle_fuel_type}
              </span>
            </div>
          </div>
        </CardBody>
      </div>
      <CardFooter className="d-flex justify-content-between mt-5">
        <Button
          type="button"
          color="primary"
          className="m-1"
          onClick={handlePrint}
        >
          <i className="ti ti-printer"></i> Print
        </Button>
        <Button
          type="button"
          color="success"
          className="m-1"
          onClick={handleDownloadPDF}
        >
          <i className="ti ti-download"></i> Download
        </Button>
        <Button
          type="button"
          color="warning"
          className="m-1"
          onClick={handleDownloadIDCard}
        >
          <i className="ti ti-download"></i> Download ID Card
        </Button>
      </CardFooter>
    </Card>
  );
};

// Modal Component
const ImageModal = ({ imageSrc, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={imageSrc}
          alt="Zoomed Profile"
          style={{
            maxWidth: "90%",
            maxHeight: "90%",
            borderRadius: "10px",
            objectFit: "contain", // Keeps aspect ratio intact
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            border: "none",
            borderRadius: "50%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default GoodsDriverAboutMeCard;
