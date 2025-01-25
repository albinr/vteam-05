"use client";

import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useRef, useCallback } from "react";
import { addBikeMarker, addChargingStationMarker, addParkingStationMarker } from "./markers.js";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const LeafletMap = ({ posix=[59.3290, 18.0680], zoom = 6, markers = [], userPosition=null}) => {
    const parkingMarkers = markers.filter((marker) => marker.type === "parking");
    const chargingStationMarkers = markers.filter((marker) => marker.type === "chargestation");
    const bikeMarkers = markers.filter((marker) => marker.type === "bike");

    const centerPos = userPosition ? userPosition : posix;

    const locationIcon = L.icon({
        iconUrl: "/icons/location-icon.png",
        iconSize: [18, 18],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
    return (
        <MapContainer
            key={`${centerPos[0]}-${centerPos[1]}-${zoom}`}
            id="map"
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

export default LeafletMap;
