"use client";

import { useState, useEffect } from "react";
import withAuth from "../hoc/withAuth";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
import { apiClient } from "@/services/apiClient";
import "./Bikes.css";

// Table columns for e-bike management
const bikeColumns = [
    { header: "ID", accessor: "bike_id" },
    { header: "Status", accessor: "status" },
    { header: "Longitude", accessor: "longitude" },
    { header: "Latitude", accessor: "latitude" },
    { header: "Battery", accessor: "battery_level" },
    { header: "Simulated", accessor: "simulation" },
];

const Bikes = ({ session }) => {
    const [bikes, setBikes] = useState([]);
    const [zones, setZones] = useState([]);
    const router = useRouter();

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

    const handleRowClick = (row) => {
        console.log("Selected E-Bike:", row);
        router.push(`/bikes/${row.bike_id}`);
    };

    return (
        <div>
            <h1>Bikes</h1>
            <p>Manage all bikes on the platform from this page.</p>
            <div className="bike-map">
                <Map markers={[...zones,...bikes]} />
            </div>
            <input></input>
            <Table
                columns={bikeColumns}
                data={bikes}
                onRowClick={handleRowClick}
            />
        </div>
    );
};

export default withAuth(Bikes);
