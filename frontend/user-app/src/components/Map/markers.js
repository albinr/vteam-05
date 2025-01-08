import { Marker, Popup} from "react-leaflet";
import L from "leaflet";
import { apiClient } from "@/services/apiClient";
import Cookies from "js-cookie";

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
            console.log("Renting bike: ", bike_id);
            await apiClient.post(`/trips/start/${bike_id}/${userId}`);

            // Redirect to "/trip"
            window.location.href = "/trip";

        } catch (error) {
            console.error("Error starting trip:", error);
            return error;
        }

    };

    return (
        <Marker
            key={bike_id}
            position={[longitude, latitude]}
        >
            <Popup
                style={{
                    window: "90vw",
                    heigh: "90vh"
                }}
            >
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