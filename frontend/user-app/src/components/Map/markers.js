import { Marker, Popup} from "react-leaflet";
import L from "leaflet";

// Ensure default icons are correctly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export const addBikeMarker = (bikeData) => {
    // const { id, position, battery, status } = bikeData;
    const { bike_id, battery_level, latitude, longitude, status } = bikeData;

    const handleButtonClick = () => {
        if (status !== "available") {
            console.log("Bike is not available for rent");
            return;
        }
        console.log("Renting bike: ", bike_id);
    };

    return (
        <Marker
            key={bike_id}
            position={[longitude, latitude]}
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