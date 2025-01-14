"use client";

import Map from "@/components/Map";
import "./MapPage.css";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";

export default function MapPage() {

    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    const [startPosition, setStartPosition] = useState(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await apiClient.get("/bikes/available");

                for (let bike of response) {
                    bike.type = "bike";
                }

                console.log(response);

                setBikes(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        const fetchZones = async () => {
            try {
                const response = await apiClient.get("/zones");
                setZones(response);
                console.log("Zones: ", response);
            } catch (error) {
                console.error("Error fetching zones:", error);
            }
        };

        const fetchUserPosition = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                console.log("Geolocation not supported");
            }

            function success(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setStartPosition([latitude, longitude]);
            }

            function error() {
                console.log("Unable to retrieve your location");
            }
        };

        fetchBikes();
        fetchZones();
        fetchUserPosition();
    }, []);

    // const ebikeMarkers = [
    //     {
    //         position: { lat: 59.3290, lng: 18.0680 },
    //         label: 'Bike #1',
    //         info: { id: 'bike1', status: 'Available', battery: 87 }
    //     },
    //     {
    //         position: { lat: 59.3300, lng: 18.0690 },
    //         label: 'Bike #2',
    //         info: { id: 'bike2', status: 'Rented', battery: 62 }
    //     },
    //     {
    //         position: { lat: 56.16156, lng: 15.58661 },
    //         label: 'Bike #3',
    //         info: { id: 'bike3', status: 'Available', battery: 75 }
    //     }
    // ];

    return (
        <div id="map-page-container">
            <Map
                markers={[...zones, ...bikes]}
                userPosition={startPosition}
                zoom={startPosition ? 16 : 7}
            />
        </div>
    );
}
