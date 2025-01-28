/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import io from "socket.io-client";
import { apiClient } from "@/services/apiClient";
const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
});
import "./MapPage.css";

export default function MapPage() {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    const [startPosition, setStartPosition] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await apiClient.get("/v3/bikes/available");
                setBikes(response.map(bike => ({ ...bike, type: "bike" })));
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
                const { latitude, longitude } = position.coords;
                setStartPosition([latitude, longitude]);
            }

            function error() {
                console.log("Unable to retrieve your location");
            }
        };

        const connectToWebSocket = async () => {
            const newSocket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}`, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });
            setSocket(newSocket);

            newSocket.on('bike-update-frontend', (newBike) => {
                // Update simulation to new value (mismatch between systems)
                newBike.simulation = newBike.simulated;

                // Update bike in state
                setBikes(prevBikes => {
                    return prevBikes.map(bike =>
                        bike.bike_id === newBike.bike_id ?
                        { ...bike, ...newBike, type: "bike" } :
                        bike
                    );
                });
            });

            return () => {
                if (socket) {
                    // Disconnect socket
                    socket.disconnect();
                }
            };
        };

        fetchBikes();
        fetchZones();
        fetchUserPosition();
        connectToWebSocket();
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