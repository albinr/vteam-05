"use client";

import { useState, useEffect } from "react";
import withAuth from "../hoc/withAuth";
import Table from "@/components/Table";
import Loader from "@/components/Loader";
import { fetchBikes } from "./api";
import { useRouter } from "next/navigation";
import Map from "@/components/Map";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const loadBikes = async () => {
            try {
                const data = await fetchBikes();
                console.log(data)
                setBikes(data);
            } catch (err) {
                console.error("Failed to fetch bikes:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBikes();
    }, []);

    const handleRowClick = (row) => {
        console.log("Selected E-Bike:", row);
        router.push(`/bikes/${row.bike_id}`);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <h1>Bikes</h1>
            <p>Manage all bikes on the platform from this page.</p>
            {error && <p className="error">{error}</p>}
            <div className="bike-map">
                <Map markers={bikes} />
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
