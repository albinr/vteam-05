"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Map = ({ posix = [62.0, 15.0], zoom = 5, markers = [] }) => {
    useEffect(() => {
        return () => {
            const mapContainer = L.DomUtil.get("map");
            if (mapContainer && mapContainer._leaflet_id) {
                mapContainer._leaflet_id = null;
            }
        };
    }, []);

    return (
        <MapContainer
            id="map"
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            dragging={true}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position}>
                    <Popup>{marker.popupText}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
