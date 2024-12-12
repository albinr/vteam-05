"use client";

import React from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import Loader from "@/components/Loader";

const GoogleMapComponent = ({
    center = { lat: 59.3293, lng: 18.0686 }, // Default center
    zoom = 10, // Default zoom level
    markers = [], // Array of markers
    containerStyle = { width: "100%", height: "400px" }, // Default container style
    circle = null, // Circle options
    options = {}, // Custom map options
    styles = [], // Custom map styles
}) => {
    return (
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} // API Key
            loadingElement={<Loader />} // Custom loader
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                options={{
                    ...options,
                    styles, // Apply custom styles
                }}
            >
                {markers.map((marker, index) => (
                    <Marker key={index} position={marker.position} title={marker.title} />
                ))}
                {circle && (
                    <Circle
                        center={circle.center}
                        radius={circle.radius}
                        options={{
                            fillColor: circle.color || "#FF0000",
                            fillOpacity: 0.2,
                            strokeColor: circle.color || "#FF0000",
                            strokeOpacity: 0.5,
                            strokeWeight: 2,
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;
