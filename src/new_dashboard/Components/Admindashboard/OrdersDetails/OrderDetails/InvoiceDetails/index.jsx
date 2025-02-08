/* eslint-disable react/no-unescaped-entities */

import { useRef } from "react";
import { Button, Col, Row } from "reactstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";
import { formatEpoch } from "../../../../../../dashboard/app/constants";
import { Divider } from "@mui/material";

const GoodsDriverInvoiceDetails = () => {
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
            <title>Goods Invoice</title>
          </head>
          <body style="margin: 0; padding: 20px; text-align: center;">
            <img src="${imgData}" style="width: 100%;"/>
          </body>
          </html>
        `);

          printWindow.document.close();

          printWindow.onload = () => {
            printWindow.print();
          };

          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }
      );
    }
  };

  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, { scale: 3 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth - 20; // Leave margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pdfHeight - 20) {
          // If content exceeds page height, split into multiple pages
          let position = 10;
          let heightLeft = imgHeight;
          const pageHeight = pdfHeight - 20;

          while (heightLeft > 0) {
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            position -= pageHeight;
            if (heightLeft > 0) pdf.addPage();
          }
        } else {
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        }

        pdf.save("goods_service_invoice.pdf");
      });
    }
  };

  const handleSendInvoice = () => {
    alert("Functionality to send invoice will be implemented here.");
  };

  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

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
                        Drop Address
                      </h6>
                      {bookingDetails.receiver_name} {" - "}
                      {bookingDetails.receiver_number}
                      <address className="w-1/2">
                        {bookingDetails.drop_address}
                      </address>
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
                <div className="mb-2">
                  <h3 className="text-gray-400 text-lg">Declaration</h3>
                  <ul>
                    <li className="text-gray-400 text-sm mb-2">
                      1. Nature of Service: VT Partner is a transport service
                      platform that connects customers with independent drivers
                      for goods delivery services. We act solely as an
                      intermediary and do not own, operate, or control any
                      vehicles or drivers.
                    </li>
                    <li className="text-gray-400 text-sm mb-2">
                      2. Liability: While we strive to connect you with reliable
                      drivers, VT Partner does not assume responsibility for the
                      quality, condition, or timely delivery of goods by the
                      drivers.
                    </li>
                    <li className="text-gray-400 text-sm mb-2">
                      3. Contractual Relationship: When booking a delivery
                      service, the contract is between the customer and the
                      driver. VT Partner facilitates this connection but is not
                      a party to the contract.
                    </li>
                  </ul>
                </div>
                <div className="mt-10">
                  <h3 className="text-black text-lg">
                    VT PARTNER TRANS PRIVATE LIMITED
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
              >
                <i className="ti ti-printer"></i> Print
              </Button>
              <Button
                type="button"
                color="secondary"
                className="m-1"
                onClick={handleSendInvoice}
              >
                <i className="ti ti-send"></i> Send Invoice
              </Button>
              <Button
                type="button"
                color="success"
                className="m-1"
                onClick={handleDownload}
              >
                <i className="ti ti-download"></i> Download
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GoodsDriverInvoiceDetails;
