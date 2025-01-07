"use client";

import Map from "@/components/Map";
import "./MapPage.css";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";

export default function MapPage() {

    const [bikes, setBikes] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await apiClient.get("/bikes");
                setBikes(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching bikes:", error);
            }
        };

        fetchBikes();
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
            {bikes.length > 0 ? <Map markers={bikes} /> : <Map markers={[]} />}
        </div>
    );
}
