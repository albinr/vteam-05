"use client";
import React, { useRef } from "react";
import { GoogleMap, useLoadScript, Marker, Circle, Polygon } from "@react-google-maps/api";

import Loader from "../Loader";

const defaultContainerStyle = {
    width: "100%",
    height: "600px",
};

const defaultMapStyles = [
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
    },
    {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
    },
];

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const MapComponent = ({
    center = { lat: 58.3293, lng: 15.0686 },
    zoom = 6,
    markers = [],
    circles = [],
    polygons = [],
    disableDefaultUI = false,
    styles = defaultMapStyles,
    googleMapsApiKey = GOOGLE_MAPS_API_KEY,
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey,
    });

    const mapRef = useRef(null);

    if (loadError) return <div>Error loading maps.</div>;
    if (!isLoaded) return <Loader />;

    return (
        <GoogleMap
            mapContainerStyle={defaultContainerStyle}
            center={center}
            zoom={zoom}
            options={{
                disableDefaultUI,
                styles,
                mapTypeControl: false,
                mapTypeId: "roadmap"
            }}
            onLoad={(map) => (mapRef.current = map)}
        >
            {/* Render individual markers */}
            {markers.map((marker, idx) => (
                <Marker
                    key={idx}
                    position={marker.position}
                    label={marker.label}
                    icon={marker.icon}
                    onClick={marker.onClick}
                />
            ))}

            {/* Render circles */}
            {circles.map((circle, idx) => (
                <Circle
                    key={idx}
                    center={circle.center}
                    radius={circle.radius}
                    options={circle.options}
                />
            ))}

            {/* Render polygons */}
            {polygons.map((polygon, idx) => (
                <Polygon key={idx} paths={polygon.paths} options={polygon.options} />
            ))}
        </GoogleMap>
    );
};

export default MapComponent;
