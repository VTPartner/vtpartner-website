import { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import {
  formatEpoch,
  mapKey,
  serverEndPoint,
} from "../../../../../dashboard/app/constants";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Loader";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "10px",
};

const polylineOptions = {
  strokeColor: "#FF5733",
  strokeOpacity: 1,
  strokeWeight: 4,
};

const GoodsOrderDetails = () => {
  const { booking_id, order_id } = useParams();

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

  const intervalRef = useRef(null);

  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [dropLocations, setDropLocations] = useState([]);
  const [dropContacts, setDropContacts] = useState([]);

  // Set pickup & drop locations when bookingDetails is available
  useEffect(() => {
    if (bookingDetails?.pickup_lat && bookingDetails?.destination_lat) {
      setPickup({
        lat: parseFloat(bookingDetails.pickup_lat),
        lng: parseFloat(bookingDetails.pickup_lng),
      });

      if (bookingDetails.multiple_drops > 0) {
        try {
          const locations =
            typeof bookingDetails.drop_locations === "string"
              ? JSON.parse(bookingDetails.drop_locations)
              : bookingDetails.drop_locations;

          const contacts =
            typeof bookingDetails.drop_contacts === "string"
              ? JSON.parse(bookingDetails.drop_contacts)
              : bookingDetails.drop_contacts;

          if (Array.isArray(locations)) {
            setDropLocations(locations);
            setDropContacts(contacts);
          }
        } catch (error) {
          console.error("Error parsing drop locations:", error);
        }
      } else {
        setDrop({
          lat: parseFloat(bookingDetails.destination_lat),
          lng: parseFloat(bookingDetails.destination_lng),
        });
      }
    }
  }, [bookingDetails]);

  // Fetch driver location at regular intervals
  useEffect(() => {
    if (bookingDetails?.driver_id) {
      fetchDriverLocation();
      intervalRef.current = setInterval(fetchDriverLocation, 10000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [bookingDetails?.driver_id]);

  const fetchDriverLocation = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${serverEndPoint}/goods_driver_current_location`,
        { driver_id: bookingDetails.driver_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.results.length > 0) {
        setDriverLocation({
          lat: parseFloat(response.data.results[0].current_lat),
          lng: parseFloat(response.data.results[0].current_lng),
        });
      }
    } catch (error) {
      console.error("Error fetching driver location:", error);
    }
  };

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
          `${serverEndPoint}/get_goods_order_detail_with_id`,
          {
            order_id: order_id,
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
  }, []);

  useEffect(() => {
    fetchBookingHistoryDetails();
  }, [bookingDetails]);

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

  const navigate = useNavigate();

  const handleGenerateInvoice = () => {
    navigate(`/goods-invoice/${bookingDetails.order_id}`, {
      state: { bookingDetails },
    });
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="m-5">
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Order Details</h4>
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
                  Order Details
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
                    <LoadScript
                      googleMapsApiKey={mapKey}
                      libraries={["places"]}
                    >
                      {pickup && (drop || dropLocations.length > 0) ? (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={pickup}
                          zoom={12}
                          options={{
                            disableDefaultUI: false,
                            zoomControl: true,
                            streetViewControl: true,
                            scaleControl: true,
                            mapTypeControl: true,
                            fullscreenControl: true,
                          }}
                        >
                          {/* Pickup Marker */}
                          <Marker
                            position={pickup}
                            icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                          />

                          {/* Multiple Drop Markers */}
                          {dropLocations.length > 0 ? (
                            dropLocations.map((location, index) => (
                              <Marker
                                key={index}
                                position={{
                                  lat: parseFloat(location.lat),
                                  lng: parseFloat(location.lng),
                                }}
                                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                label={`${index + 1}`}
                              />
                            ))
                          ) : (
                            <Marker
                              position={drop}
                              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            />
                          )}

                          {/* Polylines */}
                          {dropLocations.length > 0 ? (
                            <>
                              <Polyline
                                path={[
                                  pickup,
                                  {
                                    lat: parseFloat(dropLocations[0].lat),
                                    lng: parseFloat(dropLocations[0].lng),
                                  },
                                ]}
                                options={polylineOptions}
                              />
                              {dropLocations.slice(1).map((location, index) => (
                                <Polyline
                                  key={index}
                                  path={[
                                    {
                                      lat: parseFloat(dropLocations[index].lat),
                                      lng: parseFloat(dropLocations[index].lng),
                                    },
                                    {
                                      lat: parseFloat(location.lat),
                                      lng: parseFloat(location.lng),
                                    },
                                  ]}
                                  options={polylineOptions}
                                />
                              ))}
                            </>
                          ) : (
                            <Polyline
                              path={[pickup, drop]}
                              options={polylineOptions}
                            />
                          )}

                          {/* Driver Marker */}
                          {driverLocation && (
                            <Marker
                              position={driverLocation}
                              icon="/assets/icon/car.png"
                            />
                          )}
                        </GoogleMap>
                      ) : (
                        <p>Loading map...</p>
                      )}
                    </LoadScript>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={4}>
                <Card className="order-details-card shadow-lg border-0">
                  <CardHeader>
                    <h5 className="text-nowrap">Order Details (#{order_id})</h5>
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
                    <h5 className="text-nowrap">Address Details</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-map-pin f-s-18 me-2 text-secondary"></i>
                        Pickup
                      </h6>
                      <div className="text-end">
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
                          <i className="ti ti-map-2 f-s-18 me-2"></i>
                          Drop
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
                        <p>{bookingDetails.distance} KM</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <h6 className="f-w-600 text-dark">
                        <i className="ti ti-clock f-s-18 me-2"></i>
                        Total Time
                      </h6>
                      <div className="text-end badge bg-primary">
                        <p>{bookingDetails.total_time}</p>
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
            </Row>
          </Col>

          <Col xxl={3}>
            <Card className="equal-card shadow-lg border-0">
              <CardHeader>
                <h5>Order Status</h5>
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
                                  <th>Payment Method (INR) :</th>
                                  <th className="text-end">
                                    <div className="badge bg-green-700">
                                      <span id="cart-total">
                                        {bookingDetails.payment_method}
                                      </span>
                                    </div>
                                  </th>
                                </tr>
                                <tr className="total-price">
                                  <th>Total (INR) :</th>
                                  <th className="text-end">
                                    <div className="badge bg-primary">
                                      <span id="cart-total ">
                                        ₹{" "}
                                        {Math.round(bookingDetails.total_price)}
                                        /-
                                      </span>
                                    </div>
                                  </th>
                                </tr>
                                <tr>
                                  <Button
                                    type="button"
                                    color="primary"
                                    className="m-1 bg-primary mt-4"
                                    onClick={handleGenerateInvoice}
                                  >
                                    <i className="ti ti-printer"></i> Generate
                                    Invoice
                                  </Button>
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

export default GoodsOrderDetails;
