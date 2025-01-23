"use client";

import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useRef, useCallback } from "react";
import { addBikeMarker, addChargingStationMarker, addParkingStationMarker } from "./markers.js";
import { initializeWebSocket } from "@/services/websocket.js";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const BikeMap = ({ posix = [62.0, 13.0], zoom = 10, markers = [] }) => {
    const mapRef = useRef(null);
    // Separate markers by type
    const parkingMarkers = markers.filter((marker) => marker.type === "parking");
    const chargingStationMarkers = markers.filter((marker) => marker.type === "chargestation");
    const bikeMarkers = markers.filter((marker) => marker.type === "bike");
    const [userPosition, setUserPosition] = useState(null);
    const socketRef = useRef(null);
    const centerPos = userPosition || posix;
    const locationIcon = L.icon({
        iconUrl: "/icons/location-icon.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, 0],
    });

    // Fetch user position
    useEffect(() => {
        const fetchUserPosition = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("User position fetched:", [latitude, longitude]);
                        setUserPosition([latitude, longitude]);
                    },
                    (err) => {
                        console.error("Failed to fetch user position:", err);
                    }
                );
            } else {
                console.error("Geolocation not supported");
            }
        };

        fetchUserPosition();
    }, []);

    // const updateBikeMarkers = useCallback((updatedBike) => {
    //     if (!mapRef.current) return; // Ensure the map is initialized
    
    //     try {
    //         if (!markersRef.current[updatedBike.bike_id]) {
    //             // Create a new marker if it doesn't exist
    //             const marker = addBikeMarker({
    //                 ...updatedBike,
    //                 key: updatedBike.bike_id,
    //             });
    //             marker.addTo(mapRef.current); // Add marker to the map
    //             markersRef.current[updatedBike.bike_id] = marker; // Store in ref
    //         } else {
    //             // Update existing marker position
    //             const existingMarker = markersRef.current[updatedBike.bike_id];
    //             existingMarker.setLatLng([updatedBike.latitude, updatedBike.longitude]);
    //         }
    //     } catch (error) {
    //         console.error("Error updating marker:", error);
    //     }
    // }, []);
    // Initialize WebSocket and handle updates
    useEffect(() => {
        socketRef.current = initializeWebSocket();

        socketRef.current.on("bike-update-frontend", (updatedBike) => {
            console.log("Received message:", updatedBike);
            // updateBikeMarkers(updatedBike);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("WebSocket disconnected");
            }
        };
    }, []);

    return (
        <MapContainer
            key={`${centerPos[0]}-${centerPos[1]}-${zoom}`}
            id="map"
            ref={mapRef}
            center={centerPos}
            zoom={zoom}
            scrollWheelZoom
            dragging
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userPosition && (
                <Marker position={userPosition} icon={locationIcon}>
                    <Popup>Your location</Popup>
                </Marker>
            )}
            <MarkerClusterGroup chunkedLoading>
                {bikeMarkers.map((marker) => (
                    addBikeMarker({ ...marker, key: marker.bike_id })
                ))}
            </MarkerClusterGroup>
            {parkingMarkers.map((marker) => (
                addParkingStationMarker({ ...marker, key: marker.zone_id })
            ))}
            {chargingStationMarkers.map((marker) => (
                addChargingStationMarker({ ...marker, key: marker.zone_id })
            ))}
        </MapContainer>
    );
};

export default BikeMap;
