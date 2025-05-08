/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react"; // Add useState
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { mapKey, serverEndPoint } from "../../../../dashboard/app/constants";

const AllOnlineOtherDrivers = () => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [noDrivers, setNoDrivers] = useState(false); // Add state for no drivers

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById("googleMaps");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
        script.id = "googleMaps";
        document.body.appendChild(script);
        script.onload = () => {
          initMap();
        };
      } else {
        initMap();
      }
    };

    const initMap = () => {
      const { google } = window;
      if (!google) {
        console.warn("Google Maps API not loaded.");
        return;
      }

      // Initialize map with default settings
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Default to India's center
        zoom: 5,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      fetchDriverLocations(map);
    };

    const fetchDriverLocations = async (map) => {
      const token = Cookies.get("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await axios.post(
          `${serverEndPoint}/get_all_other_driver_online_current_location`,
          {},
          config
        );

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        if (
          response.status === 200 &&
          response.data.results &&
          response.data.results.length > 0
        ) {
          setNoDrivers(false); // Reset no drivers state
          const drivers = response.data.results;

          drivers.forEach((driver) => {
            const position = {
              lat: parseFloat(driver.current_lat),
              lng: parseFloat(driver.current_lng),
            };

            const marker = new google.maps.Marker({
              position,
              map,
              title: driver.driver_first_name,
              icon: {
                url: "/assets/icon/car.png",
                scaledSize: new google.maps.Size(40, 40),
              },
            });

            const infoWindow = new google.maps.InfoWindow({
              content: `<div style="text-align: center;">
                          <img src="${driver.profile_pic}" width="50" height="50" style="border-radius: 50%;" /><br/>
                          <strong>${driver.driver_first_name}</strong>
                        </div>`,
            });

            marker.addListener("mouseover", () => {
              infoWindow.open(map, marker);
            });

            marker.addListener("mouseout", () => {
              infoWindow.close();
            });

            markersRef.current.push(marker);
          });
        } else {
          setNoDrivers(true); // Set no drivers state to true
          console.warn("No drivers found.");
        }
      } catch (error) {
        setNoDrivers(true); // Set no drivers state to true on error
        console.error("Error fetching driver locations:", error);
      }
    };

    loadGoogleMapsScript();

    // Cleanup function
    return () => {
      // Clear markers when component unmounts
      markersRef.current.forEach((marker) => marker.setMap(null));
    };
  }, []);

  return (
    <Col lg={12}>
      <Card className="shadow-lg border-0 rounded">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5>All Online Driver Agents</h5>
          {noDrivers && (
            <span className="text-muted">
              No online Driver Agents available
            </span>
          )}
        </CardHeader>
        <CardBody>
          <div
            className="w-100 h-400"
            ref={mapRef}
            style={{
              height: "400px",
              position: "relative",
            }}
          >
            {noDrivers && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: "15px",
                  borderRadius: "5px",
                  zIndex: 1,
                }}
              >
                No online drivers available at the moment
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AllOnlineOtherDrivers;
