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
  CardFooter,
} from "reactstrap";
import html2canvas from "html2canvas";
import axios from "axios";
import jsPDF from "jspdf";
import { serverEndPoint, mapKey } from "../../../../../dashboard/app/constants";

const JCBCraneDriverAboutMeCard = ({ driverData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(driverData.status);
  const [reason, setReason] = useState("");
  const [address, setAddress] = useState("Fetching address...");

  const handleModalClick = () => setIsModalOpen(true);
  const handleImageProfileClick = () => setIsImageModalOpen(true);
  const handleImageProfileClickClose = () => setIsImageModalOpen(false);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleStatusChange = (e) => {
    const newStatus = parseInt(e.target.value, 10);
    setSelectedStatus(newStatus);
    setReason("");
  };

  const handleReasonChange = (e) => setReason(e.target.value);

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
        jcb_crane_driver_id: driverData.jcb_crane_driver_id,
        status: selectedStatus,
      };

      if (selectedStatus === 2 || selectedStatus === 3) {
        data.reason = reason;
      }

      await axios.post(
        `${serverEndPoint}/update_jcb_crane_driver_status`,
        data
      );

      Toast.fire({
        icon: "success",
        title: `${driverData.driver_name} Status Updated Successfully`,
      });

      handleCloseModal();
      window.location.reload();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: `Status Update Failed: ${error}`,
      });
    }
  };

  const cardRef = useRef(null);

  const handlePrint = () => {
    if (cardRef.current) {
      setTimeout(() => {
        html2canvas(cardRef.current, {
          scale: 1.5, // Adjusted scale for potentially better print handling
          useCORS: true,
          allowTaint: true,
          logging: false,
          height: cardRef.current.scrollHeight, // Use scrollHeight for full content
          windowHeight: cardRef.current.scrollHeight,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const printWindow = window.open("", "_blank");

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Driver Details - Print</title>
              <style>
                @page {
                  size: A4; /* Explicitly set page size */
                  margin: 10mm; /* Standard A4 margins */
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: flex-start; /* Align to top */
                  width: 100%;
                  height: 100%;
                }
                .print-container {
                  width: 100%;
                  height: auto;
                  max-width: 190mm; /* A4 width minus margins */
                  max-height: 277mm; /* A4 height minus margins */
                  overflow: hidden; /* Prevent image overflow */
                  page-break-inside: avoid; /* Try to keep content on one page */
                }
                img {
                  width: 100%;
                  height: auto;
                  display: block; /* Remove extra space below image */
                }
                @media print {
                  body {
                    width: 100%;
                    height: 100%;
                    -webkit-print-color-adjust: exact; /* Ensure colors print correctly */
                    print-color-adjust: exact;
                  }
                  .print-container {
                     page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                <img src="${imgData}" alt="Driver Profile" />
              </div>
            </body>
            </html>
          `);

          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.focus();
            // Allow time for image rendering in the new window
            setTimeout(() => {
              printWindow.print();
              // Close window after print dialog is handled (or cancelled)
              // Use a longer timeout to be safe
              setTimeout(() => {
                printWindow.close();
              }, 1000);
            }, 500);
          };
          // Fallback close in case onafterprint doesn't fire reliably
          // printWindow.onafterprint = () => printWindow.close();
        });
      }, 500); // Initial delay before canvas capture
    }
  };

  const handleDownloadPDF = () => {
    if (cardRef.current) {
      setTimeout(() => {
        html2canvas(cardRef.current, {
          scale: 1.5, // Using 1.5 scale for good balance of quality/size
          useCORS: true,
          allowTaint: true,
          logging: false,
          height: cardRef.current.scrollHeight, // Capture full content height
          windowHeight: cardRef.current.scrollHeight,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "portrait", // Force portrait A4
            unit: "mm",
            format: "a4",
          });

          const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm (210)
          const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm (297)
          const margin = 10; // 10mm margin on each side

          const usableWidth = pdfWidth - 2 * margin; // Width available for content
          const usableHeight = pdfHeight - 2 * margin; // Height available for content

          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = imgProps.width;
          const imgHeight = imgProps.height;

          // Calculate aspect ratios
          const pdfRatio = usableWidth / usableHeight;
          const imgRatio = imgWidth / imgHeight;

          let finalImgWidth, finalImgHeight;

          // Determine final dimensions based on aspect ratios to fit within usable area
          if (imgRatio > pdfRatio) {
            // Image is wider than usable area aspect ratio -> fit to width
            finalImgWidth = usableWidth;
            finalImgHeight = finalImgWidth / imgRatio;
          } else {
            // Image is taller than usable area aspect ratio (or equal) -> fit to height
            finalImgHeight = usableHeight;
            finalImgWidth = finalImgHeight * imgRatio;
          }

          // Ensure the width doesn't exceed usableWidth even after height adjustment
          if (finalImgWidth > usableWidth) {
            finalImgWidth = usableWidth;
            finalImgHeight = finalImgWidth / imgRatio;
          }

          // Center the image
          const x = margin + (usableWidth - finalImgWidth) / 2;
          const y = margin + (usableHeight - finalImgHeight) / 2;

          pdf.addImage(imgData, "PNG", x, y, finalImgWidth, finalImgHeight);

          // Use the correct driver name field if available, otherwise a default name
          const driverName =
            driverData?.driver_name ||
            driverData?.driver_first_name ||
            "Driver";
          pdf.save(`JCB/Crane_Driver_${driverName}_Details.pdf`);
        });
      }, 500); // Initial delay before canvas capture
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        return response.data.results[0].formatted_address;
      }
      return "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

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

            <Modal
              isOpen={isModalOpen}
              toggle={handleCloseModal}
              className="modal-dialog-centered"
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
                        (driverData.reason !== "NA" ? driverData.reason : "")
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
                  }
                >
                  Update Status
                </Button>
              </ModalFooter>
            </Modal>

            {isImageModalOpen && (
              <ImageModal
                imageSrc={driverData.profile_pic}
                onClose={handleImageProfileClickClose}
              />
            )}

            <div className="person-details">
              <h5 className="f-w-600">{driverData.driver_name}</h5>
              <p>JCB/Crane Driver</p>
              <p className="font-bold">
                Service: {driverData.service_name}{" "}
                {driverData.sub_cat_name ? `[${driverData.sub_cat_name}]` : ""}
              </p>

              <div className="my-2">
                <button
                  type="button"
                  className={`btn b-r-22 ${
                    driverData.status === 1
                      ? "btn-success"
                      : driverData.status === 0
                      ? "btn-warning"
                      : driverData.status === 2
                      ? "btn-danger"
                      : "btn-secondary"
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
                        : "ti-close"
                    }`}
                  ></i>
                  {driverData.status === 1
                    ? "Verified"
                    : driverData.status === 0
                    ? "Unverified"
                    : driverData.status === 2
                    ? "Blocked"
                    : "Rejected"}
                </button>
              </div>
            </div>
          </div>

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
                <i className="ti ti-map-pin"></i> Location (Registration)
              </span>
              <span className="float-end f-s-13 text-secondary">{address}</span>
            </div>
            <div>
              <span className="fw-medium">
                <i className="ti ti-map-pin"></i> Permanent Address
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.full_address}
              </span>
            </div>
            <div>
              <span className="fw-medium">
                <i className="ti ti-id"></i> Aadhar No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.aadhar_no}
              </span>
            </div>
            <div>
              <span className="fw-medium">
                <i className="ti ti-id"></i> License No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.driving_license_no}
              </span>
            </div>
            <div>
              <span className="fw-medium">
                <i className="ti ti-id"></i> Pan No
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.pan_card_no}
              </span>
            </div>
            <div>
              <span className="fw-medium">
                <i className="ti ti-calendar"></i> Registration Date
              </span>
              <span className="float-end f-s-13 text-secondary">
                {driverData.registration_date}
              </span>
            </div>
          </div>
        </CardBody>
      </div>
      <CardFooter className="d-flex justify-content-between">
        <Button color="primary" className="m-1" onClick={handlePrint}>
          <i className="ti ti-printer"></i> Print
        </Button>
        <Button color="success" className="m-1" onClick={handleDownloadPDF}>
          <i className="ti ti-download"></i> Download PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

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
            objectFit: "contain",
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

export default JCBCraneDriverAboutMeCard;
