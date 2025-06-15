/* eslint-disable react/prop-types */
import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";

const DeliveryMap = ({ pickupLocation, dropLocations }) => {
  const [directions, setDirections] = useState(null);

  const mapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    scrollwheel: false,
    zoomControl: true,
    styles: [
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // Format waypoints
  const waypoints = useMemo(() => {
    const drops = Array.isArray(dropLocations)
      ? dropLocations
      : [dropLocations];
    // Exclude the last drop as it's treated as destination
    return drops.slice(0, -1).map((loc) => ({
      location: { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) },
      stopover: true,
    }));
  }, [dropLocations]);

  const origin = useMemo(
    () => ({
      lat: parseFloat(pickupLocation.lat),
      lng: parseFloat(pickupLocation.lng),
    }),
    [pickupLocation]
  );

  const destination = useMemo(() => {
    const drops = Array.isArray(dropLocations)
      ? dropLocations
      : [dropLocations];
    return {
      lat: parseFloat(drops[drops.length - 1].lat),
      lng: parseFloat(drops[drops.length - 1].lng),
    };
  }, [dropLocations]);

  const directionsCallback = useCallback((response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h6 className="f-w-600 text-xl mb-3">
        Delivery Route{" "}
        {Array.isArray(dropLocations) && dropLocations.length > 1
          ? `(${dropLocations.length} Stops)`
          : ""}
      </h6>
      <div
        className="map-container rounded-lg overflow-hidden"
        style={{ height: "300px", width: "100%" }}
      >
        <GoogleMap
          zoom={12}
          mapContainerStyle={{ height: "100%", width: "100%" }}
          options={mapOptions}
          onLoad={(map) => {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(origin);
            if (Array.isArray(dropLocations)) {
              dropLocations.forEach((loc) => {
                bounds.extend({
                  lat: parseFloat(loc.lat),
                  lng: parseFloat(loc.lng),
                });
              });
            } else {
              bounds.extend({
                lat: parseFloat(dropLocations.lat),
                lng: parseFloat(dropLocations.lng),
              });
            }
            map.fitBounds(bounds);
          }}
        >
          {/* Show markers */}
          <Marker
            position={origin}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4CAF50",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#fff",
            }}
            label={{
              text: "P",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          />

          {(Array.isArray(dropLocations) ? dropLocations : [dropLocations]).map(
            (location, index) => (
              <Marker
                key={index}
                position={{
                  lat: parseFloat(location.lat),
                  lng: parseFloat(location.lng),
                }}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#F44336",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#fff",
                }}
                label={{
                  text:
                    Array.isArray(dropLocations) && dropLocations.length > 1
                      ? (index + 1).toString()
                      : "D",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            )
          )}

          {/* Render directions */}
          {!directions && (
            <DirectionsService
              options={{
                origin,
                destination,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
                optimizeWaypoints: true,
              }}
              callback={directionsCallback}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{
                directions,
                polylineOptions: {
                  strokeColor: "#2A62FF",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                },
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default DeliveryMap;
