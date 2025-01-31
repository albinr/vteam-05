import { Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import Button from "../Button";
import { getWebSocket } from "@/services/websocket";

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
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
});

const parkingIcon = L.icon({
    iconUrl: "/icons/parking-icon-40x40.png",
    // iconRetinaUrl: "/path/to/bike-icon@2x.png",
    iconSize: [28, 28],
    iconAnchor: [14, 30],
    popupAnchor: [0, -18],
});

const chargeIcon = L.icon({
    iconUrl: "/icons/charge-icon-40x40.png",
    // iconRetinaUrl: "/path/to/bike-icon@2x.png",
    iconSize: [28, 28],
    iconAnchor: [14, 30],
    popupAnchor: [0, -18],
});

const sendCommand = (bikeId, commandToSend) => {
    try {
        const socket = getWebSocket();
        if (socket.connected) { // Check if the socket is connected
            socket.emit("command", JSON.stringify({ bike_id: bikeId, command: commandToSend }));
            console.log(`Sent command "${commandToSend}" to bike ${bikeId}`);
        } else {
            console.error("WebSocket is not connected.");
        }
    } catch (error) {
        console.error("Error sending command:", error);
    }
};

export const addBikeMarker = (bikeData) => {
    // const { id, position, battery, status } = bikeData;
    const { bike_id, battery_level, latitude, longitude, status } = bikeData;

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
                        : status === "in_use" ?? status === "charging" ? "orange"
                            : status === "maintance" ? "red"
                                : "red"
                }}>{status}</span><br />
                <strong>Battery:</strong> {battery_level}%<br />
                <Button
                    onClick={() => sendCommand(bike_id, "stop")}
                    label={"Stop"}
                />
                {/* <Button
                    onClick={() => sendCommand(bike_id, "shutdown")}
                    label={"Shutdown"}
                /> */}
                <Button
                    onClick={() => sendCommand(bike_id, "rent")}
                    label={"Rent for testing"}
                />
            </Popup>
        </Marker>
    );
};

// Fix the marker
export const addChargingStationMarker = (stationData) => {
    const { zone_id, name, city, type, longitude, latitude, capacity, radius } = stationData;
    return (
        <Marker
            key={zone_id}
            position={[longitude, latitude]}
            icon={chargeIcon}
        >
            <Popup>
                <strong>{city}</strong><br />
                <strong>{name}</strong><br />
                <strong>{type}</strong><br />
                <strong>Radius: {radius}</strong><br />
                <strong>Longitude: {longitude}</strong><br />
                <strong>Latitude: {latitude}</strong><br />
                <strong>Capacity: {capacity}</strong><br />
            </Popup>
            <Circle center={[longitude, latitude]} radius={radius} pathOptions={{ color: 'green' }} icon={chargeIcon} >
                <Popup>
                    <strong>{city}</strong><br />
                    <strong>{name}</strong><br />
                    <strong>{type}</strong><br />
                    <strong>Radius: {radius}</strong><br />
                    <strong>Longitude: {longitude}</strong><br />
                    <strong>Latitude: {latitude}</strong><br />
                    <strong>Capacity: {capacity}</strong><br />
                </Popup>
            </Circle>
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
                <strong>{city}</strong><br />
                <strong>{name}</strong><br />
                <strong>{type}</strong><br />
                <strong>Radius: {radius}</strong><br />
                <strong>Longitude: {longitude}</strong><br />
                <strong>Latitude: {latitude}</strong><br />
                <strong>Capacity: {capacity}</strong><br />
            </Popup>
            <Circle center={[longitude, latitude]} radius={radius} pathOptions={{ color: 'blue' }} icon={chargeIcon}>
                <Popup>
                    <strong>{city}</strong><br />
                    <strong>{name}</strong><br />
                    <strong>{type}</strong><br />
                    <strong>Radius: {radius}</strong><br />
                    <strong>Longitude: {longitude}</strong><br />
                    <strong>Latitude: {latitude}</strong><br />
                    <strong>Capacity: {capacity}</strong><br />
                </Popup>
            </Circle>
        </Marker>
    );
};
