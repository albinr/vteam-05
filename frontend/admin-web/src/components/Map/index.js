"use client";

import MarkerClusterGroup from 'react-leaflet-cluster'
import { MapContainer, TileLayer } from "react-leaflet";
import { addBikeMarker, addStationMarker, addZoneMarker } from "./markers.js";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const Map = ({ posix = [62.0, 13.0], zoom = 6, markers = [] }) => {
    return (
        <MapContainer
            key={`${posix[0]}-${posix[1]}-${zoom}`}
            id="map"
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            dragging={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                chunkedLoading
            >
                {markers.map((marker) => {
                    return addBikeMarker(marker);
                })}
            </MarkerClusterGroup>
        </MapContainer>
    );
};

export default Map;