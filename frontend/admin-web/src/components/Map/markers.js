import { Marker, Popup} from "react-leaflet";
import L from "leaflet";

// Ensure default icons are correctly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const bikeIcon = L.icon({
    iconUrl: "/icons/bike-icon-40x40.png", // Replace with your custom icon path
    // iconRetinaUrl: "/path/to/bike-icon@2x.png", // For high-DPI displays
    iconSize: [28, 28], // Size of the icon [width, height]
    iconAnchor: [16, 32], // Anchor point (center-bottom of the icon)
    popupAnchor: [0, -32], // Anchor point for the popup (relative to icon)
});


export const addBikeMarker = (bikeData) => {
    // const { id, position, battery, status } = bikeData;
    const { bike_id, battery_level, latitude, longitude, status } = bikeData;

    const handleButtonClick = () => {
        console.log("Clicked bike: ", bike_id);
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
                {
                    status === "available" ?
                        <button id="bike_id" className="rent-button" onClick={handleButtonClick}>Rent Bike</button>
                        :
                        <button id={bike_id} className="rent-button" disabled>Not Available</button>
                }
            </Popup>
        </Marker>
    );
};

// Fix the marker
export const addStationMarker = (stationData) => {
    const { id, position, battery, status } = stationData;
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