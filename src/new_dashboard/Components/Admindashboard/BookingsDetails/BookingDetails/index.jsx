/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import {
  formatEpoch,
  mapKey,
  serverEndPoint,
} from "../../../../../dashboard/app/constants";
import { useParams } from "react-router-dom";
import Loader from "../../../Loader";

const GoodsBookingDetails = () => {
  const { booking_id } = useParams();
  const markerMapRef = useRef();
  const mapRef = useRef();
  const polygonMapRef = useRef();
  const [loading, setLoading] = useState(true);
  const [bookingHistory, setBookingHistory] = useState([]);

  const [bookingDetails, setBookingDetails] = useState([
    {
      booking_id: 0,
      order_id: 0,
      customer_id: 0,
      city_id: 0,
      driver_id: 0,
      pickup_lat: 0.0,
      pickup_lng: 0.0,
      destination_lat: 0.0,
      destination_lng: 0.0,
      total_price: 0.0,
      base_price: 0.0,
      booking_timing: 0.0,
      driver_arrival_time: 0.0,
      gst_amount: 0.0,
      igst_amount: 0.0,
      cancel_time: 0.0,
      goods_type_id: 0,
      payment_method: "",
      cancelled_reason: "",
      sender_name: "",
      sender_number: "",
      receiver_name: "",
      receiver_number: "",
      driver_first_name: "",
      goods_driver_auth_token: "",
      customer_name: "",
      customers_auth_token: "",
      pickup_address: "",
      drop_address: "",
      customer_mobile_no: "",
      driver_mobile_no: "",
      vehicle_id: 0,
      vehicle_name: "",
      vehicle_image: "",
      vehicle_plate_no: "",
      vehicle_fuel_type: "",
      profile_pic: "",
      booking_date: "",
      booking_status: "",
      distance: "0 KM",
      total_time: "0 Minutes",
      productImage: "",
      color: "",
      size: "",
      status: "",
      price: "",
      rating: 0,
    },
  ]);

  const driverMarkerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("googleMaps");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places&loading=async`;
        script.id = "googleMaps";
        document.body.appendChild(script);
        script.onload = () => {
          initMaps();
        };
      } else {
        initMaps();
      }
    };

    const initMaps = () => {
      const { google } = window;
      if (
        !google ||
        !bookingDetails.pickup_lat ||
        !bookingDetails.destination_lat
      ) {
        console.warn("Google Maps API not loaded or booking details missing.");
        return;
      }

      const pickup = {
        lat: parseFloat(bookingDetails.pickup_lat),
        lng: parseFloat(bookingDetails.pickup_lng),
      };

      const drop = {
        lat: parseFloat(bookingDetails.destination_lat),
        lng: parseFloat(bookingDetails.destination_lng),
      };

      // Initialize map on polygonMapRef
      const map = new google.maps.Map(polygonMapRef.current, {
        center: pickup,
        zoom: 12,
      });

      // Create a polygon path between pickup and drop
      const path = [pickup, drop];

      const polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: "#FF5733",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#FFC300",
        fillOpacity: 0.4,
      });
      polygon.setMap(map);

      // Add Pickup Marker
      new google.maps.Marker({
        position: pickup,
        map: map,
        title: "Pickup Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      });

      // Add Drop Marker
      new google.maps.Marker({
        position: drop,
        map: map,
        title: "Drop Location",
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });

      // Start tracking driver's live location
      if (bookingDetails.driver_id) {
        startTrackingDriver(map, bookingDetails.driver_id);
      }
    };

    const startTrackingDriver = (map, driverId) => {
      if (!driverId) return;

      const fetchDriverLocation = async () => {
        const token = Cookies.get("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        try {
          const response = await axios.post(
            `${serverEndPoint}/goods_driver_current_location`,
            { driver_id: driverId },
            config
          );

          if (response.status === 200 && response.data.results.length > 0) {
            const driverLocation = {
              lat: parseFloat(response.data.results[0].current_lat),
              lng: parseFloat(response.data.results[0].current_lng),
            };

            // If driverMarkerRef exists, update it; otherwise, create it
            if (driverMarkerRef.current) {
              driverMarkerRef.current.setPosition(driverLocation);
            } else {
              driverMarkerRef.current = new google.maps.Marker({
                position: driverLocation,
                map,
                title: "Driver Location",
                // icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                icon: {
                  url: "/assets/icon/car.png", // Replace with the path to your car image
                  scaledSize: new google.maps.Size(40, 40), // Adjust the size of the image as needed
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(20, 20), // Adjust anchor point if needed
                },
              });
            }
          } else {
            console.warn(
              "No driver location data found. Showing only polygon & markers."
            );
          }
        } catch (error) {
          console.error("Error fetching driver location:", error);
        }
      };

      // Fetch driver location every 10 seconds
      intervalRef.current = setInterval(fetchDriverLocation, 10000);
    };

    loadGoogleMapsScript();

    // Cleanup function to stop tracking when unmounting
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bookingDetails]);

  const fetchBookingsDetails = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [bookingDetailsResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_booking_detail_with_id`,
          {
            booking_id: booking_id,
          },
          config
        ),
      ]);

      console.log(
        "bookingDetailsResponse.data.results::" +
          bookingDetailsResponse.data.results[0]["customer_name"]
      );

      //   setBookingDetails(bookingDetailsResponse.data.results[0] || []);
      // Start tracking driver's live location
      // const driver_ID = bookingDetailsResponse.data.results[0]["driver_id"];
      // if (driver_ID) {
      //   startTrackingDriver(map, driver_ID);
      // }
      setBookingDetails({
        booking_id: bookingDetailsResponse.data.results[0]["booking_id"],
        order_id: bookingDetailsResponse.data.results[0]["order_id"],
        customer_id: bookingDetailsResponse.data.results[0]["customer_id"],
        city_id: bookingDetailsResponse.data.results[0]["city_id"],
        driver_id: bookingDetailsResponse.data.results[0]["driver_id"],
        pickup_lat: bookingDetailsResponse.data.results[0]["pickup_lat"],
        pickup_lng: bookingDetailsResponse.data.results[0]["pickup_lng"],
        destination_lat:
          bookingDetailsResponse.data.results[0]["destination_lat"],
        destination_lng:
          bookingDetailsResponse.data.results[0]["destination_lng"],
        total_price: bookingDetailsResponse.data.results[0]["total_price"],
        base_price: bookingDetailsResponse.data.results[0]["base_price"],
        booking_timing:
          bookingDetailsResponse.data.results[0]["booking_timing"],
        driver_arrival_time:
          bookingDetailsResponse.data.results[0]["driver_arrival_time"],
        gst_amount: bookingDetailsResponse.data.results[0]["gst_amount"],
        igst_amount: bookingDetailsResponse.data.results[0]["igst_amount"],
        cancel_time: bookingDetailsResponse.data.results[0]["cancel_time"],
        goods_type_id: bookingDetailsResponse.data.results[0]["goods_type_id"],
        payment_method:
          bookingDetailsResponse.data.results[0]["payment_method"],
        cancelled_reason:
          bookingDetailsResponse.data.results[0]["cancelled_reason"],
        sender_name: bookingDetailsResponse.data.results[0]["sender_name"],
        sender_number: bookingDetailsResponse.data.results[0]["sender_number"],
        receiver_name: bookingDetailsResponse.data.results[0]["receiver_name"],
        receiver_number:
          bookingDetailsResponse.data.results[0]["receiver_number"],
        driver_first_name:
          bookingDetailsResponse.data.results[0]["driver_first_name"],
        goods_driver_auth_token:
          bookingDetailsResponse.data.results[0]["goods_driver_auth_token"],
        customer_name: bookingDetailsResponse.data.results[0]["customer_name"],
        customers_auth_token:
          bookingDetailsResponse.data.results[0]["customers_auth_token"],
        pickup_address:
          bookingDetailsResponse.data.results[0]["pickup_address"],
        drop_address: bookingDetailsResponse.data.results[0]["drop_address"],
        customer_mobile_no:
          bookingDetailsResponse.data.results[0]["customer_mobile_no"],
        driver_mobile_no:
          bookingDetailsResponse.data.results[0]["driver_mobile_no"],
        vehicle_id: bookingDetailsResponse.data.results[0]["vehicle_id"],
        vehicle_name: bookingDetailsResponse.data.results[0]["vehicle_name"],
        vehicle_image: bookingDetailsResponse.data.results[0]["vehicle_image"],
        vehicle_plate_no:
          bookingDetailsResponse.data.results[0]["vehicle_plate_no"],
        vehicle_fuel_type:
          bookingDetailsResponse.data.results[0]["vehicle_fuel_type"],
        profile_pic: bookingDetailsResponse.data.results[0]["profile_pic"],
        booking_date: bookingDetailsResponse.data.results[0]["booking_date"],
        booking_status:
          bookingDetailsResponse.data.results[0]["booking_status"],
        distance: bookingDetailsResponse.data.results[0]["distance"],
        total_time: bookingDetailsResponse.data.results[0]["total_time"],
        multiple_drops: Number(
          bookingDetailsResponse.data.results[0]["multiple_drops"]
        ),
        drop_locations:
          bookingDetailsResponse.data.results[0]["drop_locations"],
        drop_contacts: bookingDetailsResponse.data.results[0]["drop_contacts"],
      });

      console.log("bookingDetails.customer_name::" + bookingDetails.ratings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBookingHistoryDetails = async () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      setLoading(true);

      const [bookingDetailsResponse] = await Promise.all([
        axios.post(
          `${serverEndPoint}/get_goods_booking_detail_history_with_id`,
          {
            booking_id: booking_id,
          },
          config
        ),
      ]);

      setBookingHistory(bookingDetailsResponse.data.results || []);

      //   console.log("bookingDetails.customer_name::" + bookingDetails.ratings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsDetails();
    fetchBookingHistoryDetails();
  }, []);

  const getTimeAgo = (epochTime) => {
    const currentTime = Date.now() / 1000; // Convert current time to seconds
    const differenceInSeconds = currentTime - epochTime; // Difference in seconds
    const differenceInMinutes = Math.floor(differenceInSeconds / 60); // Convert to minutes

    if (differenceInMinutes < 60) {
      return differenceInMinutes === 0
        ? "Just now"
        : `${differenceInMinutes} mins ago`;
    } else {
      const date = new Date(epochTime * 1000); // Convert epoch to milliseconds
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const statusColors = {
    "Driver Accepted": "primary",
    "Driver Arrived": "secondary",
    "Otp Verified": "dark",
    "OTP Verified": "dark",
    "Start Trip": "primary",
    "Reached Drop Location 1": "primary",
    "Reached Drop Location 2": "primary",
    "Make Payment": "warning",
    Completed: "success",
    "End Trip": "success",
  };

  // Parse drop locations and contacts
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
      print("Error parsing drop locations or contacts:", e);
      dropLocations = [];
      dropContacts = [];
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="m-5">
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Booking Details</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone  ph-stack f-s-16"></i> Goods
                  </span>
                </a>
              </li>

              <li className="active">
                <a href="#" className="f-s-14 f-w-500">
                  Booking Details
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="order-details">
          <Col xxl={9}>
            <Row>
              <Col lg={12}>
                <Card className="shadow-lg border-0 rounded-lg">
                  <CardHeader>
                    <h5>Route</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="w-100 h-400" ref={polygonMapRef}></div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">
                      Booking Details (#{booking_id})
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-calendar f-s-18 me-2 text-secondary"></i>
                        Date
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.booking_date}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-credit-card f-s-18 me-2"></i>Time
                      </h6>
                      <div className="text-end">
                        <p>{formatEpoch(bookingDetails.booking_timing)}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-truck-delivery f-s-18 me-2"></i>
                        Current Status
                      </h6>
                      <div className="text-end">
                        <p
                          className={`badge bg-${(() => {
                            if (bookingDetails.booking_status === "Cancelled")
                              return "danger";
                            if (bookingDetails.booking_status === "End Trip")
                              return "success";
                            if (
                              bookingDetails.booking_status === "Driver Arrived"
                            )
                              return "warning";
                            if (
                              bookingDetails.booking_status ===
                              "Driver Accepted"
                            )
                              return "info";
                            if (bookingDetails.booking_status === "Start Trip")
                              return "secondary";
                            return "light";
                          })()}`}
                        >
                          {" "}
                          {bookingDetails.booking_status}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-moneybag f-s-18 me-2"></i>
                        Estimated Amount
                      </h6>
                      <div className="text-end">
                        <p className={`badge bg-primary`}>
                          {" "}
                          Rs.{bookingDetails.total_price} /-
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Customer Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-file-invoice text-secondary f-s-18 me-2"></i>
                        Customer
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.customer_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-mail f-s-18 text-secondary me-2"></i>
                        Email
                      </h6>
                      <div className="text-end">
                        <p>NA</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-device-mobile f-s-18 text-secondary me-2"></i>
                        contact
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.customer_mobile_no}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5>Driver Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-file-invoice text-secondary f-s-18 text-secondary me-2"></i>
                        Driver
                      </h6>
                      <div className="text-end">
                        <p> {bookingDetails.driver_first_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-truck-delivery f-s-18 text-secondary me-2"></i>
                        Vehicle
                      </h6>
                      <div className="text-end badge bg-green-700">
                        <p>{bookingDetails.vehicle_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-building-estate f-s-18 text-secondary me-2"></i>
                        Fuel Type
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p>{bookingDetails.vehicle_fuel_type}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark ">
                        <i className="ti ti-rectangle f-s-18 text-secondary me-2"></i>
                        Plate No
                      </h6>
                      <div className="text-end badge bg-info">
                        <p>{bookingDetails.vehicle_plate_no}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">Address Details </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-pin f-s-18 me-2 text-secondary"></i>
                        Pickup
                      </h6>
                      <div className="text-end ">
                        <p>{bookingDetails.pickup_address}</p>
                      </div>
                    </div>
                    {bookingDetails.multiple_drops > 0 ? (
                      <div>
                        <div className="d-flex justify-content-between mt-3">
                          <h6 className="f-w-600 text-dark">
                            <i className="ti ti-map-2 f-s-18 me-2"></i>
                            Multiple Drops ({bookingDetails.multiple_drops})
                          </h6>
                        </div>
                        {dropLocations.map((location, index) => (
                          <div key={index} className="mt-3">
                            <div className="d-flex justify-content-between">
                              <h6 className="f-w-600 text-dark">
                                <i className="ti ti-map-pin f-s-18 me-2"></i>
                                Drop {index + 1}
                              </h6>
                              <div className="text-end">
                                <p>{location.address}</p>
                                {dropContacts[index] && (
                                  <p className="text-secondary">
                                    Contact: {dropContacts[index].name} (
                                    {dropContacts[index].mobile})
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between mt-3">
                        <h6 className="f-w-600 text-dark">
                          <i className="ti ti-map-2 f-s-18 me-2"></i>Drop
                        </h6>
                        <div className="text-end">
                          <p>{bookingDetails.drop_address}</p>
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-pins f-s-18 me-2"></i>
                        Total Distance
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p> {bookingDetails.distance} KM</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-clock f-s-18 me-2"></i>
                        Total Time
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p> {bookingDetails.total_time}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={3}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">Sender Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-user-check f-s-18 me-2 text-secondary"></i>
                        Name
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.sender_name}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-phone f-s-18 me-2"></i>Contact
                      </h6>
                      <div className="text-end">
                        <p>{bookingDetails.sender_number}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {bookingDetails.multiple_drops <= 0 ? (
                <Col lg={3}>
                  <Card className="order-details-card shadow-lg border-0">
                    <CardHeader>
                      <h5>Receiver Details</h5>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <h6 className="f-w-600 text-dark">
                          <i className="ti ti-user-check f-s-18 me-2 text-secondary"></i>
                          Name
                        </h6>
                        <div className="text-end">
                          <p>{bookingDetails.receiver_name}</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <h6 className="f-w-600 text-dark">
                          <i className="ti ti-phone f-s-18 me-2"></i>Contact
                        </h6>
                        <div className="text-end">
                          <p>{bookingDetails.receiver_number}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </Col>

          <Col xxl={3}>
            <Card className="equal-card shadow-lg border-0">
              <CardHeader>
                <h5>Booking Status</h5>
              </CardHeader>
              <CardBody>
                <ul className="app-timeline-box">
                  {bookingHistory.map((history) => (
                    <li
                      className="timeline-section"
                      key={history.booking_history_id}
                    >
                      <div className="timeline-icon">
                        <span
                          className={`text-light-${
                            statusColors[history.status]
                          } h-35 w-35 d-flex-center b-r-50`}
                        >
                          <i className="ti ti-checks f-s-20"></i>
                        </span>
                      </div>
                      <div
                        className={`timeline-content bg-light-${
                          statusColors[history.status]
                        } b-1-${statusColors[history.status]}`}
                      >
                        <div className="d-flex justify-content-between align-items-center timeline-flex">
                          <h6
                            className={`mt-2 text-${
                              statusColors[history.status]
                            }`}
                          >
                            {history.status === "End Trip"
                              ? "Completed"
                              : history.status}
                          </h6>
                          <span
                            className={`badge text-bg-${
                              statusColors[history.status]
                            } ms-2`}
                          >
                            {getTimeAgo(history.time)}
                          </span>
                        </div>
                        <p className="text-secondary">{history.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-12">
                      <Card className="shadow-lg border-0 rounded-lg">
                        <CardHeader>
                          <h5>Price Details</h5>
                        </CardHeader>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table cart-side-table mb-0">
                              <tbody>
                                <tr className="total-price">
                                  <th>Sub Total :</th>
                                  <th className="text-end">
                                    <span id="cart-sub">
                                      ₹ {bookingDetails.total_price}
                                    </span>
                                  </th>
                                </tr>
                                <tr>
                                  <td>Discount:</td>
                                  <td className="text-end" id="cart-discount">
                                    ₹ 0.00
                                  </td>
                                </tr>
                                <tr>
                                  <td>Penalty Charge :</td>
                                  <td className="text-end" id="cart-shipping">
                                    ₹ 0.00
                                  </td>
                                </tr>
                                <tr>
                                  <td>Estimated Tax (12.5%) :</td>
                                  <td className="text-end" id="cart-tax">
                                    Not Applicable
                                  </td>
                                </tr>
                                <tr className="total-price">
                                  <th>Total (INR) :</th>
                                  <th className="text-end">
                                    <span id="cart-total">
                                      ₹ {Math.round(bookingDetails.total_price)}
                                      /-
                                    </span>
                                  </th>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GoodsBookingDetails;
