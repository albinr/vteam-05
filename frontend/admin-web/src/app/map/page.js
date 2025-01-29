"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import withAuth from "../auth/hoc/withAuth";
import LeafletMap from "@/components/Map";
import { apiClient } from "@/services/apiClient";
import { initializeWebSocket, getWebSocket } from "@/services/websocket";
import "./MapPage.css";

const MapView = () => {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    const [startPosition, setStartPosition] = useState(null);
    const bikeUpdatesRef = useRef([]); // Temporary storage for bike updates

    useEffect(() => {
        // Fetch data from the API
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
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setStartPosition([latitude, longitude]);
                    },
                    (err) => console.error("Geolocation error:", err.message || err)
                );
            } else {
                console.error("Geolocation is not supported in this browser.");
            }
        };

        // Setup WebSocket connection
        const setupWebSocket = async () => {
            try {
                await initializeWebSocket();
                const socket = getWebSocket();
                if (!socket) {
                    console.error("WebSocket not initialized.");
                    return;
                }

                socket.on("bike-update-frontend", (newBike) => {
                    newBike.simulation = newBike.simulated;
                    console.log("Received bike update:", newBike);
                    bikeUpdatesRef.current.push(newBike); // Add updates to ref
                });
            } catch (error) {
                console.error("Error setting up WebSocket:", error);
            }
        };

        // Initialize the app
        fetchBikes();
        fetchZones();
        fetchUserPosition();
        setupWebSocket();

        // Batch update interval
        const interval = setInterval(() => {
            if (bikeUpdatesRef.current.length > 0) {
                setBikes((prevBikes) => {
                    console.log("prevBikes", prevBikes);
                    const updatedBikes = [...prevBikes];
                    bikeUpdatesRef.current.forEach((newBike) => {
                        const index = updatedBikes.findIndex(bike => bike.bike_id === newBike.bike_id);
                        if (index > -1) {
                            updatedBikes[index] = { ...updatedBikes[index], ...newBike, type: "bike" };
                        }
                    });
                    bikeUpdatesRef.current = [];
                    return updatedBikes;
                });
            }
        }, 100);

        // Cleanup
        return () => {
            clearInterval(interval);
            const socket = getWebSocket();
            if (socket) {
                socket.disconnect();
            }
        };
    }, []); // Dependency array ensures this runs only on mount

    // Memoize markers to prevent unnecessary re-renders
    const memoizedMarkers = useMemo(() => [...zones, ...bikes], [zones, bikes]);

    return (
        <div className="map-container">
            <LeafletMap
                markers={memoizedMarkers}
                userPosition={startPosition}
                zoom={startPosition ? 14 : 6}
            />
        </div>
    );
};

export default withAuth(MapView);
