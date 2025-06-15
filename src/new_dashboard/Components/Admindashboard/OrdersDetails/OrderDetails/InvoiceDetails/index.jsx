/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from "react"; // Added useState
import { Button, Col, Row } from "reactstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

import { Divider } from "@mui/material";
import Loader from "../../../../Loader";
import { formatEpoch, mapKey } from "../../../../../../dashboard/app/constants";
import { LoadScript } from "@react-google-maps/api";
import DeliveryMap from "../../../../DriverMapForInvoice";

const GoodsDriverInvoiceDetails = () => {
  const cardRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  let dropLocations = [];
  let dropContacts = [];
  if (bookingDetails?.multiple_drops > 0) {
    try {
      dropLocations =
        typeof bookingDetails.drop_locations === "string"
          ? JSON.parse(bookingDetails.drop_locations)
          : bookingDetails.drop_locations || [];
      dropContacts =
        typeof bookingDetails.drop_contacts === "string"
          ? JSON.parse(bookingDetails.drop_contacts)
          : bookingDetails.drop_contacts || [];
    } catch (e) {
      e.print();
      console.error("Error parsing drop locations or contacts:", e);
      dropLocations = [];
      dropContacts = [];
    }
  }
  // const handlePrint = async () => {
  //   if (!cardRef.current) return;

  //   setIsProcessing(true);
  //   try {
  //     // Calculate the content height
  //     const content = cardRef.current;
  //     const contentHeight = content.offsetHeight;

  //     // Create canvas with proper dimensions
  //     const canvas = await html2canvas(content, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //       windowHeight: contentHeight,
  //       height: contentHeight,
  //       scrollY: -window.scrollY,
  //       onclone: (document) => {
  //         const element = document.querySelector('[ref="cardRef"]');
  //         if (element) {
  //           element.style.height = `${contentHeight}px`;
  //         }
  //       },
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const printWindow = window.open("", "_blank");

  //     printWindow.document.write(`
  //       <!DOCTYPE html>
  //       <html>
  //       <head>
  //         <title>Goods Service Invoice</title>
  //         <style>
  //           @media print {
  //             body { margin: 0; padding: 20px; }
  //             img { max-width: 100%; height: auto; }
  //             @page { size: auto; margin: 20px; }
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <img src="${imgData}" style="width: 100%;"/>
  //       </body>
  //       </html>
  //     `);

  //     printWindow.document.close();

  //     printWindow.onload = () => {
  //       setTimeout(() => {
  //         printWindow.print();
  //       }, 500);
  //     };

  //     printWindow.onafterprint = () => {
  //       printWindow.close();
  //     };
  //   } catch (error) {
  //     console.error("Print error:", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handlePrint = async () => {
    if (!cardRef.current) return;

    setIsProcessing(true);
    try {
      // Calculate the content height
      const content = cardRef.current;
      const contentHeight = content.offsetHeight;

      // Create canvas with proper dimensions
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowHeight: contentHeight,
        height: contentHeight,
        scrollY: -window.scrollY,
        onclone: (document) => {
          const element = document.querySelector('[ref="cardRef"]');
          if (element) {
            element.style.height = `${contentHeight}px`;
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const printWindow = window.open("", "_blank");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Goods Service Invoice</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              img { max-width: 100%; height: auto; }
              @page { size: auto; margin: 20px; }
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" style="width: 100%;"/>
        </body>
        </html>
      `);

      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };

      printWindow.onafterprint = () => {
        printWindow.close();
      };
    } catch (error) {
      console.error("Print error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // const handleDownload = async () => {
  //   if (!cardRef.current) return;

  //   setIsProcessing(true);
  //   try {
  //     const content = cardRef.current;
  //     const canvas = await html2canvas(content, {
  //       scale: 2,
  //       useCORS: true,
  //       logging: false,
  //       windowHeight: content.offsetHeight,
  //       height: content.offsetHeight,
  //     });

  //     const imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //       compress: true,
  //     });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = pdfWidth - 20; // 10mm margins on each side
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     let heightLeft = imgHeight;
  //     let position = 10; // Starting position
  //     let pageHeight = pdfHeight - 20; // Accounting for margins

  //     // First page
  //     pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     // Add new pages if needed
  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight; // Top of next page
  //       pdf.addPage();
  //       pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     pdf.save(`goods_invoice_${bookingDetails?.order_id || "download"}.pdf`);
  //   } catch (error) {
  //     console.error("Download error:", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsProcessing(true);
    try {
      const content = cardRef.current;
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowHeight: content.offsetHeight,
        height: content.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // Starting position
      let pageHeight = pdfHeight - 20; // Accounting for margins

      // First page
      pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight; // Top of next page
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `GOODS_INVOICE_ORDER_ID#${bookingDetails?.order_id || "-1"}_CUSTOMER:${
          bookingDetails?.customer_name
        }.pdf`
      );
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendInvoice = () => {
    alert("Functionality to send invoice will be implemented here.");
  };

  if (!bookingDetails) {
    return <div>No order details available</div>;
  }

  if (isProcessing) {
    return <Loader />;
  }

  return (
    <div>
      <div className="container-lg align-content-center mt-5">
        <Row>
          <Col xs={12}>
            <div ref={cardRef}>
              <Col>
                <h6 className="text-3xl mb-5">Invoice / Consignment Note</h6>
                <div className=" mb-3 flex justify-between">
                  <div className="mb-3">
                    <img src="/logo_new.png" className="w-1/4" alt="" />
                  </div>
                  <div className="text-end">
                    <div className="mb-1">
                      <h3 className="text-primary">INVOICE</h3>
                    </div>
                    <p>
                      Invoice No <strong># {bookingDetails.order_id}</strong>
                    </p>
                    <p>
                      Invoice Date & Timing :{" "}
                      <strong>
                        {formatEpoch(bookingDetails.booking_timing)}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between mb-5">
                  <div className="w-full">
                    <div className="bg-blue-50   p-2 mb-4 me-4 rounded-lg">
                      <h6 className="f-w-600 font-semibold m-2">
                        CUSTOMER NAME : {bookingDetails.customer_name}
                      </h6>
                      <h6 className="f-w-600 font-semibold m-2">
                        DRIVER NAME : {bookingDetails.driver_first_name}
                      </h6>
                    </div>

                    <div className="bg-blue-50 w-50  p-2 rounded-lg">
                      <h6 className="f-w-600 font-semibold text-primary m-2">
                        {bookingDetails.vehicle_name} {" | "}{" "}
                        {bookingDetails.vehicle_plate_no}
                      </h6>
                    </div>

                    <div className="w-full mt-3">
                      <h6 className="f-w-600 font-semibold mb-2">
                        Pickup Address
                      </h6>
                      {bookingDetails.sender_name}
                      {" - "}
                      {bookingDetails.sender_number}
                      <address className="w-1/2">
                        {bookingDetails.pickup_address}
                      </address>
                    </div>
                    <div className="w-full">
                      <h6 className="f-w-600 font-semibold mb-2">
                        {bookingDetails.multiple_drops > 0
                          ? `Drop Addresses (${bookingDetails.multiple_drops})`
                          : "Drop Address"}
                      </h6>
                      {bookingDetails.multiple_drops > 0 ? (
                        dropLocations.map((location, idx) => (
                          <div key={idx} className="mb-2">
                            <strong>Drop {idx + 1}:</strong>{" "}
                            {dropContacts[idx]?.name ? (
                              <>
                                {dropContacts[idx].name} -{" "}
                                {dropContacts[idx].mobile}
                                <br />
                              </>
                            ) : null}
                            <address className="w-1/2">
                              {location.address}
                            </address>
                          </div>
                        ))
                      ) : (
                        <>
                          {bookingDetails.receiver_name} {" - "}
                          {bookingDetails.receiver_number}
                          <address className="w-1/2">
                            {bookingDetails.drop_address}
                          </address>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="bg-blue-50  p-2 mb-4 rounded-lg">
                      <Col>
                        <h6 className="f-w-600 text-xl m-3">PAYMENT DETAILS</h6>
                      </Col>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600  m-3">Ride fare</h6>
                        <h6 className="f-w-600  m-3">
                          ₹{bookingDetails.total_price}/-
                        </h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600  m-3">Promo / Discount</h6>
                        <h6 className="f-w-600  m-3">₹0.00/-</h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600  m-3">SGST</h6>
                        <h6 className="f-w-600  m-3">₹0.00/-</h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600  m-3">CGST</h6>
                        <h6 className="f-w-600  m-3">₹0.00/-</h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600  m-3">Time Penalty</h6>
                        <h6 className="f-w-600  m-3">₹0.00/-</h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600  m-3">Payment Via</h6>
                        <h6 className="f-w-600  m-3">
                          {bookingDetails.payment_method}
                        </h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 text-lg font-medium m-3">
                          Total Amount
                        </h6>
                        <h6 className="f-w-600 text-lg font-medium  m-3">
                          ₹ {Math.round(bookingDetails.total_price)}
                          /-
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                {/* After payment details card */}
                <div className="w-full mb-5">
                  <LoadScript googleMapsApiKey={mapKey}>
                    <DeliveryMap
                      pickupLocation={{
                        lat: bookingDetails.pickup_lat,
                        lng: bookingDetails.pickup_lng,
                      }}
                      dropLocations={
                        bookingDetails.multiple_drops > 0
                          ? dropLocations.map((loc, index) => ({
                              lat: loc.latitude,
                              lng: loc.longitude,
                            }))
                          : [
                              {
                                lat: bookingDetails.destination_lat,
                                lng: bookingDetails.destination_lng,
                              },
                            ]
                      }
                    />
                  </LoadScript>
                </div>
                <div className="mb-2">
                  <h3 className="text-gray-400 text-lg">Declaration</h3>
                  <ul>
                    <li className="text-gray-400 text-sm mb-2">
                      1. Nature of Service: KASP is a transport service platform
                      that connects customers with independent drivers for goods
                      delivery services. We act solely as an intermediary and do
                      not own, operate, or control any vehicles or drivers.
                    </li>
                    <li className="text-gray-400 text-sm mb-2">
                      2. Liability: While we strive to connect you with reliable
                      drivers, KASP does not assume responsibility for the
                      quality, condition, or timely delivery of goods by the
                      drivers.
                    </li>
                    <li className="text-gray-400 text-sm mb-2">
                      3. Contractual Relationship: When booking a delivery
                      service, the contract is between the customer and the
                      driver. KASP facilitates this connection but is not a
                      party to the contract.
                    </li>
                  </ul>
                </div>
                <div className="mt-10">
                  <h3 className="text-black text-lg">
                    KASP TRANS PRIVATE LIMITED
                  </h3>
                  <p className="text-gray-500 mb-2">
                    {" "}
                    Plot No.pap-a-45, Chakan, Midc Ph-iv, Nighoje, Khed, Nighoje
                    Khed Pune, Maharashtra 410501 India
                  </p>
                </div>
              </Col>
            </div>

            <div className="invoice-footer float-end mb-3">
              <Button
                type="button"
                color="primary"
                className="m-1"
                onClick={handlePrint}
                disabled={isProcessing}
              >
                <i className="ti ti-printer me-1"></i> Print
              </Button>
              <Button
                type="button"
                color="secondary"
                className="m-1"
                onClick={handleSendInvoice}
                disabled={isProcessing}
              >
                <i className="ti ti-send me-1"></i> Send Invoice
              </Button>
              <Button
                type="button"
                color="success"
                className="m-1"
                onClick={handleDownload}
                disabled={isProcessing}
              >
                <i className="ti ti-download me-1"></i> Download
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GoodsDriverInvoiceDetails;
