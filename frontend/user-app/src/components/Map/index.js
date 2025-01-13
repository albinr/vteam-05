"use client";

import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import { addBikeMarker, addChargingStationMarker, addParkingStationMarker } from "./markers.js";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const locationIcon = L.icon({
    iconUrl: "/icons/location-icon.png",
    // iconRetinaUrl: "/path/to/bike-icon@2x.png",
    iconSize: [18, 18],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
});

const Map = ({ posix=[59.3290, 18.0680], zoom = 6, markers = [], userPosition=null}) => {
    const bikeMarkers = markers.filter(marker => marker.type === "bike");
    const parkingMarkers = markers.filter(marker => marker.type === "parking");
    const chargingStationMarkers = markers.filter(marker => marker.type === "chargestation");

    const centerPos = userPosition ? userPosition : posix;

    return (
        <MapContainer
            key={`${centerPos[0]}-${centerPos[1]}-${zoom}`}
            id="map"
            center={centerPos}
            zoom={zoom}
            scrollWheelZoom={true}
            dragging={true}
            zoomControl={false}
        >
            {
                userPosition && <Marker position={centerPos} icon={locationIcon} />
            }
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading>
                {bikeMarkers.map((marker) => addBikeMarker(marker))}
            </MarkerClusterGroup>
            <MarkerClusterGroup chunkedLoading>
                {parkingMarkers.map((marker) => addParkingStationMarker(marker))}
            </MarkerClusterGroup>
            <MarkerClusterGroup chunkedLoading>
                {chargingStationMarkers.map((marker) => addChargingStationMarker(marker))}
            </MarkerClusterGroup>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
};

export default Map;
