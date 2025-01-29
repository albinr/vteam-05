import { Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import Cookies from "js-cookie";
import { useState } from "react";
import { apiClient } from "@/services/apiClient";

// Ensure default icons are correctly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const bikeIcon = L.icon({
    iconUrl: "/icons/bike-icon-40x40.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -14],
});

const parkingIcon = L.icon({
    iconUrl: "/icons/parking-icon-40x40.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

const chargeIcon = L.icon({
    iconUrl: "/icons/charge-icon-40x40.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

export const addBikeMarker = ({ bikeData }) => {
    const { bike_id, battery_level, latitude, longitude, status, simulation } = bikeData;

    const handleButtonClick = async () => {
        if (status !== "available") {
            console.log("Bike is not available for rent");
            return;
        }

        const userId = Cookies.get("user") ? JSON.parse(Cookies.get("user")).id : null;

        if (!bike_id || !userId) {
            console.log("Missing bikeId or userId");
            return;
        }

        try {
            let token = Cookies.get("token");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v3/trips/start/${bike_id}/${userId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            // Redirect to "/trip"
            window.location.href = "/trip";

        } catch (error) {
            console.error("Error starting trip:", error);
        }

    };

    return (
        <Marker
            key={bike_id}
            position={[longitude, latitude]}
            icon={bikeIcon}
        >
            <Popup>
                <strong>{bike_id}</strong><br />
                <span style={{
                    color: status === "available" ? "green"
                    : ["rented", "charging"].includes(status) ? "orange"
                    : status === "maintenance" ? "red"
                    : "red"
                }}>{status}</span><br />
                Battery: {Math.round(battery_level)}%<br />
                {
                    status === "available" && !simulation ?
                        <button id={bike_id} className="rent-button" onClick={handleButtonClick}>Rent Bike</button>
                        :
                        <button id={bike_id} className="rent-button rent-button-disabled" disabled>Bike Not Available</button>
                }
                {/* {message && <p>{message}</p>} */}
            </Popup>
        </Marker>
    );
};

export const addChargingStationMarker = (stationData) => {
    const { zone_id, name, city, type, longitude, latitude, capacity, radius } = stationData;
    return (
        <Marker
            key={zone_id}
            position={[longitude, latitude]}
            icon={chargeIcon}
            >
            <Popup>
                <strong>{name}</strong><br />
                <strong>{city}</strong><br />
                <strong>({type})</strong><br />
                <Circle center={[longitude, latitude]} radius={radius} pathOptions={{ color: 'green' }} icon={chargeIcon} />
            </Popup>
        </Marker>
    );
};

export const addParkingStationMarker = (stationData) => {
    const { zone_id, name, city, type, longitude, latitude, capacity, radius } = stationData;
    return (
        <Marker
            key={zone_id}
            position={[longitude, latitude]}
            icon={parkingIcon}
            >
            <Popup>
                <strong>{name}</strong><br />
                <strong>{city}</strong><br />
                <strong>({type})</strong><br />
                <Circle center={[longitude, latitude]} radius={radius} pathOptions={{ color: 'blue' }} icon={chargeIcon} />
            </Popup>
        </Marker>
    );
};

export const addZoneMarker = (zoneData) => {
    const { id, position, battery, status } = zoneData;
    return (
        <Marker
            key={id}
            position={position}
        >
            <Popup>
                <strong>Bike {id}</strong><br />
                Battery: {battery}%<br />
                Status: {status}
            </Popup>
        </Marker>
    );
};