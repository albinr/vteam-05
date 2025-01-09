import { Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";
import Button from "../Button";

// Ensure default icons are correctly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const bikeIcon = L.icon({
    iconUrl: "/icons/bike-icon-40x40.png",
    // iconRetinaUrl: "/path/to/bike-icon@2x.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

const parkingIcon = L.icon({
    iconUrl: "/icons/parking-icon-40x40.png",
    // iconRetinaUrl: "/path/to/bike-icon@2x.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

const chargeIcon = L.icon({
    iconUrl: "/icons/charge-icon-40x40.png",
    // iconRetinaUrl: "/path/to/bike-icon@2x.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

export const addBikeMarker = (bikeData) => {
    // const { id, position, battery, status } = bikeData;
    const { bike_id, battery_level, latitude, longitude, status } = bikeData;

    const handleButtonClick = async () => {
        try {
            window.location.href = `/bikes/${bike_id}`;
        } catch (error) {
            console.error("Error selecting bike:", error);
            return error;
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
                        : status === "rented" ?? status === "charging" ? "orange"
                            : status === "maintance" ? "red"
                                : "red"
                }}>{status}</span><br />
                Battery: {battery_level}%<br />
                <Button id="bike_id" className="rent-button" onClick={handleButtonClick}>Bike Edit</Button>
            </Popup>
        </Marker>
    );
};

// Fix the marker
export const addChargingStationMarker = (stationData) => {
    const { zone_id, name, city, type, longitude, latitude, capacity, radius } = stationData;
    return (
        <>
            <Marker
                key={zone_id}
                position={[longitude, latitude]}
                icon={chargeIcon}
            >
                <Popup>
                    <strong>{name}</strong><br />
                    {/* <Circle center={[longitude, latitude]} radius={radius} pathOptions={{ color: 'blue' }} icon={chargeIcon} /> */}
                </Popup>
            </Marker>
        </>
    );
};

export const addParkingStationMarker = (stationData) => {
    const { zone_id, name, city, type, longitude, latitude, capacity, radius } = stationData;
    return (
        <>
            <Marker
                key={zone_id}
                position={[longitude, latitude]}
                icon={parkingIcon}
            >
                <Popup>
                    <strong>{name}</strong><br />
                    {/* <Circle center={[longitude, latitude]} radius={radius} pathOptions={{ color: 'blue' }} icon={chargeIcon} /> */}
                </Popup>
            </Marker>
        </>
    );
};


// Fix the marker
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