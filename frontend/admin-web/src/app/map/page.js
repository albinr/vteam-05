"use client";

import { useState, useEffect } from "react";
import withAuth from "../auth/hoc/withAuth";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import { apiClient } from "@/services/apiClient";
import "./MapPage.css";

const MapView = ({ session }) => {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await apiClient.get("/bikes");
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
                const response = await apiClient.get("/zones");
                console.log("Zones: ", response);
                setZones(response);
            } catch (error) {
                console.error("Error fetching zones:", error);
            }
        };

        fetchBikes();
        fetchZones();
    }, []);

    return (
        <>
            <div className="map-container">
                <Map markers={[...zones, ...bikes]} />
            </div>
        </>
    );
};

export default withAuth(MapView);
