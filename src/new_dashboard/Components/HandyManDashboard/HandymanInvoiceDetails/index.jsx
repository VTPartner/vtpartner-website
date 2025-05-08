/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

import { Divider } from "@mui/material";
import Loader from "../../Loader";
import { formatEpoch } from "../../../../dashboard/app/constants";

const HandymanInvoiceDetails = () => {
  const cardRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
          <title>Handyman Service Invoice</title>
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
        `HANDYMAN_INVOICE_ORDER_ID#${
          bookingDetails?.order_id || "-1"
        }_CUSTOMER:${bookingDetails?.customer_name}.pdf`
      );
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendInvoice = () => {
    alert("Invoice sending functionality will be implemented here.");
  };

  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return <div>No invoice details available</div>;
  }

  if (isProcessing) {
    return <Loader />;
  }

  // Determine which service detail to display
  const serviceDetail =
    bookingDetails.service_name !== "NA" && bookingDetails.service_name
      ? bookingDetails.service_name
      : bookingDetails.sub_cat_name || "General Service";

  return (
    <div>
      <div className="container-lg align-content-center mt-5">
        <Row>
          <Col xs={12}>
            <div ref={cardRef} className="bg-white p-4">
              <Col>
                <h6 className="text-3xl mb-5">Handyman Service Invoice</h6>
                <div className="mb-3 flex justify-between">
                  <div className="mb-3">
                    <img src="/logo_new.png" className="w-1/4" alt="Logo" />
                  </div>
                  <div className="text-end">
                    <div className="mb-1">
                      <h3 className="text-primary">INVOICE</h3>
                    </div>
                    <p>
                      Invoice No <strong># {bookingDetails.order_id}</strong>
                    </p>
                    <p>
                      Invoice Date & Time:{" "}
                      <strong>
                        {formatEpoch(bookingDetails.booking_timing)}
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mb-5">
                  <div className="w-full">
                    <div className="bg-blue-50 p-2 mb-4 me-4 rounded-lg">
                      <h6 className="f-w-600 font-semibold m-2">
                        CUSTOMER NAME : {bookingDetails.customer_name}
                      </h6>
                      <h6 className="f-w-600 font-semibold m-2">
                        HANDYMAN NAME : {bookingDetails.handyman_name}
                      </h6>
                    </div>

                    <div className="bg-blue-50 w-50 p-2 rounded-lg">
                      <h6 className="f-w-600 font-semibold text-primary m-2">
                        Service Type: {serviceDetail}
                      </h6>
                    </div>

                    <div className="w-full mt-3">
                      <h6 className="f-w-600 font-semibold mb-2">
                        Work Location
                      </h6>
                      <address className="w-1/2">
                        {bookingDetails.pickup_address}
                      </address>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="bg-blue-50 p-2 mb-4 rounded-lg">
                      <Col>
                        <h6 className="f-w-600 text-xl m-3">PAYMENT DETAILS</h6>
                      </Col>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 m-3">Base Fare</h6>
                        <h6 className="f-w-600 m-3">
                          ₹{bookingDetails.base_price}/-
                        </h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 m-3">Service Hours</h6>
                        <h6 className="f-w-600 m-3">1 Hour</h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 m-3">GST</h6>
                        <h6 className="f-w-600 m-3">
                          ₹{bookingDetails.gst_amount}/-
                        </h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 m-3">IGST</h6>
                        <h6 className="f-w-600 m-3">
                          ₹{bookingDetails.igst_amount}/-
                        </h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 m-3">Payment Method</h6>
                        <h6 className="f-w-600 m-3">
                          {bookingDetails.payment_method}
                        </h6>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <h6 className="f-w-600 text-lg font-medium m-3">
                          Total Amount
                        </h6>
                        <h6 className="f-w-600 text-lg font-medium m-3">
                          ₹{Math.round(bookingDetails.total_price)}/-
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="text-gray-400 text-lg">Declaration</h3>
                  <ul>
                    <li className="text-gray-400 text-sm mb-2">
                      1. Nature of Service: KASP is a service platform that
                      connects customers with verified professional handymen. We
                      act as an intermediary to facilitate safe and reliable
                      home service solutions.
                    </li>
                    <li className="text-gray-400 text-sm mb-2">
                      2. Safety & Security: All our handymen are verified and
                      professionally trained to ensure quality service. However,
                      customers are advised to follow basic safety guidelines
                      during service delivery.
                    </li>
                    <li className="text-gray-400 text-sm mb-2">
                      3. Fare Calculation: The total fare is calculated based on
                      service hours and base fare as per our pricing policy.
                      Additional charges may apply for specialized tools or
                      materials required.
                    </li>
                  </ul>
                </div>

                <div className="mt-10">
                  <h3 className="text-black text-lg">
                    KASP TRANS PRIVATE LIMITED
                  </h3>
                  <p className="text-gray-500 mb-2">
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

export default HandymanInvoiceDetails;
