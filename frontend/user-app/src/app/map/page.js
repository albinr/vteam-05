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
                const response = await apiClient.get("/v3/bikes/available");

                for (let bike of response) {
                    bike.type = "bike";
                }

                setBikes(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        const fetchZones = async () => {
            try {
                const response = await apiClient.get("/v3/zones");
                setZones(response);
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
