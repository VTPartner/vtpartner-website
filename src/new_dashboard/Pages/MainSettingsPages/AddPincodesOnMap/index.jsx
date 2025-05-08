/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Polygon,
} from "@react-google-maps/api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Loader";
import { serverEndPoint, mapKey } from "../../../../dashboard/app/constants";

// Use your Google Maps API key
const GOOGLE_MAPS_API_KEY = mapKey;

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const libraries = ["drawing", "places", "geometry"];

const MapPincodeSelector = () => {
  const { city_id, city_name } = useParams();
  const navigate = useNavigate();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default center (India)
  const [zoom, setZoom] = useState(5);
  const [paths, setPaths] = useState([]);
  const [selectedPincodes, setSelectedPincodes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingStats, setAddingStats] = useState(null);
  const polygonRef = useRef(null);
  const drawingManagerRef = useRef(null);

  // Search for city to center the map
  useEffect(() => {
    if (isLoaded && city_name) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: city_name + ", India" },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            setCenter({ lat: lat(), lng: lng() });
            setZoom(11); // Zoom to city level
          }
        }
      );
    }
  }, [isLoaded, city_name]);

  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const onDrawingManagerLoad = React.useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  const onPolygonComplete = React.useCallback((polygon) => {
    // Save the reference to the polygon
    polygonRef.current = polygon;

    // Get the polygon paths (array of coordinates)
    const polygonPaths = polygon.getPath().getArray();
    const pathsArray = polygonPaths.map((point) => ({
      lat: point.lat(),
      lng: point.lng(),
    }));
    setPaths(pathsArray);

    // Disable drawing after completion
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, []);

  // Helper function to check if a place is within the polygon
  const isLocationInPolygon = (location, paths) => {
    if (!window.google || !paths.length) return false;

    const poly = new window.google.maps.Polygon({ paths });
    const point = new window.google.maps.LatLng(location.lat, location.lng);
    return window.google.maps.geometry.poly.containsLocation(point, poly);
  };

  // Get pincodes for a specific location using Geocoding API
  const getPincodesForLocation = async (location) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ location: location }, (results, status) => {
        if (status === "OK" && results && results.length) {
          const pincodes = [];
          // Loop through all results and find postal codes
          for (const result of results) {
            const postalComponent = result.address_components.find(
              (component) => component.types.includes("postal_code")
            );
            if (postalComponent && postalComponent.long_name) {
              pincodes.push(postalComponent.long_name);
            }
          }
          resolve(pincodes);
        } else {
          resolve([]);
        }
      });
    });
  };

  // Search for pincodes in the polygon using a grid approach
  const searchPincodes = async () => {
    if (!paths.length) {
      toast.error("Please draw an area on the map first.");
      return;
    }

    setIsSearching(true);
    try {
      // Create bounds from polygon
      const bounds = new window.google.maps.LatLngBounds();
      paths.forEach((point) => {
        bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
      });

      // Create a grid of points inside the bounds for sampling
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const latStep = (ne.lat() - sw.lat()) / 10; // Divide into 10 steps
      const lngStep = (ne.lng() - sw.lng()) / 10;

      const samplePoints = [];
      for (let lat = sw.lat(); lat <= ne.lat(); lat += latStep) {
        for (let lng = sw.lng(); lng <= ne.lng(); lng += lngStep) {
          const point = { lat, lng };
          if (isLocationInPolygon(point, paths)) {
            samplePoints.push(point);
          }
        }
      }

      // Add the original polygon points to ensure we check the boundaries
      paths.forEach((point) => {
        samplePoints.push(point);
      });

      // Get pincodes for each sample point
      const foundPincodes = new Set();
      let progress = 0;

      // Process in smaller batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < samplePoints.length; i += batchSize) {
        const batch = samplePoints.slice(i, i + batchSize);
        const batchPromises = batch.map((point) =>
          getPincodesForLocation(point)
        );

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach((pincodes) => {
          pincodes.forEach((pincode) => {
            if (pincode && /^\d{6}$/.test(pincode)) {
              // Validate it's a 6-digit pincode
              foundPincodes.add(pincode);
            }
          });
        });

        // Update progress for UX feedback (could be used with a progress bar)
        progress = Math.round(((i + batch.length) / samplePoints.length) * 100);
      }

      // Process results
      const pincodesList = Array.from(foundPincodes);
      setSelectedPincodes(pincodesList);
      setIsSearching(false);

      if (pincodesList.length === 0) {
        toast.warning(
          "No pincodes found in the selected area. Try expanding your selection or selecting a different area."
        );
      } else {
        toast.success(
          `Found ${pincodesList.length} pincodes in the selected area.`
        );
      }
    } catch (error) {
      console.error("Error searching pincodes:", error);
      setIsSearching(false);
      toast.error("Error searching for pincodes. Please try again.");
    }
  };

  //   const handleSavePincodes = async () => {
  //     if (selectedPincodes.length === 0) {
  //       toast.warning(
  //         "No pincodes selected. Please draw an area and search for pincodes first."
  //       );
  //       return;
  //     }

  //     setIsSubmitting(true);
  //     const token = Cookies.get("authToken");

  //     try {
  //       // Use the bulk upload endpoint
  //       const response = await axios.post(
  //         `${serverEndPoint}/add_multiple_pincodes`,
  //         {
  //           city_id: city_id,
  //           pincodes: selectedPincodes,
  //           pincode_status: 1,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       const { added_count, existing_count, failed_count } = response.data;
  //       setAddingStats({ added_count, existing_count, failed_count });

  //       // Show summary toast
  //       if (added_count > 0) {
  //         toast.success(`Successfully added ${added_count} new pincodes`);
  //       }
  //       if (existing_count > 0) {
  //         toast.info(
  //           `${existing_count} pincodes already existed and were skipped`
  //         );
  //       }
  //       if (failed_count > 0) {
  //         toast.error(`Failed to add ${failed_count} pincodes due to errors`);
  //       }
  //     } catch (error) {
  //       toast.error("An error occurred while adding pincodes from the map");
  //       console.error("Error:", error);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   };

  const handleSavePincodes = async () => {
    if (selectedPincodes.length === 0) {
      toast.warning(
        "No pincodes selected. Please draw an area and search for pincodes first."
      );
      return;
    }

    setIsSubmitting(true);
    const token = Cookies.get("authToken");

    try {
      // Make sure selectedPincodes is an array of strings (6-digit pincodes)
      console.log("Selected pincodes:", selectedPincodes);

      // Validate pincodes before sending
      const validPincodes = selectedPincodes.filter(
        (pincode) => pincode && /^\d{6}$/.test(pincode)
      );

      console.log("Valid pincodes to send:", validPincodes);

      if (validPincodes.length === 0) {
        toast.error("No valid pincodes found to add");
        setIsSubmitting(false);
        return;
      }

      // Make sure city_id is actually available and valid
      console.log("City ID:", city_id);

      if (!city_id) {
        toast.error("Missing city ID");
        setIsSubmitting(false);
        return;
      }

      // Send the request
      const response = await axios.post(
        `${serverEndPoint}/add_multiple_pincodes`,
        {
          city_id: city_id,
          pincodes: validPincodes,
          pincode_status: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      const { added_count, existing_count, failed_count } = response.data;
      setAddingStats({ added_count, existing_count, failed_count });

      // Show summary toast
      if (added_count > 0) {
        toast.success(`Successfully added ${added_count} new pincodes`);
      }
      if (existing_count > 0) {
        toast.info(
          `${existing_count} pincodes already existed and were skipped`
        );
      }
      if (failed_count > 0) {
        toast.error(`Failed to add ${failed_count} pincodes due to errors`);
      }
    } catch (error) {
      console.error("Error adding pincodes:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(
          `Error: ${error.response.data.message || "Unknown server error"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from server");
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearPolygon = () => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    setPaths([]);
    setSelectedPincodes([]);
    setAddingStats(null);
  };

  const goBack = () => {
    //navigate(`/dashboard/all-allowed-pincodes/${city_id}/${city_name}`);
  };

  if (loadError)
    return (
      <Container>
        <div className="alert alert-danger">
          Error loading Google Maps: {loadError.message}
        </div>
      </Container>
    );

  if (!isLoaded) return <Loader />;

  return (
    <div>
      <ToastContainer position="top-right" />
      <Container fluid>
        <Row className="m-1">
          <Col xs={12}>
            <h4 className="main-title">Add Pincodes Using Map</h4>
            <ul className="app-line-breadcrumbs mb-3">
              <li className="">
                <a href="#" className="f-s-14 f-w-500">
                  <span>
                    <i className="ph-duotone ph-map-pin f-s-16"></i> Pincodes
                  </span>
                </a>
              </li>
              <li className="">
                <a href="#" className="f-s-14 f-w-500" onClick={goBack}>
                  {city_name}
                </a>
              </li>
              <li className="active mt-2">
                <a href="#" className="f-s-14 f-w-500">
                  Map Selection
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col xs={12} className="mb-4">
            <Card className="shadow-lg border-0 rounded-lg">
              <CardBody>
                <div className="mb-4">
                  <h5 className="mb-3">Instructions:</h5>
                  <ol className="ps-3">
                    <li className="mb-2">
                      Use the polygon tool{" "}
                      <i className="ti ti-shape-polygon"></i> from the top
                      center of the map to draw an area.
                    </li>
                    <li className="mb-2">
                      Click "Search Pincodes" to find all postal codes in the
                      selected area.
                    </li>
                    <li className="mb-2">
                      Review the found pincodes, then click "Add Selected
                      Pincodes" to add them to {city_name}.
                    </li>
                  </ol>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button
                    className="btn btn-primary"
                    onClick={searchPincodes}
                    disabled={isSearching || paths.length === 0}
                  >
                    {isSearching ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-search me-1"></i>
                        Search Pincodes
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={handleClearPolygon}
                    disabled={paths.length === 0}
                  >
                    <i className="ti ti-eraser me-1"></i>
                    Clear Selection
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={handleSavePincodes}
                    disabled={isSubmitting || selectedPincodes.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-device-floppy me-1"></i>
                        Add Selected Pincodes
                      </>
                    )}
                  </button>

                  {/* <button className="btn btn-secondary" onClick={goBack}>
                    <i className="ti ti-arrow-back-up me-1"></i>
                    Return to Pincodes
                  </button> */}
                </div>

                {/* Google Map */}
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={zoom}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  <DrawingManager
                    onLoad={onDrawingManagerLoad}
                    onPolygonComplete={onPolygonComplete}
                    options={{
                      drawingControl: true,
                      drawingControlOptions: {
                        position: window.google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [
                          window.google.maps.drawing.OverlayType.POLYGON,
                        ],
                      },
                      polygonOptions: {
                        fillColor: "#ff0000",
                        fillOpacity: 0.3,
                        strokeColor: "#ff0000",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        clickable: true,
                        editable: true,
                        draggable: false,
                      },
                    }}
                  />

                  {/* Display the completed polygon */}
                  {paths.length > 0 && (
                    <Polygon
                      paths={paths}
                      options={{
                        fillColor: "#ff0000",
                        fillOpacity: 0.3,
                        strokeColor: "#ff0000",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                    />
                  )}
                </GoogleMap>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Selected Pincodes Card */}
        {selectedPincodes.length > 0 && (
          <Row>
            <Col xs={12}>
              <Card className="shadow-lg border-0 rounded-lg">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      Selected Pincodes ({selectedPincodes.length})
                    </h5>

                    {addingStats && (
                      <div className="d-flex gap-2">
                        {addingStats.added_count > 0 && (
                          <span className="badge bg-success">
                            {addingStats.added_count} Added
                          </span>
                        )}
                        {addingStats.existing_count > 0 && (
                          <span className="badge bg-info">
                            {addingStats.existing_count} Existing
                          </span>
                        )}
                        {addingStats.failed_count > 0 && (
                          <span className="badge bg-danger">
                            {addingStats.failed_count} Failed
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="pincode-chips"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "10px",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    {selectedPincodes.map((pincode) => (
                      <div
                        key={pincode}
                        style={{
                          backgroundColor: "#e0e0e0",
                          color: "#333",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {pincode}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MapPincodeSelector;
