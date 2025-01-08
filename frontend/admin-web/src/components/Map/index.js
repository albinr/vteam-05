"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { addBikeMarker,addStationMarker,addZoneMarker } from "./markers.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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
            {markers.map((marker) => {
                // switch (marker.type) {
                //     case "bike":
                //         return addBikeMarker(marker);
                //     case "station":
                //         return addStationMarker(marker);
                //     case "zone":
                //         return addZoneMarker(marker);
                //     default:
                //         return null;
                // }
                return addBikeMarker(marker);
            })}
        </MapContainer>
    );
};

export default Map;