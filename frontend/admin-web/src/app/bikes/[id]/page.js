"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import withAuth from "../../auth/hoc/withAuth";
import { fetchBikeById, fetchTripsByBikeId } from "../api";
import Loader from "@/components/Loader";
import Table from "@/components/Table";

const tripColumns = [
    { header: "ID", accessor: "trip_id" },
    { header: "Start time", accessor: "start_time" },
    { header: "Start position", accessor: "start_position" },
    { 
        header: "End Time", 
        render: (row) => row.end_time !== null ? `${row.end_time}` : "-"
    },
    { 
        header: "End Position", 
        render: (row) => row.end_position !== null ? `${row.end_position}` : "-"
    },
    { 
        header: "Duration", 
        render: (row) => row.duration_minutes !== null ? `${row.duration_minutes} min` : "Active"
    }
];

const BikeDetails = () => {
    const { id } = useParams();
    const [bike, setBike] = useState(null);
    const [trips, setTrips] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("Invalid bike ID.");
            setLoading(false);
            return;
        }

        const loadBikeData = async () => {
            try {
                const bike = await fetchBikeById(id);
                const trips = await fetchTripsByBikeId(id);
                // console.log(bike)
                console.log(trips)
                setBike(...bike);
                setTrips(trips);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError("Failed to fetch bike details or trips.");
            } finally {
                setLoading(false);
            }
        };

        loadBikeData();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!bike) {
        return <p>No bike details available.</p>;
    }

    return (
        <div className="page-container">
            <h1>Bike Details</h1>
            <p><strong>Bike ID:</strong> {bike.bike_id}</p>
            <p><strong>Status:</strong> {bike.status}</p>
            <p><strong>Battery Level:</strong> {bike.battery_level}%</p>
            <p><strong>Longitude:</strong> {bike.longitude || "N/A"}</p>
            <p><strong>Latitude:</strong> {bike.latitude || "N/A"}</p>

            <h2>Trips</h2>
            <Table columns={tripColumns} data={trips} />
        </div>
    );
};

export default withAuth(BikeDetails);
