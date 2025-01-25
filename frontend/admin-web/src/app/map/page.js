"use client";

import { useState, useEffect, useRef } from "react";
import withAuth from "../auth/hoc/withAuth";
import LeafletMap from "@/components/Map";
import { apiClient } from "@/services/apiClient";
import { initializeWebSocket, getWebSocket } from "@/services/websocket";
import "./MapPage.css";

const MapView = () => {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    const [startPosition, setStartPosition] = useState(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await apiClient.get("/bikes");
                setBikes(response.map(bike => ({ ...bike, type: "bike" })));
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        const fetchZones = async () => {
            try {
                const response = await apiClient.get("/zones");
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
                const { latitude, longitude } = position.coords;
                setStartPosition([latitude, longitude]);
            }

            function error() {
                console.log("Unable to retrieve your location");
            }
        };

        const setupWebSocket = async () => {
            await initializeWebSocket();

            const socket = getWebSocket();

            socket.on("bike-update-frontend", (newBike) => {
                newBike.simulation = newBike.simulated;
                // console.log("Received bike update:", newBike);
                setBikes(prevBikes =>
                    prevBikes.map(bike =>
                        bike.bike_id === newBike.bike_id
                            ? { ...bike, ...newBike, type: "bike" }
                            : bike
                    )
                );
            });
        };

        fetchBikes();
        fetchZones();
        fetchUserPosition();
        setupWebSocket();

        return () => {
            const socket = getWebSocket();
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);
    return (
        <div className="map-container">
            <LeafletMap
                markers={[...zones, ...bikes]}
                userPosition={startPosition}
                zoom={startPosition ? 14 : 6}
            />
        </div>
    );
};

export default withAuth(MapView);
