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
    const { id, position, battery, status } = bikeData;
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