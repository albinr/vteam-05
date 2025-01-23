"use client";

import { useState, useEffect, useRef } from "react";
import withAuth from "../auth/hoc/withAuth";
import { useRouter } from "next/navigation";
import BikeMap from "@/components/Map";
import { apiClient } from "@/services/apiClient";
// import { initializeWebSocket, getWebSocket } from "@/services/websocket";
import "./MapPage.css";

const MapView = ({ session }) => {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    // const [error, setError] = useState(null);
    // const socketRef = useRef(null);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await apiClient.get("/bikes");
                const bikesWithType = response.map(bike => ({ ...bike, type: "bike" }));
                setBikes(bikesWithType);
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

        fetchBikes();
        fetchZones();

        // Initialisera WebSocket-anslutningen
        // socketRef.current = initializeWebSocket();

        // // Definiera handleBikeUpdate innan användning
        // const handleBikeUpdate = (updatedBike) => {
        //     console.log("Mottaget meddelande:", updatedBike);
        //     setBikes(prevBikes => {
        //         const index = prevBikes.findIndex(bike => bike.bike_id === updatedBike.bike_id);
        //         if (index !== -1) {
        //             const updatedBikes = [...prevBikes];
        //             updatedBikes[index] = { ...updatedBikes[index], ...updatedBike };
        //             return updatedBikes;
        //         }
        //         // Lägg till ny cykel om den inte finns
        //         return [...prevBikes, { ...updatedBike, type: "bike" }];
        //     });
        // };

        // // Registrera eventlyssnare via socketRef
        // socketRef.current.on("bike-update-frontend", handleBikeUpdate);

        // // Hantera anslutningsfel via socketRef
        // socketRef.current.on("connect_error", (error) => {
        //     console.error("WebSocket connection error:", error);
        //     setError("Kunde inte ansluta till realtidsuppdateringar.");
        // });

        // // Rensa upp vid avmontering
        // return () => {
        //     if (socketRef.current) {
        //         socketRef.current.off("bike-update-frontend", handleBikeUpdate);
        //         socketRef.current.disconnect();
        //     }
        // };
    }, []);

    return (
        <>
            <div className="map-container">
                <BikeMap markers={[...zones, ...bikes]} />
            </div>
        </>
    );
};

export default withAuth(MapView);
