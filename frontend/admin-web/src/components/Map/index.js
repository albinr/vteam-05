"use client";

import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { addBikeMarker, addChargingStationMarker, addParkingStationMarker } from "./markers.js";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const Map = ({ posix = [62.0, 13.0], zoom = 10, markers = [] }) => {
    const [userPosition, setUserPosition] = useState(null);

    useEffect(() => {
        const fetchUserPosition = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setUserPosition([latitude, longitude]);
                    },
                    () => {
                        console.error("Unable to retrieve your location");
                    }
                );
            } else {
                console.error("Geolocation not supported");
            }
        };

        fetchUserPosition();
    }, []);
    const bikeMarkers = markers.filter((marker) => marker.type === "bike");
    const parkingMarkers = markers.filter((marker) => marker.type === "parking");
    const chargingStationMarkers = markers.filter((marker) => marker.type === "chargestation");

    const centerPos = userPosition ? userPosition : posix;

    const locationIcon = L.icon({
        iconUrl: "/icons/location-icon.png",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, 9],
    });

    return (
        <MapContainer
            key={`${centerPos[0]}-${centerPos[1]}-${zoom}`}
            id="map"
            center={centerPos}
            zoom={zoom}
            scrollWheelZoom={true}
            dragging={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userPosition && (
                <Marker
                    position={userPosition}
                    icon={locationIcon}
                >
                    <Popup>Your location</Popup>
                </Marker>
            )}
            <MarkerClusterGroup chunkedLoading>
                {bikeMarkers.map((marker) => addBikeMarker(marker))}
            </MarkerClusterGroup>
            <MarkerClusterGroup chunkedLoading>

            </MarkerClusterGroup>
            {parkingMarkers.map((marker) => addParkingStationMarker(marker))}
            {chargingStationMarkers.map((marker) => addChargingStationMarker(marker))}
        </MapContainer>
    );
};

export default Map;
